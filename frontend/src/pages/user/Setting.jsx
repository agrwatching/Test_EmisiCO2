// src/pages/user/Setting.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import bgemisi from "../../assets/bgemisi.png";
import defaultAvatar from "../../assets/user.png";
import { toast } from "react-toastify";

const Setting = () => {
  const [form, setForm] = useState({ name: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    document.body.style.backgroundImage = `url(${bgemisi})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.color = "white";

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setForm({ name: user.name });
    }

    return () => (document.body.style = "");
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("name", form.name);
  if (selectedFile) {
    formData.append("profile_picture", selectedFile);
  }

  try {
    const res = await axios.post(
      "http://localhost:8080/api/user/update-profile",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const updatedUser = res.data.user;
    const oldUser = JSON.parse(localStorage.getItem("user")) || {};

    const avatarUrl = updatedUser.profile_picture
      ? `http://localhost:8080/uploads/${updatedUser.profile_picture}`
      : null;

    const newUser = {
      ...oldUser,
      name: updatedUser.name,
      avatar: avatarUrl,
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser); // ✅ Update context
    toast.success("Profil berhasil diperbarui!");
  } catch (err) {
    toast.error("Gagal memperbarui profil.");
    console.error(err);
  }
};


  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      await axios.put(
        "http://localhost:8080/api/user/change-password",
        {
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Password berhasil diubah.");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal mengubah password.");
      console.error(err);
    }
  };

  const getAvatarUrl = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.avatar || defaultAvatar;
  };

  return (
    <div className="min-h-screen px-4">
      <Navbar />
      <div className="max-w-xl mx-auto mt-16 bg-white/60 backdrop-blur-md text-black p-6 rounded-xl shadow-lg relative">
        {/* Foto Profil */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <img
              src={getAvatarUrl()}
              alt="Profil"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />
            <label
              htmlFor="profilePicInput"
              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              title="Klik untuk mengganti foto"
            >
              Ganti Foto
            </label>
            <input
              id="profilePicInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Klik icon biru untuk mengganti foto
          </p>
        </div>

        {/* Form Nama */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Nama</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 rounded border"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
          >
            Simpan Perubahan
          </button>
        </form>

        {/* Form Ganti Password */}
        <div className="mt-8">
          <button
            onClick={() => setShowPasswordForm((prev) => !prev)}
            className="w-full text-blue-700 font-semibold hover:underline"
          >
            {showPasswordForm ? "Tutup Form Ganti Password" : "Ubah Password"}
          </button>

          {showPasswordForm && (
            <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-3">
              {/* Current Password */}
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  placeholder="Password Lama"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 rounded border pr-10"
                  required
                />
                <span
                  onClick={() => togglePassword("current")}
                  className="absolute right-2 top-2.5 cursor-pointer text-gray-600"
                >
                  {showPasswords.current ? "🙈" : "👁️"}
                </span>
              </div>

              {/* New Password */}
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  placeholder="Password Baru"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 rounded border pr-10"
                  required
                />
                <span
                  onClick={() => togglePassword("new")}
                  className="absolute right-2 top-2.5 cursor-pointer text-gray-600"
                >
                  {showPasswords.new ? "🙈" : "👁️"}
                </span>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Konfirmasi Password Baru"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 rounded border pr-10"
                  required
                />
                <span
                  onClick={() => togglePassword("confirm")}
                  className="absolute right-2 top-2.5 cursor-pointer text-gray-600"
                >
                  {showPasswords.confirm ? "🙈" : "👁️"}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
              >
                Ganti Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setting;
