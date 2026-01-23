import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";


export default function FullWidthCarousel({ items }: { items: { id?: number; image: string; icon?: React.ReactNode }[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalItems = items.length;
  const autoplay = true;
  const autoplayDelay = 4000;

  // 🔁 AUTOPLAY
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalItems);
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, totalItems]);

  const GAP = 20;
  const width = containerRef.current?.offsetWidth ?? 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[200px] rounded-[12px] overflow-hidden"
    >
      {/* TRACK */}
      <motion.div
        className="flex w-full gap-5 rounded-2xl"
        animate={{
          x: -(activeIndex * (width + GAP)),
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 20,
        }}
        drag="x"
        dragConstraints={containerRef}
        onDragEnd={(_, info) => {
          if (info.offset.x < -50) {
            setActiveIndex((i) => (i + 1) % totalItems);
          } else if (info.offset.x > 50) {
            setActiveIndex((i) => (i - 1 + totalItems) % totalItems);
          }
        }}
      >
        {/* ITEM */}
        {items.map((item, index) => (
          <div
            key={index}
            className="w-full  shrink-0 rounded-2xl overflow-hidden h-[200px]"
          >
            <div
              className="relative  w-full rounded-2xl h-[200px] flex items-center justify-center text-white"
              style={{
                background: `linear-gradient(to bottom, rgba(0,0,0, .5), rgba(0,0,0,0)),url(${item.image}) center/cover no-repeat`,
              }}
            >
              
            <div className={'p-0 m-0 absolute top-4 left-4'}>
              <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#016B61]">
                {item.icon}
              </span>
            </div>
              {/* overlay */}
              {/* <div className="absolute inset-0 bg-black/40" /> */}

            </div>
          </div>
        ))}
      </motion.div>

      {/* INDICATOR */}
      {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-2 w-2 rounded-full transition ${
              activeIndex === i
                ? "bg-white w-6"
                : "bg-white/50"
            }`}
          />
        ))}
      </div> */}
    </div>
  );
}
