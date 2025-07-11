import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import searchIcon from "../../assets/untitled.png";
import calendar from "../../assets/calendar.png";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      const day = now.getDate().toString().padStart(2, "0");
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[now.getMonth()];
      const year = now.getFullYear();
      setCurrentTime(`${hours}:${minutes} ${ampm} Today ${day} ${month} ${year}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dengarkan event perubahan tema
  useEffect(() => {
    const handleThemeChange = () => {
      setIsDarkMode(localStorage.getItem("theme") === "dark");
    };
    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  return (
    <div className={`relative h-auto min-h-screen flex ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-4 py-6 flex items-center gap-6 w-full">
          <h1
            className="text-2xl font-bold cursor-pointer text-blue-900"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            Co.<span className="text-orange-400">emission</span>
          </h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white pr-8 pl-4 py-1 rounded-lg shadow-sm">
              <img
                src={searchIcon}
                alt="Search"
                className="w-5 h-5 cursor-pointer mr-4"
              />
              <input
                type="text"
                placeholder="Search Users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-none px-2 w-52"
              />
            </div>

            <div className="py-2 px-4 bg-white rounded-lg shadow-md text-black flex items-center space-x-2">
              <img src={calendar} alt="Calendar" className="w-5 h-5" />
              <span className="text-xs font-medium">{currentTime}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
