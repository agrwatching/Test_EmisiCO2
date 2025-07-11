import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgemisi from "../../assets/bgemisi.png";
import Navbar from "../../components/Navbar";

const History = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/user/predictions",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistory(res.data);
      } catch (err) {
        console.error("Gagal ambil riwayat emisi:", err);
      }
    };

    fetchHistory();

    document.body.style.backgroundImage = `url(${bgemisi})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";

    return () => {
      document.body.style = "";
    };
  }, [token]);

  return (
    <div className="p-6 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 mt-12">
        <h2 className="text-3xl font-bold text-black mb-6 border-b pb-2">
          Riwayat Prediksi Emisi
        </h2>

        <div className="overflow-x-auto rounded shadow border min-h-screen bg-white">
          <table className="w-full table-auto text-sm">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="p-3">Kendaraan</th>
                <th className="p-3">Jenis</th>
                <th className="p-3">Tahun</th>
                <th className="p-3">Jarak (km)</th>
                <th className="p-3">RPM</th>
                <th className="p-3">Bahan Bakar</th>
                <th className="p-3">Status</th>
                <th className="p-3">CO₂</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    Belum ada riwayat prediksi.
                  </td>
                </tr>
              ) : (
                history.map((item, index) => (
                  <tr
                    key={index}
                    className="text-center border-t hover:bg-blue-50 cursor-pointer"
                    onClick={() => navigate("/user/hasil", { state: item })}
                  >
                    <td className="p-2">{item.kendaraan}</td>
                    <td className="p-2 capitalize">{item.jenis || "-"}</td>
                    <td className="p-2">{item.tahun}</td>
                    <td className="p-2">{item.jarakTempuh}</td>
                    <td className="p-2">{item.rpm}</td>
                    <td className="p-2">{item.bahanBakar}</td>
                    <td
                      className={`p-2 font-semibold ${
                        item.hasil === "Aman"
                          ? "text-green-600"
                          : item.hasil === "Sedang"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.hasil}
                    </td>
                    <td className="p-2">{item.emisi}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
