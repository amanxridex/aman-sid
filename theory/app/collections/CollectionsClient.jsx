"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Layers } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { INITIAL_COLLECTIONS } from "@/context/StoreContext";

export default function CollectionsClient() {
  const { collections: storeCollections, products } = useStore();

  const baseCollections =
    storeCollections && storeCollections.length > 0
      ? storeCollections
      : INITIAL_COLLECTIONS;

  // Compute live product counts per collection if available
  const enrichedCollections = baseCollections.map((col) => {
    let count = 0;
    if (products && products.length > 0) {
      if (col.handle === "all" || col.handle === "all-products") {
        count = products.length;
      } else {
        const lowerH = col.handle.toLowerCase();
        count = products.filter((p) => {
          const type = (p.product_type || "").toLowerCase();
          const cat = (p.category || "").toLowerCase();
          const tags = (p.tags || []).map((t) => t.toLowerCase());
          return (
            type.includes(lowerH) ||
            cat.includes(lowerH) ||
            tags.some((t) => t.includes(lowerH)) ||
            (lowerH === "vases-planters" && (type.includes("vase") || type.includes("planter"))) ||
            (lowerH === "tableware" && (type.includes("tableware") || type.includes("platter") || type.includes("bowl") || type.includes("plate"))) ||
            (lowerH === "everyday-ceramics" && (type.includes("ceramic") || cat.includes("ceramic"))) ||
            (lowerH === "decorative-objects" && (type.includes("decor") || type.includes("figurine") || type.includes("sculpture"))) ||
            (lowerH === "candles-holders" && (type.includes("candle") || type.includes("holder") || type.includes("ashtray"))) ||
            (lowerH === "home-linen" && (type.includes("linen") || type.includes("bedding") || type.includes("cotton"))) ||
            (lowerH === "merry-bright" && (type.includes("festive") || type.includes("christmas") || tags.includes("holiday"))) ||
            (lowerH === "blue-pottery" && (type.includes("pottery") || tags.includes("blue pottery")))
          );
        }).length;
      }
    }

    return {
      ...col,
      itemCount: count > 0 ? count : (col.itemCount || 0),
    };
  });

  return (
    <div className="bg-[#fffdf8] min-h-screen text-[#121212]">
      {/* Top Breadcrumb Navigation */}
      <div className="border-b border-[#e5e3dc] bg-[#fffdf8]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-neutral-500 hover:text-[#001540] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-neutral-400">
            <span>thecozytheory.in</span>
            <span>•</span>
            <span className="text-[#001540] font-bold">Collections</span>
          </div>
        </div>
      </div>

      {/* Editorial Hero Header */}
      <div className="border-b border-[#e5e3dc] bg-[#121212] text-[#fffdf8] py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#001540]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-blue-300 border border-white/10 text-[10px] font-mono uppercase tracking-[0.25em] font-semibold">
            <Layers className="w-3 h-3" />
            Curated Categories &amp; Edits
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[0.95]">
            Explore Collections.
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl font-normal leading-relaxed">
            Discover our distinct homeware edits — from everyday ceramics and sculpted tabletop vessels to ambient illumination and pure cotton textiles. Choose a collection below to begin.
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {enrichedCollections.map((col) => {
            const href = `/collections/${col.handle}`;
            const image = col.image || col.image_url || "/products/drive/Lemon Ceramic Vase with Handles.webp";

            return (
              <Link
                key={col.handle}
                href={href}
                className="group flex flex-col bg-white border border-[#e5e3dc] overflow-hidden hover:border-[#001540] transition-all duration-300 shadow-xs hover:shadow-md"
              >
                {/* Visual Imagery */}
                <div className="aspect-[4/3] bg-[#faf8f2] overflow-hidden relative">
                  <img
                    src={image}
                    alt={col.title || col.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono uppercase tracking-wider font-semibold rounded-xs">
                    {col.itemCount ? `${col.itemCount} Objects` : "Collection"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-[#001540] uppercase tracking-widest font-bold block">
                      The Cozy Theory Edit
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#121212] group-hover:text-[#001540] transition-colors">
                      {col.title || col.label}
                    </h2>
                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {col.description || "Artisanal homeware crafted to bring warmth, texture, and character into modern living spaces."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#e5e3dc] flex items-center justify-between text-xs font-mono font-bold uppercase text-[#001540]">
                    <span>Browse Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Helper Bar */}
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-[#faf8f2] border border-[#e5e3dc] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-mono text-[#001540] uppercase font-bold tracking-wider block">
              Looking for something specific?
            </span>
            <p className="text-xs text-neutral-600">
              Browse our full catalog with all available handcrafted pieces in one continuous archive.
            </p>
          </div>
          <Link
            href="/collections/all-products"
            className="px-6 py-3 bg-[#001540] text-white hover:bg-[#002266] text-xs font-mono font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            View All Objects Archive →
          </Link>
        </div>
      </div>
    </div>
  );
}
