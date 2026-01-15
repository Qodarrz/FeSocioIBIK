import { useState, useEffect } from "react";
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

const donationData = [
  { month: "Jan", amount: 4500000, color: "#16a34a" },
  { month: "Feb", amount: 3200000, color: "#16a34a" },
  { month: "Mar", amount: 2800000, color: "#16a34a" },
  { month: "Apr", amount: 5100000, color: "#16a34a" },
  { month: "Mei", amount: 3900000, color: "#16a34a" },
  { month: "Jun", amount: 6200000, color: "#16a34a" },
  { month: "Jul", amount: 4800000, color: "#16a34a" },
  { month: "Agu", amount: 5500000, color: "#16a34a" },
  { month: "Sep", amount: 4300000, color: "#16a34a" },
  { month: "Okt", amount: 5900000, color: "#16a34a" },
  { month: "Nov", amount: 7100000, color: "#16a34a" },
  { month: "Des", amount: 8500000, color: "#16a34a" },
];

const statsData = [
  { label: "Total Donatur", value: "2,458", change: "+12%" },
  { label: "Donasi Harian", value: "Rp 8,5 JT", change: "+5%" },
  { label: "Target Tercapai", value: "78%", change: "+3%" },
  { label: "Donasi Tertinggi", value: "Rp 25 JT", change: "-2%" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-sm text-gray-900 dark:text-white">
          {label}
        </p>
        <p className="text-primary font-bold">
          {formatRupiah(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function DonationDashboard() {
  const [selectedMonth, setSelectedMonth] = useState("Des");

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-black dark:text-white">
          Dashboard Donasi
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Periode: Jan - Des 2024
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-black dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.change.startsWith("+")
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Trend Donasi Bulanan
          </h3>
          <select
            className="text-sm border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {donationData.map((item) => (
              <option key={item.month} value={item.month}>
                {item.month}
              </option>
            ))}
          </select>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={donationData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280" }}
                tickFormatter={(value) => `${value / 1000000} JT`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="amount"
                radius={[8, 8, 0, 0]}
                onClick={(data) => setSelectedMonth(data.month)}
              >
                {donationData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.month === selectedMonth ? "#059669" : entry.color}
                    className="cursor-pointer transition-all duration-300"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-gray-600 dark:text-gray-400">
              Donasi Bulanan
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Total Tahun Ini:{" "}
            <span className="font-bold text-primary">
              {formatRupiah(
                donationData.reduce((sum, item) => sum + item.amount, 0)
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}