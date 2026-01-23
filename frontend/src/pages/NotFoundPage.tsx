import { Link } from "react-router-dom";
import { Ghost } from "lucide-react";
import { motion } from "framer-motion";
import Orb from "../components/fraction/Orb";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black dark:bg-black flex flex-col items-center justify-center text-center px-4 transition-colors">
            
            <div style={{ width: '100%', height: '600px', position: 'relative', zIndex: 999 }}>
                <Orb
                    hoverIntensity={0.5}
                    rotateOnHover={true}
                    hue={0}
                    forceHoverState={false}
                />
            </div>
            <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center flex-col">
                

                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-5xl font-bold text-white dark:text-white mb-4"
                >
                    404
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-lg text-gray-400 dark:text-gray-400 mb-6"
                >
                    Halaman yang kamu cari tidak ditemukan.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    
                </motion.div>
            </div>
        </div>
    );
}
