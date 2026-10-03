"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { NOTICE_PRODUCTS } from "@/lib/products";
import Link from "next/link";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? NOTICE_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 8)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 md:pt-28 px-4 animate-in fade-in duration-200">
      <div
        onClick={onClose}
        className="absolute inset-0"
      />
      <div className="relative bg-[#fffdf8] border border-[#121212] w-full max-w-2xl p-6 shadow-2xl space-y-4 z-10">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-2 border-b border-[#e5e3dc]">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Search Objects Catalog
          </span>
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-black transition-colors"
            aria-label="Close search modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by object title, material, drop phase..."
            autoFocus
            className="w-full bg-[#f7f5ef] border border-[#e5e3dc] pl-4 pr-12 py-3.5 text-sm font-mono focus:outline-none focus:border-black transition-colors"
          />
          <button
            type="submit"
            className="absolute right-3 top-3.5 text-neutral-500 hover:text-black transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        {/* Predictive Results */}
        {query.trim() && (
          <div className="pt-2 space-y-3 max-h-[360px] overflow-y-auto divide-y divide-[#f0eee6]">
            {results.length > 0 ? (
              <>
                <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                  Objects ({results.length})
                </div>
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.handle}`}
                    onClick={onClose}
                    className="flex items-center gap-4 py-2.5 hover:bg-[#f7f5ef] px-2 transition-colors group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-12 h-14 object-cover border border-[#e5e3dc] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold uppercase tracking-tight text-[#121212] group-hover:underline truncate">
                        {product.title}
                      </h4>
                      <div className="text-[11px] font-mono font-bold text-neutral-700">
                        Rs. {Number(product.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
                <div className="pt-3">
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full py-2.5 bg-[#121212] text-[#fffdf8] text-xs font-mono tracking-widest uppercase hover:bg-neutral-800 transition-colors"
                  >
                    View All Results For &ldquo;{query}&rdquo; →
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-xs font-mono text-neutral-500">
                No objects matching &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        )}

        {/* Suggested searches */}
        {!query && (
          <div className="pt-2 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              Popular Searches:
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {["Ceramics", "Dinner Plates", "Cotton Linen", "Serving Bowls", "Vases", "Candle Holders", "Platters"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1 bg-[#f7f5ef] border border-[#e5e3dc] hover:border-black transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
