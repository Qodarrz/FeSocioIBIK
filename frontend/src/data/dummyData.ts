import React from "react";
import { MdHealthAndSafety } from "react-icons/md";

export interface DonationItem {
  id: string;
  title: string;
  description: string;
  image: string;
  targetAmount: number;
  currentAmount: number;
  contributors: number;
}

export const DONATE_DATA: DonationItem[] = [
  {
    id: "1",
    title: "Banjir Bandang Demak",
    description:
      "Bantuan darurat logistik dan sanitasi untuk ribuan warga yang terisolasi banjir.",
    image:
      "https://bpbd.badungkab.go.id/storage/olds/bpbd/Segala-hal-tentang-Tsunami-yang-perlu-anda-ketahui_509887.jpg",
    targetAmount: 150000000,
    currentAmount: 85400000,
    contributors: 1240,
  },
  {
    id: "2",
    title: "Erupsi Gunung Marapi",
    description:
      "Pengadaan masker medis, oksigen, dan kebutuhan mendesak bagi pengungsi erupsi.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/03/3_Java_Vulkan_Semeru_n%C3%A4her_Rauchwolke.JPG",
    targetAmount: 200000000,
    currentAmount: 45000000,
    contributors: 890,
  },
  {
    id: "donasi-3",
    title: "Gempa Bumi Cianjur",
    description:
      "Program pemulihan infrastruktur sekolah dan hunian sementara bagi warga.",
    image:
      "https://pusatkrisis.kemkes.go.id/__asset/__images/content/52astrowani.png",
    targetAmount: 500000000,
    currentAmount: 320000000,
    contributors: 4200,
  },
  {
    id: "donasi-4",
    title: "Kebakaran Hutan Kalimantan",
    description:
      "Donasi untuk alat pemadam api dan layanan kesehatan pernapasan bagi masyarakat.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2plUjHN5wgKLkO_PHk_LuL2l4URmmu6yFbg&s",
    targetAmount: 100000000,
    currentAmount: 12500000,
    contributors: 315,
  },
  {
    id: "donasi-5",
    title: "Tanah Longsor Bogor",
    description:
      "Evakuasi dan bantuan paket sembako untuk keluarga korban tanah longsor.",
    image:
      "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=1000&auto=format&fit=crop",
    targetAmount: 75000000,
    currentAmount: 60000000,
    contributors: 940,
  },
  {
    id: "donasi-6",
    title: "Kekeringan NTT",
    description:
      "Pembangunan sumur bor dan distribusi air bersih untuk desa terdampak kemarau.",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop",
    targetAmount: 120000000,
    currentAmount: 95000000,
    contributors: 1100,
  },
  {
    id: "donasi-2",
    title: "Erupsi Gunung Marapi",
    description:
      "Pengadaan masker medis, oksigen, dan kebutuhan mendesak bagi pengungsi erupsi.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/03/3_Java_Vulkan_Semeru_n%C3%A4her_Rauchwolke.JPG",
    targetAmount: 200000000,
    currentAmount: 45000000,
    contributors: 890,
  },
  {
    id: "donasi-3",
    title: "Gempa Bumi Cianjur",
    description:
      "Program pemulihan infrastruktur sekolah dan hunian sementara bagi warga.",
    image:
      "https://pusatkrisis.kemkes.go.id/__asset/__images/content/52astrowani.png",
    targetAmount: 500000000,
    currentAmount: 320000000,
    contributors: 4200,
  },
  {
    id: "donasi-4",
    title: "Kebakaran Hutan Kalimantan",
    description:
      "Donasi untuk alat pemadam api dan layanan kesehatan pernapasan bagi masyarakat.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2plUjHN5wgKLkO_PHk_LuL2l4URmmu6yFbg&s",
    targetAmount: 100000000,
    currentAmount: 12500000,
    contributors: 315,
  },
  {
    id: "donasi-5",
    title: "Tanah Longsor Bogor",
    description:
      "Evakuasi dan bantuan paket sembako untuk keluarga korban tanah longsor.",
    image:
      "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=1000&auto=format&fit=crop",
    targetAmount: 75000000,
    currentAmount: 60000000,
    contributors: 940,
  },
  {
    id: "donasi-6",
    title: "Kekeringan NTT",
    description:
      "Pembangunan sumur bor dan distribusi air bersih untuk desa terdampak kemarau.",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop",
    targetAmount: 120000000,
    currentAmount: 95000000,
    contributors: 1100,
  },
  {
    id: "donasi-7",
    title: "Angin Puting Beliung",
    description:
      "Perbaikan rumah-rumah warga yang hancur akibat cuaca ekstrem di pesisir.",
    image:
      "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?q=80&w=1000&auto=format&fit=crop",
    targetAmount: 50000000,
    currentAmount: 15000000,
    contributors: 240,
  },
  {
    id: "donasi-8",
    title: "Abrasi Pantai Utara",
    description:
      "Penanaman bibit mangrove untuk membendung pengikisan daratan oleh air laut.",
    image:
      "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?q=80&w=1000&auto=format&fit=crop",
    targetAmount: 85000000,
    currentAmount: 42000000,
    contributors: 560,
  },
  {
    id: "donasi-9",
    title: "Tsunami Kecil Selat Sunda",
    description:
      "Bantuan perahu dan alat tangkap bagi nelayan pasca gelombang tsunami.",
    image:
      "https://images.unsplash.com/photo-1542401886-65d6c60db275?q=80&w=1000&auto=format&fit=crop",
    targetAmount: 250000000,
    currentAmount: 110000000,
    contributors: 1800,
  },
  {
    id: "donasi-10",
    title: "Polusi Udara Berat",
    description:
      "Pengadaan filter udara dan masker bagi anak-anak sekolah di zona merah polusi.",
    image:
      "https://images.unsplash.com/photo-1599305090598-fe179d501c27?q=80&w=1000&auto=format&fit=crop",
    targetAmount: 40000000,
    currentAmount: 5000000,
    contributors: 120,
  },
  {
    id: "donasi-11",
    title: "Krisis Air Bersih Papua",
    description:
      "Distribusi tangki air dan sistem filtrasi air minum di pedalaman.",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop",
    targetAmount: 180000000,
    currentAmount: 155000000,
    contributors: 2100,
  },
  {
    id: "donasi-12",
    title: "Kesehatan Anak Pasca Bencana",
    description:
      "Pemberian nutrisi tambahan dan imunisasi bagi balita di lokasi pengungsian.",
    image:
      "https://images.unsplash.com/photo-1489110854466-5ad062751c0a?q=80&w=1000&auto=format&fit=crop",
    targetAmount: 90000000,
    currentAmount: 68000000,
    contributors: 1350,
  },
];

export const DEMO_CAROUSEL = [
  {
    id: 1,
    image: "/images/bencana/b1.jpg",
    icon: React.createElement(MdHealthAndSafety, { className: "text-white" }),
  },
  {
    id: 2,
    image: "/images/bencana/b2.jpg",
    icon: React.createElement(MdHealthAndSafety, { className: "text-white" }),
  },
];
