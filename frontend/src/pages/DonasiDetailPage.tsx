/* eslint-disable */
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";
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

const donateData = [
  {
    title: "Bencana Aceh",
    description: "Banjir dan longsor telah melanda aceh...",
    items: [
      { id: 1, image: "/images/bencana/b1.jpg" },
      { id: 2, image: "/images/bencana/b2.jpg" },
      { id: 3, image: "/images/bencana/b3.jpg" },
    ],
  },
  {
    title: "Bencana Lampung",
    description: "Banjir dan longsor telah melanda lampung...",
    items: [
      { id: 1, image: "/images/bencana/b1.jpg" },
      { id: 2, image: "/images/bencana/b2.jpg" },
      { id: 3, image: "/images/bencana/b3.jpg" },
    ],
  },
  {
    title: "Bencana Lombok Timur",
    description: "Banjir dan longsor telah melanda lombok timur...",
    items: [
      { id: 1, image: "/images/bencana/b1.jpg" },
      { id: 2, image: "/images/bencana/b2.jpg" },
      { id: 3, image: "/images/bencana/b3.jpg" },
    ],
  },
];

const items = [
  {
    name: "agus",
    amount: 15000,
    createdAt: "2026-01-01T14:30:00.000Z",
  },
  {
    name: "dimas",
    amount: 15000,
    createdAt: "2026-01-02T14:30:00.000Z",
  },
];

const itemsPesanOrangBaik = [
  {
    name: "agus",
    pesan:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, alias dolores? Itaque, ullam molestiae expedita nam velit maxime sapiente id ad provident aliquid tempore maiores fuga ex doloribus, totam suscipit?",
    createdAt: "2026-01-01T14:30:00.000Z",
  },
  {
    name: "dimas",
    pesan:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, alias dolores? Itaque, ullam molestiae expedita nam velit maxime sapiente id ad provident aliquid tempore maiores fuga ex doloribus, totam suscipit?",
    createdAt: "2026-01-02T14:30:00.000Z",
  },
];

export default function DonasiDetailPage() {
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState<"newest" | "oldest">("newest");

  const filteredDonateData = useMemo(() => {
    return donateData.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortType === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [items, sortType]);

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
                    src="/images/bencana/b1.jpg"
                    className="w-full h-full rounded-2xl"
                    alt="Bencana Aceh"
                  />
                </div>
              </SpotlightCard>

              <div className="text-start">
                <h1 className="text-3xl font-bold text-black dark:text-white">
                  Bencana Aceh
                </h1>
                <p className="text-gray-400 text-sm">
                  Banjir bandang dan tanah longsor melanda wilayah Aceh,
                  mengakibatkan ribuan rumah terendam, infrastruktur rusak, dan
                  ribuan warga mengungsi. Bantuan mendesak dibutuhkan untuk
                  evakuasi, logistik, dan pemulihan.
                </p>

                {/* Progress Bar */}
                <div className="w-full mt-5">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h6 className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-primary">
                      Terkumpul Rp 23.000.000
                    </h6>
                    <h6 className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-black dark:text-white">
                      Target Rp 50.000.000
                    </h6>
                  </div>
                  <div className="flex-start flex h-2.5 w-full overflow-hidden rounded-full bg-blue-gray-50 font-sans bg-gray-400 text-xs font-medium">
                    <div
                      className="flex items-center justify-center h-full overflow-hidden text-white break-all bg-primary rounded-full"
                      style={{ width: "46%" }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    2,458 donatur telah berpartisipasi
                  </p>
                </div>

                <div className="mt-5">
                  <DonationInput />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-5 md:mx-10">
        <DonationDashboard />

        {/* Map and VR Section */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Peta Lokasi Bencana
          </h3>
          <DisasterMap />
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
                Donasi Terkumpul
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
                  onClick={() => setSortType("oldest")}
                  className={`
                    py-2 px-4 rounded-full text-sm font-medium border dark:border-none transition-all
                    ${
                      sortType === "oldest"
                        ? "bg-primary text-white"
                        : "bg-white text-black btn-border-reveal2 z-10 cursor-pointer border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-900"
                    }
                  `}
                >
                  Terlama
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
      <div className="mt-20">
        <DonateSection data={filteredDonateData} />
      </div>

      {/* Marquee Section */}
      <section>
        <CurvedLoop
          className="!text-black"
          marqueeText="Bersatu Kita Bisa ✦ #prayforaceh ✦ #prayforsumatra ✦ "
        />
      </section>
    </div>
  );
}
