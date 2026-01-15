import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  PerspectiveCamera,
  Stars,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion

import EarthModel from "./EarthModel";
import RobotModel from "./RobotModel";

type ScenePhase = "loading" | "idle" | "zoom";

// --- LoadingScreen Tetap Sama ---
function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const { progress } = useProgress();
  useEffect(() => {
    if (progress === 100) {
      const t = setTimeout(onFinish, 500);
      return () => clearTimeout(t);
    }
  }, [progress, onFinish]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-white"
    >
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest opacity-60 text-gray-500">Initializing Scene</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{progress.toFixed(0)}%</p>
      </div>
    </motion.div>
  );
}

// --- SceneManager Tetap Sama (Logika Tidak Diubah) ---
function SceneManager({ phase, onZoomFinish }: { phase: ScenePhase; onZoomFinish: () => void }) {
  const earthRef = useRef<THREE.Group>(null);
  const robotRef = useRef<THREE.Group>(null);
  const [earthDone, setEarthDone] = useState(false);

  useEffect(() => {
    if (earthRef.current) {
      earthRef.current.position.set(-3, -1, 0);
      earthRef.current.rotation.set(0, 1.2, 0);
    }
    if (robotRef.current) {
      // robotRef.current.position.set(3.5, -0.8, 2);
      // robotRef.current.rotation.set(-2, 0 , 0);
      // robotRef.current.scale.set(3, 3, 3); 
      robotRef.current.position.set(3.5, -1, 2);
      robotRef.current.rotation.set(0, -4, 0);
      robotRef.current.scale.set(3, 3, 3); 
    }
  }, []);

  useFrame((state) => {
    if (phase === "loading") return;
    const t = state.clock.getElapsedTime();

    if (phase === "idle") {
      if (earthRef.current) earthRef.current.rotation.y = 2 + Math.sin(t * 0.1) * 0.1;
    }

    if (phase === "zoom") {
      if (earthRef.current) {
        earthRef.current.rotation.y = THREE.MathUtils.lerp(earthRef.current.rotation.y, 10, 0.01);
        earthRef.current.rotation.x = THREE.MathUtils.lerp(earthRef.current.rotation.x, -0.5, 0.01);
        if (Math.abs(earthRef.current.rotation.y - 10) < 0.2) setEarthDone(true);
      }

      if (robotRef.current) {
        robotRef.current.rotation.y = THREE.MathUtils.lerp(robotRef.current.rotation.y, 1, 0.02);
        if (earthDone) {
          robotRef.current.position.lerp(new THREE.Vector3(-2.8, -0.6, 0.5), 0.007);
          const s = THREE.MathUtils.lerp(robotRef.current.scale.x, -1, 0.007);
          robotRef.current.scale.set(s, s, s);
        }
      }

      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5, 0.005);

      if (earthDone && robotRef.current!.scale.x < 0.45) {
        onZoomFinish(); // Memicu keluar
      }
    }
  });

  return (
    <>
      <EarthModel ref={earthRef} />
      <RobotModel ref={robotRef} />
    </>
  );
}

export default function EarthSplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<ScenePhase>("loading");
  const [isVisible, setIsVisible] = useState(true); // State untuk kontrol Fade Out

  const handleLoaded = () => {
    setPhase("idle");
    setTimeout(() => setPhase("zoom"), 2000); // Mengurangi delay sedikit agar lebih responsif
  };

  const handleFinish = () => {
    setIsVisible(false); // Memulai animasi Fade Out
    setTimeout(onComplete, 1000); // Panggil callback asli setelah animasi selesai
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }} // Fade In
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}    // Fade Out
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-white"
        >
          <Canvas className="w-full h-full" shadows>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={2} castShadow />

            <Suspense fallback={null}>
              <Stars radius={100} depth={50} count={5000} factor={4} fade />
              <SceneManager phase={phase} onZoomFinish={handleFinish} />
              <Environment preset="city" />
            </Suspense>
          </Canvas>

          <AnimatePresence>
            {phase === "loading" && <LoadingScreen onFinish={handleLoaded} />}
          </AnimatePresence>

          {/* TEXT LAYER */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[420px] pointer-events-none"
          >
            <h1 className="text-[64px] font-bold tracking-[2px] leading-tight text-primary">
              PeduliKita
            </h1>
            <p className="mt-2 text-[20px] font-medium text-primary">
              Connecting Humanity with Real Impact
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}