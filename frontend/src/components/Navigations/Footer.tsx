import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ChevronUp,
} from "lucide-react";
import { FaArrowUp } from "react-icons/fa"; //
export default function Footer({ className }: {className?: string}) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className={className + "rounded-2xl mx-5 md:mx-10 relative pt-20 z-999999 overflow-hidden"}>
      <div className="relative z-10">
        <div className="w-full px-2 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Identitas */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="PeduliKita"
                className="w-10 h-10 dark:hidden"
              />
              <img
                src="images/logo.png"
                alt="PeduliKita"
                className="w-10 h-10 hidden dark:block"
              />
              <h2 className="text-2xl font-bold dark:text-white">PeduliKita</h2>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Platform peduli sosial yang sangat bermanfaat bagi sesama kita yang membutuhkan khususnya dalam terkena musibah dan bencana.
            </p>

            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 rounded-full hover:bg-primary dark:hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook
                  size={16}
                  className="text-gray-600 hover:text-white dark:text-gray-300"
                />
              </a>
              <a
                href="#"
                className="p-2 rounded-full hover:bg-primary dark:hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram
                  size={16}
                  className="text-gray-600 hover:text-white dark:text-gray-300"
                />
              </a>
              <a
                href="#"
                className="p-2 rounded-full hover:bg-primary dark:hover:bg-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter
                  size={16}
                  className="text-gray-600 hover:text-white dark:text-gray-300"
                />
              </a>
              <a
                href="#"
                className="p-2 rounded-full hover:bg-primary dark:hover:bg-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube
                  size={16}
                  className="text-gray-600 hover:text-white dark:text-gray-300"
                />
              </a>
            </div>
          </div>

          {/* Menu Utama */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Menu Utama
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>
                <a
                  href="/"
                  className="hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="/donasi"
                  className="hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Donasi
                </a>
              </li>
              <li>
                <a
                  href="/komunitas"
                  className="hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Komunitas
                </a>
              </li>
              <li>
                <a
                  href="/tentang-kami"
                  className="hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Tentang
                </a>
              </li>
            </ul>
          </div>

          {/* Layanan */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Layanan
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>Laporan Real-time</li>
              <li>Tracking Donasi</li>
              <li>Donasi Digital</li>
              <li>Forum Komunitas</li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Kontak Kami
            </h3>

            <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-300">
              <MapPin size={18} className="mt-0.5 flex-shrink-0" />
              <span>
                Jl. Raya Tajur, Kp. Buntar RT.02/RW.08
                <br />
                Kel. Muara Sari, Kec. Bogor Selatan
              </span>
            </div>

            <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-300">
              <Phone size={18} className="flex-shrink-0" />
              <span>+62 812 3456 7890</span>
            </div>

            <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-300">
              <Mail size={18} className="flex-shrink-0" />
              <span>pedulikita@gmail.com</span>
            </div>

            <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-300">
              <Clock size={18} className="flex-shrink-0" />
              <span>Senin – Minggu, 24/7</span>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center mt-10 md:mt-0 z-10">
          <div className="text-[50px] md:text-[230px] font-black text-center relative z-10">
            PeduliKita
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none"></div>
        </div>
        {/* <button
          onClick={() => {
            const hero = document.getElementById("hero");
            if (hero) hero.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex items-center justify-center gap-2 w-full border-2 border-primary rounded-[20px] bg-primary text-white font-bold py-4 text-lg hover:bg-white hover:text-primary transition-colors duration-300"
        >
          Swipe Up
          <FaArrowUp className="ml-2" />
        </button> */}

        <div className="border-t py-4 mx-10 bottom-5 text-center text-xs text-gray-500 dark:border-gray-800 border-gray-200 dark:text-gray-400 relative z-10">
          © {new Date().getFullYear()} PeduliKita. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  );
}
