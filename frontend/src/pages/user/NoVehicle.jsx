import { Link } from "react-router-dom";

const NoVehicle = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white px-4">
      <h1 className="text-5xl font-bold mb-4">Oops!</h1>
      <p className="text-xl text-center mb-6">
        Sepertinya Anda belum menambahkan kendaraan.
        <br />
        Silakan tambahkan kendaraan terlebih dahulu untuk melakukan prediksi emisi.
      </p>
      <Link
        to="/user/vehicle"
        className="px-6 py-3 bg-orange-600 text-white rounded hover:bg-orange-700 transition text-lg font-semibold"
      >
        Tambah Kendaraan
      </Link>
    </div>
  );
};

export default NoVehicle;
