import { useState, useEffect } from "react";
import axios from "axios";

import bellIcon from "../../assets/notification.png";
import usersIcon from "../../assets/group.png";
import calendarIcon from "../../assets/calendar.png";
import vehicle from "../../assets/vehicle.png";
import Co2Chart from "./Co2Chart";

const Dashboard = () => {
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentWeek, setCurrentWeek] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [emissionStats, setEmissionStats] = useState({ aman: 0, total: 0 });
  const [vehicleTypeStats, setVehicleTypeStats] = useState({
    motor: 0,
    mobil: 0,
  });

  useEffect(() => {
    updateCalendar();
    const interval = setInterval(updateCalendar, 1000);
    fetchDashboardData();
    return () => clearInterval(interval);
  }, []);

  const updateCalendar = () => {
    const now = new Date();
    setCurrentMonth(now.toLocaleDateString("en-US", { month: "long" }));
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    let weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      weekDays.push({
        name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
        date: day.getDate(),
        isToday: new Date().toDateString() === day.toDateString(),
      });
    }
    setCurrentWeek(weekDays);
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Ambil data dari /dashboard yang mencakup statistik dan user role
      const res = await axios.get("http://localhost:8080/api/admin/dashboard", {
        headers,
      });

      // Ambil foto dari profile endpoint
      const userRes = await axios.get(
        "http://localhost:8080/api/user/profile",
        {
          headers,
        }
      );

      // Gabungkan data user dari kedua sumber
      setUserInfo({
        ...res.data.user, // berisi name, role
        profile_picture: userRes.data.profile_picture, // ambil foto saja dari sini
      });

      setEmissionStats(res.data.emissionStats);
      setVehicleTypeStats(res.data.vehicleStats);
    } catch (error) {
      console.error("Gagal memuat data dashboard:", error);
    }
  };

  return (
    <div className="flex justify-between">
      {/* KIRI */}
      <div className="flex flex-col w-[65%]">
            <Co2Chart />
          

        {/* Vehicle & CO₂ */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          {/* Vehicle */}
          <div className="w-full md:w-1/2 bg-white p-4 rounded-2xl shadow-lg">
            <div className="flex items-start">
              <div className="flex items-center justify-center max-w-fit p-1 bg-gray-100 rounded-lg">
                <img src={vehicle} alt="vehicle icon" className="w-8 h-5" />
              </div>
              <h2 className="text-md font-semibold text-gray-800 mb-2 ml-2">
                Vehicle
              </h2>
            </div>
            <div className="h-40 flex items-center justify-center rounded-lg">
              <img src={vehicle} alt="vehicle stats" className="w-36 h-20" />
            </div>
            <p>{vehicleTypeStats.motor + vehicleTypeStats.mobil} vehicles</p>
          </div>

          {/* CO₂ */}
          <div className="w-full md:w-1/2 bg-white p-4 rounded-2xl shadow-lg">
            <h2 className="text-md font-semibold text-gray-800 mb-2">CO₂</h2>
            <div className="h-40 flex items-center justify-center bg-gray-100 rounded-lg">
              [CO₂ Placeholder]
            </div>
          </div>
        </div>

        {/* Emissions Graph */}
        <div className="mt-4 bg-white p-4 rounded-2xl shadow-lg">
          <h2 className="text-md font-semibold text-gray-800 mb-2">
            Emissions Graph
          </h2>
          <div className="h-80 flex items-center justify-center bg-gray-100 rounded-lg">
            [Grafik Placeholder]
          </div>
        </div>
      </div>

      {/* KANAN */}
      <div className="right-0 top-0 bottom-0 w-1/3 h-auto bg-white p-4 space-y-4 absolute">
        {/* Info User */}
        <div className="flex items-center justify-between border-b pb-2 pr-5">
          <img
            src={bellIcon}
            alt="Notifications"
            className="w-6 h-6 cursor-pointer"
          />

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-black">
                {userInfo.name || "Loading..."}
              </p>
              <p className="text-xs text-black capitalize">
                {userInfo.role || "test"}
              </p>
            </div>
            <img
              src={
                userInfo.profile_picture
                  ? `http://localhost:8080/uploads/${userInfo.profile_picture}`
                  : "https://via.placeholder.com/60"
              }
              alt="User Profile"
              className="w-14 h-14 rounded-lg shadow-xl p-1 bg-gray-100 object-cover"
            />
          </div>
        </div>

        {/* Persentase Emisi */}
        <div className="bg-gray-100 rounded-xl p-4 text-center mx-2">
          <h2 className="text-indigo-900 font-bold text-sm">
            Percentage of Vehicles That Pass and Don't Pass
          </h2>
          <p className="text-indigo-900 font-bold text-4xl p-8">
            {(() => {
              const aman = Number(emissionStats.aman || 0);
              const sedang = Number(emissionStats.sedang || 0);
              const tidakAman = Number(emissionStats.tidak_aman || 0);
              const total = aman + sedang + tidakAman;
              const layak = aman + sedang;
              const persentase = total ? Math.round((layak / total) * 100) : 0;
              return `${persentase}/100`;
            })()}
          </p>
        </div>

        {/* Statistik Jenis Kendaraan */}
        <h2 className="text-lg font-semibold mb-2 p-4">Total Vehicle</h2>
        <div className="m-4">
          <div className="flex bg-gray-100 shadow-lg rounded-lg mb-4">
            <img
              src={usersIcon}
              alt="Users"
              className="w-24 h-24 mr-2 mt-7 mx-2"
            />
            <div className="ml-20 mt-8">
              <p className="font-bold text-orange-400 text-xl mb-2">Motor</p>
              <p className="font-bold text-orange-400 text-xl">
                {vehicleTypeStats.motor} Motor
              </p>
            </div>
          </div>
          <div className="flex bg-gray-100 shadow-lg rounded-lg">
            <img
              src={usersIcon}
              alt="Users"
              className="w-24 h-24 mr-2 mt-7 mx-2"
            />
            <div className="ml-20 mt-8">
              <p className="font-bold text-orange-400 text-xl mb-2">Mobil</p>
              <p className="font-bold text-orange-400 text-xl">
                {vehicleTypeStats.mobil} Mobil
              </p>
            </div>
          </div>
        </div>

        {/* Kalender */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Calendar</h2>
            <div className="flex items-center bg-gray-200 px-3 py-2 rounded-lg shadow">
              <img src={calendarIcon} alt="Calendar" className="w-5 h-5" />
              <span className="ml-2 text-sm">{currentMonth}</span>
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            {currentWeek.map((day, index) => (
              <div
                key={index}
                className={`flex flex-col items-center w-10 py-4 px-1 rounded-lg ${
                  day.isToday ? "bg-orange-400 text-white" : "bg-gray-100"
                }`}
              >
                <span className="text-xs font-semibold">{day.name}</span>
                <span className="text-xs font-semibold">{day.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
