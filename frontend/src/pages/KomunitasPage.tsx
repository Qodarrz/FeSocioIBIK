/* eslint-disable */
import CardKomunitas from "@/components/CardKomunitas";

const itemsPesanOrangBaik = [
  {
    name: "agus",
    id: 123,
    pesan:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, alias dolores? Itaque, ullam molestiae expedita nam velit maxime sapiente id ad provident aliquid tempore maiores fuga ex doloribus, totam suscipit?",
    images: ["/images/bencana/b1.jpg", "/images/bencana/b1.jpg"],
    createdAt: "2026-01-01T14:30:00.000Z",
  },
  {
    name: "dimas",
    id: 252,
    images: ["/images/bencana/b1.jpg"],
    pesan:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam, alias dolores? Itaque, ullam molestiae expedita nam velit maxime sapiente id ad provident aliquid tempore maiores fuga ex doloribus, totam suscipit?",
    createdAt: "2026-01-02T14:30:00.000Z",
  },
];

const items = [
  {
    name: "agus",
    id: 123,
    banner: "/images/bencana/b1.jpg",
    description:
      "Komunitas pecinta alam yang peduli lingkungan. Bergabunglah untuk aksi bersih-bersih dan penanaman pohon.",
    amount: 15000,
    createdAt: "2026-01-01T14:30:00.000Z",
  },
  {
    id: 234,
    name: "dimas",
    banner: "/images/bencana/b2.jpg",
    description:
      "Komunitas bantu sesama untuk edukasi anak-anak kurang mampu. Volunteer dan donatur sangat dibutuhkan.",
    amount: 15000,
    createdAt: "2026-01-02T14:30:00.000Z",
  },
];

export default function KomunitasPage() {
  const sortedItems = items;

  return (
    <div className="min-h-screen pt-30 bg-gray-50 dark:bg-black transition-colors duration-200">
      <main className="max-w-9xl mx-10 px-4 py-6">
        <div className="flex gap-3">
          <div className="flex-1 max-w-9xl">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 mb-6  border border-gray-200 dark:border-gray-800">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Bagikan sesuatu tentang komunitas..."
                    className="w-full bg-transparent text-lg placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none min-h-[80px]"
                    rows={3}
                  />
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                      <button className="text-primary hover:text-secondary p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                      <button className="text-primary hover:text-secondary p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </div>
                    <button className="px-5 py-2 btn-border-reveal z-10 bg-primary text-white font-medium rounded-full transition-all duration-200 ">
                      Posting
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed Title */}
            <div className="sticky top-[73px] z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-t-2xl border border-b-0 border-gray-200 dark:border-gray-800">
              <div className="px-4 text-center pt-4">
                <h2 className="text-xl font-bold text-primary dark:text-white">
                  Komunitas Hari Ini
                </h2>
                  {/* <span className="ml-2 text-sm font-normal text-gray-500 dark:text-white">
                    - {itemsPesanOrangBaik.length} pembaruan -
                  </span> */}
              </div>
              {/* Twitter-like Tab Navigation */}
              <div className="flex mt-4">
                <button className="flex-1 py-3 px-4 text-center font-medium border-b-2 border-primary text-primary">
                  Untuk Anda
                </button>
                <button className="flex-1 py-3 px-4 text-center font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  Mengikuti
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-b-2xl border border-t-0 border-gray-200 dark:border-gray-800 overflow-hidden">
              <CardKomunitas
                items={itemsPesanOrangBaik}
                onItemSelect={(item, index) => console.log(item, index)}
                // showGradients={true}
                // enableArrowNavigation={true}
                displayScrollbar={true}
              />
            </div>
          </div>

          <div className="w-96 hidden lg:block">
            <div className="sticky top-[73px] z-40 mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari komunitas..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden sticky top-[140px]">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-primary">
                  Trend Terkini
                  <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                    • Diperbarui secara real-time
                  </span>
                </h2>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {sortedItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Trending #{index + 1}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            •
                          </span>
                          <span className="text-xs text-primary">
                            Komunitas
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                          <img
                            src={item.banner}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.amount.toLocaleString()} anggota
                      </span>
                      <button className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        Ikuti
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full px-5 py-3 text-left text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium">
                Tampilkan lebih banyak →
              </button>
            </div>

            <div className="mt-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Teman yang mungkin Anda kenal
                </h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500"></div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                          User {i}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          @{`user${i}`.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs btn-border-reveal z-10 font-medium bg-primary dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity">
                      Ikuti
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <button className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}
