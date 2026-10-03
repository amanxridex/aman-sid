"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { DEFAULT_FAQS } from "@/lib/supabase";

export default function FAQPage() {
  const { storeSettings } = useStore();
  const [openSection, setOpenSection] = useState(0);

  const rawFaqs =
    storeSettings?.faqs && Array.isArray(storeSettings.faqs) && storeSettings.faqs.length > 0
      ? storeSettings.faqs
      : DEFAULT_FAQS;

  // Only show questions that are not hidden
  const visibleFaqs = rawFaqs.filter((item) => !item.hidden);

  return (
    <div className="bg-[#fffdf8] min-h-screen py-12 md:py-20">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 pb-8 border-b border-[#e5e3dc]">
          <span className="text-[10px] md:text-xs font-mono tracking-[0.25em] uppercase text-blue-600 block">
            Help &amp; Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-[#121212]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs md:text-sm font-mono text-neutral-600 max-w-lg mx-auto">
            Everything you need to know about The Cozy Theory homeware, ceramic care, shipping, and ordering.
          </p>
        </div>

        {/* Accordions */}
        <div className="divide-y divide-[#e5e3dc] border-t border-b border-[#e5e3dc]">
          {visibleFaqs.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-neutral-500">
              No questions currently published.
            </div>
          ) : (
            visibleFaqs.map((item, idx) => (
              <div key={item.id || idx} className="py-5">
                <button
                  onClick={() => setOpenSection(openSection === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-sm md:text-base font-bold uppercase tracking-tight text-[#121212] cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform duration-200 flex-shrink-0 ml-4 ${
                      openSection === idx ? "rotate-180 text-black" : ""
                    }`}
                  />
                </button>
                {openSection === idx && (
                  <div className="mt-3 text-xs md:text-sm text-neutral-600 leading-relaxed font-normal pr-6 space-y-2.5">
                    <p>{item.a}</p>
                    {item.linkUrl && (
                      <div>
                        <Link
                          href={item.linkUrl}
                          className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#001540] hover:underline"
                        >
                          <span>{item.linkText || "Check the refund policy →"}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Bottom CTA */}
        <div className="p-8 bg-[#f7f5ef] border border-[#e5e3dc] text-center space-y-3">
          <h3 className="text-lg font-bold uppercase tracking-tight">
            Have another question about our pieces?
          </h3>
          <p className="text-xs font-mono text-neutral-500">
            Our customer care team is available to assist you with styling and orders.
          </p>
          <a
            href="mailto:thecozytheory.store@gmail.com"
            className="inline-block px-6 py-3 bg-[#001540] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#002266] transition-colors"
          >
            Email The Cozy Theory Team →
          </a>
        </div>
      </div>
    </div>
  );
}
