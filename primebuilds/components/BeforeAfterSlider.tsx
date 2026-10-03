"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SlidersHorizontal, MapPin } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  title: string;
  location: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  title,
  location,
  beforeLabel = "Prior Raw Shell",
  afterLabel = "Completed Prime Build"
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div 
      className="neu-box overflow-hidden relative"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #cbd5e1",
        borderRadius: "8px"
      }}
    >
      {/* Visual Header */}
      <div className="p-3.5 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h4 className="text-sm sm:text-base font-bold text-blue-950 mb-0">{title}</h4>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin size={11} className="text-blue-600" />
            {location}
          </span>
        </div>
        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200" style={{ borderRadius: "3px" }}>
          Slide to Compare
        </span>
      </div>

      {/* Comparison Frame */}
      <div className="relative w-full aspect-[16/10] overflow-hidden select-none">
        {/* 'After' Image (Full Base - Completed Luxury Prime Build) */}
        <Image
          src={afterImage}
          alt={`Completed: ${title}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute top-3 right-3 z-20 px-2.5 py-1 bg-blue-900 text-white text-[10px] font-mono font-bold tracking-wider uppercase" style={{ borderRadius: "3px" }}>
          {afterLabel}
        </div>

        {/* 'Before' Image (Clipped Left Layer - Actual Raw Gutted Shell Without Fittings) */}
        <div
          className="absolute inset-0 z-10 overflow-hidden"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
          }}
        >
          <Image
            src={beforeImage}
            alt={`Before: ${title}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          
          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-mono font-bold tracking-wider uppercase" style={{ borderRadius: "3px" }}>
            {beforeLabel}
          </div>
        </div>

        {/* Divider Handle Line */}
        <div
          className="absolute top-0 bottom-0 z-30 w-0.5 bg-white cursor-ew-resize shadow-md"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-blue-700 text-white flex items-center justify-center shadow-lg border-2 border-white handle-pulse" style={{ borderRadius: "4px" }}>
            <SlidersHorizontal size={13} />
          </div>
        </div>

        {/* Invisible Range Input for Dragging */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          className="absolute inset-0 opacity-0 cursor-ew-resize z-40 w-full h-full"
          aria-label="Drag before and after transformation slider"
        />
      </div>
    </div>
  );
}
