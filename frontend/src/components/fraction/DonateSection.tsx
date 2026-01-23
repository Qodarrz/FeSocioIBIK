/* eslint-disable */
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import DonateCard from "../cards/DonateCard";
import { motion, AnimatePresence } from "framer-motion";
import { DonateCampaign } from "../../data/donateData";

const PER_PAGE = 12;

export default function DonateSection({
  data,
  isTitle = false,
}: {
  data: DonateCampaign[];
  isTitle?: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / PER_PAGE);

  const paginatedData = data.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  return (
    <section className="mt-15 mx-5 md:mx-10">
      {isTitle && (
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Campaign Donasi
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Pilih dan bantu campaign yang membutuhkan dukungan Anda
          </p>
        </div>
      )}

      {paginatedData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          className="text-center w-full py-12"
          animate={{ opacity: 1 }}
        >
          <div className="text-4xl mb-4">😢</div>
          <div className="text-xl text-gray-600 dark:text-gray-400">
            Jenis Donasi tidak dapat ditemukan
          </div>
        </motion.div>
      )}

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-center gap-5"
      >
        <AnimatePresence mode="popLayout">
          {paginatedData.map((item, index) => (
            <motion.div
              key={`${item.id}-${item.title}`}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                delay: index * 0.05,
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              <DonateCard
                items={item.items}
                title={item.title}
                donasiId={item.id}
                description={item.description}
                targetAmount={item.targetAmount}
                currentAmount={item.currentAmount}
                contributors={item.contributors}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination
            perpage={PER_PAGE}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </section>
  );
}
