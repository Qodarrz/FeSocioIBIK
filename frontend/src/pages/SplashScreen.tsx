import React, { useState, useEffect, useRef, Suspense } from 'react'
import './SplashScreen.css'
import SplitText from '@/components/SplitText'
import { Canvas, useFrame } from "@react-three/fiber";
import {
    Environment,
    PerspectiveCamera,
    Stars,
    useProgress,
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion
import EarthModel from '@/components/splashscreen/EarthModel';
import RobotModel from '@/components/splashscreen/RobotModel';
import TrueFocus from '@/components/TrueFocus';



type ScenePhase = "loading" | "idle" | "zoom";
function SceneManager({ phase, onZoomFinish }: { phase: ScenePhase; onZoomFinish: () => void }) {
    const earthRef = useRef<THREE.Group>(null);
    const robotRef = useRef<THREE.Group>(null);
    const [earthDone, setEarthDone] = useState(false);
    useEffect(() => {
        if (earthRef.current) {
            earthRef.current.position.set(0, 0, 0); // TENGAH
            earthRef.current.rotation.set(0, 0, 0);
            earthRef.current.scale.set(1, 1, 1); // 🔽 KECILIN DI SINI
        }
    }, []);


    useFrame((state) => {
        if (phase === "loading") return;
        const t = state.clock.getElapsedTime();

        if (phase === "idle" && earthRef.current) {
            earthRef.current.rotation.y += 0.002;
            earthRef.current.position.y = Math.sin(t * 0.6) * 0.1;
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
            {/* <RobotModel ref={robotRef} /> */}
        </>
    );
}

const SplashScreen = () => {
    const [phase, setPhase] = useState<ScenePhase>("idle");
    const [isVisible, setIsVisible] = useState(true); // State untuk kontrol Fade Out
 // Mengurangi delay sedikit agar lebih responsif

    const handleFinish = () => {
        setIsVisible(false); // Memulai animasi Fade Out
        // setTimeout(onComplete, 1000); // Panggil callback asli setelah animasi selesai
    };
    const [animClass, setAnimClass] = useState({
        bgParent: "bg-primary",
        bgChild1: "bg-white dark:bg-black",
        bgChild2: "bg-primary",
        classLogo: "opacity-0",
        textlogo: "text-primary",
        hasEndAnimation: false,
        hasEndAnimation2: false,
    })

    useEffect(() => {
        const t1 = setTimeout(() => {
            setAnimClass(prev => ({
                ...prev,
                classLogo: "",
            }))
        }, 70)

        const t2 = setTimeout(() => {
            setAnimClass(prev => ({
                ...prev,
                bgParent: "bg-white dark:bg-black",
                classLogo: "",
                hasEndAnimation: true
            }))
        }, 1000)

        const t3 = setTimeout(() => {
            setAnimClass(prev => ({
                ...prev,
                textlogo: "text-white",
                // bgChild1: "opacity-0",
            }))
        }, 1500)

        const t4 = setTimeout(() => {
            setAnimClass(prev => ({
                ...prev,
                hasEndAnimation2: true
            }))
        }, 2200)
        const t5 = setTimeout(() => {
            setAnimClass(prev => ({
                ...prev,
                bgParent: "opacity-0"
            }))
        }, 6200)
        const t6 = setTimeout(() => {
            setAnimClass(prev => ({
                ...prev,
                bgParent: "hidden"
            }))
        }, 6400)

        return () => {
            clearTimeout(t1)
            clearTimeout(t2)
            clearTimeout(t3)
            clearTimeout(t4)
            clearTimeout(t5)
            clearTimeout(t6)
        }
    }, [])


    return (
        <div className={`fixed top-0 transition-all ease-in-out left-0 w-full ${animClass.bgParent} z-[999999] h-[100vh] flex justify-center items-center`}>
            <div className="w-full h-full flex justify-center items-center relative">
                <div className={`anim1 ${animClass.bgChild1} relative`}>
                </div>

                <div className={`anim2 ${animClass.bgChild2} h-[100vh] flex justify-center items-center `}>

                    {/* <Canvas className="w-full h-full transition-all ease-in-out" shadows>
                        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
                        <ambientLight intensity={1.5} />
                        <pointLight position={[10, 10, 10]} intensity={2} castShadow />

                        <Suspense fallback={null}>
                            <Stars radius={100} depth={50} count={5000} factor={4} fade />
                            <SceneManager phase={phase} onZoomFinish={handleFinish} />
                            <Environment preset="city" />
                        </Suspense>
                    </Canvas> */}
                    {
                        animClass.hasEndAnimation2 && (
                            <TrueFocus
                            sentence="Platform Peduli Sosial"
                            manualMode={false}
                            blurAmount={5}
                            borderColor="#70b2b2"
                            animationDuration={0.8}
                            pauseBetweenAnimations={0.5}
                            />

                        )
                    }
                </div>

                <div className='fixed top-0 left-0 w-full flex flex-col justify-center items-center ease-in-out transition-all h-[100vh]'>
                    <div className='relative anim3 flex justify-center flex-col'>
                        <div className=' p-2 flex justify-center items-center'>
                            <img src="/images/logo.png" className={`${animClass.classLogo} anim4 transition-all ease-in-out w-20 md:w-40`} alt="" />
                        </div>

                        <div className='relative  pt-3 px-3 pb-1'>
                            <div className='animtextlogo absolute h-full top-0 left-0'>

                            </div>
                            <SplitText
                                text="Peduli Kita"
                                className={`text-2xl md:text-4xl ${animClass.textlogo} mb-0 pb-0 font-semibold transition-all ease-in-out text-center`}
                                delay={100}
                                duration={0.8}
                                ease="power3.out"
                                splitType="chars"
                                from={{ opacity: 0, y: 40 }}
                                to={{ opacity: 1, y: 0 }}
                                threshold={0.1}
                                rootMargin="-100px"
                                textAlign="center"
                            // onLetterAnimationComplete={handleAnimationComplete}
                            />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SplashScreen
