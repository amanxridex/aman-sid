"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { subscribeNewsletter, DEFAULT_FOOTER_SECTIONS } from "@/lib/supabase";
import { useStore } from "@/context/StoreContext";

export default function Footer() {
  const { storeSettings } = useStore();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      await subscribeNewsletter(email);
      setEmail("");
    }
  };

  const isJournalVisible = storeSettings?.journal_visible !== false;

  const rawSections =
    storeSettings?.footer_sections &&
    Array.isArray(storeSettings.footer_sections) &&
    storeSettings.footer_sections.length > 0
      ? storeSettings.footer_sections
      : DEFAULT_FOOTER_SECTIONS;

  const sectionsToRender = rawSections.map((section) => ({
    ...section,
    links: (section.links || []).filter((link) => {
      if (!isJournalVisible && (link.url === "/blogs/news" || link.label?.toLowerCase() === "journal")) {
        return false;
      }
      return true;
    }),
  }));

  const instagramUrl =
    storeSettings?.footer_instagram_url ||
    "https://www.instagram.com/the.cozy.theory?stkn=MWxpY3UyOTZoMXpiYg==";
  const pinterestUrl =
    storeSettings?.footer_pinterest_url ||
    "https://pin.it/229oxMjQD";

  return (
    <footer className="bg-[#121212] text-[#fffdf8] pt-16 md:pt-24 pb-12 border-t border-neutral-800">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 space-y-16">
        
        {/* Top Section: Brand Story & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Brand Philosophy */}
          <div className="lg:col-span-6 space-y-5">
            <Link href="/" className="inline-flex flex-col gap-1 group">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-[-0.04em] text-2xl sm:text-3xl uppercase font-sans">
                  {storeSettings?.brand_name || "THE COZY THEORY"}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#001540] inline-block -mt-3"></span>
              </div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-sky-300 uppercase font-bold">
                {storeSettings?.brand_tagline || "Stay Cozy, Stay You"}
              </span>
            </Link>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed max-w-xl font-normal">
              {storeSettings?.about_description ||
                "The Cozy Theory curates everyday objects, dining accents, and soft furnishings that transform your living space into a sanctuary of warmth, texture, and individual expression. We believe in everyday rituals elevated by honest materials."}
            </p>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[11px] font-mono tracking-[0.2em] text-sky-300 uppercase block">
              {storeSettings?.footer_newsletter_title || "Join The Cozy Theory Collector List"}
            </span>
            <p className="text-xs text-neutral-300">
              {storeSettings?.footer_newsletter_text ||
                "Be first to gain access to limited seasonal drops, archival ceramics, and private offers."}
            </p>

            <form onSubmit={handleSubscribe} className="flex max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 bg-neutral-900 border border-neutral-700 text-white px-4 py-3 text-xs font-mono placeholder:text-neutral-500 focus:outline-none focus:border-[#001540] transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#001540] text-white hover:bg-[#002266] transition-colors flex items-center justify-center"
                aria-label="Subscribe to newsletter"
              >
                {subscribed ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </form>
            {subscribed && (
              <p className="text-[11px] font-mono text-emerald-400">
                ✓ You have been subscribed to The Cozy Theory private list.
              </p>
            )}
          </div>
        </div>

        {/* Middle Section: Dynamic Navigation & Policies (Without Pure Cotton Linen) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-neutral-800 text-xs font-mono">
          {sectionsToRender.map((section, sIdx) => (
            <div key={section.id || sIdx} className="space-y-3">
              <div className="text-neutral-500 uppercase tracking-widest text-[10px] font-bold">
                {section.title}
              </div>
              <ul className="space-y-2 text-neutral-300">
                {section.links?.map((link, lIdx) => (
                  <li key={link.id || lIdx}>
                    <Link href={link.url} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} THE COZY THEORY. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span>IN / INR (₹)</span>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5 group"
              title="Follow The Cozy Theory on Instagram"
            >
              <svg className="w-3.5 h-3.5 fill-neutral-400 group-hover:fill-pink-400 transition-colors" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>INSTAGRAM</span>
            </a>
            <a
              href={pinterestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5 group"
              title="Follow The Cozy Theory on Pinterest"
            >
              <svg className="w-3.5 h-3.5 fill-neutral-400 group-hover:fill-rose-500 transition-colors" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
              <span>PINTEREST</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
