"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Wrench, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Ruler
} from "lucide-react";
import { servicesData } from "@/data/servicesData";

const categories = ["All", "Residential", "Commercial", "Conversion", "Refurbishment"];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredServices = activeCategory === "All"
    ? servicesData
    : servicesData.filter(s => s.category === activeCategory);

  return (
    <div className="space-y-16 py-10">
      {/* Services Minimalist Header */}
      <section className="site-container">
        <div className="max-w-2xl">
          <span className="arch-tag mb-2">
            <Wrench size={12} className="text-blue-700" />
            Disciplines
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-950 mb-3 tracking-tight">
            Architectural Services
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-normal">
            Turnkey building solutions engineered for London properties. All projects feature fixed-price tenders, council planning management, and a 10-Year Insurance Structural Warranty.
          </p>

          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
            <span className="p-2 bg-white border border-slate-200" style={{ borderRadius: "4px" }}>
              10-Year Insurance Warranty
            </span>
            <span className="p-2 bg-white border border-slate-200" style={{ borderRadius: "4px" }}>
              London Building Control Sign-Off
            </span>
            <span className="p-2 bg-white border border-slate-200" style={{ borderRadius: "4px" }}>
              Dedicated Site Supervisor
            </span>
          </div>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <section className="site-container">
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 font-mono">
            Filter:
          </span>
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                style={{
                  backgroundColor: isSelected ? "#0f2765" : "#ffffff",
                  color: isSelected ? "#ffffff" : "#475569",
                  border: isSelected ? "1px solid #0a192f" : "1px solid #cbd5e1",
                  borderRadius: "4px"
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Services Grid (Apple-Level Minimalist Layout) */}
      <section className="site-container space-y-10">
        {filteredServices.map((service, index) => (
          <div
            key={service.id}
            id={service.id}
            className="neu-box p-6 md:p-8 border border-slate-200 scroll-mt-24"
            style={{ backgroundColor: "#ffffff", borderRadius: "10px" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Image & Key Stats (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="relative w-full aspect-[16/11] overflow-hidden" style={{ borderRadius: "6px" }}>
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-blue-950 text-white text-[10px] font-mono font-bold uppercase" style={{ borderRadius: "3px" }}>
                    {service.category}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-slate-50 border border-slate-200" style={{ borderRadius: "4px" }}>
                    <span className="text-[10px] text-slate-400 block uppercase">Timeline</span>
                    <span className="font-bold text-blue-950">{service.timeline}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200" style={{ borderRadius: "4px" }}>
                    <span className="text-[10px] text-slate-400 block uppercase">London Rate</span>
                    <span className="font-bold text-blue-950">{service.avgCostLondon}</span>
                  </div>
                </div>
              </div>

              {/* Scope & Details (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-700 font-semibold mb-1">
                    <span>DISCIPLINE 0{index + 1}</span>
                    <span>•</span>
                    <span>LONDON, UK</span>
                  </div>
                  <h2 className="text-2xl font-bold text-blue-950 mb-2">
                    {service.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {service.shortDesc}
                  </p>
                </div>

                {/* Features Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {service.features.slice(0, 4).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 bg-slate-50 border border-slate-100" style={{ borderRadius: "4px" }}>
                      <CheckCircle2 size={13} className="text-blue-600 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    href={`/contact?service=${service.id}`}
                    className="btn-primary text-xs uppercase tracking-wider font-semibold py-2.5 px-4 flex items-center justify-center gap-2"
                    style={{ borderRadius: "4px" }}
                  >
                    <span>Inquire For This Service</span>
                    <ArrowRight size={13} />
                  </Link>

                  <Link
                    href="/calculator"
                    className="btn-secondary text-xs uppercase tracking-wider font-semibold py-2.5 px-4 flex items-center justify-center gap-2"
                    style={{ borderRadius: "4px" }}
                  >
                    <span>Estimate Cost</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
