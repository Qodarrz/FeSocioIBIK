/* eslint-disable */
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ShinyText from "../components/fraction/ShinyText";
import DonateSection from "../components/fraction/DonateSection";
import CurvedLoop from "../components/fraction/CurvedLoop";
import SpotlightCard from "../components/fraction/SpotlightCard";
import ListRiwayatDonate from "../components/ListRiwayatDonate";
import ListPesanRiwayatDonate from "../components/ListPesanRiwayatDonate";
import { formatRupiah } from "../services/formatRupiah";
import DonationInput from "../components/DetailPages/DonationInput.tsx";
import DonationDashboard from "../components/DetailPages/DonationDashboard.tsx";
import DisasterMap from "../components/DetailPages/DisasterMap.tsx";
import donateData from "../data/donateData";

// Data statis yang diperbanyak untuk simulasi "Donasi Tertinggi"
const items = [
  {
    name: "Sultan IT",
    amount: 10000000,
    createdAt: "2026-01-20T10:30:00.000Z",
  },
  {
    name: "Hamba Allah",
    amount: 500000,
    createdAt: "2026-01-21T11:00:00.000Z",
  },
  { name: "agus", amount: 15000, createdAt: "2026-01-01T14:30:00.000Z" },
  { name: "dimas", amount: 50000, createdAt: "2026-01-02T14:30:00.000Z" },
  { name: "Andi", amount: 250000, createdAt: "2026-01-15T09:15:00.000Z" },
];

const itemsPesanOrangBaik = [
  {
    name: "Sultan IT",
    pesan: "Semoga cepat pulih untuk saudara-saudara kita di sana. Semangat!",
    createdAt: "2026-01-20T10:30:00.000Z",
  },
  {
    name: "agus",
    pesan: "Semoga bermanfaat, walau sedikit.",
    createdAt: "2026-01-01T14:30:00.000Z",
  },
  {
    name: "dimas",
    pesan: "Titip doa untuk para relawan di lapangan.",
    createdAt: "2026-01-02T14:30:00.000Z",
  },
];

// Data detail untuk masing-masing bencana berdasarkan ID
const disasterDetailData = {
  1: {
    title: "Bencana Banjir Aceh",
    fullDescription:
      "Banjir bandang dan tanah longsor melanda wilayah Aceh, mengakibatkan ribuan rumah terendam, infrastruktur rusak, dan ribuan warga mengungsi. Bantuan mendesak dibutuhkan untuk evakuasi, logistik, dan pemulihan.",
    target: 50000000,
    collected: 23000000,
    donaturCount: 2458,
    progress: 46,
    image: "/images/bencana/b1.jpg",
    location: "Aceh, Sumatra",
    mapCenter: { lat: 5.548, lng: 95.319 },
    completed: false, // Aceh masih progres
    details: "Banjir terparah dalam 10 tahun terakhir. 15 kecamatan terdampak.",
  },
  2: {
    title: "Longsor Sumatra Utara",
    fullDescription:
      "Gempa bumi berkekuatan 7.2 SR mengguncang wilayah Sumatra Utara, menyebabkan kerusakan parah pada bangunan dan fasilitas publik. Dana telah terkumpul sepenuhnya dan sedang dalam tahap penyaluran bantuan tahap akhir.",
    target: 75000000,
    collected: 75000000,
    donaturCount: 5123,
    progress: 100,
    image: "/images/bencana/bencana-2-longsor-sumut-3.webp",
    location: "Sumatra Utara",
    mapCenter: { lat: 1.848, lng: 98.2914 },
    completed: true, // Sumut sudah beres
    details: "Donasi ditutup. Terima kasih atas partisipasi para donatur.",
  },
};

