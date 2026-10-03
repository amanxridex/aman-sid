import React from "react";
import Link from "next/link";
import { 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Ruler, 
  FileCheck 
} from "lucide-react";

export default function ProcessPage() {
  const steps = [
    {
      num: "01",
      title: "Discovery & Site Audit",
      timeline: "Days 1 – 3",
      summary: "Complimentary on-site London property inspection, spatial laser measurements, and initial council planning check."
    },
    {
      num: "02",
      title: "Design & Structural Engineering",
      timeline: "Weeks 1 – 4",
      summary: "Full CAD drawings, structural steel RSJ beam calculations, Party Wall notices, and building regulations filing."
    },
    {
      num: "03",
      title: "Fixed-Price Tender",
      timeline: "Week 5",
      summary: "Exhaustive schedule of works with price and program lock under standard JCT contract terms."
    },
    {
      num: "04",
      title: "Master Construction",
      timeline: "Weeks 6 – Completion",
      summary: "Dedicated London site supervisor managing daily trades, milestones, and council building control inspections."
    },
    {
      num: "05",
      title: "Handover & Warranty",
      timeline: "Final Milestone",
      summary: "Zero-snag inspection, Building Control completion certificate, and 10-Year Insurance Structural Warranty handover."
    }
  ];

  return (
    <div className="space-y-16 py-10">
      {/* Header */}
      <section className="site-container">
        <div className="max-w-2xl">
          <span className="arch-tag mb-2">
            <Clock size={12} className="text-blue-700" />
            Methodology
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-950 mb-3 tracking-tight">
            The 5-Step London Delivery Pipeline
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            A structured, transparent framework designed to eliminate surprises, control budgets, and deliver on schedule.
          </p>
        </div>
      </section>

      {/* Step Pipeline Cards */}
      <section className="site-container">
        <div className="space-y-4">
          {steps.map((s) => (
            <div
              key={s.num}
              className="neu-box p-6 md:p-8 border border-slate-200"
              style={{ backgroundColor: "#ffffff", borderRadius: "8px" }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start md:items-center gap-4">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-blue-900 shrink-0">
                    {s.num}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg sm:text-xl font-bold text-blue-950 mb-0">
                        {s.title}
                      </h3>
                      <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5" style={{ borderRadius: "3px" }}>
                        {s.timeline}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mb-0 max-w-2xl font-normal">
                      {s.summary}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <Link
                    href="/contact"
                    className="btn-secondary text-xs uppercase tracking-wider font-semibold py-2 px-3 inline-flex items-center gap-1.5"
                    style={{ borderRadius: "4px" }}
                  >
                    <span>Book Audit</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Guarantees */}
      <section className="site-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white border border-slate-200" style={{ borderRadius: "6px", boxShadow: "var(--neu-raised-sm)" }}>
            <ShieldCheck size={20} className="text-blue-700 mb-2" />
            <h4 className="text-sm font-bold text-blue-950 mb-1">Fixed-Price Contracts</h4>
            <p className="text-xs text-slate-500 mb-0 leading-relaxed">
              Standard JCT agreement with locked-in rates. Zero surprise invoices.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200" style={{ borderRadius: "6px", boxShadow: "var(--neu-raised-sm)" }}>
            <Ruler size={20} className="text-blue-700 mb-2" />
            <h4 className="text-sm font-bold text-blue-950 mb-1">Dedicated Supervision</h4>
            <p className="text-xs text-slate-500 mb-0 leading-relaxed">
              Full-time London site supervisor coordinating daily trades.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200" style={{ borderRadius: "6px", boxShadow: "var(--neu-raised-sm)" }}>
            <FileCheck size={20} className="text-blue-700 mb-2" />
            <h4 className="text-sm font-bold text-blue-950 mb-1">10-Year Warranty</h4>
            <p className="text-xs text-slate-500 mb-0 leading-relaxed">
              Insurance-backed structural guarantee upon Building Control sign-off.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
