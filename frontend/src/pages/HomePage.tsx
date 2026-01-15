import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";

import { MdHealthAndSafety } from "react-icons/md";
import FlowingMenu from "../components/fraction/FlowingMenu";
import Hero from "../components/HomeSections/Hero";
import FAQSection from "../components/HomeSections/Faq";
import DonateHero from "../components/HomeSections/DonateHero";
import CallToActionSection from "../components/HomeSections/CallToAction";
import RobotModel from "../components/splashscreen/RobotModel";

function interpolate(p1: any, p2: any, progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  return {
    x: p1.x + (p2.x - p1.x) * p,
    y: p1.y + (p2.y - p1.y) * p,
    z: p1.z + (p2.z - p1.z) * p,
    scale: p1.scale + (p2.scale - p1.scale) * p,
    rotY: p1.rotY + (p2.rotY - p1.rotY) * p,
  };
}

function HomeRobot() {
  const robotRef = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const desktopPoints = {
    intro2: { x: 2.8, y: -0.5, z: 0, scale: 2, rotY: Math.PI - 0.5 },
    cta: { x: 0.4, y: -0.5, z: 0, scale: 1.5, rotY: Math.PI + 0.8 },
    donate: { x: 0, y: -2, z: 0, scale: 1.5, rotY: Math.PI - 0.8 },
    menu: { x: 2, y: 0, z: 1, scale: 1.8, rotY: Math.PI * 2.2 },
    faq: { x: -0.4, y: -1, z: 0, scale: 2, rotY: Math.PI + 0.6 },
  };

  const mobilePoints = {
    intro2: {
      x: -1,
      y: -1,
      z: 0,
      scale: 1.2,
      rotY: Math.PI + 0.5,
      rotX: 0.2,
      rotZ: -0.2,
    },
    cta: {
      x: 1,
      y: 0.2,
      z: 0,
      scale: 1,
      rotY: Math.PI - 0.5,
      rotX: -0.1,
      rotZ: 0.15,
    },
    donate: {
      x: -1,
      y: -1.5,
      z: 0,
      scale: 1.1,
      rotY: Math.PI * 1.5,
      rotX: 0.3,
      rotZ: 0,
    },
    menu: {
      x: 0,
      y: -0.5,
      z: 0,
      scale: 1.2,
      rotY: Math.PI * 2,
      rotX: 0,
      rotZ: 0.1,
    },
    faq: {
      x: 0,
      y: -1,
      z: 0,
      scale: 1.3,
      rotY: Math.PI + 0.3,
      rotX: 0.2,
      rotZ: -0.1,
    },
  };

  const points = isMobile ? mobilePoints : desktopPoints;

  useFrame((state) => {
    if (!robotRef.current) return;

    const t = state.clock.getElapsedTime();
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const lerpSpeed = 0.08;

    const sections = {
      hero: 0,
      cta: vh * 1.0,
      donate: vh * 1.8,
      menu: vh * 3.5,
      faq: vh * 4.5,
    };

    let target = { ...points.intro2 };

    if (scrollY < sections.cta) {
      const progress = scrollY / sections.cta;
      target = interpolate(points.intro2, points.cta, progress);
    } else if (scrollY < sections.donate) {
      const progress =
        (scrollY - sections.cta) / (sections.donate - sections.cta);
      target = interpolate(points.cta, points.donate, progress);
    } else if (scrollY < sections.menu) {
      const progress =
        (scrollY - sections.donate) / (sections.menu - sections.donate);
      target = interpolate(points.donate, points.menu, progress);
    } else {
      const progress = Math.min(
        1,
        (scrollY - sections.menu) / (sections.faq - sections.menu)
      );
      target = interpolate(points.menu, points.faq, progress);
    }

    const floating = Math.sin(t * 0.8) * 0.1;

    // Smooth position transition
    robotRef.current.position.lerp(
      new THREE.Vector3(target.x, target.y + floating, target.z),
      lerpSpeed
    );

    // Smooth scale transition
    const s = THREE.MathUtils.lerp(
      robotRef.current.scale.x,
      target.scale,
      lerpSpeed
    );
    robotRef.current.scale.set(s, s, s);

    // Smooth rotation transition + mouse tracking (reduced on mobile)
    const mouseInfluence = isMobile ? 0.05 : 0.2;
    robotRef.current.rotation.y = THREE.MathUtils.lerp(
      robotRef.current.rotation.y,
      target.rotY + state.mouse.x * mouseInfluence,
      lerpSpeed
    );
  });

  return <RobotModel ref={robotRef} />;
}

export default function HomePage() {
  const demoItems = [
    {
      link: "/peduli",
      text: "Peduli Kemanusiaan",
      image: "/images/bencana/b1.jpg",
    },
    {
      link: "/relawan",
      text: "Relawan Tanggap",
      image: "/images/bencana/b2.jpg",
    },
    {
      link: "/donasi",
      text: "Donasi Darurat",
      image: "/images/bencana/b3.jpg",
    },
    {
      link: "/aksi-sosial",
      text: "Aksi Sosial",
      image: "/images/bencana/b4.jpg",
    },
  ];

  const demoCarousel = [
    {
      id: 1,
      image: "/images/bencana/b1.jpg",
      icon: <MdHealthAndSafety className="h-[16px] w-[16px] text-white" />,
    },
    {
      id: 2,
      image: "/images/bencana/b2.jpg",
      icon: <MdHealthAndSafety className="h-[16px] w-[16px] text-white" />,
    },
    {
      id: 3,
      image: "/images/bencana/b3.jpg",
      icon: <MdHealthAndSafety className="h-[16px] w-[16px] text-white" />,
    },
  ];

  const donateData = [
    {
      title: "Bencana Pegi Jatuh",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Pegi Jatuh",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
    {
      title: "Bencana Lampung",
      description: "Deskripsi bantuan...",
      items: demoCarousel,
    },
  ];

  return (
    <div className="relative bg-white text-text mt-40 dark:bg-black dark:text-textDark">
      {/* 3D CANVAS LAYER */}
      <div
        className="fixed inset-0 pointer-events-none z-[999]"
        style={{ touchAction: "none" }}
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          style={{ pointerEvents: "none" }}
          gl={{ antialias: true, alpha: true }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
          <ambientLight intensity={0.8} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />

          <Suspense fallback={null}>
            <HomeRobot />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>

      {/* UI CONTENT LAYER */}
      <div className="relative z-[20]">
        <Hero />
        <CallToActionSection />
        <DonateHero data={donateData} isTitle={true} />

        {/* <section
          style={{ height: "600px", position: "relative" }}
          className="mt-20 mb-40"
        >
          {demoItems.map((item, idx) => (
            <div key={idx} className="hidden">
              {idx}: {item.image}
              <img
                src={item.image}
                alt=""
                onError={(e) =>
                  console.error(`Failed to load image ${item.image}`, e)
                }
              />
            </div>
          ))}
          <FlowingMenu items={demoItems} />
        </section> */}
        <section>
          
        </section>

        <FAQSection />
      </div>
    </div>
  );
}
