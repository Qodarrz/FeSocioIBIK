/* eslint-disable */
import { useEffect, useState } from "react";
import Pagination from "../fraction/Pagination";
import DonateCard from "../cards/DonateCard";
import { motion, AnimatePresence } from "framer-motion";

const PER_PAGE = 12;

export default function DonateSection({
  data,
  isTitle = false,
}: {
  data: any[];
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
      {/* HEADER */}
      <div className="gap-8 md:gap-12 mb-10 md:mb-15">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center"
        >
          <h1 className="mb-6 font-bold text-2xl md:text-5xl leading-tight">
            - Mari Berpartisipasi Dengan
            <span className="fancy ml-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Dukungan Mu
            </span>{" "}
            -
          </h1>
        </motion.div>
      </div>

      {/* KARTU DONASI */}
      {paginatedData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          className="text-center w-full py-12"
          animate={{ opacity: 1 }}
        >
          <div className="text-4xl mb-4">😢</div>
          <div className="text-xl text-gray-600 font-medium">
            Jenis Donasi tidak dapat ditemukan
          </div>
        </motion.div>
      )}

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-stretch gap-6"
      >
        <AnimatePresence mode="popLayout">
          {paginatedData.map((item, index) => (
            <motion.div
              key={item.id || item.title}
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
                // Pass image tunggal ke dalam array items untuk carousel
                items={
                  item.image
                    ? [{ image: item.image, title: item.title }]
                    : item.items
                }
                title={item.title}
                donasiId={item.id}
                description={item.description}
                // PROPS PENTING: Menghubungkan data unik bencana
                contributors={item.contributors}
                targetAmount={item.targetAmount}
                currentAmount={item.currentAmount}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-16 mb-10">
          <Pagination
            perpage={PER_PAGE}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}
    </section>
  );
}
