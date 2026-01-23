/* eslint-disable */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ShinyText from "../components/fraction/ShinyText";
import DonateSection from "../components/fraction/DonateSection";
import CurvedLoop from "../components/fraction/CurvedLoop";
import { allDonateData } from "../data/donateData";

export default function DonasiPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const filteredDonateData = useMemo(() => {
    return allDonateData.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <div className="bg-white text-text dark:bg-black dark:text-textDark">
      {/* Konten Section tetap sama */}
      <section className="w-full h-[300px] flex justify-center relative items-center text-white text-center bg-primary">
        <div className="absolute w-full left-0 -bottom-8 px-4">
          <h1 className="mb-10 font-bold text-4xl md:text-6xl">
            Mari
            <ShinyText
              text="Peduli"
              speed={3}
              className="mx-2"
              shineColor="#70B2B2"
            />
            Berdonasi
          </h1>
          <form
            className="w-full max-w-2xl mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(searchInput);
            }}
          >
            <div className="relative flex items-center shadow-lg rounded-full">
              <span className="absolute left-4 text-gray-400 pointer-events-none">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </span>

              <input
                type="text"
                placeholder="Cari campaign donasi..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full h-14 md:h-16 pl-11 pr-28 bg-white dark:bg-gray-900 rounded-full border-2 border-gray-100 dark:border-none focus:outline-none focus:border-primary transition-all text-sm md:text-base text-gray-700 dark:text-white"
              />

              <div className="absolute right-1.5">
                <button
                  type="submit"
                  className="h-11 md:h-13 px-6 rounded-full bg-[#016B61] text-white text-sm font-medium hover:bg-[#01524a] transition-colors"
                >
                  Temukan
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <div className="mt-24 container mx-auto px-4">
        <DonateSection data={filteredDonateData} />
      </div>

      <section className="py-10">
        <CurvedLoop
          className="!text-black"
          marqueeText="Bersatu Kita Bisa ✦ #prayforaceh ✦ #prayforsumatra ✦ "
        />
      </section>
    </div>
  );
}
