"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, CheckCircle2, ShieldCheck, HelpCircle, Layers, SlidersHorizontal } from "lucide-react";

interface ProjectOption {
  id: string;
  name: string;
  baseRatePerSqm: number;
  baseWeeks: number;
  minArea: number;
  maxArea: number;
  defaultArea: number;
  description: string;
}

const projectOptions: ProjectOption[] = [
  {
    id: "refurbishment",
    name: "Full House Refurbishment",
    baseRatePerSqm: 1900,
    baseWeeks: 12,
    minArea: 50,
    maxArea: 450,
    defaultArea: 140,
    description: "Complete interior overhaul, structural openings, rewiring, plumbing & fine joinery."
  },
  {
    id: "extension",
    name: "Architectural Extension",
    baseRatePerSqm: 2400,
    baseWeeks: 10,
    minArea: 20,
    maxArea: 150,
    defaultArea: 45,
    description: "Single or double storey rear/side-return extension with Crittall glazing and concrete foundations."
  },
  {
    id: "loft",
    name: "Loft & Attic Conversion",
    baseRatePerSqm: 1650,
    baseWeeks: 8,
    minArea: 25,
    maxArea: 100,
    defaultArea: 40,
    description: "Mansard, Dormer, or Velux conversion with master suite en-suite wetroom and rooflights."
  },
  {
    id: "commercial",
    name: "Commercial Office / Retail Fit-Out",
    baseRatePerSqm: 1100,
    baseWeeks: 8,
    minArea: 80,
    maxArea: 600,
    defaultArea: 220,
    description: "Cat A / Cat B turnkey workplace fitout with acoustic glazing, MEP and custom reception."
  }
];

const finishTiers = [
  { id: "premium", name: "Premium Architectural", multiplier: 1.0, desc: "High-spec porcelain, engineered oak, integrated branded appliances" },
  { id: "luxury", name: "Luxury Bespoke", multiplier: 1.25, desc: "Italian marble slabs, smart home automation, custom fluted cabinetry" },
  { id: "ultra", name: "Ultra-Prime London", multiplier: 1.55, desc: "Heritage restoration, specialist microcement, triple glazing, bespoke brassware" }
];

const londonBoroughFactors: Record<string, { factor: number; label: string }> = {
  "rbkc": { factor: 1.12, label: "Kensington & Chelsea (High Conservation)" },
  "westminster": { factor: 1.10, label: "Westminster & Mayfair (Strict Access)" },
  "camden": { factor: 1.05, label: "Camden & Regents Park" },
  "islington": { factor: 1.03, label: "Islington & Hackney" },
  "richmond": { factor: 1.04, label: "Richmond & Wandsworth" },
  "greater": { factor: 1.00, label: "Other London Boroughs" }
};

