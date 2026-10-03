import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2
} from "lucide-react";
import TiltCard from "@/components/TiltCard";

export default function AboutPage() {
  const values = [
    {
      title: "Architectural Integrity",
      desc: "Balancing London's historic urban fabric with contemporary engineering precision."
    },
    {
      title: "Fixed-Price Tenders",
      desc: "Comprehensive schedules of work with price locks under standard JCT contracts."
    },
    {
      title: "Dedicated Supervision",
      desc: "Every project is led on-site daily by an experienced London Site Supervisor."
    },
    {
      title: "Multi-Year Guarantee",
      desc: "10-Year Insurance-Backed Structural Warranty delivered upon final Building Control sign-off."
    }
  ];

  const stats = [
    { num: "10+", label: "Years in London" },
    { num: "200+", label: "Builds Finished" },
    { num: "100%", label: "Council Sign-Off" },
    { num: "9.9/10", label: "Client Rating" }
  ];

  return (
    <div className="space-y-16 py-10">
      {/* Header */}
      <section className="site-container">
        <div className="max-w-2xl">
          <span className="arch-tag mb-2">
            <Building2 size={12} className="text-blue-700" />
            London Heritage
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-950 mb-3 tracking-tight">
            About Prime Builds
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Prime Builds is an architectural construction and refurbishment practice based exclusively in London. We engineer enduring residential extensions, master lofts, and boutique commercial fit-outs across all 32 London Boroughs.
          </p>
        </div>
      </section>

      {/* Story & Visual */}
      <section className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="arch-tag">Our Standard</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
              Precision Engineering. London Focus.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Founded over a decade ago in London, Prime Builds provides an integrated delivery model tailored to the capital&apos;s distinct architectural nuances — from Victorian party walls and clay subsoils to strict local council conservation area restrictions.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              With over 200 completed projects across Chelsea, Camden, Mayfair, and Westminster, our team brings transparent pricing, dedicated supervision, and unmatched structural fidelity to every build.
            </p>

            <div className="pt-2">
              <Link href="/contact" className="btn-primary text-xs uppercase tracking-wider font-semibold inline-flex items-center gap-2">
                <span>Book Site Audit</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <TiltCard maxTilt={6}>
              <div 
                className="neu-box p-2.5 border border-slate-200 overflow-hidden"
                style={{ backgroundColor: "#ffffff", borderRadius: "10px" }}
              >
                <div className="relative w-full aspect-[16/11] overflow-hidden" style={{ borderRadius: "6px" }}>
                  <Image
                    src="/images/london_commercial_fitout.jpg"
                    alt="Prime Builds London Site Management"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-mono font-bold uppercase text-sky-300 block mb-0.5">
                      LONDON ARCHITECTURAL STANDARDS
                    </span>
                    <h3 className="text-base font-bold text-white mb-0">
                      Precision Built For London Living
                    </h3>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="site-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s, idx) => (
            <div 
              key={idx}
              className="p-5 bg-white border border-slate-200 text-center"
              style={{ borderRadius: "6px", boxShadow: "var(--neu-raised-sm)" }}
            >
              <span className="block text-3xl font-black font-mono text-blue-950 mb-0.5">
                {s.num}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="site-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v, idx) => (
            <div
              key={idx}
              className="p-5 bg-white border border-slate-200 flex flex-col justify-between"
              style={{ borderRadius: "6px", boxShadow: "var(--neu-raised-sm)" }}
            >
              <div>
                <span className="font-mono text-xs font-bold text-blue-700 block mb-2">
                  0{idx + 1}
                </span>
                <h3 className="text-base font-bold text-blue-950 mb-1">
                  {v.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-0 font-normal">
                  {v.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
