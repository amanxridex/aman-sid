"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function EditorialBanner() {
  const { storeSettings } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef(null);
  const [isInReadingView, setIsInReadingView] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsInReadingView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInReadingView(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1,
        rootMargin: "-15% 0px -25% 0px",
      }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const tagline = storeSettings?.manifesto_tagline || "OUR STORY // STAY COZY, STAY YOU";
  const title = storeSettings?.manifesto_title || "OUR STORY.";
  const text =
    storeSettings?.manifesto_text ||
    "There was always something comforting about the little things. A favourite cup waiting on the kitchen shelf. A vase catching the afternoon light. A plate brought out when friends stayed a little longer than planned. The small objects that quietly turn a house into a place that feels like yours.";
  const buttonText = storeSettings?.manifesto_button_text || "Read More →";
  const buttonUrl = storeSettings?.manifesto_button_url || "/pages/our-story";
  const spotlightImage =
    storeSettings?.manifesto_image ||
    "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/Product9-01.png?v=1784242846";
  const spotlightTitle =
    storeSettings?.manifesto_product_title ||
    "TT-251 Ceramic Chicken Condiment Jar with Spoon";
  const spotlightUrl =
    storeSettings?.manifesto_product_url ||
    "/products/tt-251-ceramic-chicken-condiment-jar-with-spoon";

  return (
    <section ref={sectionRef} className="bg-[#121212] text-[#fffdf8] py-16 md:py-24 border-y border-neutral-800">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
        
        {/* Left Editorial Narrative Typography */}
        <div className="lg:col-span-7 space-y-6">
          <span className="text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase block">
            {tagline}
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[0.95] whitespace-pre-line text-white">
            {title}
          </h2>

          <div className="space-y-4 max-w-xl text-neutral-300 font-normal leading-relaxed text-sm md:text-base">
            <p>
              {text}
            </p>

            {/* Expandable story continuation for interested readers without taking too much homepage space */}
            {isExpanded && (
              <div className="space-y-3 pt-3 border-t border-neutral-800 text-sm text-neutral-300 leading-relaxed transition-all duration-300">
                <p className="text-base sm:text-lg font-serif italic text-white border-l-2 border-[#001540] pl-4 py-1">
                  The Cozy Theory was born from that feeling.
                </p>
                <p>
                  We believe a home doesn&apos;t have to be perfect to be beautiful. It just needs to feel like you. So we curate pieces that bring warmth, character, and charm into everyday spaces — from the table where stories are shared to the quiet corners that belong only to you.
                </p>
                <div className="pt-1">
                  <Link
                    href="/pages/our-story"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-white uppercase tracking-wider underline underline-offset-4 transition-colors"
                  >
                    <span>Read Full Story Page with Chapters &amp; Philosophy →</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={buttonUrl}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#001540] text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-[#002266] transition-colors shadow-md border border-[#001540]"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 px-4 py-3.5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-mono tracking-wider uppercase border border-white/15 transition-colors cursor-pointer"
            >
              {isExpanded ? (
                <>
                  <span>Show Less</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Quick Read Here</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Feature Showcase Box */}
        <div className="lg:col-span-5 relative">
          <Link href={spotlightUrl} className="block aspect-[4/5] bg-neutral-900 border border-neutral-700 overflow-hidden relative group">
            <img
              src={spotlightImage}
              alt={spotlightTitle}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/80 backdrop-blur-md border border-neutral-700">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-1">
                Spotlight Object
              </span>
              <p className="text-xs font-mono font-bold uppercase text-white">
                {spotlightTitle}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

