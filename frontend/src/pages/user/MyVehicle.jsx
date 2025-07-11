/* src/pages/user/MyVehicle.jsx */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import bgemisi from "../../assets/bgemisi.png";
import Navbar from "../../components/Navbar";

const MyVehicle = () => {
  /* ───────── state ───────── */
  const [vehicles, setVehicles] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    engine_cc: "",
    fuel_type_id: "",
    type: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ───────── helper ───────── */
  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  /* ───────── fetch data ───────── */
  const fetchInit = async () => {
    try {
      const [vehRes, fuelRes] = await Promise.all([
        api.get("/user/vehicles"),
        api.get("/fuel-types"),
      ]);
      setVehicles(vehRes.data);
      setFuelTypes(fuelRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.response?.status === 401) navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  /* ───────── lifecycle ───────── */
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    fetchInit();

    /* set background persis LandingPage */
    document.body.style.backgroundImage = `url(${bgemisi})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.color = "white";

    return () => {
      document.body.style = "";
    };
  }, [token, navigate]);

  /* ───────── handler ───────── */
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const isEmpty = (str) => !str.trim();

  const handleAddVehicle = async (e) => {
    e.preventDefault();

    const { brand, model, year, engine_cc, fuel_type_id, type } = form;
    if (
      isEmpty(brand) ||
      isEmpty(model) ||
      !year ||
      !engine_cc ||
      !fuel_type_id ||
      !type
    ) {
      return alert("Semua field wajib diisi dengan benar.");
    }

    try {
      await api.post("/vehicles", form); // ← user_id tidak dikirim!
      setShowForm(false);
      setForm({
        brand: "",
        model: "",
        year: "",
        engine_cc: "",
        fuel_type_id: "",
        type: "",
      });
      fetchInit(); // refresh tabel
    } catch (err) {
      console.error("Tambah kendaraan gagal:", err);
      alert("Gagal menambahkan kendaraan.");
    }
  };

  /* ───────── options ───────── */
  const years = Array.from(
    { length: new Date().getFullYear() - 1999 },
    (_, i) => 2000 + i
  );

  /* ───────── UI ───────── */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Memuat data kendaraan…
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <Navbar />

      {/* Card utama */}
      <div className="max-w-5xl mx-auto bg-white/50 backdrop-blur-md rounded-xl shadow-lg p-6 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900 bg-white px-4 py-1 rounded border-4 border-blue-200">
            Kendaraan Saya
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-600 text-white font-bold px-9 py-2 rounded hover:bg-orange-700 shadow"
          >
            + Tambah
          </button>
        </div>

        {/* Tabel kendaraan */}
        <div className="overflow-x-auto rounded shadow border min-h-[300px] bg-white">
          <table className="w-full table-auto text-sm">
            <thead className="bg-blue-100 text-black">
              <tr>
                <th className="p-3">Merk</th>
                <th className="p-3">Model</th>
                <th className="p-3">Tahun</th>
                <th className="p-3">CC</th>
                <th className="p-3">Bahan Bakar</th>
                <th className="p-3">Jenis</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-black">
                    Belum ada kendaraan.
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr
                    key={v.id}
                    className="text-center border-t hover:bg-blue-50 text-black"
                  >
                    <td className="p-2">{v.brand}</td>
                    <td className="p-2">{v.model}</td>
                    <td className="p-2">{v.year}</td>
                    <td className="p-2">{v.engine_cc}</td>
                    <td className="p-2">{v.fuel_type}</td>
                    <td className="p-2 capitalize">{v.type}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tengah */}
      {showForm && (
        <div
          onClick={() => setShowForm(false)}
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md mx-4 p-6 rounded-xl shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4 text-black">
              Tambah Kendaraan
            </h3>

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Merk Kendaraan"
                required
                className="w-full p-2 border rounded text-black"
              />
              <input
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="Model Kendaraan"
                required
                className="w-full p-2 border rounded text-black"
              />
              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded text-black"
              >
                <option value="">Pilih Tahun</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="engine_cc"
                value={form.engine_cc}
                onChange={handleChange}
                placeholder="CC Mesin"
                min="1"
                required
                className="w-full p-2 border rounded text-black"
              />
              <select
                name="fuel_type_id"
                value={form.fuel_type_id}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded text-black"
              >
                <option value="">Pilih Bahan Bakar</option>
                {fuelTypes.map((ft) => (
                  <option key={ft.id} value={ft.id}>
                    {ft.fuel_name}
                  </option>
                ))}
              </select>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded text-black"
              >
                <option value="">Pilih Jenis Kendaraan</option>
                <option value="mobil">Mobil</option>
                <option value="motor">Motor</option>
              </select>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
              >
                Simpan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyVehicle;
