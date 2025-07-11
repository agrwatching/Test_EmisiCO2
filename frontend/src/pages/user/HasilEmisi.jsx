import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import bgemisi from "../../assets/bgemisi.png";
import Navbar from "../../components/Navbar";

const HasilEmisi = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!state) {
      navigate("/predict", { replace: true });
      return;
    }

    document.body.style.backgroundImage = `url(${bgemisi})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.color = "white";

    return () => {
      document.body.style = "";
    };
  }, [navigate, state]);

  if (!state) return null;

  const isFromPredict = state.result && state.vehicle && state.input;
  const kendaraan = isFromPredict
    ? `${state.vehicle.brand} ${state.vehicle.model}`
    : state.kendaraan;
  const jenis = isFromPredict ? state.vehicle.type : state.jenis;
  const tahun = isFromPredict ? state.vehicle.year : state.tahun;
  const jarakTempuh = isFromPredict
    ? state.input.distance_km
    : state.jarakTempuh;
  const rpm = isFromPredict ? state.input.rpm : state.rpm;
  const bahanBakar = isFromPredict ? state.vehicle.fuel_type : state.bahanBakar;
  const emisi = isFromPredict
    ? state.result.prediksi_co2_emission
    : state.emisi;
  const hasil = isFromPredict ? state.result.status_emisi : state.hasil;
  const plot_base64 = isFromPredict
    ? state.result.plot_base64
    : state.plot_base64;

  return (
    <div className="min-h-screen p-6">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-14 bg-white/50 backdrop-blur-md p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-black">
          Hasil Prediksi Emisi
        </h2>
        <div className="bg-white border rounded shadow-sm overflow-hidden text-sm text-black mb-6">
          {[
            ["Kendaraan", kendaraan],
            ["Jenis", jenis || "-"],
            ["Tahun", tahun],
            ["Jarak Tempuh", `${jarakTempuh} km`],
            ["RPM", rpm],
            ["Bahan Bakar", bahanBakar],
            ["CO₂ Emisi", emisi],
          ].map(([label, value], idx, arr) => (
            <div
              key={label}
              className={`grid grid-cols-2 px-4 py-2 ${
                idx !== arr.length - 1 ? "border-b" : ""
              }`}
            >
              <span className="font-semibold">{label}</span>
              <span className={label === "Jenis" ? "capitalize" : ""}>
                {value}
              </span>
            </div>
          ))}
          <div className="grid grid-cols-2 px-4 py-2 border-t">
            <span className="font-semibold">Status</span>
            <span
              className={`font-semibold ${
                hasil === "Aman"
                  ? "text-green-600"
                  : hasil === "Sedang"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {hasil}
            </span>
          </div>
        </div>

        {plot_base64 ? (
          <img
            src={`data:image/png;base64,${plot_base64}`}
            alt="Grafik prediksi"
            className="w-full rounded mb-4"
          />
        ) : (
          <p className="text-center text-sm text-gray-600 mb-4">
            Grafik tidak tersedia untuk data ini.
          </p>
        )}

        <button
          onClick={() => navigate("/user/history")}
          className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          Kembali ke Riwayat
        </button>
      </div>
    </div>
  );
};

export default HasilEmisi;
