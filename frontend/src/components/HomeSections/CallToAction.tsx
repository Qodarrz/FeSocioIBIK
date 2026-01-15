import React from "react";
import { Carousel } from "../ui/carousel";

const CallToActionSection: React.FC = () => {
  // Data untuk carousel
  const carouselSlides = [
    {
      title: "Tim Relawan Medis",
      button: "Pelajari Lebih Lanjut",
      src: "/images/home/1.png",
      description: "Menyediakan perawatan kesehatan darurat di lokasi bencana untuk korban yang membutuhkan."
    },
    {
      title: "Distribusi Bantuan",
      button: "Lihat Bantuan",
      src: "/images/home/2.png",
      description: "Menyalurkan paket makanan dan kebutuhan pokok kepada keluarga terdampak."
    },
    {
      title: "Tenda Pengungsian",
      button: "Bantu Sekarang",
      src: "/images/home/3.png",
      description: "Menyediakan tempat berlindung sementara yang aman dan nyaman."
    },
    {
      title: "Pendidikan Darurat",
      button: "Dukung Pendidikan",
      src: "/images/home/4.png",
      description: "Kegiatan belajar untuk anak-anak korban bencana agar tidak tertinggal pelajaran."
    },
    {
      title: "Rekonstruksi",
      button: "Ikut Membangun",
      src: "/images/home/4.png",
      description: "Memulihkan lingkungan dan infrastruktur yang rusak akibat bencana."
    },
    {
      title: "Dukungan Psikologis",
      button: "Berikan Dukungan",
      src: "/images/home/3.png",
      description: "Memberikan dukungan mental dan trauma healing bagi korban bencana."
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-10 md:px-0 md:mx-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Kolom Kiri - Teks Ajakan */}
          <div className="">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Setiap <span className="text-primary">Tindakan</span> Anda
                <br />
                <span className="text-foreground">Menyelamatkan</span>
                <span className="text-primary"> Nyawa</span>
              </h2>

              <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
                Di tengah ujian yang menghampiri saudara-saudara kita, kami
                percaya bahwa kebaikan akan selalu mengalahkan kesulitan. Setiap
                kontribusi, baik besar maupun kecil, menjadi harapan baru bagi
                mereka yang terdampak.
              </p>
              
                <p className="text-muted-foreground mb-6">
                  Bergabunglah dengan ribuan orang baik yang telah mempercayakan
                  bantuannya melalui platform kami. Bersama, kita bisa
                  memberikan dampak yang lebih besar.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-8 py-3 btn-border-reveal z-10 bg-primary text-white rounded-full  hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
                    Mulai Berdonasi Sekarang
                  </button>
                  <button className="px-8 py-3 btn-border-reveal2 z-10 border border-gray-200 rounded-full bg-gray-50 dark:bg-gray-900 dark:border-gray-800  hover:bg-primary/10 transition-colors">
                    Menjadi Relawan
                  </button>
                </div>
            </div>

          </div>

          {/* Kolom Kanan - Carousel */}
          <div className="flex -mt-10  items-center justify-center h-full">
            <Carousel slides={carouselSlides} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;