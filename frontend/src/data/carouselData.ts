// src/data/carouselData.ts

export interface CarouselSlide {
  title: string;
  button: string;
  src: string;
  description: string;
}

export const carouselSlides: CarouselSlide[] = [
  {
    title: "Tim Relawan Medis",
    button: "Pelajari Lebih Lanjut",
    src: "/images/home/1.png",
    description:
      "Menyediakan perawatan kesehatan darurat di lokasi bencana untuk korban yang membutuhkan.",
  },
  {
    title: "Distribusi Bantuan",
    button: "Lihat Bantuan",
    src: "/images/home/2.png",
    description:
      "Menyalurkan paket makanan dan kebutuhan pokok kepada keluarga terdampak.",
  },
  {
    title: "Tenda Pengungsian",
    button: "Bantu Sekarang",
    src: "/images/home/3.png",
    description:
      "Menyediakan tempat berlindung sementara yang aman dan nyaman.",
  },
  {
    title: "Pendidikan Darurat",
    button: "Dukung Pendidikan",
    src: "/images/home/4.png",
    description:
      "Kegiatan belajar untuk anak-anak korban bencana agar tidak tertinggal pelajaran.",
  },
  {
    title: "Rekonstruksi",
    button: "Ikut Membangun",
    src: "/images/home/4.png",
    description:
      "Memulihkan lingkungan dan infrastruktur yang rusak akibat bencana.",
  },
  {
    title: "Dukungan Psikologis",
    button: "Berikan Dukungan",
    src: "/images/home/3.png",
    description:
      "Memberikan dukungan mental dan trauma healing bagi korban bencana.",
  },
];
