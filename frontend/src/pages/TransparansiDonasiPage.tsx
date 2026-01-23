import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { formatRupiah } from "../services/formatRupiah";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (Icon.Default.prototype as any)._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const disasterTransparencyData = {
  1: {
    title: "Bencana Banjir Aceh",
    totalCollected: 23000000,
    totalUsed: 21500000,
    remaining: 1500000,
    location: "Aceh",
    mapCenter: [5.548, 95.319] as [number, number],
    affectedAreas: [
      { name: "Banda Aceh", coordinates: [5.548, 95.319], impact: "Tinggi" },
      { name: "Lhokseumawe", coordinates: [5.1801, 97.1507], impact: "Sedang" },
      { name: "Meulaboh", coordinates: [4.1363, 96.1269], impact: "Tinggi" },
    ],
    timeline: [
      { date: "2024-01-01", event: "Penggalangan dana dimulai" },
      { date: "2024-01-10", event: "Banjir bandang melanda" },
      { date: "2024-01-15", event: "Distribusi bantuan tahap 1" },
      { date: "2024-01-25", event: "Distribusi bantuan tahap 2" },
      { date: "2024-02-01", event: "Penggalangan dana selesai" },
    ],
    financialReports: [
      {
        id: 1,
        category: "Bantuan Pangan",
        amount: 12000000,
        description: "Distribusi paket sembako untuk 500 keluarga terdampak",
        date: "2024-01-15",
        location: "Banda Aceh",
        items: [
          "Beras 10kg",
          "Minyak Goreng 2L",
          "Gula 2kg",
          "Telur 30 butir",
          "Mie Instan 40 bungkus",
        ],
        beneficiaries: 500,
        evidence: "/images/evidence/food.jpg",
        receipt: "/images/receipts/receipt1.jpg",
      },
      {
        id: 2,
        category: "Shelter & Pengungsian",
        amount: 6500000,
        description: "Penyediaan tenda untuk 200 pengungsi",
        date: "2024-01-20",
        location: "Lhokseumawe",
        items: [
          "Tenda keluarga 100 unit",
          "Selimut 400 buah",
          "Kasur lipat 200 buah",
          "Peralatan memasak",
        ],
        beneficiaries: 200,
        evidence: "/images/evidence/tent.jpg",
        receipt: "/images/receipts/receipt2.jpg",
      },
      {
        id: 3,
        category: "Kesehatan",
        amount: 3000000,
        description: "Bantuan obat-obatan dasar untuk puskesmas darurat",
        date: "2024-01-25",
        location: "Meulaboh",
        items: [
          "Paracetamol 5000 tablet",
          "Oralit 2000 sachet",
          "Antibiotik",
          "P3K kit",
          "Vitamin",
        ],
        beneficiaries: 1500,
        evidence: "/images/evidence/medicine.jpg",
        receipt: "/images/receipts/receipt3.jpg",
      },
    ],
    incomeSources: [
      { source: "Donasi Online", amount: 18000000, percentage: 78.3 },
      { source: "Transfer Bank", amount: 4000000, percentage: 17.4 },
      { source: "Corporate Donation", amount: 1000000, percentage: 4.3 },
    ],
    expenditureByCategory: [
      { category: "Bantuan Pangan", amount: 12000000, percentage: 55.8 },
      { category: "Shelter", amount: 6500000, percentage: 30.2 },
      { category: "Kesehatan", amount: 3000000, percentage: 14.0 },
    ],
  },
  2: {
    title: "Bencana Gempa Sumatra",
    totalCollected: 75000000,
    totalUsed: 74500000,
    remaining: 500000,
    location: "Sumatra Utara",
    mapCenter: [1.848, 98.2914] as [number, number],
    affectedAreas: [
      { name: "Medan", coordinates: [3.5952, 98.6722], impact: "Sedang" },
      {
        name: "Pematang Siantar",
        coordinates: [2.96, 99.06],
        impact: "Tinggi",
      },
      {
        name: "Tebing Tinggi",
        coordinates: [3.3285, 99.1625],
        impact: "Rendah",
      },
      { name: "Kabanjahe", coordinates: [3.1005, 98.4915], impact: "Tinggi" },
    ],
    timeline: [
      { date: "2024-02-01", event: "Penggalangan dana dimulai" },
      { date: "2024-02-05", event: "Gempa 7.2 SR mengguncang" },
      { date: "2024-02-10", event: "Rehabilitasi rumah tahap 1" },
      { date: "2024-02-20", event: "Perbaikan infrastruktur" },
      { date: "2024-02-25", event: "Bantuan pendidikan" },
      { date: "2024-03-01", event: "Penggalangan dana selesai" },
    ],
    financialReports: [
      {
        id: 1,
        category: "Rekonstruksi",
        amount: 50000000,
        description: "Perbaikan 150 rumah rusak ringan dan sedang",
        date: "2024-02-10",
        location: "Pematang Siantar",
        items: [
          "Material bangunan",
          "Upah tukang",
          "Peralatan konstruksi",
          "Atap seng",
          "Semen & pasir",
        ],
        beneficiaries: 150,
        evidence: "/images/rekontruksi.png",
        receipt: "/images/struk.png",
      },
      {
        id: 2,
        category: "Infrastruktur",
        amount: 20000000,
        description: "Perbaikan jalan dan jembatan yang rusak",
        date: "2024-02-20",
        location: "Kabanjahe",
        items: [
          "Aspal hotmix",
          "Bahan perbaikan jembatan",
          "Alat berat",
          "Material drainase",
        ],
        beneficiaries: 5000,
        evidence: "/images/evidence/infrastructure.jpg",
        receipt: "/images/receipts/receipt5.jpg",
      },
      {
        id: 3,
        category: "Pendidikan",
        amount: 4500000,
        description: "Bantuan perlengkapan sekolah untuk anak-anak terdampak",
        date: "2024-02-25",
        location: "Medan",
        items: [
          "Tas sekolah",
          "Buku tulis",
          "Alat tulis",
          "Seragam sekolah",
          "Sepatu",
        ],
        beneficiaries: 450,
        evidence: "/images/evidence/education.jpg",
        receipt: "/images/receipts/receipt6.jpg",
      },
    ],
    incomeSources: [
      { source: "Donasi Online", amount: 45000000, percentage: 60.0 },
      { source: "Transfer Bank", amount: 25000000, percentage: 33.3 },
      { source: "Corporate Donation", amount: 5000000, percentage: 6.7 },
    ],
    expenditureByCategory: [
      { category: "Rekonstruksi", amount: 50000000, percentage: 67.1 },
      { category: "Infrastruktur", amount: 20000000, percentage: 26.8 },
      { category: "Pendidikan", amount: 4500000, percentage: 6.0 },
    ],
  },
};

