module.exports = (app) => {
  const db = app.get("db");
  const jwtSecret = app.get("jwt_secret");

  // Middleware untuk verifikasi token
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

  // 🔹 Ambil semua fuel types
  app.get("/api/fuel-types", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT id, fuel_name FROM fuel_types");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: "Gagal mengambil data fuel types" });
    }
  });

  // 🔹 Ambil semua kendaraan milik user (butuh token)
  app.get("/api/user/vehicles", verifyToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const [rows] = await db.query(
        `SELECT 
          v.id, v.brand, v.model, v.year, v.engine_cc, 
          f.fuel_name AS fuel_type,
          v.type
         FROM vehicles v
         JOIN fuel_types f ON v.fuel_type_id = f.id
         WHERE v.user_id = ?`,
        [userId]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Gagal mengambil data kendaraan user" });
    }
  });

  // 🔹 Tambah kendaraan milik user (tanpa user_id dari frontend)
  app.post("/api/vehicles", verifyToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { brand, model, year, engine_cc, fuel_type_id, type } = req.body;

      if (!brand || !model || !year || !engine_cc || !fuel_type_id || !type) {
        return res.status(400).json({ error: "Semua field wajib diisi" });
      }

      await db.query(
        `INSERT INTO vehicles 
         (user_id, brand, model, year, engine_cc, fuel_type_id, type) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, brand, model, year, engine_cc, fuel_type_id, type]
      );

      res.status(201).json({ message: "Kendaraan berhasil ditambahkan" });
    } catch (err) {
      console.error("Gagal tambah kendaraan user:", err);
      res.status(500).json({ error: "Gagal menambahkan kendaraan" });
    }
  });

  // 🔹 Ambil daftar user yang memiliki kendaraan
  app.get("/api/users/with-vehicles", async (req, res) => {
    try {
      const [results] = await db.query(`
        SELECT DISTINCT u.id, u.name 
        FROM users u 
        JOIN vehicles v ON v.user_id = u.id
      `);
      res.json(results);
    } catch (err) {
      res.status(500).json({ message: "Gagal ambil data user" });
    }
  });

  // 🔹 Ambil riwayat prediksi user
  app.get("/api/user/predictions", verifyToken, async (req, res) => {
    try {
      const userId = req.user.id;

      const [rows] = await db.query(
        `SELECT 
          v.brand AS kendaraan,
          v.type AS jenis,
          v.year AS tahun,
          p.distance_km AS jarakTempuh,
          p.rpm,
          f.fuel_name AS bahanBakar,
          p.category AS hasil,
          p.co2_emission AS emisi
        FROM predictions p
        JOIN vehicles v ON p.vehicle_id = v.id
        LEFT JOIN fuel_types f ON v.fuel_type_id = f.id
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC`,
        [userId]
      );

      res.json(rows);
    } catch (err) {
      console.error("Gagal ambil riwayat prediksi:", err);
      res.status(500).json({ error: "Gagal mengambil riwayat prediksi" });
    }
  });

    // 🔹 Ambil data user saat ini berdasarkan token
  app.get("/api/user/me", verifyToken, async (req, res) => {
    try {
      const userId = req.user.id;

      const [rows] = await db.query(
        "SELECT id, name, email, role, profile_picture FROM users WHERE id = ?",
        [userId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      res.json({ user: rows[0] });
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
  });

};
