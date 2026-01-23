// import axios from "axios";
// import { useState, useEffect } from "react";

import DomeGallery from "../fraction/DomGallery";
import { FaArrowDown } from "react-icons/fa6";
import ShinyText from "../fraction/ShinyText";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";

export default function Hero() {
    const scrollToNextSection = () => {
        const nextSection = document.querySelector('#ns');
        console.log('tes')
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
            console.log('tes2')
        }
    };
    SplitText.create(".split", {
        type: "lines",
        autoSplit: true,
        onSplit: (self) => {
            return gsap.from(self.lines, {
            y: 100,
            opacity: 0,
            stagger: 0.05
            });
        }
        });
    return (
        <div className="pt-40" >
            <div className="text-center mx-5 md:mx-10 mb-20">
                <h1 className="font-bold split-text text-3xl md:text-6xl ">Mari 
                    <ShinyText
                    text="Peduli"
                    speed={3}
                    delay={0}
                    color="#016B61"
                    className=" mx-2"
                    shineColor="#ffffff"
                    spread={120}
                    direction="left"
                    yoyo={false}
                    pauseOnHover={false}
                    />
                    Sejak Dini</h1>
                <p className="mt-2 text-gray-400">Terhadap sekitar kita yang lebih membutuhkan dan memerlukan bantuan kita.</p>
                
                {/* <form className="max-w-lg mx-5 md:mx-auto mt-5">
                    <div className="relative flex items-center">
                        <span className="absolute left-4 text-gray-400 pointer-events-none">
                        <svg
                            className="w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                            />
                        </svg>
                        </span>

                        <input
                        type="search"
                        placeholder="Cari berita bencana disini"
                        className="
                            w-full
                            h-12
                            pl-11
                            pr-24
                            bg-white
                            rounded-full
                            border border-gray-200
                            text-sm
                            text-gray-700
                            placeholder-gray-400
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#016B61]
                            focus:border-[#016B61]
                            
                        "
                        />

                        <div className="absolute
                            right-1.5">

                            <button
                            type="button"
                            className="
                                h-9
                                cursor-pointer
                                px-5
                                rounded-full
                                bg-[#016B61]
                                text-white
                                text-sm
                                font-medium
                                hover:bg-[#016B61]
                                btn-border-reveal
                                z-10
                            "
                            onClick={() => alert('w')}
                            >
                            Temukan
                            </button>
                        </div>
                    </div>
                </form> */}
                <div className="flex flex-col md:flex-row gap-3 w-full justify-center items-center mt-5">
                    <button onClick={() => window.location.href ='/donasi'} className="btn-border-reveal z-10 bg-primary cursor-pointer px-6 py-3 text-white rounded-full">Mulai Donasi</button>
                    <button onClick={() => window.location.href ='/donasi'} className="btn-border-reveal2 px-8 py-3 bg-gray-50 dark:bg-gray-900 dark:border-gray-800 cursor-pointer border border-gray-200 rounded-full z-10">Jelajahi</button>
                </div>

            </div>

            <section style={{ width: '100vw' }} className="mt-5 h-[80vh] md:h-[100vh] relative">
                <DomeGallery />
                
                <div 
                className='absolute con-btn-ai md:hidden flex w-full justify-center items-center' 
                style={{
                    left: "0", 
                    top: "140px", 
                    zIndex: ""
                }}
                >
                    <div className="w-full flex justify-center items-center">
                        <div 
                            className='rounded-md cursor-pointer btn-ai flex items-center justify-center text-white shadow-sm bg-[#016B61] dark:bg-[#016B61]' 
                            onClick={() => scrollToNextSection()}
                        >
                            <FaArrowDown />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}