import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import StaggeredMenu from "../fraction/StaggeredMenu";
import checkIsLogin from "../../services/checkIsLogin";
import DataUser from "../../services/dataUser";
import logoutUser from "../../services/logout";

const menuItems = [
  { label: "Home", ariaLabel: "Pergi Ke Halaman Utama", link: "/" },
  { label: "Donasi", ariaLabel: "Cari bencana dan donasi", link: "/donasi" },
  // { label: "Berita", ariaLabel: "Lihat berita terkini", link: "/berita" },
  { label: "Komunitas", ariaLabel: "Lihat komunitas", link: "/komunitas" },
  {
    label: "Tentang",
    ariaLabel: "Tentang Aplikasi dan developer",
    link: "/tentang-kami",
  },
  // { label: "Profile", ariaLabel: "Lihat profil pengguna", link: "/profile" },
];

const socialItems = [
  { label: "Login", link: "/login" },
  { label: "Register", link: "/register" },
];
const socialItemsHasLog = [
  { label: "Login", link: "/login" },
  { label: "Register", link: "/register" },
  { label: "Profile", link: "/profile" },
];

export default function Header() {
  const [lastScrollY, setLastScrollY] = useState(0);
  const datas = DataUser();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  const handleLogout = () => {
    logoutUser();
  };

  useEffect(() => {
    const verifyLogin = async () => {
      const loggedIn = await checkIsLogin();
      setIsLoggedIn(loggedIn);
      console.log("Status Login dari useEffect:", loggedIn);
    };

    verifyLogin();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Untuk background saat scroll
          setScrolled(currentScrollY > 50);

          // ⭐ LOGIKA UTAMA ⭐
          if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
            // Scroll ke bawah DAN sudah scroll lebih dari 100px
            setIsVisible(false);
          } else if (currentScrollY < lastScrollYRef.current) {
            // Scroll ke atas
            setIsVisible(true);
          }

          lastScrollYRef.current = currentScrollY;
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
  <header
    className={`fixed top-0 left-0 right-0 z-9999 transition-all duration-300 ${
      isVisible ? 'opacity-100 top-0' : 'opacity-0 -top-20'
    } ${
      scrolled
        ? "bg-tertiary dark:bg-tertiaryDark shadow-md"
        : "bg-transparent dark:bg-transparent"
    }`}
  >
      <div className="w-full bg-primary">
        <StaggeredMenu
          position="right"
          items={menuItems}
          isFixed={false}
          socialItems={isLoggedIn ? socialItemsHasLog : socialItemsHasLog}
          displaySocials={true}
          displayItemNumbering={true}
          menuButtonColor="#000"
          openMenuButtonColor="#000"
          changeMenuColorOnOpen={true}
          colors={["#016b61", "#016B61"]}
          logoUrl="/images/headerlogo.png"
          accentColor="#9ecfd4"
          onMenuOpen={() => console.log("Menu opened")}
          onMenuClose={() => console.log("Menu closed")}
        />
      </div>
    </header>
  );
}
