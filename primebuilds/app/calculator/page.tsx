import React from "react";
import Link from "next/link";
import { Calculator, ShieldCheck, Ruler, CheckCircle2, ArrowRight } from "lucide-react";
import CostCalculator from "@/components/CostCalculator";
import BoroughGrid from "@/components/BoroughGrid";

export default function CalculatorPage() {
  return (
    <div className="space-y-16 py-10">
      {/* Header */}
      <section className="site-container">
        <div 
          className="neu-box p-8 md:p-14 bg-blueprint-grid border border-blue-200"
          style={{ backgroundColor: "#ffffff", borderRadius: "12px" }}
        >
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="arch-tag">
                <Calculator size={13} className="text-blue-700" />
                London Construction Estimator
              </span>
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                TRANSPARENT FINANCIAL PLANNING
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-950 mb-4 tracking-tight">
              London Project Cost Calculator
            </h1>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6">
              Estimate your residential extension, loft conversion, full house refurbishment, or commercial fit-out across London. Our algorithmic pricing reflects current London materials, structural steel tariffs, and skilled labor rates.
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-bold text-blue-900">
              <span className="p-2 bg-blue-50 border border-blue-200 rounded" style={{ borderRadius: "4px" }}>
                Live Greater London Rates
              </span>
              <span className="p-2 bg-blue-50 border border-blue-200 rounded" style={{ borderRadius: "4px" }}>
                Borough-Specific Planning Adjustments
              </span>
              <span className="p-2 bg-blue-50 border border-blue-200 rounded" style={{ borderRadius: "4px" }}>
                Fixed-Price JCT Tender Guarantee
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Tool */}
      <section className="site-container">
        <CostCalculator />
      </section>

      {/* Estimator Explanation & Cost Breakdown Guide */}
      <section className="site-container">
        <div className="p-8 md:p-12 bg-white border border-blue-200" style={{ borderRadius: "12px", boxShadow: "var(--neu-raised-sm)" }}>
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mb-2">
              Understanding London Construction Cost Breakdown
            </h2>
            <p className="text-sm text-slate-600">
              Unlike generic UK builders, London building work involves distinct factors such as party wall negotiations, London clay subsoil foundations, parking suspensions, and conservation controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-700">
            <div className="p-4 bg-slate-50 border border-slate-200" style={{ borderRadius: "6px" }}>
              <h4 className="font-bold text-blue-950 text-base mb-2">Substructure & Steels (~30%)</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-0">
                Foundations, groundworks, RSJ steel craning, structural openings, and party wall beam pockets designed by certified engineers.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200" style={{ borderRadius: "6px" }}>
              <h4 className="font-bold text-blue-950 text-base mb-2">MEP & Envelope (~40%)</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-0">
                Crittall glazing, flat roof single-ply membranes, Part L acoustic insulation, zoned underfloor heating, and electrical circuitry.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200" style={{ borderRadius: "6px" }}>
              <h4 className="font-bold text-blue-950 text-base mb-2">Architectural Finishes (~30%)</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-0">
                Bespoke joinery, Calacatta marble waterfalls, airless spray painting, designer sanitaryware, and smart lighting controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Borough Coverage */}
      <section className="site-container">
        <BoroughGrid />
      </section>
    </div>
  );
}
