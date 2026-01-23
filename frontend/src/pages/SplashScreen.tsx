import React, { useState, useEffect } from "react";
import "./SplashScreen.css";
import SplitText from "@/components/SplitText";
import TrueFocus from "@/components/TrueFocus";

const SplashScreen = () => {
  const [animClass, setAnimClass] = useState({
    bgParent: "bg-primary",
    bgChild1: "bg-white dark:bg-black",
    bgChild2: "bg-primary",
    classLogo: "opacity-0",
    textlogo: "text-primary",
    hasEndAnimation: false,
    hasEndAnimation2: false,
  });

  useEffect(() => {
    const t1 = setTimeout(() => {
      setAnimClass((prev) => ({ ...prev, classLogo: "" }));
    }, 70);

    const t2 = setTimeout(() => {
      setAnimClass((prev) => ({
        ...prev,
        bgParent: "bg-white dark:bg-black",
        hasEndAnimation: true,
      }));
    }, 1000);

    const t3 = setTimeout(() => {
      setAnimClass((prev) => ({ ...prev, textlogo: "text-white" }));
    }, 1500);

    const t4 = setTimeout(() => {
      setAnimClass((prev) => ({ ...prev, hasEndAnimation2: true }));
    }, 2200);

    const t5 = setTimeout(() => {
      setAnimClass((prev) => ({ ...prev, bgParent: "opacity-0" }));
    }, 6200);

    const t6 = setTimeout(() => {
      setAnimClass((prev) => ({ ...prev, bgParent: "hidden" }));
    }, 6400);

    return () => {
      [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 transition-all duration-700 ease-in-out left-0 w-full ${animClass.bgParent} z-[999999] h-[100vh] flex justify-center items-center`}
    >
      <div className="w-full h-full flex justify-center items-center relative">
        {/* Background layers */}
        <div className={`anim1 ${animClass.bgChild1} relative`}></div>
        <div
          className={`anim2 ${animClass.bgChild2} h-[100vh] w-full flex justify-center items-center`}
        >
          {animClass.hasEndAnimation2 && (
            <TrueFocus
              sentence="Platform Peduli Sosial"
              manualMode={false}
              blurAmount={5}
              borderColor="#70b2b2"
              animationDuration={0.8}
              pauseBetweenAnimations={0.5}
            />
          )}
        </div>

        {/* Logo and Text Content */}
        <div className="fixed top-0 left-0 w-full flex flex-col justify-center items-center ease-in-out transition-all h-[100vh]">
          <div className="relative anim3 flex justify-center flex-col">
            <div className="p-2 flex justify-center items-center">
              <img
                src="/images/logo.png"
                className={`${animClass.classLogo} anim4 transition-all duration-500 ease-in-out w-20 md:w-40`}
                alt="Logo"
              />
            </div>

            <div className="relative pt-3 px-3 pb-1">
              <div className="animtextlogo absolute h-full top-0 left-0"></div>
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
