import { useState, useEffect } from "react";
import bgemisi from "../assets/bgemisi.png";
import loginIcon from "../assets/login.png";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import arrow from "../assets/arrow.png";
import axios from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    document.body.style.backgroundImage = `url(${bgemisi})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";

    return () => {
      document.body.style = "";
    };
  }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password || (!isLogin && (!name || !confirmPassword))) {
      setErrorMessage("Semua field harus diisi.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Format email tidak valid.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password minimal 6 karakter.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setErrorMessage("Password dan konfirmasi tidak cocok.");
      return;
    }

    if (!isLogin && !acceptedTerms) {
      setErrorMessage("Anda harus menyetujui syarat dan ketentuan.");
      return;
    }

    try {
      const endpoint = isLogin ? "/user/login" : "/user/register";
      const payload = isLogin ? { email, password } : { name, email, password };

      const { data } = await axios.post(endpoint, payload);

      if (isLogin) {
        toast.success("Login berhasil!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate(data.user.role === "admin" ? "/admin/dashboard" : "/");
      } else {
        setSuccessMessage("Registrasi berhasil! Silakan login.");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAcceptedTerms(false);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error || "Terjadi kesalahan saat mengirim data"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Link
        to="/"
        className="absolute top-4 left-4 bg-orange-500/80 hover:bg-orange-600 text-gray-800 px-3 py-1 rounded shadow transition"
      >
        <img
          src={arrow}
          alt="Arrow"
          className="w-8 h-8 bg-white rounded-full"
        />
      </Link>

      <div className="relative w-[800px] h-[550px] bg-white shadow-2xl rounded-3xl overflow-hidden flex">
        {/* Toggle Login/Register */}
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 z-30 flex bg-gray-200 rounded-full p-1">
          <button
            onClick={() => {
              setIsLogin(false);
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              !isLogin ? "bg-orange-400 text-white" : "text-purple-700"
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setIsLogin(true);
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              isLogin ? "bg-orange-400 text-white" : "text-purple-700"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`absolute w-1/2 h-full z-20 flex flex-col items-center justify-center p-10 transition-all duration-500 ease-in-out ${
            isLogin
              ? "left-0 bg-gradient-to-br from-orange-400 to-orange-600"
              : "left-1/2 bg-gradient-to-br from-orange-400 to-orange-600"
          } text-white`}
        >
          <img src={loginIcon} alt="icon" className="w-20 h-20 mb-4" />
          <h2 className="text-3xl font-bold mb-2">
            {isLogin ? "LOGIN" : "SIGN UP"}
          </h2>
          <p className="text-center px-6">
            {isLogin
              ? "Enter your credentials to access your account."
              : "Create an account to start predicting your vehicle emissions."}
          </p>
        </div>

        <div className="absolute w-1/2 h-full mt-3 top-0 transition-all duration-500 ease-in-out">
          {/* Register */}
          <form
            onSubmit={handleSubmit}
            className={`absolute w-full h-full top-0 left-0 p-10 transition-all duration-500 transform ${
              isLogin
                ? "translate-x-full opacity-0 pointer-events-none z-0"
                : "translate-x-0 opacity-100 pointer-events-auto z-10"
            }`}
          >
            <h2 className="text-2xl font-bold text-center mb-2">
              Create a New Account
            </h2>

            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="mb-2 relative">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-sm"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="mb-2 relative">
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-sm"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="mb-2 flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="terms" className="text-sm">
                I accept{" "}
                <Link
                  to="/terms"
                  className="text-purple-700 underline hover:text-purple-900"
                >
                  the terms and conditions
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              REGISTER
            </button>

            {successMessage && (
              <p className="text-green-600 text-sm mt-2 text-center">
                {successMessage}
              </p>
            )}
            {errorMessage && (
              <p className="text-red-600 text-sm mt-2 text-center">
                {errorMessage}
              </p>
            )}
            <p className="text-sm text-center text-gray-500 mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="text-purple-700 hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>

          {/* Login */}
          <form
            onSubmit={handleSubmit}
            className={`absolute w-full h-full top-0 left-0 p-10 transition-all duration-500 transform ${
              isLogin
                ? "translate-x-100 opacity-100 pointer-events-auto z-10"
                : "-translate-x-full opacity-0 pointer-events-none z-0"
            }`}
          >
            <h2 className="text-2xl font-bold text-center mb-6">
              Login to Your Account
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="mb-6 relative">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-sm"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              LOGIN
            </button>

            {errorMessage && (
              <p className="text-red-600 text-sm mt-2 text-center">
                {errorMessage}
              </p>
            )}

            <p className="text-sm text-center text-gray-500 mt-6">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="text-purple-700 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
