import { useEffect } from "react";
import bgemisi from "../assets/bgemisi.png";
import Navbar from "../components/Navbar";

const Faq = () => {
  useEffect(() => {
    document.body.style.backgroundImage = `url(${bgemisi})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.color = "white";

    return () => {
      document.body.style = "";
    };
  }, []);

  const faqs = [
    {
      question: "Apakah saya harus login untuk menggunakan fitur prediksi?",
      answer: "Ya, Anda harus login terlebih dahulu untuk mengakses fitur prediksi emisi dan menyimpan riwayat.",
    },
    {
      question: "Data apa saja yang dibutuhkan untuk memprediksi emisi?",
      answer: "Anda perlu mengisi data kendaraan seperti merk, model, tahun, jenis bahan bakar, RPM, dan jarak tempuh.",
    },
    {
      question: "Apakah data saya aman?",
      answer: "Ya, kami menjaga kerahasiaan data pengguna dan tidak membagikan data kepada pihak ketiga.",
    },
    {
      question: "Siapa yang bisa mengakses halaman admin?",
      answer: "Hanya pengguna dengan role admin yang bisa mengakses halaman khusus seperti manajemen kendaraan dan pengguna.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-20 bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg text-black">
        <h1 className="text-3xl font-bold mb-6">Pertanyaan Umum (FAQ)</h1>
        <ul className="space-y-4">
          {faqs.map((faq, idx) => (
            <li key={idx}>
              <h3 className="font-semibold text-lg mb-1">{faq.question}</h3>
              <p>{faq.answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Faq;
