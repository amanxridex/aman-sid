import React from "react";
import Image from "next/image";

interface LightningLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showImage?: boolean;
  className?: string;
}

export function LightningLogo({ size = "md", showImage = true, className = "" }: LightningLogoProps) {
  const sizeMap = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-20 h-20",
  };

  const pxMap = {
    sm: 24,
    md: 32,
    lg: 48,
    xl: 80,
  };

  if (showImage) {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-xl overflow-hidden shadow-xs border border-blue-100 bg-white ${sizeMap[size]} ${className}`}
      >
        <Image
          src="/lightning.jpg"
          alt="Divya AI Lightning"
          width={pxMap[size]}
          height={pxMap[size]}
          className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>
    );
  }

  // Fallback crisp SVG vector lightning
  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs ${sizeMap[size]} ${className}`}
    >
      <svg
        className="w-3/5 h-3/5 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
      </svg>
    </div>
  );
}
