import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FaUsers, FaHome, FaHospital } from "react-icons/fa";
// IMPORT CSS LEAFLET (Wajib)
import "leaflet/dist/leaflet.css";

// Perbaikan untuk Icon Marker yang hilang/pecah di Webpack/Next.js
import L from "leaflet";
const iconRetinaUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
const iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
const shadowUrl =
  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";

// Inisialisasi Icon Default
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
  });
}

// Dynamically import Leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);
const disasterLocations = [
  {
    id: 1,
    name: "Banda Aceh",
    position: [5.5483, 95.3238] as [number, number],
    severity: "high",
    affected: 2500,
    donations: 8500000,
    description: "Pusat bencana banjir bandang",
  },
  {
    id: 2,
    name: "Meulaboh",
    position: [4.1364, 96.1266] as [number, number],
    severity: "medium",
    affected: 1800,
    donations: 6500000,
    description: "Daerah terdampak tanah longsor",
  },
  {
    id: 3,
    name: "Lhokseumawe",
    position: [5.1801, 97.1507] as [number, number],
    severity: "high",
    affected: 3200,
    donations: 15200000,
    description: "Banjir parah dan rumah rusak",
  },
  {
    id: 4,
    name: "Calang",
    position: [4.6255, 95.6695] as [number, number],
    severity: "low",
    affected: 1200,
    donations: 4300000,
    description: "Daerah pesisir terendam",
  },
  {
    id: 5,
    name: "Sigli",
    position: [5.3848, 95.9607] as [number, number],
    severity: "medium",
    affected: 2100,
    donations: 7200000,
    description: "Infrastruktur jalan rusak",
  },
  {
    id: 6,
    name: "Takengon",
    position: [4.6303, 96.8325] as [number, number],
    severity: "high",
    affected: 2800,
    donations: 12700000,
    description: "Daerah pegunungan longsor",
  },
];

const severityColors = {
  high: "#ef4444", // red
  medium: "#f59e0b", // amber
  low: "#10b981", // emerald
};
export default function DisasterMap() {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  if (!mapLoaded) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
          <p className="mt-2 text-sm text-gray-600">Memuat peta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Map Container - Full Width Adjustment */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
        <MapContainer
          center={[4.6951, 96.7494]}
          zoom={8}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {disasterLocations.map((location) => (
            <div key={location.id}>
              <Circle
                center={location.position}
                radius={location.affected * 5} // Penyesuaian radius agar terlihat di zoom level 8
                pathOptions={{
                  fillColor:
                    severityColors[
                      location.severity as keyof typeof severityColors
                    ],
                  color:
                    severityColors[
                      location.severity as keyof typeof severityColors
                    ],
                  fillOpacity: 0.3,
                  weight: 1,
                }}
              />
              <Marker position={location.position}>
                <Popup>
                  <div className="p-1 min-w-[200px]">
                    <h3 className="font-bold text-base border-b pb-1 mb-2">
                      {location.name}
                    </h3>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaUsers />{" "}
                        <span>{location.affected.toLocaleString()} Jiwa</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaHome />{" "}
                        <span>{formatRupiah(location.donations)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 font-semibold">
                        <FaHospital />{" "}
                        <span>Status: {location.severity.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </div>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Tinggi
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Sedang
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Rendah
          </span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Daerah
          </p>
          <p className="text-2xl font-bold text-black dark:text-white">6</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Terdampak
          </p>
          <p className="text-2xl font-bold text-black dark:text-white">
            13,600
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Donasi Tersalurkan
          </p>
          <p className="text-2xl font-bold text-primary">92%</p>
        </div>
      </div>
    </div>
  );
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}
