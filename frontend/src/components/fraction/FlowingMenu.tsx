import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import cekIsDark from "../../services/cekIsDark";

interface MenuItemData {
  link: string;
  text: string;
  image: string;
}

interface FlowingMenuProps {
  items?: MenuItemData[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
}

interface MenuItemProps extends MenuItemData {
  speed: number;
  textColor: string;
  borderColor: string;
  isFirst: boolean;
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items = [],
  speed = 15,
  textColor = "#fff",
  bgColor = "#060010",
  borderColor = "#fff",
}) => {
  return (
    <div
      className="w-full h-full relative !bg-white dark:!bg-black"
      style={{ backgroundColor: bgColor }}
    >
      <nav className="flex flex-col h-full m-0 p-0">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
            speed={speed}
            textColor={textColor}
            borderColor={borderColor}
            isFirst={idx === 0}
          />
        ))}
      </nav>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({
  text,
  image,
  speed,
  textColor,
  isFirst,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const [repetitions, setRepetitions] = useState(8);
  const { isDark } = cekIsDark();

  const animationDefaults = { duration: 0.6, ease: "expo.out" };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!itemRef.current) return;
      const height = itemRef.current.offsetHeight;
      // Rasio repetisi berdasarkan lebar layar dibagi tinggi item
      const needed = Math.ceil(window.innerWidth / (height || 100)) + 2;
      setRepetitions(needed * 2);
    };

    calculateRepetitions();
    window.addEventListener("resize", calculateRepetitions);
    return () => window.removeEventListener("resize", calculateRepetitions);
  }, []);

  useEffect(() => {
    if (!marqueeInnerRef.current) return;
    if (animationRef.current) animationRef.current.kill();

    // Animasi Infinite Horizontal Scroll
    animationRef.current = gsap.to(marqueeInnerRef.current, {
      xPercent: -50,
      duration: speed,
      ease: "none",
      repeat: -1,
    });

    return () => {
      animationRef.current?.kill();
    };
  }, [repetitions, speed]);

  const findClosestEdge = (mouseY: number, height: number): "top" | "bottom" => {
    return mouseY < height / 2 ? "top" : "bottom";
  };

  const handleMouseEnter = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current || !linkRef.current) return;
    
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientY - rect.top, rect.height);
    const images = marqueeInnerRef.current.querySelectorAll(".menu-image");

    gsap.timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === "top" ? "-100%" : "100%" }, 0)
      .set(marqueeInnerRef.current, { y: edge === "top" ? "100%" : "-100%" }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" }, 0)
      .to(linkRef.current, { opacity: 0 }, 0)
      // Efek Grayscale: Mematikan warna gambar menjadi abu-abu
      .to(images, { filter: "grayscale(100%) brightness(0.7)", duration: 0.4 }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current || !linkRef.current) return;
    
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientY - rect.top, rect.height);
    const images = marqueeInnerRef.current.querySelectorAll(".menu-image");

    gsap.timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === "top" ? "-100%" : "100%" }, 0)
      .to(marqueeInnerRef.current, { y: edge === "top" ? "100%" : "-100%" }, 0)
      .to(linkRef.current, { opacity: 1 }, 0)
      // Mengembalikan warna gambar
      .to(images, { filter: "grayscale(0%) brightness(1)", duration: 0.4 }, 0);
  };

  return (
    <div
      ref={itemRef}
      className={`flex-1 relative overflow-hidden text-center border-primary dark:border-white ${
        isFirst ? "" : "border-t"
      }`}
    >
      {/* Label Menu */}
      <a
        ref={linkRef}
        className="flex items-center justify-center h-full !text-primary dark:!text-white relative z-10 cursor-pointer uppercase no-underline font-semibold text-[4vh]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ color: textColor }}
      >
        {text}
      </a>

      {/* Marquee Wrapper */}
      <div
        ref={marqueeRef}
        className={`absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none translate-y-full ${
          isDark ? "bg-black" : "bg-primary"
        }`}
      >
        <div ref={marqueeInnerRef} className="h-full flex w-fit">
          {[...Array(repetitions)].map((_, idx) => (
            <div key={idx} className="h-full flex-shrink-0">
              <div
                className="menu-image aspect-square h-full bg-cover bg-center transition-filter"
                style={{ backgroundImage: `url(${image})` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlowingMenu;