import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Ruler, 
  Wrench, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Home as HomeIcon,
  PhoneCall
} from "lucide-react";
import ParallaxHero from "@/components/ParallaxHero";
import TiltCard from "@/components/TiltCard";
import CostCalculator from "@/components/CostCalculator";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import BoroughGrid from "@/components/BoroughGrid";
import { servicesData } from "@/data/servicesData";
import { projectsData } from "@/data/projectsData";
import { testimonialsData } from "@/data/testimonialsData";

export default function Home() {
  const featuredServices = servicesData.slice(0, 6);
  const featuredProjects = projectsData.slice(0, 3);

  return (
    <div className="space-y-20 md:space-y-28 pb-12">
      {/* 1. 3D Parallax Hero Section */}
      <ParallaxHero />

      {/* 2. Architectural Pillars / Minimalist Introduction */}
      <section className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="arch-tag">
              <Building2 size={12} className="text-blue-700" />
              Who We Are
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight leading-tight">
              London Architecture, Built With Exacting Standards.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Prime Builds is a full-service construction practice in London. We specialize in complex subterranean structures, rear Crittall glass extensions, Mansard loft conversions, and high-spec commercial fit-outs.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200" style={{ borderRadius: "6px" }}>
                <ShieldCheck size={16} className="text-blue-700 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">
                  10-Year Insurance-Backed Structural Guarantee
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200" style={{ borderRadius: "6px" }}>
                <Ruler size={16} className="text-blue-700 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">
                  Fixed-Price Contracts with Zero Hidden Surcharges
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/about" className="btn-secondary text-xs uppercase tracking-wider font-semibold">
                <span>Our Heritage</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <BeforeAfterSlider
              beforeImage="/images/camden_kitchen_before.jpg"
              afterImage="/images/london_kitchen_extension.jpg"
              title="Camden Victorian Rear & Kitchen Extension"
              location="London (Camden)"
              beforeLabel="Prior Raw Shell"
              afterLabel="Completed Prime Build"
            />
          </div>
        </div>
      </section>

      {/* 3. Core Disciplines / Services Grid (Minimalist 3D Neumorphic Cards) */}
      <section className="site-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-3 border-b border-slate-200">
          <div>
            <span className="arch-tag mb-1.5">
              <Wrench size={12} className="text-blue-700" />
              Disciplines
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
              Bespoke Construction Disciplines
            </h2>
          </div>

          <Link href="/services" className="btn-secondary text-xs uppercase tracking-wider font-semibold shrink-0">
            <span>All 8 Services</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
            <TiltCard key={service.id} maxTilt={6}>
              <div 
                className="neu-box h-full p-5 flex flex-col justify-between border border-slate-200"
                style={{ backgroundColor: "#ffffff", borderRadius: "8px" }}
              >
                <div>
                  <div className="relative w-full aspect-[16/10] overflow-hidden mb-3" style={{ borderRadius: "6px" }}>
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-blue-950/90 text-white text-[10px] font-mono font-bold uppercase tracking-wider" style={{ borderRadius: "3px" }}>
                      {service.category}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-blue-700 font-semibold mb-1">
                    <span>{service.timeline}</span>
                    <span>{service.avgCostLondon}</span>
                  </div>

                  <h3 className="text-lg font-bold text-blue-950 mb-1.5">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {service.shortDesc}
                  </p>
                </div>

                <Link
                  href={`/services#${service.id}`}
                  className="w-full py-2 px-3 bg-slate-50 text-blue-950 hover:bg-blue-800 hover:text-white border border-slate-200 transition-colors font-semibold text-xs uppercase tracking-wider flex items-center justify-between"
                  style={{ borderRadius: "4px" }}
                >
                  <span>Explore Scope</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* 4. Interactive London Cost Calculator Widget */}
      <section className="site-container">
        <CostCalculator />
      </section>

      {/* 5. Minimalist 5-Step London Delivery Pipeline */}
      <section className="site-container">
        <div className="mb-8 pb-3 border-b border-slate-200">
          <span className="arch-tag mb-1.5">
            <Clock size={12} className="text-blue-700" />
            Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
            The 5-Step London Delivery Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[
            { step: "01", title: "Discovery", desc: "Complimentary on-site London audit & laser scan." },
            { step: "02", title: "Design & Calcs", desc: "Architectural elevations, structural steels & council permissions." },
            { step: "03", title: "Fixed Tender", desc: "Itemized schedule of works with price & program lock." },
            { step: "04", title: "Master Build", desc: "Dedicated London site supervisor & milestone inspections." },
            { step: "05", title: "Sign-Off", desc: "Building Control certificate & 10-year warranty handover." }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="p-4 bg-white border border-slate-200 flex flex-col justify-between"
              style={{ borderRadius: "6px", boxShadow: "var(--neu-raised-sm)" }}
            >
              <div>
                <span className="text-2xl font-black font-mono text-blue-900 block mb-1">
                  {item.step}
                </span>
                <h4 className="text-sm font-bold text-blue-950 mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mb-0 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Featured London Projects Showcase */}
      <section className="site-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-3 border-b border-slate-200">
          <div>
            <span className="arch-tag mb-1.5">
              <HomeIcon size={12} className="text-blue-700" />
              Portfolio
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
              Selected London Transformations
            </h2>
          </div>
          <Link href="/projects" className="btn-secondary text-xs uppercase tracking-wider font-semibold">
            <span>View All Projects</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <div 
              key={project.id}
              className="neu-box overflow-hidden flex flex-col justify-between border border-slate-200"
              style={{ borderRadius: "8px", backgroundColor: "#ffffff" }}
            >
              <div>
                <div className="relative w-full aspect-[16/11] overflow-hidden">
                  <Image
                    src={project.imageAfter}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-blue-950/90 text-white text-[10px] font-mono font-bold uppercase tracking-wider" style={{ borderRadius: "3px" }}>
                    {project.category}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white bg-blue-950/85 px-2.5 py-1" style={{ borderRadius: "4px" }}>
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin size={11} className="text-sky-300" />
                      {project.location}
                    </span>
                    <span className="font-mono text-[11px]">{project.timeline}</span>
                  </div>
                </div>

                <div className="p-4">
                  <span className="text-[10px] font-mono font-bold text-blue-700 uppercase block mb-0.5">
                    {project.borough}
                  </span>
                  <h3 className="text-base font-bold text-blue-950 mb-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                    {project.summary}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  href="/projects"
                  className="w-full btn-secondary text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 py-2"
                  style={{ borderRadius: "4px" }}
                >
                  <span>Case Study</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. London Coverage Interactive Grid */}
      <section className="site-container">
        <BoroughGrid />
      </section>

      {/* 8. Minimalist Verified Testimonials (NO STARS) */}
      <section className="site-container">
        <div className="mb-8 pb-3 border-b border-slate-200 flex justify-between items-end">
          <div>
            <span className="arch-tag mb-1.5">
              <ShieldCheck size={12} className="text-blue-700" />
              Client Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
              Client Satisfaction
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-blue-700">
            9.9/10 AVERAGE RATING
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonialsData.map((test) => (
            <div
              key={test.id}
              className="neu-box p-5 border border-slate-200 flex flex-col justify-between"
              style={{ backgroundColor: "#ffffff", borderRadius: "8px" }}
            >
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-blue-950 mb-0">
                      {test.clientName}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {test.borough}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 bg-blue-100 text-blue-950 text-xs font-bold font-mono" style={{ borderRadius: "3px" }}>
                    Score: {test.score}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic mb-3">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
                <span>{test.projectType}</span>
                <span className="font-mono text-blue-600 font-semibold">{test.completionDate}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Minimalist Consultation Invitation */}
      <section className="site-container">
        <div 
          className="p-8 md:p-10 bg-blue-950 text-white flex flex-col lg:flex-row items-center justify-between gap-6"
          style={{ borderRadius: "10px" }}
        >
          <div className="max-w-lg">
            <span className="text-xs font-mono font-bold uppercase text-sky-400 block mb-1">
              COMPLIMENTARY ON-SITE AUDIT • LONDON ONLY
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Ready to Build Your London Project?
            </h3>
            <p className="text-xs sm:text-sm text-blue-200 mb-0 leading-relaxed">
              Book a free feasibility survey with our senior London surveyors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <a 
              href="tel:+442079460892" 
              className="btn-secondary text-xs uppercase tracking-wider font-semibold text-center py-3 px-5 flex items-center justify-center gap-2"
              style={{ borderRadius: "4px" }}
            >
              <PhoneCall size={13} />
              <span>+44 20 7946 0892</span>
            </a>
            <Link 
              href="/contact" 
              className="btn-primary text-xs uppercase tracking-wider font-semibold text-center py-3 px-5 flex items-center justify-center gap-2 shimmer-btn"
              style={{ backgroundColor: "#2563eb", borderColor: "#3b82f6", borderRadius: "4px" }}
            >
              <span>Book Site Audit</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
