"use client";

import { useState } from "react";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import LookbookSection from "@/components/LookbookSection";
import EditorialBanner from "@/components/EditorialBanner";
import QuickViewModal from "@/components/QuickViewModal";
import { NOTICE_PRODUCTS, HERO_SLIDES, LOOKBOOK_SPOTS } from "@/lib/products";
import { SlidersHorizontal, ArrowUpDown, ArrowRight, Shuffle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";

export default function Home() {
  const { products, storeSettings } = useStore();
  const { addToCart } = useCart();
  const [activeFilter, setActiveFilter] = useState("all");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [sortBy, setSortBy] = useState("featured");
  const [randomSeed, setRandomSeed] = useState(0);

  const catalog = products && products.length > 0 ? products : NOTICE_PRODUCTS;

  const handleShuffle = () => {
    setRandomSeed((prev) => prev + 1);
  };

  const filteredProducts = catalog.filter((p) => {
    if (activeFilter === "all") return true;
    const lowerTitle = p.title.toLowerCase();
    const lowerType = (p.product_type || "").toLowerCase();
    const tags = (p.tags || []).map((t) => t.toLowerCase());
    const fullSearch = `${lowerTitle} ${lowerType} ${tags.join(" ")}`;

    if (activeFilter === "ceramics") return fullSearch.includes("ceramic") || fullSearch.includes("tableware") || fullSearch.includes("bowl") || fullSearch.includes("mug");
    if (activeFilter === "tableware") return fullSearch.includes("tableware") || fullSearch.includes("plate") || fullSearch.includes("bowl");
    if (activeFilter === "serveware") return fullSearch.includes("serveware") || fullSearch.includes("platter") || fullSearch.includes("tray");
    if (activeFilter === "vases") return fullSearch.includes("vase") || fullSearch.includes("planter");
    if (activeFilter === "decorative") return fullSearch.includes("decorative") || fullSearch.includes("figurine") || fullSearch.includes("stand");
    if (activeFilter === "candles") return fullSearch.includes("candle") || fullSearch.includes("holder");
    if (activeFilter === "linen") return fullSearch.includes("bedsheet") || fullSearch.includes("linen") || fullSearch.includes("cushion") || fullSearch.includes("cotton");
    if (activeFilter === "festive") return fullSearch.includes("christmas") || fullSearch.includes("santa") || fullSearch.includes("holiday") || fullSearch.includes("merry") || fullSearch.includes("tree");

    return true;
  }).sort((a, b) => {
    if (sortBy === "price-low") return Number(a.price) - Number(b.price);
    if (sortBy === "price-high") return Number(b.price) - Number(a.price);
    if (sortBy === "title-asc") return a.title.localeCompare(b.title);
    if (randomSeed > 0) {
      // Deterministic pseudo-random shuffle per seed
      const hashA = (a.id * (randomSeed + 31)) % 1000;
      const hashB = (b.id * (randomSeed + 31)) % 1000;
      return hashA - hashB;
    }
    return 0;
  });

  return (
    <main className="min-h-screen bg-[#fffdf8] flex flex-col">
      {/* Hero Slideshow */}
      <HeroSlider
        slides={
          storeSettings?.hero_slides && storeSettings.hero_slides.length > 0
            ? storeSettings.hero_slides
            : HERO_SLIDES
        }
      />

      {/* Product Catalog Section */}
      <section id="catalog" className="py-12 md:py-20 max-w-[1600px] mx-auto px-4 md:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#e5e3dc] pb-6">
          <div>
            <span className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase text-blue-600 block mb-1">
              THE COZY THEORY // CURATED SELECTION
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-[#121212]">
              LIVING OBJECTS
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleShuffle}
              className="flex items-center gap-1.5 border border-[#e5e3dc] hover:border-black px-3 py-1.5 bg-white text-xs font-mono uppercase transition-colors"
              title="Shuffle selection of random homeware"
            >
              <Shuffle className="w-3.5 h-3.5 text-blue-600" />
              <span>Randomize Mix</span>
            </button>

            <div className="flex items-center gap-1.5 border border-[#e5e3dc] px-3 py-1.5 bg-white text-xs font-mono">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer uppercase"
                aria-label="Filter category"
              >
                <option value="all">All Objects ({NOTICE_PRODUCTS.length})</option>
                <option value="ceramics">Everyday Ceramics</option>
                <option value="tableware">Tableware & Dining</option>
                <option value="serveware">Serveware</option>
                <option value="vases">Vases & Planters</option>
                <option value="decorative">Decorative Objects</option>
                <option value="candles">Candles & Holders</option>
                <option value="linen">Home Linen & Bedding</option>
                <option value="festive">Festive Accents</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 border border-[#e5e3dc] px-3 py-1.5 bg-white text-xs font-mono">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer uppercase"
                aria-label="Sort objects"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="title-asc">Alphabetical (A-Z)</option>
              </select>
            </div>

            <Link
              href="/collections/all-products"
              className="px-3.5 py-1.5 bg-[#121212] text-[#fffdf8] text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filteredProducts.slice(0, 24).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

        {/* View All Collection Banner */}
        <div className="mt-12 text-center pt-8 border-t border-[#e5e3dc]">
          <Link
            href="/collections/all-products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#121212] text-[#fffdf8] text-xs font-mono font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            <span>Explore Complete Archive ({NOTICE_PRODUCTS.length} Objects)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Editorial Manifesto */}
      <EditorialBanner />

      {/* Interactive Lookbook */}
      <LookbookSection
        hotspots={storeSettings?.lookbook_spots && storeSettings.lookbook_spots.length > 0 ? storeSettings.lookbook_spots : LOOKBOOK_SPOTS}
        onAddToCart={(p) => addToCart(p)}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p) => addToCart(p)}
      />
    </main>
  );
}