export default function DonasiDetailPage() {
  const { id } = useParams();
  const disasterId = parseInt(id || "1");
  const [search, setSearch] = useState("");
  // Tambah state "highest" pada sortType
  const [sortType, setSortType] = useState<"newest" | "oldest" | "highest">(
    "newest",
  );

  const disaster =
    disasterDetailData[disasterId as keyof typeof disasterDetailData] ||
    disasterDetailData[1];

  const filteredDonateData = useMemo(() => {
    return donateData.filter(
      (item) =>
        item.id !== disasterId &&
        (item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())),
    );
  }, [search, disasterId]);

  // Logika sorting disesuaikan untuk mengakomodasi "Tertinggi"
  const sortedItems = useMemo(() => {
    let result = [...items];
    if (sortType === "highest") {
      return result.sort((a, b) => b.amount - a.amount);
    }
    return result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortType === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [items, sortType]);

  const marqueeTexts = {
    1: "Bersatu Kita Bisa ✦ #prayforaceh ✦ #solidaritasaceh ✦ ",
    2: "Donasi Selesai ✦ Terima Kasih Orang Baik ✦ #sumutbangkit ✦ ",
  };

  return (
    <div className="bg-white text-text dark:bg-black dark:text-textDark">
      {/* Hero Section */}
      <section className="w-full h-auto py-20 flex justify-center relative items-center text-black dark:text-white text-center">
        <div className="mt-5 mx-5 md:mx-10">
          <div className="mt-10 container">
            <div className="w-full h-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <SpotlightCard
                className="custom-spotlight-card dark:bg-gray-900 dark:!border-none border-1 !p-5 !border-gray-200 rounded-xl bg-white"
                spotlightColor="rgba(158, 207, 212, 0.5)"
              >
                <div className="w-full h-[350px] items-center justify-center">
                  <img
                    src={disaster.image}
                    className="w-full h-full rounded-2xl object-cover"
                    alt={disaster.title}
                  />
                </div>
              </SpotlightCard>

              <div className="text-start">
                <div className="flex justify-between items-center mb-2">
                  <h1 className="text-3xl font-bold text-black dark:text-white">
                    {disaster.title}
                  </h1>
                  {disaster.completed && (
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
                      ✅ Selesai
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  {disaster.fullDescription}
                </p>
                {disaster.details && (
                  <p className="text-gray-500 text-xs italic">
                    {disaster.details}
                  </p>
                )}

                {/* Progress Bar */}
                <div className="w-full mt-5">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h6 className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-primary">
                      Terkumpul {formatRupiah(disaster.collected)}
                    </h6>
                    <h6 className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-black dark:text-white">
                      Target {formatRupiah(disaster.target)}
                    </h6>
                  </div>
                  <div className="flex-start flex h-2.5 w-full overflow-hidden rounded-full bg-blue-gray-50 font-sans bg-gray-400 text-xs font-medium">
                    <div
                      className={`flex items-center justify-center h-full overflow-hidden text-white break-all rounded-full ${
                        disaster.completed ? "bg-green-500" : "bg-primary"
                      }`}
                      style={{ width: `${disaster.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    {disaster.donaturCount.toLocaleString()} donatur telah
                    berpartisipasi
                  </p>
                </div>

                {/* Tombol Transparansi untuk yang sudah selesai */}
                {disaster.completed ? (
                  <div className="mt-5">
                    <Link
                      to={`/transparansi-donasi/${disasterId}`}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 2H4v4h12V6z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M2 14a2 2 0 002 2h12a2 2 0 002-2v-2h-2v2H4v-2H2v2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Lihat Transparansi Donasi
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                      Penggalangan dana ini sudah selesai. Lihat laporan
                      penggunaan dana secara transparan.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5">
                    <DonationInput disasterId={disasterId} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-5 md:mx-10">
        <DonationDashboard disasterId={disasterId} />

        {/* Map and VR Section */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Peta Lokasi Bencana - {disaster.location}
          </h3>
          <DisasterMap
            center={disaster.mapCenter}
            location={disaster.location}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2">
          <div className="w-full">
            <div className="pb-4 pt-3">
              <h1 className="text-xl font-semibold text-black dark:text-white">
                Pesan Orang Baik
              </h1>
            </div>
            <ListPesanRiwayatDonate
              items={itemsPesanOrangBaik}
              onItemSelect={(item, index) => console.log(item, index)}
              showGradients={true}
              enableArrowNavigation={true}
              displayScrollbar={true}
            />
          </div>

          <div className="w-full">
            <div className="flex pb-4 justify-between items-center">
              <h1 className="text-xl font-semibold text-black dark:text-white">
                Historis Donasi
              </h1>
              <div className="flex gap-3">
                <button
                  onClick={() => setSortType("newest")}
                  className={`
                    py-2 px-4 rounded-full text-sm font-medium border dark:border-none transition-all
                    ${
                      sortType === "newest"
                        ? "bg-primary text-white"
                        : "bg-white text-black btn-border-reveal2 z-10 cursor-pointer border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700"
                    }
                  `}
                >
                  Terbaru
                </button>
                <button
                  onClick={() => setSortType("highest")}
                  className={`
                    py-2 px-4 rounded-full text-sm font-medium border dark:border-none transition-all
                    ${
                      sortType === "highest"
                        ? "bg-primary text-white"
                        : "bg-white text-black btn-border-reveal2 z-10 cursor-pointer border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-900"
                    }
                  `}
                >
                  Tertinggi
                </button>
              </div>
            </div>
            <ListRiwayatDonate
              items={sortedItems}
              onItemSelect={(item, index) => console.log(item, index)}
              showGradients={true}
              enableArrowNavigation={true}
              displayScrollbar={true}
            />
          </div>
        </div>
      </div>

      {/* Other Donation Section */}
      <div className="mt-40">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Donasi Lainnya yang Membutuhkan Bantuan
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Masih banyak bencana lain yang membutuhkan uluran tangan Anda
          </p>
        </div>
        <DonateSection data={filteredDonateData} />
      </div>

      {/* Marquee Section */}
      <section>
        <CurvedLoop
          className="!text-black dark:!text-white"
          marqueeText={
            marqueeTexts[disasterId as keyof typeof marqueeTexts] ||
            marqueeTexts[1]
          }
        />
      </section>
    </div>
  );
}
