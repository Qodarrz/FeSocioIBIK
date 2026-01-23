/* eslint-disable */
import React from "react";
import {
  MdHealthAndSafety,
  MdWaterDrop,
  MdLocalHospital,
  MdFoodBank,
  MdHome,
  MdSchool,
} from "react-icons/md";
import {
  FaFire,
  FaTint,
  FaMountain,
  FaWind,
  FaCloudShowersHeavy,
} from "react-icons/fa";

export interface CarouselItem {
  id: number;
  image: string;
  icon: React.ReactNode;
}

export interface DonateCampaign {
  id: number;
  title: string;
  description: string;
  items: CarouselItem[];
  targetAmount?: number;
  currentAmount?: number;
  contributors?: number;
}

export const iconThemes = {
  flood: React.createElement(MdWaterDrop, {
    className: "h-[16px] w-[16px] text-blue-500",
  }),
  health: React.createElement(MdHealthAndSafety, {
    className: "h-[16px] w-[16px] text-red-500",
  }),
  medical: React.createElement(MdLocalHospital, {
    className: "h-[16px] w-[16px] text-white",
  }),
  food: React.createElement(MdFoodBank, {
    className: "h-[16px] w-[16px] text-yellow-500",
  }),
  shelter: React.createElement(MdHome, {
    className: "h-[16px] w-[16px] text-green-500",
  }),
  education: React.createElement(MdSchool, {
    className: "h-[16px] w-[16px] text-purple-500",
  }),
  fire: React.createElement(FaFire, {
    className: "h-[16px] w-[16px] text-orange-500",
  }),
  landslide: React.createElement(FaMountain, {
    className: "h-[16px] w-[16px] text-amber-900",
  }),
  typhoon: React.createElement(FaWind, {
    className: "h-[16px] w-[16px] text-gray-400",
  }),
  heavyRain: React.createElement(FaCloudShowersHeavy, {
    className: "h-[16px] w-[16px] text-blue-300",
  }),
  water: React.createElement(FaTint, {
    className: "h-[16px] w-[16px] text-blue-400",
  }),
};

const createCarouselFromLocalPaths = (
  filenames: string[],
  icon: React.ReactNode,
): CarouselItem[] => {
  return filenames.map((name, index) => ({
    id: index + 1,
    image: `/images/bencana/${name}`,
    icon: icon,
  }));
};

export const donateData: DonateCampaign[] = [
  {
    id: 1,
    title: "Darurat Banjir Aceh",
    description:
      "Banjir bandang melanda pemukiman. Dibutuhkan bantuan logistik dan evakuasi segera untuk warga terdampak.",
    items: createCarouselFromLocalPaths(
      [
        "bencana-1-banjir-aceh-1.jpg",
        "bencana-1-banjir-aceh-2.jpg",
        "bencana-1-banjir-aceh-3.jpeg",
      ],
      iconThemes.flood,
    ),
    targetAmount: 250000000,
    currentAmount: 145000000,
    contributors: 2350,
  },
  {
    id: 2,
    title: "Longsor Sumatera Utara",
    description:
      "Akses jalan terputus akibat longsor. Donasi akan digunakan untuk pengadaan alat berat dan bantuan pangan.",
    items: createCarouselFromLocalPaths(
      [
        "bencana-2-longsor-sumut-1.jpeg",
        "bencana-2-longsor-sumut-2.webp",
        "bencana-2-longsor-sumut-3.webp",
      ],
      iconThemes.landslide,
    ),

    targetAmount: 180000000,
    currentAmount: 95000000,
    contributors: 1820,
  },
  {
    id: 3,
    title: "Karhutla Kalimantan",
    description:
      "Kebakaran hutan mengakibatkan kabut asap pebal. Bantuan berupa masker N95 dan oksigen portable sangat dibutuhkan.",
    items: createCarouselFromLocalPaths(
      [
        "bencana-3-karhutla-kalimantan-1.jpg",
        "bencana-3-karhutla-kalimantan-2.jpeg",
        "bencana-3-karhutla-kalimantan-3.jpeg",
      ],
      iconThemes.fire,
    ),
    targetAmount: 120000000,
    currentAmount: 75000000,
    contributors: 1340,
  },
  {
    id: 4,
    title: "Pemulihan Tsunami Palu",
    description:
      "Membangun kembali fasilitas sekolah dan menyediakan peralatan belajar bagi anak-anak di pesisir Palu.",
    items: createCarouselFromLocalPaths(
      [
        "bencana-4-tsunami-palu-1.webp",
        "bencana-4-tsunami-palu-2.jpeg",
        "bencana-4-tsunami-palu-3.jpeg",
      ],
      iconThemes.education,
    ),
    targetAmount: 300000000,
    currentAmount: 180000000,
    contributors: 3150,
  },
  {
    id: 5,
    title: "Hunian Sementara Cianjur",
    description:
      "Bantu penyintas gempa yang masih tinggal di tenda untuk memiliki hunian sementara (Huntara) yang layak.",
    items: createCarouselFromLocalPaths(
      ["bencana-5-gempa-cianjur-1.png", "bencana-5-gempa-cianjur-2.png"],
      iconThemes.shelter,
    ),
    targetAmount: 500000000,
    currentAmount: 310000000,
    contributors: 4200,
  },
  {
    id: 6,
    title: "Banjir Luapan Papua",
    description:
      "Bantuan dapur umum dan layanan kesehatan darurat untuk ribuan pengungsi banjir di wilayah Papua.",
    items: createCarouselFromLocalPaths(
      ["bencana-6-banjir-papua-1.png", "bencana-6-banjir-papua-2.png"],
      iconThemes.flood,
    ),
    targetAmount: 150000000,
    currentAmount: 85400000,
    contributors: 1240,
  },
  {
    id: 7,
    title: "Krisis Air Gunung Kidul",
    description:
      "Kekeringan panjang membuat warga sulit mendapat air bersih. Mari bantu bangun sumur bor dan pipanisasi.",
    items: createCarouselFromLocalPaths(
      ["bencana-7-gunung-kidul-1.png", "bencana-7-gunung-kidul-2.png"],
      iconThemes.water,
    ),
    targetAmount: 180000000,
    currentAmount: 155000000,
    contributors: 2100,
  },
  {
    id: 8,
    title: "Respon Cepat Logistik",
    description:
      "Dana taktis untuk penyaluran logistik mendadak di berbagai titik bencana di seluruh Indonesia.",
    items: createCarouselFromLocalPaths(
      ["b1.jpg", "b2.jpg", "b3.jpg", "b4.jpg", "b5.webp", "b6.jpg", "b7.jpg"],
      iconThemes.health,
    ),
    targetAmount: 100000000,
    currentAmount: 45000000,
    contributors: 890,
  },
];

export const allDonateData: DonateCampaign[] = [...donateData];

export default allDonateData;
