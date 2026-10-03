"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, Search, ChevronDown, ChevronRight, User } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function Header({
  cartCount,
  onOpenCart,
  onOpenSearch,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(false);

  const { collections, storeSettings } = useStore();

  // Primary categories to display on desktop nav (excluding all-products)
  const nonAllCollections = (collections || []).filter((c) => c.handle !== "all-products");
  const primaryCollections = nonAllCollections.slice(0, 6);
  const remainingCollections = nonAllCollections.slice(6);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fffdf8]/98 backdrop-blur-md border-b border-[#e5e3dc] transition-all duration-200">
        {/* Tier 1: Main Brand & Utilities Bar */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-14 md:h-16 grid grid-cols-3 items-center">
          
          {/* Left Column: Mobile Menu Trigger / Desktop Subtle Brand Accent */}
          <div className="flex items-center justify-start">
            {/* Mobile Controls */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-[#121212] hover:opacity-70 transition-opacity cursor-pointer"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.6]" />
              </button>
              <button
                onClick={onOpenSearch}
                className="p-2 text-[#121212] hover:opacity-70 transition-opacity cursor-pointer"
                aria-label="Search Catalog"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.6]" />
              </button>
            </div>

            {/* Desktop Left Brand Indicator / Story */}
            <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono tracking-widest text-neutral-500 uppercase">
              <Link href="/pages/our-story" className="hover:text-black transition-colors font-medium">
                {storeSettings?.header_story_label || "Our Story"}
              </Link>
              {storeSettings?.show_header_tagline && storeSettings?.header_tagline && (
                <>
                  <span className="text-neutral-300">•</span>
                  <span className="text-neutral-400">{storeSettings.header_tagline}</span>
                </>
              )}
            </div>
          </div>

          {/* Center Column: Perfectly Centered Brand Identity (Zero Collision) */}
          <div className="flex items-center justify-center text-center">
            <Link href="/" className="inline-block group focus:outline-none">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <span className="font-extrabold tracking-[-0.03em] text-base sm:text-xl md:text-2xl uppercase font-sans text-[#121212] whitespace-nowrap">
                  {storeSettings?.brand_name || "THE COZY THEORY"}
                </span>
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#001540] inline-block -mt-1.5 sm:-mt-2 flex-shrink-0"></span>
              </div>
              <span className="hidden sm:block text-[8px] font-mono tracking-[0.22em] text-neutral-500 uppercase -mt-0.5">
                {storeSettings?.brand_tagline || "Stay Cozy, Stay You"}
              </span>
            </Link>
          </div>

          {/* Right Column: Search, Account, Currency, Bag */}
          <div className="flex items-center justify-end gap-2 sm:gap-4 xl:gap-5">
            <button
              onClick={onOpenSearch}
              className="hidden lg:flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-neutral-700 hover:text-black transition-colors"
              aria-label="Search Catalog"
            >
              <Search className="w-4 h-4 stroke-[1.6]" />
              <span className="hidden xl:inline">Search</span>
            </button>

            {/* Account Link */}
            <Link
              href="/account"
              className="flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-neutral-700 hover:text-black transition-colors p-1"
              aria-label="Collector Account"
            >
              <User className="w-4 h-4 stroke-[1.6]" />
              <span className="hidden xl:inline">Account</span>
            </Link>

            <span className="hidden md:inline-block text-xs font-mono text-neutral-400">
              INR ₹
            </span>

            {/* Shopping Bag Button with Badge */}
            <button
              id="header-cart-btn"
              data-cart-target="true"
              onClick={onOpenCart}
              className="flex items-center gap-1.5 sm:gap-2 py-1.5 px-2.5 sm:px-3 rounded-full hover:bg-neutral-100 transition-colors relative"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#121212] stroke-[1.6]" />
              <span className="text-[11px] sm:text-xs font-mono font-bold bg-[#121212] text-white px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            </button>
          </div>

        </div>

        {/* Tier 2: Dedicated Desktop Categories Navigation Bar (Full Width, Zero Collision) */}
        <nav className="hidden lg:flex items-center justify-center border-t border-[#e5e3dc] bg-[#fffdf8]/90 py-2.5 px-4 overflow-x-auto">
          <div className="flex items-center justify-center gap-6 xl:gap-8 text-[11px] xl:text-[12px] tracking-[0.1em] font-medium uppercase text-[#121212]">
            <Link
              href="/collections/all-products"
              className="transition-colors hover:text-[#001540] py-0.5 whitespace-nowrap"
            >
              All Objects
            </Link>

            {primaryCollections.map((col) => (
              <Link
                key={col.handle}
                href={`/collections/${col.handle}`}
                className="transition-colors hover:text-[#001540] py-0.5 whitespace-nowrap"
              >
                {col.title || col.label}
              </Link>
            ))}

            {/* More Collections Dropdown if more than 6 */}
            {remainingCollections.length > 0 && (
              <div className="relative group py-0.5">
                <button className="flex items-center gap-1 hover:text-[#001540] transition-colors cursor-pointer uppercase">
                  <span>More Collections</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                </button>

                <div className="absolute top-full right-0 w-60 bg-[#fffdf8] border border-[#e5e3dc] shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50 rounded">
                  <div className="px-4 py-1.5 text-[10px] font-mono text-neutral-400 border-b border-[#e5e3dc] uppercase">
                    Curated Categories
                  </div>
                  {remainingCollections.map((item) => (
                    <Link
                      key={item.handle}
                      href={`/collections/${item.handle}`}
                      className="block px-4 py-2 text-xs hover:bg-[#121212] hover:text-white transition-colors"
                    >
                      {item.title || item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Off-Canvas Menu Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-[380px] bg-[#fffdf8] shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-[#e5e3dc] flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex flex-col"
            >
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-[-0.03em] text-lg uppercase font-sans text-[#121212]">
                  {storeSettings?.brand_name || "THE COZY THEORY"}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#001540] inline-block -mt-1"></span>
              </div>
              <span className="text-[8px] font-mono tracking-[0.2em] text-neutral-500 uppercase -mt-0.5">
                {storeSettings?.brand_tagline || "Stay Cozy, Stay You"}
              </span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-neutral-600 hover:text-black transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>

          {/* Drawer Links */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            <div className="space-y-3">
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                Collections ({collections.length})
              </div>
              {collections.map((col) => (
                <Link
                  key={col.handle}
                  href={`/collections/${col.handle}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium uppercase text-neutral-900 hover:text-[#001540] transition-colors"
                >
                  {col.title || col.label}
                </Link>
              ))}
            </div>

            {/* Quick Links */}
            <div className="pt-4 border-t border-[#e5e3dc] space-y-2.5 text-xs font-mono uppercase text-neutral-500">
              <div><Link href="/account" onClick={() => setMobileMenuOpen(false)} className="hover:text-black flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Collector Account</Link></div>
              <div><Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="hover:text-black">Shopping Bag</Link></div>
              <div><Link href="/checkout" onClick={() => setMobileMenuOpen(false)} className="hover:text-black font-bold text-[#001540]">Instant Checkout →</Link></div>
              <div><Link href="/pages/our-story" onClick={() => setMobileMenuOpen(false)} className="hover:text-black">Our Story</Link></div>
              <div><Link href="/pages/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-black">Contact Us</Link></div>
              <div><Link href="/pages/faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-black">FAQs</Link></div>
              {storeSettings?.journal_visible !== false && (
                <div><Link href="/blogs/news" onClick={() => setMobileMenuOpen(false)} className="hover:text-black">Journal</Link></div>
              )}
            </div>
          </div>

          {/* Drawer Footer Utilities */}
          <div className="p-6 bg-[#f7f5ef] border-t border-[#e5e3dc] space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-neutral-600">
              <span>CURRENCY:</span>
              <span className="font-bold text-black">INR (₹)</span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              {storeSettings?.footer_tagline || "Stay cozy, stay you. The Cozy Theory crafts everyday homeware, everyday ceramics, and pure linen for warm living spaces."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
