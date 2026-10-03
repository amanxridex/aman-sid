"use client";

import { X, ShoppingBag, Plus, Minus, Check, Scale } from "lucide-react";
import { useState, useMemo } from "react";
import { parseProductSpecifications } from "@/lib/productSections";

export default function QuickViewModal({ product, isOpen, onClose, onAddToCart }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const specs = useMemo(() => {
    return parseProductSpecifications(product?.description);
  }, [product?.description]);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onAddToCart({ ...product, quantity });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const formattedPrice = Number(product.price).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-3xl bg-[#fffdf8] border border-[#121212] shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white text-black transition-colors rounded-full"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Imagery */}
        <div className="w-full md:w-1/2 bg-neutral-100 p-6 flex flex-col justify-between items-center border-b md:border-b-0 md:border-r border-[#e5e3dc]">
          <div className="w-full aspect-square relative bg-white border border-[#e5e3dc] overflow-hidden">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto max-w-full pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-14 h-14 border flex-shrink-0 transition-colors ${
                    selectedImage === i ? "border-[#121212] ring-1 ring-black" : "border-[#e5e3dc]"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">
                {product.product_type || "The Cozy Theory"}
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-tight text-[#121212]">
                {product.title}
              </h2>
              <div className="text-lg font-mono font-bold text-[#121212] mt-1">
                Rs. {formattedPrice}
              </div>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              Artisanal homeware crafted to stay cozy, stay you. Hand-finished stoneware and tactile textures that bring character to your space.
            </p>

            {/* Quick Specs */}
            {specs && (specs.weight || specs.dimensions || specs.material) && (
              <div className="p-3 bg-[#faf8f2] border border-[#e5e3dc] rounded space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-500 border-b border-[#e5e3dc] pb-1">
                  <span className="font-bold text-[#001540]">Specifications</span>
                  <span className="flex items-center gap-1">
                    <Scale className="w-3 h-3" />
                    <span>Courier Weight</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {specs.material && (
                    <div>
                      <span className="text-neutral-400 block text-[9px] uppercase">Material</span>
                      <span className="font-semibold text-neutral-900">{specs.material}</span>
                    </div>
                  )}
                  {specs.weight && (
                    <div>
                      <span className="text-neutral-400 block text-[9px] uppercase">Weight</span>
                      <span className="font-semibold text-neutral-900">{specs.weight}</span>
                    </div>
                  )}
                  {specs.dimensions && (
                    <div className="col-span-2">
                      <span className="text-neutral-400 block text-[9px] uppercase">Dimensions</span>
                      <span className="font-semibold text-neutral-900">{specs.dimensions}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-mono uppercase text-neutral-500 block">
                Quantity:
              </label>
              <div className="flex items-center border border-[#e5e3dc] w-fit bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-neutral-500 hover:text-black hover:bg-neutral-100"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-xs font-mono font-bold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-neutral-500 hover:text-black hover:bg-neutral-100"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Add to Bag CTA */}
          <div className="pt-6 space-y-2">
            <button
              onClick={handleAdd}
              disabled={!product.available}
              className={`w-full py-4 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
                added
                  ? "bg-emerald-600 text-white"
                  : product.available
                  ? "bg-[#121212] text-[#fffdf8] hover:bg-neutral-800"
                  : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added To Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.available ? "Add To Bag" : "Sold Out"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
