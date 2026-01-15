"use client";

import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useEffect, useCallback } from "react";

interface SlideData {
  src: string;
}

interface SlideProps {
  src: string;
  isActive: boolean;
  index: number;
}

const Slide = ({ src, isActive }: SlideProps) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;
      
      const x = xRef.current;
      const y = yRef.current;
      
      slideRef.current.style.transform = isActive 
        ? `translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)`
        : 'none';
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isActive]);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!slideRef.current || !isActive) return;
    
    const r = slideRef.current.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
    
    if (slideRef.current) {
      slideRef.current.style.setProperty("--x", `${xRef.current}px`);
      slideRef.current.style.setProperty("--y", `${yRef.current}px`);
    }
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  return (
    <div
      ref={slideRef}
      className="flex-shrink-0 w-[320px] h-[460px] rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer will-change-transform"
      style={{
        transform: isActive ? 'scale(1)' : 'scale(0.85)',
        opacity: isActive ? 1 : 0.6,
        filter: isActive ? 'none' : 'brightness(0.8)',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), filter 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover"
        draggable={false}
        style={{
          transition: 'transform 0.3s ease',
        }}
      />
    </div>
  );
};

interface CarouselControlProps {
  type: "previous" | "next";
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({ type, title, handleClick }: CarouselControlProps) => {
  return (
    <button
      className={`w-12 h-12 flex items-center justify-center bg-background border border-gray-200 rounded-full focus:outline-none active:scale-95 transition-all duration-200 ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
      aria-label={title}
    >
      <IconArrowNarrowRight className="text-gray-700" size={24} />
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
  autoSlideInterval?: number;
}

export function Carousel({ 
  slides, 
  autoSlideInterval = 4000 
}: CarouselProps) {
  const extendedSlides = [...slides, ...slides, ...slides];
  const middleIndex = slides.length;
  
  const [current, setCurrent] = useState(middleIndex);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const slideWidth = 320;
  const gap = 20;
  const totalWidth = slideWidth + gap;

  // Auto-slide function
  const startAutoSlide = useCallback(() => {
    if (isDragging) return;
    
    if (autoSlideTimerRef.current) {
      clearTimeout(autoSlideTimerRef.current);
    }
    
    autoSlideTimerRef.current = setTimeout(() => {
      if (!isDragging) {
        handleNext();
      }
      startAutoSlide();
    }, autoSlideInterval);
  }, [isDragging, autoSlideInterval]);

  // Initialize auto-slide
  useEffect(() => {
    startAutoSlide();
    
    return () => {
      if (autoSlideTimerRef.current) {
        clearTimeout(autoSlideTimerRef.current);
      }
    };
  }, [startAutoSlide]);

  // Reset auto-slide timer when current changes
  useEffect(() => {
    if (!isDragging) {
      startAutoSlide();
    }
  }, [current, isDragging, startAutoSlide]);

  const getTrackOffset = useCallback(() => {
    const baseOffset = current * totalWidth;
    const dragOffsetValue = isDragging ? dragOffset : 0;
    return `calc(50% - ${baseOffset}px + ${dragOffsetValue}px)`;
  }, [current, totalWidth, isDragging, dragOffset]);

  // Infinite loop reset
  useEffect(() => {
    if (!isTransitioning || isDragging) return;
    
    const timer = setTimeout(() => {
      if (current >= slides.length * 2 - 2) {
        setIsTransitioning(false);
        setCurrent(middleIndex);
        setTimeout(() => setIsTransitioning(true), 16);
      } else if (current <= slides.length - 2) {
        setIsTransitioning(false);
        setCurrent(middleIndex);
        setTimeout(() => setIsTransitioning(true), 16);
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [current, slides.length, middleIndex, isTransitioning, isDragging]);

  // Drag handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setIsTransitioning(false);
    
    if (autoSlideTimerRef.current) {
      clearTimeout(autoSlideTimerRef.current);
    }
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    setIsTransitioning(true);
    
    const threshold = slideWidth / 3;
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    
    setDragOffset(0);
    startAutoSlide();
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrent(prev => prev + 1);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrent(prev => prev - 1);
  };

  // Mouse and touch events
  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (!carouselElement) return;

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      handleDragStart(e.clientX);
    };

    const onMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientX);
    };

    const onMouseUp = () => {
      handleDragEnd();
    };

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleDragStart(touch.clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleDragMove(touch.clientX);
    };

    const onTouchEnd = () => {
      handleDragEnd();
    };

    carouselElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    
    carouselElement.addEventListener('touchstart', onTouchStart);
    carouselElement.addEventListener('touchmove', onTouchMove);
    carouselElement.addEventListener('touchend', onTouchEnd);

    return () => {
      carouselElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      
      carouselElement.removeEventListener('touchstart', onTouchStart);
      carouselElement.removeEventListener('touchmove', onTouchMove);
      carouselElement.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, dragOffset]);

  const getActualActiveIndex = () => {
    return ((current % slides.length) + slides.length) % slides.length;
  };

  const getTransitionStyle = () => {
    if (isDragging) {
      return 'none';
    }
    
    if (isTransitioning) {
      return 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
    
    return 'none';
  };

  return (
    <section className="relative w-full overflow-hidden py-16" ref={carouselRef}>
      {/* Gradient masks */}
      <div 
        className="pointer-events-none absolute left-0 top-0 z-20 h-full w-48 bg-gradient-to-r from-background via-background/90 to-transparent"
        aria-hidden="true"
      />
      <div 
        className="pointer-events-none absolute right-0 top-0 z-20 h-full w-48 bg-gradient-to-l from-background via-background/90 to-transparent"
        aria-hidden="true"
      />
      
      {/* Carousel track */}
      <div className="relative select-none">
        <div
          ref={trackRef}
          className="flex items-center gap-11 will-change-transform"
          style={{
            transform: `translateX(${getTrackOffset()})`,
            transition: getTransitionStyle(),
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          {extendedSlides.map((slide, index) => (
            <Slide
              key={`${index}-${slide.src}`}
              src={slide.src}
              isActive={index === current}
              index={index}
            />
          ))}
        </div>
        
        {/* Navigation controls */}
        <div className="absolute -bottom-16 left-1/2 flex -translate-x-1/2 gap-4 z-30">
          <CarouselControl
            type="previous"
            title="Go to previous slide"
            handleClick={handlePrev}
          />
          
          <div className="flex items-center gap-1 mx-4">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === getActualActiveIndex() 
                    ? 'bg-gray-800 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => {
                  const targetIndex = middleIndex + index;
                  setIsTransitioning(true);
                  setCurrent(targetIndex);
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <CarouselControl
            type="next"
            title="Go to next slide"
            handleClick={handleNext}
          />
        </div>
      </div>
    </section>
  );
}