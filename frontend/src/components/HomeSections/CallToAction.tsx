import React from "react";
import { Carousel } from "../ui/carousel";
// Mengimpor data dari file eksternal
import { carouselSlides } from "@/data/carouselData";

const CallToActionSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden relative">
      {/* GRADASI BACKGROUND UTAMA 
        Diletakkan di luar container agar tidak terikat pada grid. 
        Menggunakan blur yang sangat besar (150px+) agar transisi halus.
      */}
      <div
        className="absolute top-1/4 -right-20 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/10 blur-[100px] md:blur-[160px] rounded-full opacity-60 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 -left-20 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-primary/5 blur-[80px] md:blur-[140px] rounded-full opacity-50 pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Kolom Kiri - Teks Ajakan */}
          <div className="flex flex-col space-y-6 md:space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight text-foreground">
              Setiap <span className="text-primary">Tindakan</span> Anda
              <br className="hidden sm:block" />
              <span className="text-foreground"> Menyelamatkan</span>
              <span className="text-primary"> Nyawa</span>
            </h2>

            <div className="space-y-4 max-w-xl">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Di tengah ujian yang menghampiri saudara-saudara kita, kami
                percaya bahwa kebaikan akan selalu mengalahkan kesulitan. Setiap
                kontribusi menjadi harapan baru bagi mereka yang terdampak.
              </p>

              <p className="text-sm md:text-base text-muted-foreground/80 italic">
                Bergabunglah dengan ribuan orang baik yang telah mempercayakan
                bantuannya. Bersama, kita bisa memberikan dampak yang lebih
                besar.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95">
                Mulai Berdonasi Sekarang
              </button>
              <button className="w-full sm:w-auto px-8 py-4 border border-input rounded-full bg-background font-semibold hover:bg-secondary transition-all active:scale-95">
                Menjadi Relawan
              </button>
            </div>
          </div>

          {/* Kolom Kanan - Carousel */}
          <div className="relative w-full flex items-center justify-center lg:justify-end">
            {/* GRADASI AKSEN (MOBILE-SPECIFIC)
              Digeser sedikit keluar (offset) agar terlihat di balik sudut carousel 
            */}
            <div
              className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/10 blur-[60px] md:hidden"
              aria-hidden="true"
            />

            <div className="w-full max-w-[480px] lg:max-w-[550px] relative">
              {/* Bingkai Dekoratif Halus */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary/10 to-transparent rounded-[2rem] blur-2xl -z-10 opacity-50" />

              <Carousel slides={carouselSlides} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