export default function CostCalculator() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("refurbishment");
  const [areaSqm, setAreaSqm] = useState<number>(140);
  const [selectedFinish, setSelectedFinish] = useState<string>("luxury");
  const [selectedBorough, setSelectedBorough] = useState<string>("rbkc");

  const currentProject = useMemo(() => {
    return projectOptions.find(p => p.id === selectedProjectId) || projectOptions[0];
  }, [selectedProjectId]);

  const currentTier = useMemo(() => {
    return finishTiers.find(t => t.id === selectedFinish) || finishTiers[1];
  }, [selectedFinish]);

  const calculations = useMemo(() => {
    const boroughMultiplier = londonBoroughFactors[selectedBorough]?.factor || 1.0;
    const baseCost = areaSqm * currentProject.baseRatePerSqm * currentTier.multiplier * boroughMultiplier;
    
    // Low and High bounds
    const costLow = Math.round((baseCost * 0.93) / 500) * 500;
    const costHigh = Math.round((baseCost * 1.08) / 500) * 500;

    // Timeline calculation
    const calculatedWeeks = Math.max(
      currentProject.baseWeeks,
      Math.round(currentProject.baseWeeks + (areaSqm / 25))
    );

    // VAT & Building Control allowance
    const vatEstimate = Math.round(baseCost * 0.2);
    const statutoryAllowance = Math.round(baseCost * 0.04);

    return {
      costLow,
      costHigh,
      weeks: calculatedWeeks,
      vatEstimate,
      statutoryAllowance,
      sqft: Math.round(areaSqm * 10.764)
    };
  }, [areaSqm, currentProject, currentTier, selectedBorough]);

  const handleProjectChange = (projId: string) => {
    setSelectedProjectId(projId);
    const proj = projectOptions.find(p => p.id === projId);
    if (proj) {
      setAreaSqm(proj.defaultArea);
    }
  };

  return (
    <div 
      className="neu-box p-6 md:p-10 border border-blue-200"
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px"
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-blue-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="arch-tag">
              <Calculator size={13} className="text-blue-700" />
              London Tender Tool
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              REAL-TIME ESTIMATOR
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-blue-950 mb-0">
            Interactive London Build Cost Calculator
          </h3>
        </div>
        <div className="text-xs text-slate-500 bg-blue-50 border border-blue-200 p-2.5 rounded font-medium" style={{ borderRadius: "6px" }}>
          Calculated using live London material and labor indices.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Configuration Controls (Left 7 cols) */}
        <div className="lg:col-span-7 space-y-7">
          {/* Step 1: Select Project Discipline */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-blue-950 mb-3">
              1. Select Project Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {projectOptions.map((proj) => {
                const isSelected = selectedProjectId === proj.id;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => handleProjectChange(proj.id)}
                    className="p-3.5 text-left transition-all duration-200"
                    style={{
                      backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
                      border: isSelected ? "2px solid #1d4ed8" : "1px solid #cbd5e1",
                      borderRadius: "6px",
                      boxShadow: isSelected ? "0 4px 12px rgba(29, 78, 216, 0.15)" : "none"
                    }}
                  >
                    <span className="font-bold text-sm text-blue-950 block mb-1">
                      {proj.name}
                    </span>
                    <span className="text-xs text-slate-600 block line-clamp-2">
                      {proj.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Area Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-blue-950">
                2. Approximate Floor Area
              </label>
              <div className="text-sm font-bold text-blue-900 bg-blue-100 px-2.5 py-1" style={{ borderRadius: "4px" }}>
                {areaSqm} m² <span className="text-xs text-slate-500 font-normal">({calculations.sqft} sq ft)</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-blue-200" style={{ borderRadius: "6px" }}>
              <input
                type="range"
                min={currentProject.minArea}
                max={currentProject.maxArea}
                step={5}
                value={areaSqm}
                onChange={(e) => setAreaSqm(Number(e.target.value))}
                className="w-full accent-blue-700 cursor-pointer h-2 bg-blue-200 rounded-none"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
                <span>Min: {currentProject.minArea} m²</span>
                <span>Average London Terraced: ~120 m²</span>
                <span>Max: {currentProject.maxArea} m²</span>
              </div>
            </div>
          </div>

          {/* Step 3: Finish Tier */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-blue-950 mb-3">
              3. Specification & Material Finish
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {finishTiers.map((tier) => {
                const isSelected = selectedFinish === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedFinish(tier.id)}
                    className="p-3 text-left transition-all"
                    style={{
                      backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
                      border: isSelected ? "2px solid #1d4ed8" : "1px solid #cbd5e1",
                      borderRadius: "6px"
                    }}
                  >
                    <span className="font-bold text-xs text-blue-950 block mb-1">{tier.name}</span>
                    <span className="text-[11px] text-slate-600 block">{tier.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: London Borough */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-blue-950 mb-2">
              4. London Borough / Location
            </label>
            <select
              value={selectedBorough}
              onChange={(e) => setSelectedBorough(e.target.value)}
              className="w-full p-3 text-sm font-semibold text-blue-950 bg-white border border-blue-200"
              style={{ borderRadius: "6px" }}
            >
              {Object.entries(londonBoroughFactors).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Reflects parking suspension tariffs, conservation area compliance, and site access constraints.
            </p>
          </div>
        </div>

        {/* Results Card (Right 5 cols) */}
        <div className="lg:col-span-5">
          <div 
            className="p-6 md:p-8 bg-blue-950 text-white border-2 border-blue-800"
            style={{ borderRadius: "10px", boxShadow: "0 16px 32px rgba(15, 39, 101, 0.25)" }}
          >
            <div className="flex items-center justify-between pb-4 border-b border-blue-800 mb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                ESTIMATED LONDON TENDER
              </span>
              <span className="px-2 py-0.5 bg-blue-800 text-blue-200 text-[11px] font-semibold" style={{ borderRadius: "3px" }}>
                Fixed-Price Guide
              </span>
            </div>

            {/* Main Price Display */}
            <div className="mb-6">
              <span className="text-xs text-blue-300 uppercase tracking-wider block mb-1">
                Estimated Construction Cost
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                £{calculations.costLow.toLocaleString()} – £{calculations.costHigh.toLocaleString()}
              </div>
              <span className="text-xs text-blue-300 block mt-1">
                Excludes statutory VAT (Estimated £{calculations.vatEstimate.toLocaleString()})
              </span>
            </div>

            {/* Project Metrics Summary */}
            <div className="space-y-3 py-4 border-y border-blue-900 text-xs">
              <div className="flex justify-between items-center text-blue-200">
                <span>Estimated Program Length:</span>
                <span className="font-bold text-white font-mono">{calculations.weeks} Weeks</span>
              </div>
              <div className="flex justify-between items-center text-blue-200">
                <span>Planning & Statutory Allowance:</span>
                <span className="font-bold text-white font-mono">~£{calculations.statutoryAllowance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-blue-200">
                <span>Insurance Guarantee Included:</span>
                <span className="font-bold text-sky-400 font-mono">10 Years</span>
              </div>
              <div className="flex justify-between items-center text-blue-200">
                <span>Survey & Feasibility:</span>
                <span className="font-bold text-sky-400 font-mono">Complimentary</span>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href={`/contact?service=${selectedProjectId}&area=${areaSqm}&borough=${selectedBorough}`}
                className="w-full btn-primary text-center flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-bold py-3.5"
                style={{ 
                  backgroundColor: "#2563eb", 
                  borderColor: "#3b82f6",
                  borderRadius: "6px"
                }}
              >
                <span>Lock In Free Site Audit</span>
                <ArrowRight size={15} />
              </Link>
              <p className="text-[11px] text-blue-300 text-center mt-3 mb-0">
                No obligation. Site audit conducted by Prime Builds Senior Surveyors in London.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
