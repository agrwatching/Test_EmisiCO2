import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// public pages
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Faq from "./pages/Faq";
import Login from "./pages/Login";
import Logout from "./pages/common/Logout";
import NotFound from "./pages/NotFound";
import Faktor from "./pages/Faktor";
import Fact from "./pages/Fact";

// route guard
import ProtectedRoute from "./components/ProtectedRoute";

// admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import DataVehicle from "./pages/admin/DataVehicle";
import TestResults from "./pages/admin/TestResults";
import ManagementUser from "./pages/admin/ManagementUser";
import AdminSettings from "./pages/admin/Settings";

// user pages
import Predict from "./pages/user/Predict";
import HasilEmisi from "./pages/user/HasilEmisi";
import MyVehicle from "./pages/user/MyVehicle";
import History from "./pages/user/History";
import NoVehicle from "./pages/user/NoVehicle";
import Profil from "./pages/user/Profil";
import Setting from "./pages/user/Setting";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ───── Public Routes ───── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/faktor" element={<Faktor />} />
        <Route path="/terms" element={<Fact />} />

        {/* ───── Protected Routes - USER ───── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/user/predict" element={<Predict />} />
          <Route path="/user/hasil" element={<HasilEmisi />} />
          <Route path="/user/vehicle" element={<MyVehicle />} />
          <Route path="/user/history" element={<History />} />
          <Route path="/user/profil" element={<Profil />} />
          <Route path="/user/setting" element={<Setting />} />
          <Route path="/user/NoVehicle" element={<NoVehicle />} />
        </Route>

        {/* ───── Protected Routes - ADMIN ───── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="data-vehicle" element={<DataVehicle />} />
          <Route path="test-results" element={<TestResults />} />
          <Route path="management-user" element={<ManagementUser />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* ───── 404 Not Found ───── */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default App;
