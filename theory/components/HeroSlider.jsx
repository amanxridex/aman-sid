"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_SLIDES } from "@/lib/products";

export default function HeroSlider({ slides }) {
  const slideList = Array.isArray(slides) && slides.length > 0 ? slides : HERO_SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto advance slides every 6 seconds if multiple slides exist
  useEffect(() => {
    if (slideList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideList.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slideList.length]);

  const nextSlide = () => {
    if (slideList.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slideList.length);
  };

  const prevSlide = () => {
    if (slideList.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slideList.length) % slideList.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (!slideList || slideList.length === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-[#121212] select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-700 ease-out h-[68vh] min-h-[480px] md:h-[82vh] max-h-[820px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slideList.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className="w-full flex-shrink-0 h-full relative flex items-end justify-start"
          >
            {/* Responsive Background Images: Mobile vs Desktop */}
            <picture className="absolute inset-0 w-full h-full">
              {slide.desktopImage && (
                <source media="(min-width: 768px)" srcSet={slide.desktopImage} />
              )}
              <img
                src={slide.desktopImage || slide.mobileImage || "/placeholder.png"}
                alt={slide.title || "The Cozy Theory Banner"}
                className="w-full h-full object-cover object-center brightness-[0.9]"
                loading={idx === 0 ? "eager" : "lazy"}
              />
            </picture>

            {/* Gradient Overlays for optimal editorial readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

            {/* Slide Content */}
            <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 pb-14 md:pb-20 text-[#fffdf8]">
              <div className="max-w-2xl space-y-3 md:space-y-4">
                {slide.subtitle && (
                  <span className="inline-block text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase px-2.5 py-1 bg-white/15 backdrop-blur-md rounded-full border border-white/20">
                    {slide.subtitle}
                  </span>
                )}

                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[1.05]">
                  {slide.title}
                </h1>

                {slide.description && (
                  <p className="text-xs md:text-sm text-neutral-300 font-normal tracking-wide max-w-lg hidden sm:block">
                    {slide.description}
                  </p>
                )}

                {/* Call-to-action buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {slide.ctaText && (
                    <Link
                      href={slide.ctaLink || "/collections/all-products"}
                      className="inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-3.5 bg-[#fffdf8] text-[#121212] text-xs font-mono font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors shadow-lg"
                    >
                      {slide.ctaText}
                    </Link>
                  )}
                  {slide.secondaryCta && (
                    <Link
                      href={slide.secondaryCtaLink || "/collections/all-products"}
                      className="inline-flex items-center justify-center px-5 py-3 md:px-6 md:py-3.5 border border-white/40 text-[#fffdf8] text-xs font-mono tracking-widest uppercase hover:bg-white/10 transition-colors"
                    >
                      {slide.secondaryCta}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Navigation Controls */}
      {slideList.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Pagination Dots / Indicators */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {slideList.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === i ? "w-8 h-1.5 bg-[#fffdf8]" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
