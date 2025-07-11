import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import home from "../assets/home.png";
import car from "../assets/car.png";
import test from "../assets/test.png";
import user from "../assets/manager.png";
import setting from "../assets/settings.png";
import logout from "../assets/logout.png";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  // Tutup sidebar jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".sidebar")) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const menuItems = [
    { img: home, label: "Home", path: "/admin/dashboard" },
    { img: car, label: "Data Vehicle", path: "/admin/data-vehicle" },
    { img: test, label: "Test Results", path: "/admin/test-results" },
    { img: user, label: "Management User", path: "/admin/management-user" },
    { img: setting, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div
      className={`fixed left-0 h-[90%] z-50 mt-20 w-60 bg-indigo-900 text-white transform transition-transform duration-300 rounded-tr-4xl shadow-lg ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } sidebar`}
    >
      <ul className="ml-4 mt-20 text-lg font-medium cursor-pointer space-y-2">
        {menuItems.map((item, index) => (
          <Link to={item.path} key={index} onClick={onClose}>
            <li
              className={`flex items-center space-x-3 py-3 px-4 rounded-l-3xl transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-white text-blue-900"
                  : "hover:bg-white hover:text-blue-900 my-1"
              }`}
            >
              <img src={item.img} className="w-5 h-5" alt={item.label} />
              <span>{item.label}</span>
            </li>
          </Link>
        ))}

        <Link to="/logout" onClick={onClose}>
          <li className="flex items-center space-x-3 py-3 px-4 mt-10 rounded-l-3xl hover:bg-white hover:text-blue-900 transition-all duration-200">
            <img src={logout} className="w-5 h-5" alt="Log Out" />
            <span>Log Out</span>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
