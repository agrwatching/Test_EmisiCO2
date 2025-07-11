import React, { useEffect, useState } from "react";
import axios from "axios";

const DataVehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    user_id: "",
    brand: "",
    model: "",
    year: "",
    engine_cc: "",
    fuel_type_id: "",
    type: "",
  });
  const [fadeIn, setFadeIn] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 26 }, (_, i) => currentYear - i);

  useEffect(() => {
    fetchVehicles();
    fetchUsers();
    fetchFuelTypes();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/vehicles");
      setVehicles(res.data);
    } catch (error) {
      console.error("Gagal mengambil data kendaraan:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
    }
  };

  const fetchFuelTypes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/fuel-types");
      setFuelTypes(res.data);
    } catch (error) {
      console.error("Gagal mengambil data bahan bakar:", error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({
      id: null,
      user_id: "",
      brand: "",
      model: "",
      year: "",
      engine_cc: "",
      fuel_type_id: "",
      type: "",
    });
    setIsEditMode(false);
  };

  const handleSubmit = async () => {
    const { id, user_id, brand, model, year, engine_cc, fuel_type_id, type } =
      formData;

    if (!user_id || !brand || !model || !year || !engine_cc || !fuel_type_id || !type) {
      alert("Mohon lengkapi semua data.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (isEditMode) {
        await axios.put(
          `http://localhost:8080/api/admin/vehicles/${id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          "http://localhost:8080/api/admin/vehicles",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setShowModal(false);
      setFadeIn(false);
      fetchVehicles();
      resetForm();
    } catch (err) {
      alert("Gagal menyimpan kendaraan.");
    }
  };

  const handleEdit = (vehicle) => {
    setFormData({
      id: vehicle.id,
      user_id: vehicle.user_id,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      engine_cc: vehicle.engine_cc,
      fuel_type_id: vehicle.fuel_type_id,
      type: vehicle.type,
    });
    setIsEditMode(true);
    setShowModal(true);
    setTimeout(() => setFadeIn(true), 10);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah kamu yakin ingin menghapus kendaraan ini?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8080/api/admin/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchVehicles(); // refresh data
      } catch (err) {
        alert("Gagal menghapus kendaraan.");
      }
    }
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
    setTimeout(() => setFadeIn(true), 10);
  };

  const closeModal = () => {
    setFadeIn(false);
    setTimeout(() => setShowModal(false), 300);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Data Kendaraan
      </h2>
      <button
        onClick={openModal}
        className="bg-indigo-900 hover:bg-indigo-800 text-white px-4 py-2 rounded mb-4"
      >
        + Tambah Kendaraan
      </button>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">No</th>
              <th className="px-4 py-3 text-left">Nama Pemilik</th>
              <th className="px-4 py-3 text-left">Merk</th>
              <th className="px-4 py-3 text-left">Model</th>
              <th className="px-4 py-3 text-left">Tahun</th>
              <th className="px-4 py-3 text-left">CC</th>
              <th className="px-4 py-3 text-left">Bahan Bakar</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  Belum ada data kendaraan.
                </td>
              </tr>
            ) : (
              vehicles.map((v, i) => (
                <tr
                  key={v.id}
                  className="border-t hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-3">{String(i + 1).padStart(2, "0")}</td>
                  <td className="px-4 py-3">{v.owner_name}</td>
                  <td className="px-4 py-3">{v.brand}</td>
                  <td className="px-4 py-3">{v.model}</td>
                  <td className="px-4 py-3">{v.year}</td>
                  <td className="px-4 py-3">{v.engine_cc}</td>
                  <td className="px-4 py-3">{v.fuel_type}</td>
                  <td className="px-4 py-3 capitalize">{v.type}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(v)}
                      className="text-xs px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded shadow"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="text-xs px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className={`bg-gradient-to-tr from-blue-900 via-blue-700 to-blue-500 p-6 rounded-xl shadow-lg w-full max-w-xl transform transition-all duration-300 ${
              fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">
              {isEditMode ? "Edit Data Kendaraan" : "+ Tambah Data Kendaraan"}
            </h3>

            <div className="space-y-4">
              <select
                name="user_id"
                value={formData.user_id}
                className="w-full border border-white bg-white text-gray-800 px-3 py-2 rounded"
                onChange={handleChange}
              >
                <option value="">Pilih Pemilik Kendaraan</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>

              <input
                name="brand"
                placeholder="Merk Kendaraan"
                value={formData.brand}
                className="w-full border border-white bg-white text-gray-800 px-3 py-2 rounded"
                onChange={handleChange}
              />
              <input
                name="model"
                placeholder="Model Kendaraan"
                value={formData.model}
                className="w-full border border-white bg-white text-gray-800 px-3 py-2 rounded"
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="year"
                  className="border border-white bg-white text-gray-800 px-3 py-2 rounded"
                  onChange={handleChange}
                  value={formData.year}
                >
                  <option value="" disabled>
                    Pilih Tahun Produksi
                  </option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  name="engine_cc"
                  placeholder="CC Mesin"
                  value={formData.engine_cc}
                  className="border border-white bg-white text-gray-800 px-3 py-2 rounded"
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select
                  name="fuel_type_id"
                  className="border border-white bg-white text-gray-800 px-3 py-2 rounded"
                  onChange={handleChange}
                  value={formData.fuel_type_id}
                >
                  <option value="">Pilih Bahan Bakar</option>
                  {fuelTypes.map((fuel) => (
                    <option key={fuel.id} value={fuel.id}>
                      {fuel.fuel_name}
                    </option>
                  ))}
                </select>

                <select
                  name="type"
                  className="border border-white bg-white text-gray-800 px-3 py-2 rounded"
                  onChange={handleChange}
                  value={formData.type}
                >
                  <option value="" disabled>
                    Pilih Jenis Kendaraan
                  </option>
                  <option value="mobil">Mobil</option>
                  <option value="motor">Motor</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-white text-blue-700 font-semibold px-5 py-2 rounded hover:bg-gray-200"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataVehicle;
