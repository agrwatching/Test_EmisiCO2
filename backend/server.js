const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();

// === Middleware dasar ===
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// === DB Pool & Shared Config ===
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
app.set("db", db);
app.set("jwt_secret", process.env.JWT_SECRET);

// === Multer Config ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// === Auth Middleware ===
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token tidak valid" });
  }
};

// === Register ===
app.post("/api/user/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Data tidak lengkap" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "user"]
    );
    res.status(201).json({ message: "Registrasi berhasil" });
  } catch (err) {
    res.status(500).json({ error: "Gagal mendaftar" });
  }
});

// === Login ===
app.post("/api/user/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!results.length)
      return res.status(401).json({ error: "Email tidak ditemukan" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Password salah" });

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        avatar: user.profile_picture
          ? `http://localhost:8080/uploads/${user.profile_picture}`
          : "https://i.pravatar.cc/40?u=default",
      },
    });
  } catch (err) {
    console.error("Login error:", err); // ← penting banget!
    res.status(500).json({ error: "Login gagal" });
  }
});

// === Get Profile ===
app.get("/api/user/profile", verifyToken, async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT name, role, profile_picture FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!results.length) {
      return res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }

    const user = results[0];
    res.json({
      name: user.name,
      profile_picture: user.profile_picture || null,
    });
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil profil" });
  }
});

// === Update Profile ===
app.post(
  "/api/user/update-profile",
  verifyToken,
  upload.single("profile_picture"),
  async (req, res) => {
    const name = req.body.name;
    const profile_picture = req.file ? req.file.filename : null;

    if (!name) {
      return res.status(400).json({ error: "Nama tidak boleh kosong" });
    }

    try {
      const [checkUser] = await db.query("SELECT id FROM users WHERE id = ?", [
        req.user.id,
      ]);
      if (!checkUser.length) {
        return res.status(404).json({ error: "Pengguna tidak ditemukan" });
      }

      const sql = profile_picture
        ? "UPDATE users SET name = ?, profile_picture = ? WHERE id = ?"
        : "UPDATE users SET name = ? WHERE id = ?";
      const values = profile_picture
        ? [name, profile_picture, req.user.id]
        : [name, req.user.id];

      await db.query(sql, values);
      res.json({ message: "Profil berhasil diperbarui" });
    } catch (err) {
      res.status(500).json({ error: "Gagal update profil" });
    }
  }
);

// === Change Password ===
app.put("/api/user/change-password", verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }

  try {
    const [results] = await db.query(
      "SELECT password FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!results.length) {
      return res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: "Password lama salah" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [
      hashed,
      req.user.id,
    ]);

    res.json({ message: "Password berhasil diubah" });
  } catch (err) {
    res.status(500).json({ error: "Gagal mengganti password" });
  }
});

// === Predict ===
const axios = require("axios");
app.post("/api/predict", verifyToken, async (req, res) => {
  try {
    const {
      rpm_mesin,
      cc,
      jenis_bahan_bakar,
      jarak_tempuh,
      tahun_produksi,
      vehicle_id,
    } = req.body;

    const [vehicleRows] = await db.query(
      "SELECT type FROM vehicles WHERE id = ? AND user_id = ?",
      [vehicle_id, req.user.id]
    );

    if (!vehicleRows.length) {
      return res
        .status(404)
        .json({ error: "Kendaraan tidak ditemukan atau bukan milik user" });
    }

    const jenis_kendaraan = vehicleRows[0].type;

    const flaskResponse = await axios.post("http://localhost:5000/predict", {
      rpm_mesin,
      cc,
      jenis_bahan_bakar,
      jarak_tempuh,
      tahun_produksi,
      jenis_kendaraan,
    });

    const { prediksi_co2_emission, status_emisi, plot_base64 } =
      flaskResponse.data;

    const co2_emission = parseFloat(prediksi_co2_emission);
    const category = status_emisi;

    await db.query(
      `INSERT INTO predictions (user_id, vehicle_id, rpm, distance_km, co2_emission, category)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, vehicle_id, rpm_mesin, jarak_tempuh, co2_emission, category]
    );

    res.json({ prediksi_co2_emission, status_emisi, plot_base64 });
  } catch (err) {
    console.error("Prediksi error:", err);
    res.status(500).json({ error: "Gagal memanggil model prediksi" });
  }
});

// === Include modular routes ===
require("./admin")(app);
require("./user")(app);

// === Start Server ===
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
