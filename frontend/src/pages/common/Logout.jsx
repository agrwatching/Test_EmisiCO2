import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Hapus data dari localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    // 2. Redirect ke login
    navigate("/login");
  }, [navigate]);

  return null; // tidak render apa-apa
};

export default Logout;
