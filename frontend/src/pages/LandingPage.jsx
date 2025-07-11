import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import arrow from "../assets/arrow.png";
import articel1 from "../assets/articel1.png";
import articel2 from "../assets/articel2.png";
import articel3 from "../assets/articel3.png";
import bgemisi from "../assets/bgemisi.png";
import co2 from "../assets/co2.png";
import frame from "../assets/frame.png";
import frame2 from "../assets/frame2.png";

const LandingPage = () => {
  const scrollContainerRef = useRef(null);
  const learnMoreRef = useRef(null);

  useEffect(() => {
    // scroll ke bagian tertentu jika diminta
    const scrollToId = localStorage.getItem("scrollTo");
    if (scrollToId) {
      const el = document.getElementById(scrollToId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        localStorage.removeItem("scrollTo");
      }
    }
    // Set background styles for body
    document.body.style.backgroundImage = `url(${bgemisi})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.color = "white";

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundAttachment = "";
      document.body.style.color = "";
    };
  }, []);

  //3 scroll dan arow
  useEffect(() => {
    // Animasi teks scroll (Monitor / Analyze / Reduce)
    const scrollContainer = scrollContainerRef.current;
    const items = scrollContainer.children;
    const itemCount = items.length - 1;
    const itemHeight = items[0].offsetHeight;
    let index = 0;

    const intervalId = setInterval(() => {
      index++;
      scrollContainer.style.transform = `translateY(-${index * itemHeight}px)`;

      if (index === itemCount) {
        setTimeout(() => {
          scrollContainer.style.transition = "none";
          scrollContainer.style.transform = "translateY(0)";
          index = 0;
          setTimeout(() => {
            scrollContainer.style.transition = "transform 0.7s ease-in-out";
          }, 50);
        }, 700);
      }
    }, 2000);

    // Smooth scroll ke #next-section
    const link = learnMoreRef.current;
    const onLinkClick = (e) => {
      e.preventDefault();
      const target = document.querySelector("#next-section");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    };
    link.addEventListener("click", onLinkClick);

    return () => {
      clearInterval(intervalId);
      link.removeEventListener("click", onLinkClick);
    };
  }, []);

  // Hover arrow (FIXED)
  const handleArrowHover = (e) => {
    const img = e.currentTarget.querySelector(".arrow-img");
    img.classList.remove("arrow-rotate-leave");
    img.classList.add("arrow-rotate-hover");
  };

  const handleArrowLeave = (e) => {
    const img = e.currentTarget.querySelector(".arrow-img");
    img.classList.remove("arrow-rotate-hover");
    img.classList.add("arrow-rotate-leave");
  };

  //animasi artikel
  const overlayRef = useRef(null);
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const img3Ref = useRef(null);

  const [activeImage, setActiveImage] = useState(null);
  const originalStyle = useRef({});

  const focusImage = (imgRef, alt, link) => {
    if (activeImage) return;

    const img = imgRef.current;
    setActiveImage({ ref: imgRef, link });

    originalStyle.current = {
      transform: img.style.transform,
      zIndex: img.style.zIndex,
      transition: img.style.transition,
    };

    img.style.zIndex = "50";
    img.style.transition = "transform 0.7s ease";

    const classList = img.className;
    const rotateMatch = classList.match(/-rotate-([0-9]+)/);
    const rotateNegMatch = classList.match(/-rotate-(-[0-9]+)/);
    let angleDeg = 0;
    if (rotateMatch) angleDeg = parseInt(rotateMatch[1]);
    if (rotateNegMatch) angleDeg = parseInt(rotateNegMatch[1]);

    const moveDistance = -window.innerHeight / 2 + 100;
    const angleRad = (angleDeg * Math.PI) / 180;
    const moveX = Math.sin(angleRad) * moveDistance;
    const moveY = Math.cos(angleRad) * moveDistance;

    img.style.transform += ` translate(${moveX}px, ${moveY}px)`;

    setTimeout(() => {
      const rect = img.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const imgCenterX = rect.left + rect.width / 2;
      const imgCenterY = rect.top + rect.height / 2;

      let offsetX = 0;
      let offsetY = 0;
      let rotateFinal = 20;
      let scaleFinal = 1.5;

      if (alt === "Artikel 1") {
        offsetY = 30;
        scaleFinal = 1.7;
      } else if (alt === "Artikel 2") {
        rotateFinal = 10;
        offsetY = 30;
        scaleFinal = 1.3;
      } else if (alt === "Artikel 3") {
        offsetY = 20;
      }

      const finalMoveX = centerX - imgCenterX + offsetX;
      const finalMoveY = centerY - imgCenterY + offsetY;

      img.style.transition = "transform 0.7s ease";
      img.style.transform = `translate(${moveX}px, ${moveY}px) translate(${finalMoveX}px, ${finalMoveY}px) scale(${scaleFinal})`;

      const overlay = overlayRef.current;
      overlay.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      overlay.classList.remove("hidden", "opacity-0");
      overlay.classList.add("opacity-100");
    }, 700);
  };

  const closeImage = () => {
    if (!activeImage) return;

    const img = activeImage.ref.current;

    img.style.transition = "transform 0.7s ease";
    img.style.transform = originalStyle.current.transform;
    img.style.zIndex = originalStyle.current.zIndex;

    const overlay = overlayRef.current;
    overlay.classList.remove("opacity-100");
    overlay.classList.add("opacity-0");

    setTimeout(() => {
      overlay.classList.add("hidden");
      overlay.style.backgroundColor = "";
      overlay.style.transition = "";
      img.style.transition = originalStyle.current.transition;
      setActiveImage(null);
    }, 700);
  };

  const handleImageClick = (imgRef, alt, link) => {
    const img = imgRef.current;

    // Kalau belum aktif (gambar belum difokuskan)
    if (!activeImage) {
      focusImage(imgRef, alt, link);
    }
    // Kalau sudah aktif dan gambar yang diklik adalah yang sedang aktif
    else if (activeImage.ref.current === img) {
      window.location.href = link;
    }
  };

  return (
    <div className="">
      <Navbar />
      <section className="h-screen flex flex-col justify-center px-10">
        <div className="flex items-center py-12 justify-between w-full ml-4">
          {/* Kiri: Animasi teks scroll */}
          <div className="relative h-20 overflow-hidden">
            <div
              ref={scrollContainerRef}
              id="scroll-container"
              className="flex flex-col transition-transform duration-700 ease-in-out"
            >
              {["Monitor", "Analyze", "Reduce", "Monitor"].map((text, idx) => (
                <div key={idx} className="h-20 flex items-center">
                  <span className="text-5xl md:text-6xl font-bold text-white">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Kanan */}
          <div className="text-center">
            <h1 className="text-5xl md:text-8xl font-bold text-gray-300 opacity-50">
              Your Vehicle's <br />
              CO<sub>2</sub> Emissions
            </h1>
          </div>
          <img src={frame} alt="Frame" className="w-12" />
        </div>

        {/* Tombol bawah */}
        <div className="mt-28">
          <a
            href="#next-section"
            ref={learnMoreRef}
            className="group inline-flex items-center gap-2 py-1 px-3 border border-white transition"
            onMouseEnter={handleArrowHover}
            onMouseLeave={handleArrowLeave}
          >
            <img
              src={arrow}
              alt="Arrow"
              className="arrow-img w-8 h-8 bg-white rotate-180 rounded-full"
            />
            Learn More
          </a>
        </div>
      </section>
      <section className="relative bg-white text-black py-4 overflow-hidden">
        <div className="marquee">
          <div className="marquee-content">
            {Array(5)
              .fill("Emission Knowledge")
              .map((text, index) => (
                <span key={`row1-${index}`} className="mx-8 text-xl">
                  {text}
                </span>
              ))}
          </div>
          <div className="marquee-content">
            {Array(5)
              .fill("Emission Knowledge")
              .map((text, index) => (
                <span key={`row2-${index}`} className="mx-8 text-xl">
                  {text}
                </span>
              ))}
          </div>
        </div>
      </section>
      <section
        id="next-section"
        className="relative h-screen bg-black text-white overflow-hidden"
      >
        {/* Logo dan frame */}
        <div className="flex w-full justify-between items-center pt-6 px-8">
          <img src={co2} alt="Logo CO2" className="h-32 w-auto" />
          <img src={frame2} alt="Frame" className="h-32 w-auto" />
        </div>

        {/* Paragraf */}
        <div className="mt-12 max-w-md px-10">
          <p className="text-lg leading-relaxed">
            Emisi karbon dioksida (CO₂) merupakan salah satu penyebab utama
            perubahan iklim. CO₂ berasal dari aktivitas manusia seperti
            pembakaran bahan bakar fosil (bensin, batu bara, gas alam),
            deforestasi, dan industri.
          </p>
        </div>

        {/* Overlay */}
        <div
          ref={overlayRef}
          className="fixed inset-0 hidden z-40 transition-opacity duration-500 opacity-0"
          onClick={closeImage}
        ></div>

        {/* Gambar Artikel */}
        <img
          ref={img1Ref}
          src={articel1}
          alt="Artikel 1"
          data-link="https://lindungihutan.com/"
          className="absolute -bottom-20 left-100 transform -rotate-20 h-72 z-10 shadow-xl rounded-lg cursor-pointer"
          onClick={() =>
            handleImageClick(img1Ref, "Artikel 1", "https://lindungihutan.com/")
          }
        />
        <img
          ref={img2Ref}
          src={articel2}
          alt="Artikel 2"
          data-link="https://lindungihutan.com/"
          className="absolute -bottom-20 right-12 transform -translate-x-1/2 -rotate-10 h-96 z-20 shadow-2xl rounded-lg cursor-pointer"
          onClick={() =>
            handleImageClick(img2Ref, "Artikel 2", "https://www.nestle.co.id/")
          }
        />
        <img
          ref={img3Ref}
          src={articel3}
          alt="Artikel 3"
          data-link="https://lindungihutan.com/"
          className="absolute -bottom-10 -right-16 transform -rotate-20 h-80 z-30 shadow-xl rounded-lg cursor-pointer"
          onClick={() =>
            handleImageClick(img3Ref, "Artikel 3", "https://lindungihutan.com/")
          }
        />
      </section>
    </div>
  );
};

export default LandingPage;