const getImpactColor = (impact: string) => {
  switch (impact.toLowerCase()) {
    case "tinggi":
      return "#ef4444";
    case "sedang":
      return "#f59e0b";
    case "rendah":
      return "#10b981";
    default:
      return "#6b7280";
  }
};

export default function TransparansiDonasiPage() {
  const { id } = useParams();
  const disasterId = parseInt(id || "1");
  const data =
    disasterTransparencyData[
      disasterId as keyof typeof disasterTransparencyData
    ];

  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "reports" | "map" | "timeline"
  >("overview");

  // Custom marker icons
  const highImpactIcon = new Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const mediumImpactIcon = new Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const lowImpactIcon = new Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const getMarkerIcon = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "tinggi":
        return highImpactIcon;
      case "sedang":
        return mediumImpactIcon;
      case "rendah":
        return lowImpactIcon;
      default:
        return highImpactIcon;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="pt-30 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <Link
                to={`/donasi/detail/${disasterId}`}
                className="inline-flex items-center text-white/90 hover:text-white mb-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Kembali ke Halaman Donasi
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Transparansi Donasi - {data.title}
              </h1>
              <p className="text-white/80">
                Laporan lengkap penggunaan dana donasi yang telah terkumpul
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full">
                ✅ Penggalangan Selesai
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-primary text-primary dark:text-primary-dark"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Ringkasan Keuangan
                </span>
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reports"
                    ? "border-primary text-primary dark:text-primary-dark"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Detail Laporan
                </span>
              </button>
              <button
                onClick={() => setActiveTab("map")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "map"
                    ? "border-primary text-primary dark:text-primary-dark"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  Peta Distribusi
                </span>
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "timeline"
                    ? "border-primary text-primary dark:text-primary-dark"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Timeline
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-4">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Total Terkumpul
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatRupiah(data.totalCollected)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 mr-4">
                    <svg
                      className="w-6 h-6 text-green-600 dark:text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Total Digunakan
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatRupiah(data.totalUsed)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 mr-4">
                    <svg
                      className="w-6 h-6 text-purple-600 dark:text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Sisa Dana
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatRupiah(data.remaining)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sumber Dana */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Sumber Dana
                </h3>
                <div className="space-y-4">
                  {data.incomeSources.map((source, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {source.source}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatRupiah(source.amount)} ({source.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pengeluaran per Kategori */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Pengeluaran per Kategori
                </h3>
                <div className="space-y-4">
                  {data.expenditureByCategory.map((category, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {category.category}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatRupiah(category.amount)} ({category.percentage}
                          %)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Progress Penggunaan Dana
              </h3>
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>
                    {Math.round((data.totalUsed / data.totalCollected) * 100)}%
                    Dana Telah Digunakan
                  </span>
                  <span>
                    {formatRupiah(data.totalUsed)} /{" "}
                    {formatRupiah(data.totalCollected)}
                  </span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600"
                    style={{
                      width: `${(data.totalUsed / data.totalCollected) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-8">
            {/* Detail Laporan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Rincian Penggunaan Dana
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Berikut detail penggunaan dana donasi yang telah diverifikasi
                </p>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.financialReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {report.title || report.category}
                          </h3>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                            {formatRupiah(report.amount)}
                          </span>
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                            📍 {report.location}
                          </span>
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                            👥 {report.beneficiaries} penerima
                          </span>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {report.description}
                        </p>

                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Barang yang didistribusikan:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {report.items.map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date(report.date).toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>

                      <div className="flex gap-3 mt-4 lg:mt-0 lg:ml-6">
                        <button
                          onClick={() =>
                            setSelectedReport({ ...report, type: "evidence" })
                          }
                          className="flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Lihat Foto
                        </button>
                        <button
                          onClick={() =>
                            setSelectedReport({ ...report, type: "receipt" })
                          }
                          className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium rounded-lg transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Nota
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "map" && (
          <div className="space-y-8">
            {/* Map Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Peta Distribusi Bantuan
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Lokasi daerah terdampak dan distribusi bantuan
                </p>
              </div>

              <div className="p-4">
                <div className="h-[500px] rounded-lg overflow-hidden">
                  <MapContainer
                    center={data.mapCenter}
                    zoom={8}
                    className="h-full w-full"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {data.affectedAreas.map((area, index) => (
                      <Marker
                        key={index}
                        position={area.coordinates as [number, number]}
                        icon={getMarkerIcon(area.impact)}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-bold text-lg">{area.name}</h3>
                            <p className="mt-1">
                              <span
                                className={`inline-block w-3 h-3 rounded-full mr-2`}
                                style={{
                                  backgroundColor: getImpactColor(area.impact),
                                }}
                              ></span>
                              Tingkat Dampak: <strong>{area.impact}</strong>
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              Koordinat: {area.coordinates[0].toFixed(4)},{" "}
                              {area.coordinates[1].toFixed(4)}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Dampak Tinggi
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Dampak Sedang
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Dampak Rendah
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Daerah Terdampak
                </h3>
                <ul className="space-y-3">
                  {data.affectedAreas.map((area, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <span
                          className={`w-3 h-3 rounded-full mr-3`}
                          style={{
                            backgroundColor: getImpactColor(area.impact),
                          }}
                        ></span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {area.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {area.impact}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Statistik Bantuan
                </h3>
                <div className="space-y-4">
                  {data.financialReports.map((report, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-700 dark:text-gray-300">
                        {report.location}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatRupiah(report.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Total Penerima Manfaat
                </h3>
                <div className="text-center py-8">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {data.financialReports
                      .reduce((sum, report) => sum + report.beneficiaries, 0)
                      .toLocaleString()}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Orang</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Timeline Penggunaan Dana
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Kronologi kegiatan dan penggunaan dana donasi
                </p>
              </div>

              <div className="p-6">
                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                  {/* Timeline Items */}
                  <div className="space-y-8">
                    {data.timeline.map((item, index) => (
                      <div
                        key={index}
                        className={`relative flex ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center`}
                      >
                        {/* Timeline Dot */}
                        <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-primary z-10"></div>

                        {/* Content */}
                        <div
                          className={`ml-12 md:ml-0 md:w-5/12 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}
                        >
                          <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <div className="text-sm font-medium text-primary mb-1">
                              {new Date(item.date).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </div>
                            <p className="text-gray-900 dark:text-white">
                              {item.event}
                            </p>

                            {/* Connect to Financial Reports if exists */}
                            {data.financialReports.find(
                              (r) => r.date === item.date,
                            ) && (
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  Ada Laporan Keuangan
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Ringkasan Waktu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {data.timeline.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Kegiatan
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {data.financialReports.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Laporan Keuangan
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.round(
                      (new Date(
                        data.timeline[data.timeline.length - 1].date,
                      ).getTime() -
                        new Date(data.timeline[0].date).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Hari Durasi
                  </div>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {data.affectedAreas.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Lokasi Bantuan
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-xl p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-primary">
                Transparansi & Akuntabilitas
              </h3>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  • Seluruh laporan telah diaudit oleh akuntan publik independen
                  <br />
                  • Bukti pengeluaran telah diverifikasi dan disimpan dengan
                  aman
                  <br />
                  • Update transparansi dilakukan real-time melalui sistem
                  terintegrasi
                  <br />• Pertanyaan lebih lanjut dapat diajukan melalui email:
                  transparansi@bantuan.org
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedReport.category || selectedReport.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {selectedReport.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                <img
                  src={
                    selectedReport.type === "receipt"
                      ? selectedReport.receipt
                      : selectedReport.evidence
                  }
                  alt={
                    selectedReport.type === "receipt"
                      ? "Nota Pembelian"
                      : "Bukti Distribusi"
                  }
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                {selectedReport.type === "receipt"
                  ? "Nota Pembelian"
                  : "Bukti Distribusi"}{" "}
                sebesar {formatRupiah(selectedReport.amount)}
                <br />
                Lokasi: {selectedReport.location} • Penerima:{" "}
                {selectedReport.beneficiaries} orang
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
