import { useState, useRef, useEffect, useCallback } from "react";
import { FiMaximize2, FiMinimize2, FiPlay, FiPause } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const vrScenes = [
  {
    id: 1,
    title: "Lokasi Banjir Bandang",
    image: "/images/vr/aceh-flood-1.jpg",
    hotspots: [
      { id: 1, x: 30, y: 40, label: "Rumah Terendam" },
      { id: 2, x: 60, y: 30, label: "Jalan Rusak" },
    ],
  },
  {
    id: 2,
    title: "Posko Pengungsian",
    image: "/images/vr/aceh-shelter-1.jpg",
    hotspots: [{ id: 3, x: 50, y: 50, label: "Area Medis" }],
  },
];

export default function VRViewerOptimized() {
  const [currentScene, setCurrentScene] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ isDragging: false, startX: 0 });

  // Handle Rotation Logic (Smooth)
  const updateRotation = useCallback((delta: number) => {
    setRotation((prev) => prev + delta);
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current.isDragging) return;
    const delta = (e.clientX - dragRef.current.startX) * 0.2;
    updateRotation(delta);
    dragRef.current.startX = e.clientX;
  };

  useEffect(() => {
    let frameId: number;
    const animate = () => {
      if (isPlaying && !dragRef.current.isDragging) {
        setRotation((prev) => prev + 0.1);
      }
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 font-sans">
      <div
        ref={viewerRef}
        className="relative h-[500px] rounded-2xl overflow-hidden bg-black shadow-2xl group cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => {
          dragRef.current = { isDragging: true, startX: e.clientX };
          setIsPlaying(false);
        }}
        onMouseUp={() => (dragRef.current.isDragging = false)}
        onMouseMove={onMouseMove}
        onMouseLeave={() => (dragRef.current.isDragging = false)}
      >
        {/* VR Engine (Pure CSS Transform for Smoothness) */}
        <div 
          className="absolute inset-0 transition-transform duration-75 ease-out"
          style={{
            backgroundImage: `url(${vrScenes[currentScene].image})`,
            backgroundSize: '200% 100%', // Simulasi sederhana panorama
            backgroundPosition: `${rotation}px center`,
          }}
        />

        {/* Minimalist Overlay Info */}
        <div className="absolute top-6 left-6 pointer-events-none">
          <h2 className="text-white text-xl font-medium tracking-tight drop-shadow-md">
            {vrScenes[currentScene].title}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white/70 text-xs uppercase tracking-widest">360° View</span>
          </div>
        </div>

        {/* Discrete Controls */}
        <div className="absolute bottom-6 right-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
          >
            {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
          </button>
          <button
            onClick={() => {
              if (!isFullscreen) viewerRef.current?.requestFullscreen();
              else document.exitFullscreen();
              setIsFullscreen(!isFullscreen);
            }}
            className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
          >
            {isFullscreen ? <FiMinimize2 size={20} /> : <FiMaximize2 size={20} />}
          </button>
        </div>

        {/* Hotspots Container */}
        <div className="absolute inset-0 pointer-events-none">
          {vrScenes[currentScene].hotspots.map((h) => (
            <div
              key={h.id}
              className="absolute pointer-events-auto"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              <div className="relative group/item">
                <div className="w-4 h-4 bg-white rounded-full shadow-lg border-4 border-white/30 animate-ping absolute" />
                <div className="w-4 h-4 bg-white rounded-full shadow-lg relative" />
                <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">
                  {h.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Scene Switcher */}
      <div className="flex justify-center gap-4">
        {vrScenes.map((scene, idx) => (
          <button
            key={scene.id}
            onClick={() => setCurrentScene(idx)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              currentScene === idx
                ? "bg-black text-white scale-105 shadow-lg"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {scene.title}
          </button>
        ))}
      </div>
    </div>
  );
}