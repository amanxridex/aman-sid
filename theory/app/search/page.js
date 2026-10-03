"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { NOTICE_PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Search } from "lucide-react";

import { useStore } from "@/context/StoreContext";

function SearchContent() {
  const { products } = useStore();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const catalog = products && products.length > 0 ? products : NOTICE_PRODUCTS;

  const results = query.trim()
    ? catalog.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))) ||
          (p.product_type && p.product_type.toLowerCase().includes(query.toLowerCase()))
      )
    : catalog.slice(0, 12);

  return (
    <div className="bg-[#fffdf8] min-h-screen py-10 md:py-16">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 space-y-8">
        
        {/* Search Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-neutral-500">
            Catalog Search
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#121212]">
            Search Objects
          </h1>

          <div className="relative pt-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by object title, material, drop phase..."
              className="w-full bg-[#f7f5ef] border border-[#121212] px-5 py-4 text-sm font-mono pr-12 focus:outline-none shadow-sm"
              autoFocus
            />
            <Search className="w-5 h-5 text-neutral-500 absolute right-4 top-6" />
          </div>

          <div className="text-xs font-mono text-neutral-500 pt-1">
            {query.trim()
              ? `Found ${results.length} objects matching "${query}"`
              : "Showing featured objects studio selection"}
          </div>
        </div>

        {/* Results Grid */}
        <div className="pt-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {results.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <p className="text-lg font-bold uppercase tracking-tight">
                No objects found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs font-mono text-neutral-500">
                Try searching for Card Bar, Tetrapod, Spring Table, Calendar, or Vase.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-mono">Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
