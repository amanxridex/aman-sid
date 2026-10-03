"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2
} from "lucide-react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { projectsData } from "@/data/projectsData";

const categories = ["All", "Residential", "Commercial", "Conversion", "Refurbishment"];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredProjects = selectedCategory === "All"
    ? projectsData
    : projectsData.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-16 py-10">
      {/* Portfolio Header */}
      <section className="site-container">
        <div className="max-w-2xl">
          <span className="arch-tag mb-2">
            <Building2 size={12} className="text-blue-700" />
            Portfolio
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-950 mb-3 tracking-tight">
            Selected London Builds
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            A curated selection of residential extensions, luxury townhouse refurbishments, and commercial fit-outs across Greater London.
          </p>
        </div>
      </section>

      {/* Category Filter Controls */}
      <section className="site-container">
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 font-mono">
            Filter:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
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

      {/* Before & After Interactive Showcase */}
      <section className="site-container">
        <div className="mb-6">
          <span className="arch-tag mb-1.5">Interactive Studies</span>
          <h2 className="text-2xl font-bold text-blue-950">
            Before & After Transformations
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BeforeAfterSlider
            beforeImage="/images/camden_kitchen_before.jpg"
            afterImage="/images/london_kitchen_extension.jpg"
            title="Camden Victorian Rear & Kitchen Extension"
            location="Camden, London"
            beforeLabel="Prior Raw Shell"
            afterLabel="Completed Prime Build"
          />

          <BeforeAfterSlider
            beforeImage="/images/regents_loft_before.jpg"
            afterImage="/images/london_loft_conversion.jpg"
            title="Regents Park Mansard Master Loft Suite"
            location="Regents Park, London"
            beforeLabel="Prior Raw Attic"
            afterLabel="Completed Master Suite"
          />
        </div>
      </section>

      {/* Minimalist Case Studies Grid */}
      <section className="site-container space-y-8">
        <div className="pb-3 border-b border-slate-200 flex justify-between items-end">
          <h2 className="text-2xl font-bold text-blue-950">
            Completed Projects
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {filteredProjects.length} Projects
          </span>
        </div>

        <div className="space-y-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="neu-box p-6 md:p-8 border border-slate-200"
              style={{ backgroundColor: "#ffffff", borderRadius: "10px" }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Visual Showcase (5 cols) */}
                <div className="lg:col-span-5">
                  <div className="relative w-full aspect-[16/11] overflow-hidden" style={{ borderRadius: "6px" }}>
                    <Image
                      src={project.imageAfter}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-blue-950 text-white text-[10px] font-mono font-bold uppercase" style={{ borderRadius: "3px" }}>
                      {project.category}
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-blue-950/90 text-white p-2 text-xs flex justify-between items-center" style={{ borderRadius: "4px" }}>
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin size={11} className="text-sky-300" />
                        {project.location}
                      </span>
                      <span className="font-mono text-[11px]">{project.timeline}</span>
                    </div>
                  </div>
                </div>

                {/* Narrative & Metrics (7 cols) */}
                <div className="lg:col-span-7 space-y-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-700 uppercase block mb-1">
                      {project.borough} • {project.budgetRange}
                    </span>
                    <h3 className="text-xl font-bold text-blue-950 mb-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {project.summary}
                    </p>
                  </div>

                  {/* Clean 4-Metric Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
                    {project.stats.map((s, sIdx) => (
                      <div key={sIdx} className="p-2 bg-slate-50 border border-slate-200" style={{ borderRadius: "4px" }}>
                        <span className="text-[10px] text-slate-400 block uppercase">{s.label}</span>
                        <span className="font-bold text-blue-950">{s.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/contact?project=${project.id}`}
                      className="btn-primary text-xs uppercase tracking-wider font-semibold inline-flex items-center gap-2 py-2 px-4"
                      style={{ borderRadius: "4px" }}
                    >
                      <span>Inquire About Similar Build</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
