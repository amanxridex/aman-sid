"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, Building, Check } from "lucide-react";
import { londonBoroughs } from "@/data/testimonialsData";

export default function BoroughGrid() {
  const [activeBorough, setActiveBorough] = useState<string>(londonBoroughs[0].name);

  return (
    <div className="neu-box p-6 md:p-10 border border-blue-200" style={{ backgroundColor: "#ffffff", borderRadius: "12px" }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-blue-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="arch-tag">
              <MapPin size={12} className="text-blue-700" />
              London Territory
            </span>
            <span className="text-xs font-mono font-bold text-slate-500 uppercase">
              LOCAL PLANNING EXPERTISE
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mb-0">
            Active London Borough Operations
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md m-0">
          Our specialized site managers possess deep familiarity with local council planning officers, party wall regulations, and conservation area guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {londonBoroughs.map((borough) => {
          const isSelected = activeBorough === borough.name;
          return (
            <div
              key={borough.name}
              onClick={() => setActiveBorough(borough.name)}
              className="p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between"
              style={{
                backgroundColor: isSelected ? "#eff6ff" : "#f8fafd",
                border: isSelected ? "2px solid #1d4ed8" : "1px solid #cbd5e1",
                borderRadius: "6px",
                boxShadow: isSelected ? "0 4px 12px rgba(29, 78, 216, 0.12)" : "none"
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5" style={{ borderRadius: "3px" }}>
                    {borough.code}
                  </span>
                  {isSelected && <Check size={14} className="text-blue-700 font-bold" />}
                </div>
                <h4 className="text-sm font-bold text-blue-950 mb-1 leading-snug">
                  {borough.name}
                </h4>
                <span className="text-xs text-slate-500 block">
                  {borough.projects}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between text-xs font-semibold text-blue-800">
                <span>View Permits</span>
                <ArrowRight size={13} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <span>Address: <strong className="text-blue-950 font-bold">London, United Kingdom</strong>. Covering all Greater London postal zones.</span>
        <Link href="/contact" className="text-blue-700 font-bold hover:underline flex items-center gap-1">
          <span>Inquire for your London borough</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
