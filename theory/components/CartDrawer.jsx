"use client";

import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Scale } from "lucide-react";
import { calculateTieredShipping } from "@/lib/productSections";

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}) {
  const FREE_SHIPPING_THRESHOLD = 2999;

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const progressPercentage = Math.min(
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
    100
  );

  const amountNeeded = FREE_SHIPPING_THRESHOLD - subtotal;

  const formattedSubtotal = subtotal.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const shippingInfo = calculateTieredShipping(items, subtotal);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Slide-out Drawer Panel */}
      <div
        className={`absolute top-0 right-0 bottom-0 w-full sm:w-[480px] max-w-full bg-[#fffdf8] shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#e5e3dc] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#121212]" />
            <h2 className="text-base font-bold tracking-tight uppercase font-sans text-[#121212]">
              Shopping Bag ({items.reduce((acc, item) => acc + item.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black transition-colors"
            aria-label="Close cart"
          >
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-6 py-3.5 bg-[#f7f5ef] border-b border-[#e5e3dc]">
          <div className="flex justify-between items-center text-xs font-mono mb-2">
            {amountNeeded > 0 ? (
              <span>
                Add <strong className="text-black">Rs. {amountNeeded.toLocaleString("en-IN")}</strong> more for Free Shipping!
              </span>
            ) : (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                You have unlocked FREE Standard Shipping!
              </span>
            )}
          </div>
          <div className="w-full h-1.5 bg-[#e5e3dc] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#121212] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#f0eee6]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#f0eee6] flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-neutral-400" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold uppercase tracking-tight">
                  Your bag is empty
                </p>
                <p className="text-xs text-neutral-500 font-mono">
                  Explore our curated objects to start a collection.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-3 bg-[#121212] text-[#fffdf8] text-xs font-mono tracking-widest uppercase hover:bg-neutral-800 transition-colors"
              >
                Browse Objects
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4 items-center">
                {/* Product Thumbnail */}
                <div className="w-20 h-24 bg-neutral-100 flex-shrink-0 border border-[#e5e3dc] overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info & Quantity controls */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h4 className="text-xs md:text-sm font-bold uppercase tracking-tight line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="text-xs font-mono font-semibold text-neutral-800">
                    Rs. {Number(item.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center border border-[#e5e3dc] bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-neutral-500 hover:text-black hover:bg-neutral-100"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-neutral-500 hover:text-black hover:bg-neutral-100"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[11px] font-mono text-neutral-400 hover:text-rose-600 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Drawer Sticky Bottom Summary */}
        {items.length > 0 && (
          <div className="p-6 bg-[#f7f5ef] border-t border-[#e5e3dc] space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono text-neutral-600">
                <span className="flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Parcel Weight:</span>
                </span>
                <span className="font-semibold text-neutral-800">~{shippingInfo.totalWeightKg} kg</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono text-neutral-600">
                <span>Delivery:</span>
                <span>
                  {shippingInfo.shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase">FREE</span>
                  ) : (
                    `Rs. ${shippingInfo.shippingFee}.00 (${shippingInfo.tierLabel})`
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center text-base font-bold font-mono text-[#121212] pt-2 border-t border-[#e5e3dc]">
                <span>SUBTOTAL:</span>
                <span>Rs. {formattedSubtotal}</span>
              </div>
            </div>

            {/* Sticky Mobile/Desktop Checkout CTA */}
            <div>
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full py-4 bg-[#121212] text-[#fffdf8] text-xs font-mono font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Proceed To Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
