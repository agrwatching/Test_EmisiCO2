// src/pages/user/Profil.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import bgemisi from "../../assets/bgemisi.png";

const Profil = () => {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Gagal ambil profil:", err);
      }
    };

    fetchProfile();

    // Atur background saat komponen dipasang
    document.body.style.backgroundImage = `url(${bgemisi})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.color = "white";

    return () => {
      document.body.style = ""; // Reset saat keluar
    };
  }, [token]);

  if (!profile)
    return <div className="text-center mt-10 text-white">Memuat...</div>;

  return (
    <div className="min-h-screen px-4">
      <Navbar />

      <div className="max-w-3xl mx-auto mt-20 relative">
        {/* ID Card */}
        <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden flex flex-col sm:flex-row">
          {/* Tombol Edit */}
          <button
            onClick={() => navigate("/user/setting")}
            className="absolute top-4 right-4 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg shadow-md text-sm"
          >
            Edit Profil
          </button>

          {/* Header */}
          <div className="bg-blue-700 text-white text-center p-4 sm:rounded-l-2xl sm:w-1/3 flex items-center justify-center">
            <h2 className="text-2xl font-bold">CO2 Emission ID</h2>
          </div>

          {/* Profile Info */}
          <div className="flex-1 p-6 text-gray-800">
            <div className="flex items-center gap-6">
              <img
                src={
                  profile.profile_picture
                    ? `http://localhost:8080/uploads/${profile.profile_picture}`
                    : "https://i.pravatar.cc/100"
                }
                alt="Profil"
                className="w-24 h-24 rounded-full border-4 border-blue-400 object-cover"
              />
              <div>
                <h3 className="text-2xl font-bold">{profile.name}</h3>
                <p className="text-gray-600 mt-1 capitalize">{profile.role}</p>
                <p className="text-gray-500 italic">Email disembunyikan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-white mt-6">
          Data ini digunakan untuk membantu sistem memprediksi emisi kendaraan
          Anda dengan lebih akurat.
        </div>
      </div>
    </div>
  );
};

export default Profil;
