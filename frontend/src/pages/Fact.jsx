import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgemisi from "../assets/bgemisi.png";

const Fact = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundImage = `url(${bgemisi})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundAttachment = "";
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 my-8">
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-xl text-black">
        <h1 className="text-3xl font-bold mb-4 text-center text-purple-800">
          Syarat & Ketentuan Pengguna
        </h1>
        <p className="mb-4 text-justify">
          Dengan menggunakan aplikasi ini, Anda menyetujui syarat dan ketentuan berikut:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-justify">
          <li>Data kendaraan dan informasi pribadi Anda akan digunakan untuk keperluan analisis emisi.</li>
          <li>Data yang Anda masukkan akan digunakan untuk keperluan prediksi emisi kendaraan.</li>
          <li>Kami tidak membagikan data Anda kepada pihak ketiga tanpa izin.</li>
          <li>Gunakan aplikasi ini secara bijak dan sesuai dengan hukum yang berlaku.</li>
          <li>Aplikasi ini hanya memberikan estimasi, bukan jaminan terhadap hasil emisi sebenarnya.</li>
          <li>Anda bertanggung jawab atas keakuratan data yang dimasukkan ke dalam sistem.</li>
          <li>Kami tidak bertanggung jawab atas kerugian yang timbul akibat penggunaan informasi dari aplikasi ini.</li>
          <li>Perubahan kebijakan dapat dilakukan sewaktu-waktu tanpa pemberitahuan terlebih dahulu.</li>
          <li>Penggunaan layanan berarti Anda telah membaca dan memahami seluruh isi syarat dan ketentuan ini.</li>
        </ul>
        <p className="mt-6 text-sm text-center text-gray-600">
          Dengan melanjutkan, Anda telah membaca dan menyetujui semua ketentuan di atas.
        </p>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-900 transition"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Fact;
