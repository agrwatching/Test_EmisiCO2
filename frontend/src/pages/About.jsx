import { useEffect } from "react";
import bgemisi from "../assets/bgemisi.png";
import Navbar from "../components/Navbar";
import TeamChart from "../components/TeamChart";

const About = () => {
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

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto mt-20 bg-black/70 backdrop-blur-md p-8 rounded-xl shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-4">Tentang Aplikasi</h1>
        <p className="mb-3">
          <strong>CO.Emission</strong> adalah sebuah platform berbasis web yang
          dirancang untuk memprediksi dan menganalisis emisi karbon dari
          kendaraan bermotor. Aplikasi ini menggunakan data kendaraan seperti
          jenis bahan bakar, kapasitas mesin, dan putaran mesin (RPM) sebagai
          parameter utama dalam memperkirakan tingkat emisi yang dihasilkan.
        </p>
        <p className="mb-3">
          Dengan tampilan antarmuka yang intuitif dan sistem yang responsif,{" "}
          <strong>CO.Emission</strong> membantu pengguna, baik individu maupun
          institusi, untuk lebih memahami dampak lingkungan dari kendaraan
          mereka. Aplikasi ini tidak hanya memberikan estimasi emisi, tetapi
          juga berfungsi sebagai alat edukatif untuk mendorong kesadaran
          terhadap pentingnya pengendalian emisi gas buang demi keberlangsungan
          lingkungan hidup.
        </p>
        <p className="mb-3">
          Fitur manajemen data pada aplikasi memungkinkan administrator untuk
          dengan mudah mengelola informasi kendaraan, riwayat pengujian, serta
          melakukan pemantauan secara terpusat. Hal ini menjadikan{" "}
          <strong>CO.Emission</strong> ideal untuk digunakan dalam kegiatan
          inspeksi kendaraan, penelitian, maupun pengembangan kebijakan
          lingkungan.
        </p>
        <p>
          Dikembangkan menggunakan teknologi modern seperti React, Node.js, dan
          Express, aplikasi ini mengedepankan performa, keamanan, serta
          kemudahan akses dari berbagai perangkat. <strong>CO.Emission</strong>{" "}
          merupakan langkah nyata menuju transportasi yang lebih ramah
          lingkungan dan berkelanjutan.
        </p>
        <p className="mt-4">
          Aplikasi ini dikembangkan oleh tim profesional yang tergabung dalam{" "}
          <strong>Tim Inovasi Emisi Nusantara</strong>, yang terdiri dari 7
          individu dengan latar belakang yang beragam — mulai dari rekayasa
          perangkat lunak, desain UI/UX, hingga penelitian lingkungan. Dengan
          komitmen tinggi terhadap teknologi dan keberlanjutan, tim ini berhasil
          merancang dan mewujudkan <strong>CO.Emission</strong> sebagai solusi
          digital yang berdampak.
        </p>
        <p className="mt-3">
          Proyek pengembangan aplikasi ini didukung oleh anggaran sebesar{" "}
          <strong>Rp675.000.000</strong>, yang mencakup proses penelitian,
          perancangan sistem, pengujian, dan implementasi infrastruktur.
          Anggaran tersebut mencerminkan keseriusan dalam menghadirkan produk
          teknologi yang berkualitas, andal, dan relevan dengan tantangan
          lingkungan masa kini.
        </p>

        {/* TIM PENGEMBANG */}
        <div className="mt-20 relative">
          <h2 className="text-2xl font-semibold mb-16 text-center">
            Tim Pengembang
          </h2>
          <TeamChart />
        </div>
      </div>
    </div>
  );
};

export default About;
