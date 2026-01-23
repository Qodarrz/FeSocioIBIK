/* eslint-disable */
import React from "react";
import SpotlightCard from "../fraction/SpotlightCard";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import FullWidthCarousel from "../fraction/CarouselCard2";
import { FaUserPlus } from "react-icons/fa";

/**
 * Interface untuk data donasi agar sesuai standar akurasi data.
 */
interface DonateCardProps {
  items: any[];
  title: string;
  description: string;
  donasiId: number;
  contributors?: number;
  targetAmount?: number;
  currentAmount?: number;
}

const DonateCard = ({
  items,
  title,
  description,
  donasiId,
  contributors = 0,
  targetAmount = 50000000,
  currentAmount = 0,
}: DonateCardProps) => {
  // Avatar generator menggunakan DiceBear untuk variasi visual kontributor
  const profileImages = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Anya",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Erik",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Lina",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=UserPlus",
  ];

  // Fungsi utilitas format angka (Penalaran Logis: Mempermudah pembacaan nominal)
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Kalkulasi persentase untuk indikator progres (Opsional)
  const progressPercent = Math.min(
    Math.round((currentAmount / targetAmount) * 100),
    100,
  );

  return (
    <SpotlightCard
      className="custom-spotlight-card bg-primary-foreground dark:!border-none border-1 !p-5 !border-gray-200 rounded-xl"
      spotlightColor="rgba(158, 207, 212, 0.5)"
    >
      {/* Carousel Area dengan Aspect Ratio yang terjaga */}
      <div
        style={{ height: "200px", position: "relative" }}
        className="flex w-full items-center justify-center overflow-hidden rounded-lg"
      >
        <FullWidthCarousel items={items} />
      </div>

      <div className="mt-5 title-desc">
        <div className="mb-1 font-black text-lg text-black dark:text-white line-clamp-1">
          {title}
        </div>
        <p className="text-sm text-gray-400 line-clamp-2 h-10">{description}</p>
      </div>

      {/* Indikator Progres Visual */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-4 overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-1000"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Contributors Section */}
      <div className="mt-4 flex items-center">
        <div className="relative flex mr-3">
          {profileImages.map((image, index) => (
            <div
              key={index}
              className="relative"
              style={{
                marginLeft: index > 0 ? "-12px" : "0",
                zIndex: profileImages.length - index,
              }}
            >
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden bg-gray-200 flex items-center justify-center">
                {index === profileImages.length - 1 ? (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <FaUserPlus className="text-primary text-[10px]" />
                  </div>
                ) : (
                  <img
                    src={image}
                    alt="Contributor"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-600 dark:text-gray-400">
          <span className="font-bold text-black dark:text-white">
            {formatNumber(contributors)}
          </span>{" "}
          pahlawan bergabung
        </div>
      </div>

      {/* Footer Card: Nominal & Action */}
      <div className="w-full mt-6 flex p-0 flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
        <div className="flex flex-col w-full sm:w-auto">
          <span className="font-black text-xl text-primary dark:text-secondary">
            Rp {formatNumber(currentAmount)}
          </span>
          <span className="text-[11px] text-gray-400 uppercase tracking-wider">
            Target:{" "}
            <span className="font-semibold text-gray-500">
              Rp {formatNumber(targetAmount)}
            </span>
          </span>
        </div>

        <button
          className="bg-primary btn-border-reveal w-full sm:w-auto px-5 py-2.5 z-50 cursor-pointer text-sm rounded-md text-white font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
          onClick={() => (window.location.href = "/donasi/detail/" + donasiId)}
        >
          DONASI <BsFillArrowUpRightCircleFill className="text-lg" />
        </button>
      </div>
    </SpotlightCard>
  );
};

export default DonateCard;
