import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import chevron from "../assets/chevron.png";
import login from "../assets/login.png";
import defaultAvatar from "../assets/user.png";

const Navbar = () => {
  const faktorBtnRef = useRef(null);
  const faktorMenuRef = useRef(null);
  const profileBtnRef = useRef(null);
  const profileMenuRef = useRef(null);
  const chevronRef = useRef(null);

  const [isFaktorOpen, setIsFaktorOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !faktorBtnRef.current?.contains(e.target) &&
        !faktorMenuRef.current?.contains(e.target)
      )
        setIsFaktorOpen(false);
      if (
        !profileBtnRef.current?.contains(e.target) &&
        !profileMenuRef.current?.contains(e.target)
      )
        setIsProfileOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (chevronRef.current) {
      chevronRef.current.classList.remove("rotate-90", "rotate-270");
      chevronRef.current.classList.add(
        isFaktorOpen ? "rotate-270" : "rotate-90"
      );
    }

    const loginBtn = document.getElementById("login-button");
    const hoverBg = document.getElementById("hover-bg");

    const handleEnter = () => {
      hoverBg?.classList.remove("animate-unhover-bounce");
      hoverBg?.classList.add("animate-hover-bounce");
    };
    const handleLeave = () => {
      hoverBg?.classList.remove("animate-hover-bounce");
      hoverBg?.classList.add("animate-unhover-bounce");
    };

    loginBtn?.addEventListener("mouseenter", handleEnter);
    loginBtn?.addEventListener("mouseleave", handleLeave);

    return () => {
      loginBtn?.removeEventListener("mouseenter", handleEnter);
      loginBtn?.removeEventListener("mouseleave", handleLeave);
    };
  }, [isFaktorOpen]);

  const getAvatarUrl = () => {
    return user?.avatar || defaultAvatar;
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handlePrediksiClick = () => {
    if (user) navigate("/user/predict");
    else navigate("/login");
  };

  return (
    <nav className="sticky z-50 w-auto mx-52 top-4 flex justify-center bg-opacity-50">
      <div className="flex items-center justify-between px-6 py-2 bg-black/30 text-white rounded-lg shadow-lg w-full max-w-screen-xl">
        {/* Logo */}
        <div className="text-xl font-bold">
          <a href="/">
            <span className="text-white">Co</span>
            <span className="text-orange-500">.emission</span>
          </a>
        </div>

        {/* Menu */}
        <ul className="flex space-x-6 font-medium">
          <li>
            <a href="/" className="hover:text-yellow-400">
              Home
            </a>
          </li>
          <li>
            <a
              href="/"
              className="hover:text-yellow-400"
              onClick={() => localStorage.setItem("scrollTo", "next-section")}
            >
              Artikel
            </a>
          </li>
          <li className="relative">
            <button
              ref={faktorBtnRef}
              onClick={(e) => {
                e.stopPropagation();
                setIsFaktorOpen((prev) => !prev);
                setIsProfileOpen(false);
              }}
              className="flex items-center hover:text-yellow-400"
            >
              <span>Faktor</span>
              <img
                ref={chevronRef}
                src={chevron}
                alt="dropdown"
                className="ml-1 mt-1 h-3 w-3 transform transition-transform duration-300 rotate-90"
              />
            </button>
            <ul
              ref={faktorMenuRef}
              className={`absolute left-0 mt-2 w-32 rounded-md bg-black/80 text-white shadow-lg ${
                isFaktorOpen ? "" : "hidden"
              }`}
            >
              <a href="/faktor#bahanbakar">
                <li className="px-4 py-2 hover:bg-yellow-400 hover:text-black">
                  Bahan Bakar
                </li>
              </a>
              <a href="/faktor#rpm">
                <li className="px-4 py-2 hover:bg-yellow-400 hover:text-black">
                  RPM
                </li>
              </a>
              <a href="/faktor#ccmesin">
                <li className="px-4 py-2 hover:bg-yellow-400 hover:text-black">
                  CC Mesin
                </li>
              </a>
            </ul>
          </li>
          <li>
            <button
              onClick={handlePrediksiClick}
              className="hover:text-yellow-400"
            >
              Prediksi
            </button>
          </li>
          <li>
            <a href="/about" className="hover:text-yellow-400">
              About
            </a>
          </li>
          <li>
            <a href="/faq" className="hover:text-yellow-400">
              Faq
            </a>
          </li>
        </ul>

        {/* Auth Section */}
        {user ? (
          <div className="flex items-center space-x-3 relative">
            <div className="relative" ref={profileBtnRef}>
              <img
                src={getAvatarUrl()}
                alt="avatar"
                className="w-8 h-8 rounded-full cursor-pointer border border-white object-cover"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileOpen((prev) => !prev);
                  setIsFaktorOpen(false);
                }}
              />
              {isProfileOpen && (
                <ul
                  ref={profileMenuRef}
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-max rounded-md bg-black/80 text-white shadow-xl z-50 text-center"
                >
                  <a href="/user/profil">
                    <li className="px-4 py-2 hover:bg-yellow-400 hover:text-black">
                      Profil
                    </li>
                  </a>
                  <a href="/user/vehicle">
                    <li className="px-4 py-2 hover:bg-yellow-400 hover:text-black">
                      MyVehicle
                    </li>
                  </a>
                  <a href="/user/history">
                    <li className="px-4 py-2 hover:bg-yellow-400 hover:text-black">
                      History
                    </li>
                  </a>
                  <a href="/user/setting">
                    <li className="px-4 py-2 hover:bg-yellow-400 hover:text-black">
                      Setting
                    </li>
                  </a>
                </ul>
              )}
            </div>
            <span className="max-w-[100px] truncate">
              {user?.name?.split(" ")[0] || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="text-orange-400 border border-orange-400 px-3 py-1 rounded hover:bg-orange-400 hover:text-white"
            >
              Logout
            </button>
          </div>
        ) : (
          <div
            id="login-button"
            className="relative group overflow-hidden items-center rounded border border-orange-400 cursor-pointer"
          >
            <a href="/login">
              <span
                id="hover-bg"
                className="absolute top-0 left-0 h-full bg-orange-400 w-[40px] rounded"
              ></span>
              <div className="relative flex items-center px-1 text-white">
                <img src={login} className="w-8 h-8 mr-3" alt="Login" />
                <span className="font-semibold text-xl">Login</span>
              </div>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
