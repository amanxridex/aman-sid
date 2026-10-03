"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal, ArrowUpDown, Grid3X3, Grid2X2, Layers, ArrowRight } from "lucide-react";
import { useStore, INITIAL_COLLECTIONS } from "@/context/StoreContext";

export default function CollectionClient({ handle, allProducts }) {
  const { products: storeProducts, collections: storeCollections } = useStore();
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [desktopCols, setDesktopCols] = useState(4);

  const activeCatalog = storeProducts && storeProducts.length > 0 ? storeProducts : allProducts;

  // Map handle to readable titles and descriptions for The Home Definer categories
  const collectionInfo = useMemo(() => {
    const customCol = (storeCollections || []).find((c) => c.handle === handle);
    if (customCol) {
      return {
        title: customCol.title,
        subtitle: "Curated Category",
        description: customCol.description || "Artisanal home objects crafted to bring warmth, texture, and character to living spaces.",
      };
    }

    switch (handle) {
      case "all-products":
      case "all":
      case "shop":
      case "year-round":
        return {
          title: "All Objects & Homeware",
          subtitle: "Complete The Cozy Theory Collection",
          description: "Discover our comprehensive portfolio of everyday ceramics, sculptural tabletop pieces, and artisanal soft furnishings.",
        };
      case "everyday-ceramics":
        return {
          title: "Everyday Ceramics",
          subtitle: "Artisanal Tableware & Dinnerware",
          description: "Handcrafted mugs, ceramic bowls, plates, and breakfast sets designed for daily ritual and elevated dining.",
        };
      case "tableware":
        return {
          title: "Tableware & Dinnerware",
          subtitle: "Dining Accents",
          description: "Porcelain & stoneware dining sets, ramen bowls, dessert plates, and condiment bowls.",
        };
      case "serveware":
        return {
          title: "Platters & Serveware",
          subtitle: "Entertaining Statements",
          description: "Elevated ceramic serving trays, dip bowls, tiered platters, and cheese boards.",
        };
      case "vases-planters":
      case "vases":
        return {
          title: "Vases & Planters",
          subtitle: "Sculptural Vessels",
          description: "Contemporary ceramic, metal, and glass vases crafted to transform botanical stems into gallery centerpieces.",
        };
      case "decorative-objects":
      case "decor":
        return {
          title: "Decorative Objects",
          subtitle: "Conversational Sculptures",
          description: "Handcrafted figurines, resin art pieces, bookends, and abstract architectural monoliths.",
        };
      case "candles-holders":
      case "candles":
        return {
          title: "Candles & Holders",
          subtitle: "Ambient Illumination",
          description: "Sculptural brass, ceramic, and glass candleholders paired with fragrant artisanal wax pieces.",
        };
      case "home-linen":
      case "bedding":
        return {
          title: "Premium Home Linen",
          subtitle: "Bedding & Soft Furnishings",
          description: "Pure cotton double, queen, and king bedsheets, quilted bed covers, matching cushion covers, and table runners.",
        };
      case "merry-bright":
      case "festive":
      case "holiday":
        return {
          title: "Merry & Bright Holiday Collection",
          subtitle: "Festive Heirloom Accents",
          description: "Resin Santa camper vans, light-up village houses, decorative tree stands, and heirloom holiday figurines.",
        };
      case "blue-pottery":
        return {
          title: "Traditional Blue Pottery",
          subtitle: "Heritage Craft",
          description: "Authentic hand-painted blue pottery planters, decorative bowls, and glazed artistic vessels.",
        };
      case "storage-solutions":
        return {
          title: "Storage Solutions & Jars",
          subtitle: "Kitchen & Vanity",
          description: "Ceramic canisters, wooden-lidded spice containers, and elegant bathroom vanity organisers.",
        };
      default:
        return {
          title: handle.replace(/-/g, " ").toUpperCase(),
          subtitle: "Curated Category",
          description: "Artisanal home objects crafted to bring warmth, texture, and character to living spaces.",
        };
    }
  }, [handle, storeCollections]);

  // Filter products matching collection
  const filteredProducts = useMemo(() => {
    return activeCatalog.filter((p) => {
      const lowerTitle = p.title.toLowerCase();
      const lowerType = (p.product_type || "").toLowerCase();
      const tags = (p.tags || []).map((t) => t.toLowerCase());
      const fullSearch = `${lowerTitle} ${lowerType} ${tags.join(" ")}`;

      if (handle === "all-products" || handle === "all" || handle === "shop") {
        // match all
      } else if (handle === "everyday-ceramics" && !fullSearch.includes("ceramic") && !fullSearch.includes("tableware") && !fullSearch.includes("bowl") && !fullSearch.includes("mug")) {
        return false;
      } else if (handle === "tableware" && !fullSearch.includes("tableware") && !fullSearch.includes("plate") && !fullSearch.includes("bowl") && !fullSearch.includes("dinner")) {
        return false;
      } else if (handle === "serveware" && !fullSearch.includes("serveware") && !fullSearch.includes("platter") && !fullSearch.includes("tray")) {
        return false;
      } else if ((handle === "vases-planters" || handle === "vases") && !fullSearch.includes("vase") && !fullSearch.includes("planter")) {
        return false;
      } else if (handle === "decorative-objects" && !fullSearch.includes("decorative") && !fullSearch.includes("object") && !fullSearch.includes("figurine") && !fullSearch.includes("stand")) {
        return false;
      } else if (handle === "candles-holders" && !fullSearch.includes("candle") && !fullSearch.includes("holder")) {
        return false;
      } else if ((handle === "home-linen" || handle === "bedding") && !fullSearch.includes("bedsheet") && !fullSearch.includes("linen") && !fullSearch.includes("cushion") && !fullSearch.includes("cotton")) {
        return false;
      } else if ((handle === "merry-bright" || handle === "festive") && !fullSearch.includes("christmas") && !fullSearch.includes("santa") && !fullSearch.includes("holiday") && !fullSearch.includes("merry") && !fullSearch.includes("tree")) {
        return false;
      } else if (handle === "blue-pottery" && !fullSearch.includes("pottery") && !fullSearch.includes("blue")) {
        return false;
      } else if (handle === "storage-solutions" && !fullSearch.includes("storage") && !fullSearch.includes("jar") && !fullSearch.includes("canister")) {
        return false;
      } else {
        // Check if custom category handle or title matches
        const customCol = (storeCollections || []).find((c) => c.handle === handle);
        if (customCol) {
          const colTitle = customCol.title.toLowerCase();
          const colHandle = customCol.handle.toLowerCase();
          if (!fullSearch.includes(colTitle) && !fullSearch.includes(colHandle)) {
            return false;
          }
        }
      }

      // Sub-filters
      if (activeCategory === "available" && !p.available) return false;
      if (activeCategory === "under1500" && Number(p.price) >= 1500) return false;
      if (activeCategory === "over1500" && Number(p.price) < 1500) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return Number(a.price) - Number(b.price);
      if (sortBy === "price-high") return Number(b.price) - Number(a.price);
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [activeCatalog, handle, activeCategory, sortBy, storeCollections]);

  return (
    <div className="bg-[#fffdf8] min-h-screen">
      
      {/* Breadcrumbs */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4 text-xs font-mono text-neutral-500 flex items-center gap-2 border-b border-[#e5e3dc]">
        <Link href="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link href="/collections/all-products" className="hover:text-black">Collections</Link>
        <span>/</span>
        <span className="text-black font-semibold uppercase">{collectionInfo.title}</span>
      </div>

      {/* Collection Editorial Banner (Vibrant Studio Blue matching Announcement Bar) */}
      <div className="border-b border-[#003ec7] py-12 md:py-16 bg-[#001540] text-white relative overflow-hidden shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 space-y-3 relative z-10">
          <span className="text-[10px] md:text-xs font-mono tracking-[0.25em] uppercase text-blue-200 block font-semibold">
            {collectionInfo.subtitle}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white font-sans">
            {collectionInfo.title}
          </h1>
          <p className="text-xs md:text-sm text-blue-100 font-normal max-w-xl leading-relaxed">
            {collectionInfo.description}
          </p>
        </div>
      </div>

      {/* Interactive Collection Switcher (Shows different collections so visitors can choose which collection to go through) */}
      <div className="bg-[#faf8f2] border-b border-[#e5e3dc] py-4 md:py-5 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-[#001540] font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Choose Collection To Explore:</span>
            </span>
            <Link
              href="/collections"
              className="text-[11px] font-mono uppercase text-neutral-600 hover:text-[#001540] transition-colors flex items-center gap-1 font-semibold"
            >
              <span>View All Collections Directory</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
            {(storeCollections && storeCollections.length > 0 ? storeCollections : INITIAL_COLLECTIONS).map((cat) => {
              const isCurrent = cat.handle === handle;
              return (
                <Link
                  key={cat.handle}
                  href={`/collections/${cat.handle}`}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-[11px] font-mono uppercase transition-all whitespace-nowrap shrink-0 ${
                    isCurrent
                      ? "bg-[#001540] text-white border-[#001540] font-bold shadow-xs"
                      : "bg-white text-neutral-800 border-[#e5e3dc] hover:border-[#001540] hover:bg-[#f2efe6]"
                  }`}
                >
                  <img
                    src={cat.image || "/products/drive/Lemon Ceramic Vase with Handles.webp"}
                    alt={cat.title || cat.label}
                    className="w-4 h-4 rounded-full object-cover border border-neutral-300"
                  />
                  <span>{cat.title || cat.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter and Controls Bar */}
      <div className="sticky top-14 md:top-[102px] z-30 bg-[#fffdf8]/95 backdrop-blur-md border-b border-[#e5e3dc]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Quick Sub-Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {[
              { id: "all", label: "All Items" },
              { id: "available", label: "In Stock" },
              { id: "under1500", label: "Under Rs. 1,500" },
              { id: "over1500", label: "Rs. 1,500+" },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setActiveCategory(chip.id)}
                className={`px-3 py-1.5 text-xs font-mono uppercase whitespace-nowrap transition-colors border ${
                  activeCategory === chip.id
                    ? "bg-[#121212] text-white border-[#121212]"
                    : "bg-white text-neutral-700 border-[#e5e3dc] hover:border-black"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Right Tools: Count, Sort, Grid toggles */}
          <div className="flex items-center gap-4 text-xs font-mono ml-auto">
            <span className="text-neutral-500 hidden sm:inline-block">
              {filteredProducts.length} Objects
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 border border-[#e5e3dc] px-3 py-1.5 bg-white">
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

            {/* Desktop Grid Layout Switcher */}
            <div className="hidden lg:flex items-center gap-1 border border-[#e5e3dc] p-1 bg-white">
              <button
                onClick={() => setDesktopCols(3)}
                className={`p-1 transition-colors ${desktopCols === 3 ? "bg-[#121212] text-white" : "text-neutral-400 hover:text-black"}`}
                aria-label="3 Column Grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDesktopCols(4)}
                className={`p-1 transition-colors ${desktopCols === 4 ? "bg-[#121212] text-white" : "text-neutral-400 hover:text-black"}`}
                aria-label="4 Column Grid"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid Area */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-10">
        <div
          className={`grid grid-cols-2 ${
            desktopCols === 3 ? "md:grid-cols-3" : "md:grid-cols-3 lg:grid-cols-4"
          } gap-3 sm:gap-4 md:gap-6`}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 sm:py-16 text-center space-y-8">
            <div className="max-w-md mx-auto space-y-3">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#001540] font-bold">
                CURATED PIECES // ARRIVING SOON
              </span>
              <p className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-[#121212]">
                New Creations in Craft
              </p>
              <p className="text-xs font-mono text-neutral-500 leading-relaxed">
                New releases for this category are arriving soon. In the meantime, explore our available handcrafted living pieces below.
              </p>
              <div className="pt-2">
                <Link
                  href="/collections/all-products"
                  className="inline-block px-5 py-2.5 bg-[#121212] text-[#fffdf8] text-xs font-mono uppercase tracking-widest font-bold hover:bg-neutral-800 transition-colors"
                >
                  View All Available Objects
                </Link>
              </div>
            </div>

            {/* Available Curated Pieces */}
            <div className="text-left pt-8 border-t border-[#e5e3dc] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-neutral-700">
                  Available Handcrafted Objects
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  {activeCatalog.length} pieces in stock
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {activeCatalog.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
