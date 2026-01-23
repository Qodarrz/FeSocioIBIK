import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";
import ShinyText from "../fraction/ShinyText";
import { formatRupiah } from "../../services/formatRupiah";

const QUICK_AMOUNTS = [
  { label: "10rb", value: 10000 },
  { label: "20rb", value: 20000 },
  { label: "50rb", value: 50000 },
  { label: "100rb", value: 100000 },
];

const PAYMENTS = [
  {
    id: "qris",
    label: "QRIS",
    logo: "https://images.seeklogo.com/logo-png/39/1/quick-response-code-indonesia-standard-qris-logo-png_seeklogo-391791.png",
  },
  {
    id: "bca",
    label: "Transfer BCA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg",
  },
  {
    id: "va",
    label: "Virtual Account",
    logo: "https://cdn-icons-png.flaticon.com/512/2331/2331941.png",
  },
];

export default function DonationInput() {
  const [displayValue, setDisplayValue] = useState("");
  const [rawValue, setRawValue] = useState<number | null>(null);
  const [activeQuick, setActiveQuick] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, "");
    const numberValue = numeric ? Number(numeric) : null;

    setRawValue(numberValue);
    setDisplayValue(numberValue ? formatRupiah(numberValue) : "");
    setActiveQuick(null);
  };

  const handleQuickSelect = (amount: number) => {
    setRawValue(amount);
    setDisplayValue(formatRupiah(amount));
    setActiveQuick(amount);
  };

  return (
    <div className="w-full">
      <label className="mb-1 block text-sm font-medium text-black dark:text-white">
        Mari Berdonasi
      </label>

      {/* INPUT */}
      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
          Rp
        </span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Masukkan jumlah donasi"
          value={displayValue}
          onChange={handleInputChange}
          className="
            w-full
            pl-10
            pr-4
            py-2.5
            text-sm
            rounded-md
            border
            border-gray-300
            bg-white
            text-black
            focus:outline-none
            focus:ring-2
            focus:ring-primary
            dark:bg-gray-900
            dark:border-gray-700
            dark:text-white
          "
          required
        />
      </div>

      {/* QUICK OPTIONS */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_AMOUNTS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => handleQuickSelect(item.value)}
            className={`
              py-2
              rounded-lg
              text-sm
              font-medium
              border
              transition-all
              ${
                activeQuick === item.value
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-black border-gray-300 btn-border-reveal2 z-10 cursor-pointer dark:bg-gray-900 dark:text-white dark:border-gray-700"
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* VALUE ASLI UNTUK BACKEND */}
      <input type="hidden" name="donation_amount" value={rawValue ?? ""} />

      <p className="mt-2 text-xs text-gray-500">
        Pilih nominal cepat atau isi manual. Minimal Donasi Rp 10.000.
      </p>

      <button
        type="button"
        onClick={() => {
          if (!rawValue || rawValue < 10000) {
            Swal.fire({
              icon: "warning",
              title: "Nominal Tidak Valid",
              text: "Minimal donasi adalah Rp 10.000",
              confirmButtonColor: "#16a34a",
            });
            return;
          }
          setOpenModal(true);
        }}
        className="mt-4 w-full bg-primary text-white py-2.5 rounded-md btn-border-reveal z-10 transition-colors"
      >
        <ShinyText
          text="Lanjutkan Donasi"
          speed={3}
          delay={0}
          color="#ffffff"
          className="mx-2"
          shineColor="#70B2B2"
          spread={120}
          direction="left"
          yoyo={false}
          pauseOnHover={false}
        />
      </button>

      {/* MODAL */}
      <AnimatePresence>
        {openModal && (
          <motion.div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-xl rounded-xl bg-white dark:bg-gray-900 h-[80vh] overflow-y-auto p-6 shadow-xl"
            >
              {/* HEADER */}
              <h2 className="text-lg font-semibold mb-1 text-black dark:text-white">
                Konfirmasi Donasi - Bencana Aceh
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Pastikan data donasi sudah benar
              </p>

              {/* TOTAL */}
              <div className="mb-4">
                <p className="text-sm text-gray-500">Total Donasi</p>
                <p className="text-xl font-bold text-primary">
                  Rp{displayValue}
                </p>
              </div>

              <hr className="my-4 border-gray-200 dark:border-gray-700" />

              {/* FORM */}
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nama Pengirim (Opsional)"
                  className="w-full rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-gray-800 text-black dark:text-white"
                />
                <textarea
                  placeholder="Pesan / Doa Donasi"
                  className="w-full rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-gray-800 text-black dark:text-white"
                  rows={3}
                />
              </div>

              <hr className="my-4 border-gray-200 dark:border-gray-700" />

              {/* PAYMENT */}
              <p className="text-sm font-medium mb-3 text-black dark:text-white">
                Metode Pembayaran
              </p>
              <div className="space-y-2">
                {PAYMENTS.map((item) => (
                  <motion.label
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex items-center gap-3
                      border rounded-lg p-3 border-gray-200 dark:border-gray-700
                      cursor-pointer transition-all
                      bg-white dark:bg-gray-800
                      ${
                        selectedPayment === item.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary"
                      }
                    `}
                    onClick={() => setSelectedPayment(item.id)}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPayment === item.id}
                      onChange={() => setSelectedPayment(item.id)}
                      className="accent-primary"
                    />
                    <img
                      src={item.logo}
                      alt={item.label}
                      className="h-6 object-contain"
                    />
                    <span className="text-sm font-medium text-black dark:text-white">
                      {item.label}
                    </span>
                  </motion.label>
                ))}
              </div>

              {/* ACTION */}
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 text-sm rounded-md btn-border-reveal2 z-10 border hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (!selectedPayment) {
                      Swal.fire({
                        icon: "warning",
                        title: "Pilih Metode Pembayaran",
                        confirmButtonColor: "#16a34a",
                      });
                      return;
                    }
                    Swal.fire({
                      icon: "success",
                      title: "Donasi Diproses",
                      text: "Terima kasih atas kebaikan Anda ❤️",
                      confirmButtonColor: "#16a34a",
                    });
                  }}
                  className="px-4 py-2 text-sm btn-border-reveal z-10 rounded-md bg-primary text-white hover:bg-primary/90"
                >
                  Bayar Donasi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}