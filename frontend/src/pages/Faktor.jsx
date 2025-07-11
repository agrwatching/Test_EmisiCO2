import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import bgemisi from "../assets/bgemisi.png";

const Faktor = () => {
  useEffect(() => {
     if (window.location.hash) {
    window.history.replaceState(null, "", "/faktor");
  }

    document.body.style.backgroundImage = `url(${bgemisi})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.color = "white";

    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        setTimeout(() => {
          const rect = target.getBoundingClientRect();
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
          const navbarHeight = 2000; // Sesuaikan tinggi Navbar jika berbeda
          const offset =
            window.innerHeight / 2 - rect.height / 2 - navbarHeight;
          const targetY = scrollTop + rect.top - offset;

          window.scrollTo({
            top: targetY,
            behavior: "smooth",
          });
        }, 200); // beri jeda agar layout benar-benar siap
      }
    }

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundAttachment = "";
      document.body.style.color = "";
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="text-white px-8 py-20 space-y-40 bg-black bg-opacity-70 mt-6">
        {/* Bahan Bakar */}
        <section id="bahanbakar" className="p-5 mt-12">
          <div>
            <h2 className="text-3xl font-bold mb-4 mt-40">Bahan Bakar</h2>
            <p className="text-lg leading-relaxed">
              Bahan bakar seperti bensin dan solar menghasilkan CO₂ saat dibakar
              dalam mesin kendaraan. Jenis dan kualitas bahan bakar dapat
              memengaruhi seberapa besar emisi karbon yang dilepaskan.
            </p>
          </div>
        </section>

        {/* RPM */}
        <section id="rpm" className="p-5">
          <h2 className="text-3xl font-bold mb-4 mt-40">
            RPM (Revolutions Per Minute)
          </h2>
          <p className="text-lg leading-relaxed">
            RPM menggambarkan seberapa cepat mesin kendaraan berputar. Semakin
            tinggi RPM, biasanya konsumsi bahan bakar meningkat dan emisi pun
            bertambah, terutama saat akselerasi tiba-tiba.
          </p>
        </section>

        {/* CC Mesin */}
        <section id="ccmesin" className="p-5">
          <h2 className="text-3xl font-bold mb-4 mt-40">CC Mesin</h2>
          <p className="text-lg leading-relaxed mb-80">
            CC (Cubic Centimeter) menunjukkan kapasitas mesin kendaraan. Mesin
            dengan CC lebih besar biasanya menghasilkan tenaga lebih kuat, namun
            juga berpotensi menghasilkan emisi lebih tinggi jika tidak efisien.
          </p>
        </section>
      </div>
    </>
  );
};

export default Faktor;
