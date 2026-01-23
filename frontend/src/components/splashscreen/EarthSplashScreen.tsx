import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  PerspectiveCamera,
  Stars,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

import EarthModel from "./EarthModel";
import RobotModel from "./RobotModel";

type ScenePhase = "loading" | "idle" | "zoom";

const CONFIG = {
  desktop: {
    earthPos: new THREE.Vector3(-3, -1, 0),
    robotPos: new THREE.Vector3(3.5, -1, 2),
    robotTargetPos: new THREE.Vector3(-2.8, -0.6, 0.5),
    robotScale: 3,
    cameraZ: 8,
    zoomDuration: 2000,
  },
  mobile: {
    earthPos: new THREE.Vector3(0, 1.5, 0),
    robotPos: new THREE.Vector3(0, -2, 2),
    robotTargetPos: new THREE.Vector3(0, -0.5, 1),
    robotScale: 1.8,
    cameraZ: 12,
    zoomDuration: 1500,
  }
};

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

function SceneManager({ 
  phase, 
  onZoomFinish, 
  isMobile 
}: { 
  phase: ScenePhase; 
  onZoomFinish: () => void; 
  isMobile: boolean 
}) {
  const earthRef = useRef<THREE.Group>(null);
  const robotRef = useRef<THREE.Group>(null);
  const [earthDone, setEarthDone] = useState(false);
  
  const activeConfig = isMobile ? CONFIG.mobile : CONFIG.desktop;

  useEffect(() => {
    if (earthRef.current) {
      earthRef.current.position.copy(activeConfig.earthPos);
      earthRef.current.rotation.set(0, 1.2, 0);
    }
    if (robotRef.current) {
      robotRef.current.position.copy(activeConfig.robotPos);
      robotRef.current.rotation.set(0, -4, 0);
      robotRef.current.scale.setScalar(activeConfig.robotScale); 
    }
  }, [isMobile]);

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
          robotRef.current.position.lerp(activeConfig.robotTargetPos, 0.007);
          const s = THREE.MathUtils.lerp(robotRef.current.scale.x, -1, 0.007);
          robotRef.current.scale.set(s, s, s);
        }
      }

      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5, 0.005);

      if (earthDone && robotRef.current!.scale.x < 0.45) {
        onZoomFinish();
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
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi Mobile secara Real-time
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLoaded = () => {
    setPhase("idle");
    const delay = isMobile ? CONFIG.mobile.zoomDuration : CONFIG.desktop.zoomDuration;
    setTimeout(() => setPhase("zoom"), delay);
  };

  const handleFinish = () => {
    setIsVisible(false);
    setTimeout(onComplete, 1000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}    
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-white overflow-hidden"
        >
          <Canvas className="w-full h-full" shadows>
            <PerspectiveCamera 
              makeDefault 
              position={[0, 0, isMobile ? CONFIG.mobile.cameraZ : CONFIG.desktop.cameraZ]} 
              fov={45} 
            />
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={2} castShadow />

            <Suspense fallback={null}>
              <Stars radius={100} depth={50} count={5000} factor={4} fade />
              <SceneManager phase={phase} onZoomFinish={handleFinish} isMobile={isMobile} />
              <Environment preset="city" />
            </Suspense>
          </Canvas>

          <AnimatePresence>
            {phase === "loading" && <LoadingScreen onFinish={handleLoaded} />}
          </AnimatePresence>

          {/* TEXT LAYER - Responsive CSS Classes */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className={`absolute flex flex-col pointer-events-none px-6
              ${isMobile 
                ? "bottom-[10%] left-0 w-full items-center text-center" 
                : "right-[8%] top-1/2 -translate-y-1/2 w-[420px] items-start text-left"
              }`}
          >
            <h1 className={`${isMobile ? "text-[40px]" : "text-[64px]"} font-bold tracking-[2px] leading-tight text-primary`}>
              PeduliKita
            </h1>
            <p className={`${isMobile ? "text-[16px]" : "text-[20px]"} mt-2 font-medium text-primary`}>
              Connecting Humanity with Real Impact
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}