/* eslint-disable */
import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatRupiah } from "../../services/formatRupiah";

// Data Tren Donasi Bulanan (Dummy)
const monthlyDataRaw = [
  { month: "Jan", amount: 4500000 },
  { month: "Feb", amount: 3200000 },
  { month: "Mar", amount: 2800000 },
  { month: "Apr", amount: 5100000 },
  { month: "Mei", amount: 3900000 },
  { month: "Jun", amount: 6200000 },
  { month: "Jul", amount: 4800000 },
  { month: "Agu", amount: 5500000 },
  { month: "Sep", amount: 4300000 },
  { month: "Okt", amount: 5900000 },
  { month: "Nov", amount: 7100000 },
  { month: "Des", amount: 8500000 },
];

interface DashboardProps {
  disasterId: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-sm text-gray-900 dark:text-white">
          Bulan {label}
        </p>
        <p className="text-primary font-bold">
          {formatRupiah(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function DonationDashboard({ disasterId }: DashboardProps) {
  const [selectedMonth, setSelectedMonth] = useState("Des");

  // Logika Data Stats berdasarkan Disaster ID
  const stats = useMemo(() => {
    if (disasterId === 2) {
      // Data untuk Longsor Sumut (Selesai)
      return [
        {
          label: "Total Donatur",
          value: "5,123",
          change: "+100%",
          status: "up",
        },
        {
          label: "Dana Terkumpul",
          value: "Rp 75 JT",
          change: "Full",
          status: "up",
        },
        {
          label: "Target Tercapai",
          value: "100%",
          change: "Done",
          status: "up",
        },
        {
          label: "Donasi Tertinggi",
          value: "Rp 15 JT",
          change: "+5%",
          status: "up",
        },
      ];
    }
    // Data untuk Banjir Aceh (On Progress)
    return [
      { label: "Total Donatur", value: "2,458", change: "+12%", status: "up" },
      {
        label: "Dana Terkumpul",
        value: "Rp 23 JT",
        change: "+8%",
        status: "up",
      },
      {
        label: "Target Tercapai",
        value: "46%",
        change: "-24 JT lagi",
        status: "down",
      },
      {
        label: "Donasi Tertinggi",
        value: "Rp 10 JT",
        change: "+15%",
        status: "up",
      },
    ];
  }, [disasterId]);

  return (
    <div className="w-full mb-8 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-black dark:text-white">
          Statistik Penggalangan Dana
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400 italic">
            *Data diperbarui setiap 10 menit
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </p>
            <div className="flex justify-between items-end mt-2">
              <p className="text-2xl font-bold text-black dark:text-white">
                {stat.value}
              </p>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-md ${
                  stat.status === "up"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart Section */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Grafik Pertumbuhan Donasi
            </h3>
            <p className="text-sm text-gray-500">
              Akumulasi donasi masuk per bulan
            </p>
          </div>
          <select
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-primary outline-none"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {monthlyDataRaw.map((item) => (
              <option key={item.month} value={item.month}>
                Bulan {item.month}
              </option>
            ))}
          </select>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyDataRaw}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                vertical={false}
                opacity={0.1}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                tickFormatter={(value) => `${value / 1000000}JT`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
              />
              <Bar
                dataKey="amount"
                radius={[6, 6, 0, 0]}
                onClick={(data) => setSelectedMonth(data.month)}
              >
                {monthlyDataRaw.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.month === selectedMonth ? "#16a34a" : "#16a34a44"
                    }
                    className="cursor-pointer transition-all duration-300"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Target Harian
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/30"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Rata-rata
              </span>
            </div>
          </div>
          <div className="text-sm font-medium">
            <span className="text-gray-500">Total Akumulasi: </span>
            <span className="text-primary text-lg ml-1 font-bold">
              {formatRupiah(
                monthlyDataRaw.reduce((sum, item) => sum + item.amount, 0),
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
