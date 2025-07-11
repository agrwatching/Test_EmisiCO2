import { useEffect, useState } from "react";
import axios from "axios";

const ManagementUser = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    role: "user",
  });
  const [passwordData, setPasswordData] = useState({
    id: null,
    newPassword: "",
  });
  const [showFormModal, setShowFormModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const filtered = response.data.filter((u) => u.role !== "admin");
      setUsers(filtered);
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setFormData({ id: null, name: "", email: "", role: "user" });
    setIsEditMode(false);
  };

  const resetPasswordForm = () => {
    setPasswordData({ id: null, newPassword: "" });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }));
  };

  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsEditMode(true);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8080/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
      } catch (err) {
        alert("Gagal menghapus user.");
      }
    }
  };

  const handleSubmit = async () => {
    const { id, name, email, role } = formData;
    if (!name || !email || !role) {
      return alert("Mohon lengkapi semua field.");
    }

    try {
      const token = localStorage.getItem("token");
      if (isEditMode) {
        await axios.put(
          `http://localhost:8080/api/admin/users/${id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setShowFormModal(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      alert("Gagal menyimpan data user.");
    }
  };

  const handlePasswordSubmit = async () => {
    const { id, newPassword } = passwordData;
    if (!newPassword || newPassword.length < 6) {
      return alert("Password minimal 6 karakter.");
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/admin/users/${id}/password`,
        { new_password: newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowPasswordModal(false);
      resetPasswordForm();
      alert("Password berhasil diubah.");
    } catch (err) {
      alert("Gagal mengganti password.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800">
        Manajemen User
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-indigo-100 text-indigo-700">
              <th className="py-2 px-4 text-left">No</th>
              <th className="py-2 px-4 text-left">Foto</th>
              <th className="py-2 px-4 text-left">Nama</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="px-4 py-2">
                  <img
                    src={
                      user.profile_picture
                        ? user.profile_picture
                        : `https://i.pravatar.cc/100?u=${user.email}`
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-lg object-cover border"
                  />
                </td>
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4 capitalize">{user.role}</td>
                <td className="py-2 px-4 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-sm px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setPasswordData({ id: user.id, newPassword: "" });
                      setShowPasswordModal(true);
                    }}
                    className="text-sm px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded"
                  >
                    Ganti Password
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Edit */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <div className="space-y-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                disabled={isEditMode}
              >
                <option value="user">User</option>
              </select>
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => setShowFormModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ganti Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Ganti Password</h3>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Password baru"
              className="w-full border px-3 py-2 rounded"
            />
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
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

export default ManagementUser;
