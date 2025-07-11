import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgemisi from "../../assets/bgemisi.png";
import Navbar from "../../components/Navbar";

const Predict = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [vehicleDetail, setVehicleDetail] = useState(null);
  const [formData, setFormData] = useState({ rpm: "", distance_km: "" });
  const [loadingVeh, setLoadingVeh] = useState(true);
  const [loadingPrediksi, setLoadingPrediksi] = useState(false);

  // 🖼️ Setup background
  useEffect(() => {
    document.body.style.backgroundImage = `url(${bgemisi})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.color = "white";

    return () => {
      document.body.style = "";
    };
  }, []);

  // 🚗 Ambil kendaraan milik user
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8080/api/user/vehicles",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVehicles(data);
        if (data.length === 0) {
          navigate("/user/novehicle", { replace: true });
        }
      } catch (err) {
        console.error("Gagal mengambil kendaraan:", err);
        if (err.response?.status === 401) {
          navigate("/notfound", { replace: true });
        }
      } finally {
        setLoadingVeh(false);
      }
    };

    fetchVehicles();
  }, [navigate, token]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleVehicleSelect = (e) => {
    const id = e.target.value;
    setSelectedVehicleId(id);
    const detail = vehicles.find((v) => v.id.toString() === id);
    setVehicleDetail(detail || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicleId || !formData.rpm || !formData.distance_km) return;

    setLoadingPrediksi(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/predict",
        {
          vehicle_id: selectedVehicleId,
          rpm_mesin: Number(formData.rpm),
          jarak_tempuh: Number(formData.distance_km),
          cc: vehicleDetail.engine_cc,
          tahun_produksi: vehicleDetail.year,
          jenis_bahan_bakar: vehicleDetail.fuel_type,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTimeout(() => {
        setLoadingPrediksi(false);
        navigate("/user/hasil", {
          state: {
            result: data,
            vehicle: vehicleDetail,
            input: {
              rpm: Number(formData.rpm),
              distance_km: Number(formData.distance_km).toFixed(2),
            },
          },
        });
      }, 1000);
    } catch (err) {
      console.error("Prediksi gagal:", err);
      setLoadingPrediksi(false);
      alert("Prediksi gagal. Coba lagi nanti.");
    }
  };

  if (loadingVeh) {
    return <p className="text-center text-white mt-10">Memuat kendaraan…</p>;
  }

  return (
    <div className="min-h-screen p-4">
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white/50 backdrop-blur-md p-6 rounded-xl shadow mt-12">
        <h2 className="text-2xl font-bold mb-6 text-black">
          Tes Emisi Kendaraan
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-4 text-black">
            <select
              value={selectedVehicleId}
              onChange={handleVehicleSelect}
              className="w-full border p-3 rounded"
              required
            >
              <option value="">Pilih Kendaraan</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} ({v.year})
                </option>
              ))}
            </select>

            <input
              name="rpm"
              type="number"
              placeholder="RPM Mesin"
              value={formData.rpm}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />

            <input
              name="distance_km"
              type="number"
              placeholder="Jarak Tempuh (km)"
              value={formData.distance_km}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
              disabled={loadingPrediksi}
            >
              {loadingPrediksi ? "Memproses..." : "Prediksi Emisi"}
            </button>
          </div>

          {vehicleDetail && (
            <div className="bg-white/90 border rounded shadow-sm overflow-hidden text-sm text-gray-800">
              {[
                ["Merk", vehicleDetail.brand],
                ["Model", vehicleDetail.model],
                ["Tahun", vehicleDetail.year],
                ["CC", vehicleDetail.engine_cc],
                ["Bahan Bakar", vehicleDetail.fuel_type],
                ["Jenis", vehicleDetail.type],
              ].map(([label, value], i, arr) => (
                <div
                  key={label}
                  className={`grid grid-cols-[130px_12px_1fr] items-center px-4 py-2 ${
                    i !== arr.length - 1 ? "border-b" : ""
                  }`}
                >
                  <span className="font-semibold">{label}</span>
                  <span className="text-center">:</span>
                  <span className={label === "Jenis" ? "capitalize" : ""}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Predict;
