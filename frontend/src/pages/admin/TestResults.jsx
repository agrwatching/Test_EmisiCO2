import React, { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

const TestResults = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users/with-vehicles")
      .then((res) => setUserOptions(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleExport = (format) => {
    setShowExportMenu(false);
    if (selectedUser) {
      window.open(
        `http://localhost:8080/api/export/${selectedUser}?format=${format}`,
        "_blank"
      );
    } else {
      alert("Pilih user terlebih dahulu.");
    }
  };

  return (
    <div className="px-6 min-h-screen">
      <div className=" items-center mb-6 bg-white w-max p-2 rounded">
        <h1 className="text-2xl font-semibold">Test Results</h1>
      </div>

      {/* Dropdown */}
      <div className="flex justify-between mb-4">
        <select
          className="w-[250px] px-4 py-2 border border-gray-400 rounded shadow-sm bg-white"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Dropdown Name</option>
          {userOptions.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-[#d62828] hover:bg-[#b71c1c] text-white font-bold px-10 py-2 rounded"
            >
              Export
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-red-800 text-white rounded-lg shadow-lg z-20">
                {["CSV", "PDF", "JPG", "PNG"].map((format) => (
                  <button
                    key={format}
                    onClick={() => handleExport(format.toLowerCase())}
                    className="w-full py-2 hover:bg-red-600"
                  >
                    {format}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Box Data Kendaraan + Grafik + Power Meter */}
      <div className="bg-white rounded-xl p-6 shadow-md space-y-6">
        {/* Baris: Informasi Kendaraan */}
        <div className="grid grid-cols-6 gap-2">
          {[
            "001",
            "125 CC",
            "2024",
            "Pertamax",
            "Tidak Lulus",
            "1600 g/Km",
          ].map((item, idx) => (
            <div
              key={idx}
              className="px-4 py-2 bg-[#e5e5e5] text-sm font-semibold rounded-md text-center shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>

        {/* Grid utama: Grafik dan Blok Kanan (Power + Motor) */}
        <div className="grid grid-cols-2 gap-6 items-center">
          {/* Grafik */}
          <div className="h-[200px] bg-gray-200 rounded-lg p-4 flex flex-col justify-between relative overflow-hidden">
            {/* Garis-garis horizontal */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-[1px] bg-gray-400 opacity-30" />
            ))}

            {/* Grafik line */}
            <svg
              className="w-full h-full -mt-[200px]"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <polyline
                fill="none"
                stroke="#3b3bdb"
                strokeWidth="2"
                points="0,90 20,60 40,70 60,50 80,30 100,70"
              />
            </svg>
          </div>

          {/* Blok Power + Motor */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#a1f0c4] to-[#8df0e4] rounded-xl h-[200px] px-6">
            {/* Power Meter */}
            <div className="bg-white rounded-lg shadow-md w-[120px] h-[120px] flex flex-col justify-center items-center text-center">
              <svg width="100" height="60" viewBox="0 0 100 50">
                <path d="M0,50 A50,50 0 0,1 100,50" fill="#f0f0f0" />
                <path d="M20,50 A30,30 0 0,1 80,50" fill="#9ae6b4" />
              </svg>
              <div className="text-sm font-bold text-[#00c78c] mt-1">90 CC</div>
            </div>

            {/* Gambar Motor */}
            <img
              src="/bike.png"
              alt="Bike"
              className="h-[120px] object-contain"
            />
          </div>
        </div>
      </div>

      {/* Perbandingan Bahan Bakar */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-3 bg-white w-max rounded p-2">
          Perbandingan bahan bakar
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Card Pertalite */}
          <div className="bg-white p-6 rounded-lg shadow border-b-4 border-green-400 text-center">
            <h3 className="text-green-600 font-semibold">Pertalite</h3>
            <p className="text-4xl font-bold text-green-600">85%</p>
          </div>

          {/* Card Pertamax */}
          <div className="bg-white p-6 rounded-lg shadow border-b-4 border-blue-800 text-center">
            <h3 className="text-blue-800 font-semibold">Pertamax</h3>
            <p className="text-4xl font-bold text-blue-800">0%</p>
          </div>

          {/* Card Diesel */}
          <div className="bg-white p-6 rounded-lg shadow border-b-4 border-green-400 text-center">
            <h3 className="text-green-600 font-semibold">Diesel</h3>
            <p className="text-4xl font-bold text-green-600">0%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
