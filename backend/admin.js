const axios = require("axios");
const bcrypt = require("bcrypt");

module.exports = (app) => {
  const db = app.get("db");
  const jwtSecret = app.get("jwt_secret");

  const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token tidak ditemukan" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = require("jsonwebtoken").verify(token, jwtSecret);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ error: "Token tidak valid" });
    }
  };

  function getEmissionCategory(co2) {
    if (co2 < 100) return "Aman";
    if (co2 > 200) return "Tidak Aman";
    return "Sedang";
  }

  app.get("/api/fuel-types", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT id, fuel_name FROM fuel_types");
      res.json(rows);
    } catch (err) {
      console.error("Gagal mengambil data fuel types:", err);
      res.status(500).json({ message: "Gagal mengambil data fuel types" });
    }
  });

  app.get("/api/admin/dashboard", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    try {
      const [userRows] = await db.query(
        "SELECT name, role FROM users WHERE id = ?",
        [req.user.id]
      );
      const user = userRows[0];

      const [countRows] = await db.query(`
        SELECT 
          COUNT(*) AS total,
          SUM(CASE WHEN category = 'Aman' THEN 1 ELSE 0 END) AS aman,
          SUM(CASE WHEN category = 'Sedang' THEN 1 ELSE 0 END) AS sedang,
          SUM(CASE WHEN category = 'Tidak Aman' THEN 1 ELSE 0 END) AS tidak_aman
        FROM predictions
      `);

      const { total, aman, sedang, tidak_aman } = countRows[0];
      const percentageAman = total ? ((aman / total) * 100).toFixed(2) : 0;
      const percentageSedang = total ? ((sedang / total) * 100).toFixed(2) : 0;
      const percentageTidakAman = total
        ? ((tidak_aman / total) * 100).toFixed(2)
        : 0;

      const [vehicleRows] = await db.query(`
        SELECT type, COUNT(*) AS total 
        FROM vehicles 
        GROUP BY type
      `);

      const motor =
        vehicleRows.find((v) => v.type.toLowerCase() === "motor")?.total || 0;
      const mobil =
        vehicleRows.find((v) => v.type.toLowerCase() === "mobil")?.total || 0;

      res.json({
        user: { name: user.name, role: user.role },
        emissionStats: {
          total,
          aman: percentageAman,
          sedang: percentageSedang,
          tidak_aman: percentageTidakAman,
        },
        vehicleStats: { motor, mobil },
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      res.status(500).json({ error: "Gagal mengambil data dashboard" });
    }
  });

  app.get("/api/admin/users", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    try {
      const [users] = await db.query(`
        SELECT id, name, email, password, role, profile_picture
        FROM users
      `);

      const mapped = users.map((u) => ({
        ...u,
        profile_picture:
          u.profile_picture && u.profile_picture !== "null"
            ? `http://localhost:8080/uploads/${u.profile_picture}`
            : null,
      }));

      res.json(mapped);
    } catch (err) {
      res.status(500).json({ error: "Gagal mengambil data user" });
    }
  });

  app.post("/api/admin/vehicles", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    const {
      user_id,
      brand,
      model,
      year,
      engine_cc,
      fuel_type_id,
      co2_emission,
      type,
    } = req.body;

    if (
      !user_id ||
      !brand ||
      !model ||
      !year ||
      !engine_cc ||
      !fuel_type_id ||
      !type
    ) {
      return res.status(400).json({ error: "Data kendaraan tidak lengkap" });
    }

    try {
      const [result] = await db.query(
        `INSERT INTO vehicles (user_id, brand, model, year, engine_cc, fuel_type_id, type)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, brand, model, year, engine_cc, fuel_type_id, type]
      );
      const vehicleId = result.insertId;

      if (co2_emission) {
        const category = getEmissionCategory(co2_emission);
        await db.query(
          `INSERT INTO predictions (user_id, vehicle_id, co2_emission, category)
           VALUES (?, ?, ?, ?)`,
          [user_id, vehicleId, co2_emission, category]
        );
      }

      res.json({ message: "Kendaraan berhasil ditambahkan untuk user" });
    } catch (err) {
      res.status(500).json({ message: "Gagal menambahkan kendaraan" });
    }
  });

  app.get("/api/vehicles", async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          vehicles.id,
          users.name AS owner_name,
          vehicles.brand,
          vehicles.model,
          vehicles.year,
          vehicles.engine_cc,
          fuel_types.fuel_name AS fuel_type,
          vehicles.type,
          predictions.co2_emission
        FROM vehicles
        JOIN users ON vehicles.user_id = users.id
        LEFT JOIN fuel_types ON vehicles.fuel_type_id = fuel_types.id
        LEFT JOIN predictions ON predictions.vehicle_id = vehicles.id
      `);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: "Gagal mengambil data kendaraan" });
    }
  });

  // ✅ FINAL: Endpoint Statistik Emisi Hanya Harian & Tahunan
  app.get("/api/admin/emission-stats", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    const range = req.query.range || "day";

    let selectLabel = "";
    let whereCondition = "";

    if (range === "day") {
      selectLabel = `DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00') AS label`;
      whereCondition = "created_at >= NOW() - INTERVAL 1 DAY";
    } else if (range === "year") {
      selectLabel = `DATE_FORMAT(created_at, '%Y-%m') AS label`;
      whereCondition = "created_at >= NOW() - INTERVAL 12 MONTH";
    } else {
      return res.status(400).json({ error: "Range tidak valid" });
    }

    try {
      const [rows] = await db.query(`
      SELECT ${selectLabel}, SUM(co2_emission) AS total_emission
      FROM predictions
      WHERE ${whereCondition}
      GROUP BY label
      ORDER BY label ASC
    `);

      res.json(rows);
    } catch (err) {
      console.error("Gagal mengambil data CO₂:", err);
      res.status(500).json({ error: "Gagal mengambil data CO₂" });
    }
  });
  app.put("/api/admin/vehicles/:id", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    const { id } = req.params;
    const { user_id, brand, model, year, engine_cc, fuel_type_id, type } =
      req.body;

    if (
      !user_id ||
      !brand ||
      !model ||
      !year ||
      !engine_cc ||
      !fuel_type_id ||
      !type
    ) {
      return res.status(400).json({ error: "Data kendaraan tidak lengkap" });
    }

    try {
      await db.query(
        `UPDATE vehicles
       SET user_id = ?, brand = ?, model = ?, year = ?, engine_cc = ?, fuel_type_id = ?, type = ?
       WHERE id = ?`,
        [user_id, brand, model, year, engine_cc, fuel_type_id, type, id]
      );

      res.json({ message: "Data kendaraan berhasil diubah" });
    } catch (err) {
      console.error("Gagal update kendaraan:", err);
      res.status(500).json({ message: "Gagal mengubah data kendaraan" });
    }
  });
  app.delete("/api/admin/vehicles/:id", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    const { id } = req.params;

    try {
      await db.query("DELETE FROM predictions WHERE vehicle_id = ?", [id]);
      await db.query("DELETE FROM vehicles WHERE id = ?", [id]);

      res.json({ message: "Kendaraan berhasil dihapus" });
    } catch (err) {
      console.error("Gagal hapus kendaraan:", err);
      res.status(500).json({ message: "Gagal menghapus kendaraan" });
    }
  });

  // PUT: Edit user
  app.put("/api/admin/users/:id", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    const { id } = req.params;
    const { name, email } = req.body;

    // role dikunci sebagai 'user'
    const role = "user";

    if (!name || !email) {
      return res.status(400).json({ error: "Data user tidak lengkap" });
    }

    try {
      await db.query(
        `UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?`,
        [name, email, role, id]
      );

      res.json({ message: "User berhasil diperbarui" });
    } catch (err) {
      console.error("Gagal mengedit user:", err);
      res.status(500).json({ error: "Gagal mengedit user" });
    }
  });

  // DELETE: Hapus user
  app.delete("/api/admin/users/:id", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    const { id } = req.params;

    try {
      await db.query("DELETE FROM predictions WHERE user_id = ?", [id]);
      await db.query("DELETE FROM vehicles WHERE user_id = ?", [id]);
      await db.query("DELETE FROM users WHERE id = ?", [id]);

      res.json({ message: "User berhasil dihapus" });
    } catch (err) {
      console.error("Gagal menghapus user:", err);
      res.status(500).json({ error: "Gagal menghapus user" });
    }
  });

  // PUT: Ganti password user
  app.put("/api/admin/users/:id/password", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    const { id } = req.params;
    const { new_password } = req.body;

    if (!new_password || new_password.length < 6) {
      return res.status(400).json({ error: "Password minimal 6 karakter" });
    }

    try {
      const hashedPassword = await bcrypt.hash(new_password, 10);
      await db.query(`UPDATE users SET password = ? WHERE id = ?`, [
        hashedPassword,
        id,
      ]);

      res.json({ message: "Password berhasil diubah" });
    } catch (err) {
      console.error("Gagal mengubah password:", err);
      res.status(500).json({ error: "Gagal mengubah password user" });
    }
  });
};
