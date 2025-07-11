import { useEffect, useState } from "react";
import axios from "axios";

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // for preview
  const [imageFile, setImageFile] = useState(null); // actual file
  const [fullName, setFullName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFullName(res.data.name);
        setProfileImage(`http://localhost:8080/uploads/${res.data.profile_picture}`);
      })
      .catch((err) => console.error(err));
  }, [token]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    window.dispatchEvent(new Event("themeChange"));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      return alert("Nama tidak boleh kosong.");
    }

    const formData = new FormData();
    formData.append("name", fullName);
    if (imageFile) {
      formData.append("profile_picture", imageFile);
    }

    try {
      await axios.post("http://localhost:8080/api/user/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profil berhasil diperbarui.");
    } catch (err) {
      alert("Gagal memperbarui profil.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      return alert("Semua kolom harus diisi.");
    }
    if (newPassword !== confirmPassword) {
      return alert("Password baru dan konfirmasi tidak sama!");
    }

    try {
      await axios.post(
        "http://localhost:8080/api/user/change-password",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Password berhasil diubah.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert("Gagal mengubah password.");
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="bg-white rounded shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-72">
        {/* Dark Mode */}
        <div className="flex items-center gap-4">
          <span className="font-medium">Dark Mode</span>
          <button
            onClick={toggleTheme}
            className={`w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${
              isDarkMode ? "bg-gray-700" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
                isDarkMode ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Edit Profil */}
        <div className="flex justify-center">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => setShowEditProfile(!showEditProfile)}
          >
            {showEditProfile ? "Tutup Profil" : "Edit Profil"}
          </button>
        </div>

        {/* Ganti Password */}
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            {showChangePassword ? "Tutup Password" : "Ganti Password"}
          </button>
        </div>
      </div>

      {/* Form Edit Profil */}
      {showEditProfile && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white mt-6 rounded shadow p-6 max-w-xl mx-auto space-y-4"
        >
          <h3 className="text-lg font-semibold mb-4">Edit Profil</h3>
          <div className="flex flex-col items-center gap-2">
            {profileImage && (
              <img
                src={profileImage}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Simpan
          </button>
        </form>
      )}

      {/* Form Ganti Password */}
      {showChangePassword && (
        <form
          onSubmit={handleChangePassword}
          className="bg-white mt-6 rounded shadow p-6 max-w-xl mx-auto space-y-4"
        >
          <h3 className="text-lg font-semibold mb-4">Ganti Password</h3>
          <input
            type="password"
            placeholder="Password Lama"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password Baru"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Konfirmasi Password Baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            Simpan
          </button>
        </form>
      )}
    </div>
  );
};

export default Settings;
