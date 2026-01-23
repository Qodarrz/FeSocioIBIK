import { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment, Html } from "@react-three/drei";
import * as THREE from "three";
import { MessageCircle, X, Send } from "lucide-react";

// Import Sections
import Hero from "../components/HomeSections/Hero";
import FAQSection from "../components/HomeSections/Faq";
import DonateHero from "../components/HomeSections/DonateHero";
import CallToActionSection from "../components/HomeSections/CallToAction";
import RobotModel from "../components/splashscreen/RobotModel";

// Import Data Dummy
import { donateData } from "../data/donateData";

// --- Helpers ---
function interpolate(p1: any, p2: any, progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  return {
    x: p1.x + (p2.x - p1.x) * p,
    y: p1.y + (p2.y - p1.y) * p,
    z: p1.z + (p2.z - p1.z) * p,
    scale: p1.scale + (p2.scale - p1.scale) * p,
    rotY: p1.rotY + (p2.rotY - p1.rotY) * p,
    rotX: (p1.rotX || 0) + ((p2.rotX || 0) - (p1.rotX || 0)) * p,
    rotZ: (p1.rotZ || 0) + ((p2.rotZ || 0) - (p1.rotZ || 0)) * p,
  };
}

function ChatWindow({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed bottom-10 right-10 w-80 h-96 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[9999] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 pointer-events-auto">
      <div className="p-4 bg-primary text-white flex justify-between items-center">
        <span className="font-bold">Robot Assistant</span>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 p-4 text-sm overflow-y-auto dark:text-gray-300">
        <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-lg mb-2 w-fit">
          Halo! Ada yang bisa saya bantu?
        </div>
      </div>
      <div className="p-3 border-t dark:border-zinc-800 flex gap-2">
        <input
          type="text"
          placeholder="Tanya sesuatu..."
          className="flex-1 bg-transparent text-sm outline-none"
        />
        <button className="text-primary">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

function HomeRobot({ onChatClick }: { onChatClick: () => void }) {
  const robotRef = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    const startTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      setShowBubble(false);
      idleTimerRef.current = setTimeout(() => setShowBubble(true), 500);
    };
    startTimer();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("scroll", startTimer);
    return () => {
      window.removeEventListener("resize", checkMobile);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const points = useMemo(() => {
    if (isMobile) {
      return {
        hero: {
          x: 1.2,
          y: -1,
          z: 0,
          scale: 1.2,
          rotY: Math.PI,
          rotX: 0,
          rotZ: -0.3,
        },
        stay: {
          x: 1.2,
          y: -1,
          z: 0,
          scale: 1.2,
          rotY: Math.PI,
          rotX: 0,
          rotZ: -0.3,
        },
      };
    }
    return {
      hero: {
        x: 3.5,
        y: -0.9,
        z: 0,
        scale: 2,
        rotY: Math.PI - 1,
        rotX: 0.3,
        rotZ: -0.5,
      },
      // Target Satset: Pojok kanan bawah, miring Z
      stay: {
        x: 3.8,
        y: -1.3,
        z: 0,
        scale: 1.6,
        rotY: Math.PI - 0.5,
        rotX: 0.2,
        rotZ: -0.4,
      },
    };
  }, [isMobile]);

  useFrame((state) => {
    if (!robotRef.current) return;
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    // Kecepatan lerp dinaikkan jadi 0.15 agar "satset" (lebih responsif)
    const lerpSpeed = 0.15;

    // Logic: Jika sudah lewat 80% VH (Hero beres), langsung kunci ke posisi STAY
    let target = scrollY > vh * 0.8 ? points.stay : points.hero;

    const floating = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;

    // Pergerakan Posisi
    robotRef.current.position.lerp(
      new THREE.Vector3(target.x, target.y + floating, target.z),
      lerpSpeed,
    );

    // Pergerakan Skala
    const s = THREE.MathUtils.lerp(
      robotRef.current.scale.x,
      target.scale,
      lerpSpeed,
    );
    robotRef.current.scale.set(s, s, s);

    // Pergerakan Rotasi
    robotRef.current.rotation.y = THREE.MathUtils.lerp(
      robotRef.current.rotation.y,
      target.rotY + state.mouse.x * 0.1,
      lerpSpeed,
    );
    robotRef.current.rotation.x = THREE.MathUtils.lerp(
      robotRef.current.rotation.x,
      target.rotX + state.mouse.y * -0.05,
      lerpSpeed,
    );
    robotRef.current.rotation.z = THREE.MathUtils.lerp(
      robotRef.current.rotation.z,
      target.rotZ,
      lerpSpeed,
    );
  });

  return (
    <group ref={robotRef}>
      <RobotModel />
      <Html
        position={[0, 1.1, 0]}
        center
        distanceFactor={10}
        zIndexRange={[100, 0]}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onChatClick();
          }}
          className={`cursor-pointer group flex items-center gap-1 bg-white dark:bg-zinc-800 px-1 py-1 rounded-full shadow-2xl border-2 border-primary/50 transition-all duration-500 whitespace-nowrap pointer-events-auto ${
            showBubble
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-75 pointer-events-none"
          }`}
        >
          <div className="bg-primary p-0.5 rounded-full">
            <MessageCircle className="text-white w-3 h-3 md:w-4 md:h-4" />
          </div>
          <span className="hidden md:flex md:text-[10px] font-bold dark:text-white pr-2">
            PeduliAgent
          </span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white dark:border-t-zinc-800"></div>
        </div>
      </Html>
    </group>
  );
}

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="relative bg-white dark:bg-black w-full overflow-x-hidden">
      <main className="relative z-[10]">
        <div className="mt-15">
          <Hero />
          <CallToActionSection />
          <DonateHero data={donateData} isTitle={true} />
          <FAQSection />
          <div className="h-40" />
        </div>
      </main>

      <div className="fixed inset-0 z-[50] pointer-events-none">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ pointerEvents: "none" }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
          <ambientLight intensity={0.8} />
          <Suspense fallback={null}>
            <HomeRobot onChatClick={() => setIsChatOpen(true)} />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>

      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
