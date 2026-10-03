"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Check, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, e);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const primaryImage = product.images[0] || "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/Product_79-01.png?v=1784392136";
  const secondaryImage = product.images[1] || primaryImage;

  const formattedPrice = Number(product.price).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedComparePrice = product.compare_at_price
    ? Number(product.compare_at_price).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : null;

  return (
    <div className="group flex flex-col bg-[#fffdf8] border border-[#e5e3dc] hover:border-[#121212] transition-colors relative">
      <Link href={`/products/${product.handle}`} className="flex flex-col flex-1">
        {/* Media Container with 1:1 / 4:5 aspect ratio and dual image flip */}
        <div className="product-card-media aspect-[4/5] sm:aspect-square w-full relative">
          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
            {!product.available && (
              <span className="text-[9px] md:text-[10px] font-mono uppercase px-2 py-0.5 bg-[#121212] text-[#fffdf8] tracking-widest font-semibold">
                Sold Out
              </span>
            )}
            {product.tags.some((t) => t.toLowerCase().includes("bestseller")) && (
              <span className="text-[9px] md:text-[10px] font-mono uppercase px-2 py-0.5 bg-[#e5e3dc] text-[#121212] tracking-wider font-medium">
                Bestseller
              </span>
            )}
          </div>

          {/* Primary Image */}
          <img
            src={primaryImage}
            alt={product.title}
            className="primary-img absolute inset-0 w-full h-full object-cover object-center"
            loading="lazy"
          />

          {/* Secondary Image (lifestyle/alternate view on hover) */}
          <img
            src={secondaryImage}
            alt={`${product.title} alternate`}
            className="secondary-img absolute inset-0 w-full h-full object-cover object-center opacity-0"
            loading="lazy"
          />

          {/* Desktop Quick Actions on Hover */}
          <div className="hidden md:flex absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity justify-between items-center z-10">
            {onQuickView && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(product);
                }}
                className="px-2.5 py-2 bg-white/90 text-black hover:bg-white text-xs font-mono uppercase flex items-center gap-1 shadow-md transition-colors"
                title="Quick View"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleAdd}
              disabled={!product.available}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono tracking-wider uppercase transition-all shadow-md ml-auto ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : product.available
                  ? "bg-[#fffdf8] text-[#121212] hover:bg-black hover:text-white"
                  : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add To Bag</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Product Details Card Footer */}
        <div className="p-3 md:p-4 flex flex-col justify-between flex-1 gap-2 bg-[#fffdf8]">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mb-0.5 truncate">
              {product.product_type || "The Cozy Theory"}
            </span>
            <h3 className="text-xs md:text-sm font-semibold tracking-tight uppercase line-clamp-2 text-[#121212] group-hover:underline">
              {product.title}
            </h3>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#f0eee6]">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs md:text-sm font-mono font-bold text-[#121212]">
                Rs. {formattedPrice}
              </span>
              {formattedComparePrice && (
                <span className="text-[11px] font-mono text-neutral-400 line-through">
                  Rs. {formattedComparePrice}
                </span>
              )}
            </div>

            {/* Mobile Direct Add button */}
            <button
              type="button"
              onClick={handleAdd}
              disabled={!product.available}
              className="md:hidden w-8 h-8 rounded-full border border-[#e5e3dc] flex items-center justify-center text-[#121212] active:bg-[#121212] active:text-[#fffdf8] transition-colors"
              aria-label={`Add ${product.title} to bag`}
            >
              {isAdded ? <Check className="w-4 h-4 text-emerald-600" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
