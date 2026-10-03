"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { parseProductSections, parseProductSpecifications } from "@/lib/productSections";
import {
  Plus,
  Minus,
  ShoppingBag,
  Check,
  ChevronDown,
  RotateCcw,
  Share2,
  Scale,
} from "lucide-react";

import { useStore } from "@/context/StoreContext";

export default function ProductDetailClient({ product: initialProduct, relatedProducts: initialRelated, handle }) {
  const { products } = useStore();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState("details");

  // Prefer latest product from live store context (Supabase), fallback to initialProduct
  const liveProduct = products?.find(
    (p) =>
      p.handle === handle ||
      (initialProduct?.id && String(p.id) === String(initialProduct.id)) ||
      (initialProduct?.handle && p.handle === initialProduct.handle)
  );

  const product = liveProduct || initialProduct || null;
  const relatedProducts =
    products && products.length > 0
      ? products.filter((p) => p.handle !== handle).slice(0, 4)
      : initialRelated || [];

  const productImages =
    product?.images && product.images.length > 0
      ? product.images
      : ["/og-image.jpg"];

  const { sections } = useMemo(
    () => parseProductSections(product?.description),
    [product?.description]
  );

  const specs = useMemo(
    () => parseProductSpecifications(product?.description),
    [product?.description]
  );

  const activeAccordionList = useMemo(() => {
    const list = [];
    if (sections?.objectDetails?.enabled) {
      list.push({
        id: "details",
        title: "Object Details",
        content: sections.objectDetails.content,
      });
    }
    if (sections?.materialDimensions?.enabled) {
      list.push({
        id: "dimensions",
        title: "Material & Dimensions",
        content: sections.materialDimensions.content,
      });
    }
    if (sections?.careMaintenance?.enabled) {
      list.push({
        id: "care",
        title: "Care & Maintenance",
        content: sections.careMaintenance.content,
      });
    }
    if (sections?.shippingReturns?.enabled) {
      list.push({
        id: "shipping",
        title: "Shipping & Returns",
        content: sections.shippingReturns.content,
      });
    }
    return list;
  }, [sections]);

  if (!product) {
    return (
      <div className="bg-[#fffdf8] min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-mono uppercase tracking-widest text-[#121212] mb-3">
          Object Not Found
        </h2>
        <p className="text-sm font-mono text-neutral-500 max-w-md mb-6">
          This object might have been archived or is newly created in the admin portal.
        </p>
        <Link
          href="/collections/all-products"
          className="bg-black text-white px-6 py-3 font-mono text-xs uppercase tracking-wider hover:bg-neutral-800"
        >
          Explore All Objects →
        </Link>
      </div>
    );
  }

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

  const handleAddToCart = (e) => {
    addToCart(product, quantity, e);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    window.location.href = "/checkout";
  };

  const toggleAccordion = (name) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  return (
    <div className="bg-[#fffdf8] min-h-screen">
      
      {/* Breadcrumb Navigation */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4 text-xs font-mono text-neutral-500 flex items-center gap-2 border-b border-[#e5e3dc]">
        <Link href="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link href="/collections/all-products" className="hover:text-black">Objects</Link>
        <span>/</span>
        <span className="text-black font-semibold truncate">{product.title}</span>
      </div>

      {/* Main Product Layout: Gallery & Details */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        
        {/* Left Column: Interactive Product Media Gallery */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Large Image Display */}
          <div className="w-full aspect-square bg-[#f7f5ef] border border-[#e5e3dc] overflow-hidden relative group">
            <img
              id="main-product-image"
              src={productImages[selectedImage] || productImages[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            {!product.available && (
              <span className="absolute top-4 left-4 z-10 bg-black text-white text-xs font-mono uppercase px-3 py-1 font-bold">
                Sold Out
              </span>
            )}
          </div>

          {/* Thumbnails Gallery */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-2">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square border bg-[#f7f5ef] overflow-hidden transition-all ${
                    selectedImage === idx
                      ? "border-[#121212] ring-2 ring-black"
                      : "border-[#e5e3dc] opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information, Pricing, Actions, Accordions */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-mono tracking-[0.2em] text-neutral-500 uppercase block mb-1.5">
                {product.product_type || "The Cozy Theory"} // Curated Living
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#121212] leading-[1.05]">
                {product.title}
              </h1>

              {/* Price Display */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-xl sm:text-2xl font-mono font-bold text-[#121212]">
                  Rs. {formattedPrice}
                </span>
                {formattedComparePrice && (
                  <span className="text-sm font-mono text-neutral-400 line-through">
                    Rs. {formattedComparePrice}
                  </span>
                )}
                <span className="text-[11px] font-mono text-neutral-500">
                  (Tax included. Free Standard Shipping)
                </span>
              </div>
            </div>


            {/* Quick Specifications Strip (Weight & Dimensions) */}
            {specs && (specs.weight || specs.dimensions || specs.material) && (
              <div className="p-4 bg-white border border-[#e5e3dc] shadow-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#001540] font-bold">
                    Specifications
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase flex items-center gap-1">
                    <Scale className="w-3 h-3 text-neutral-500" />
                    <span>Courier Weight Rate</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  {specs.material && (
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase">Material</span>
                      <span className="font-semibold text-neutral-900">{specs.material}</span>
                    </div>
                  )}
                  {specs.weight && (
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase">Weight</span>
                      <span className="font-semibold text-neutral-900">{specs.weight}</span>
                    </div>
                  )}
                  {specs.dimensions && (
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase">Dimensions</span>
                      <span className="font-semibold text-neutral-900">{specs.dimensions}</span>
                    </div>
                  )}
                  {specs.finish && (
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase">Finish</span>
                      <span className="font-semibold text-neutral-900">{specs.finish}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Buy Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono uppercase text-neutral-600 font-semibold">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#e5e3dc] bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 hover:bg-neutral-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-xs font-mono font-bold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2 hover:bg-neutral-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Stacked Full-Width Buttons */}
              <div className="space-y-3 pt-2">
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.available}
                  className={`w-full py-4 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-md ${
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
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{product.available ? "Add to Cart" : "Sold Out"}</span>
                    </>
                  )}
                </button>

                {/* 1-Click Buy It Now (GoKwik style) */}
                {product.available && (
                  <button
                    onClick={handleBuyNow}
                    id="gokwik-buy-now"
                    className="w-full py-4 bg-[#001540] text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-[#002266] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>⚡ Instant Checkout (UPI / Razorpay / PhonePe)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Accordions (Object Details, Material & Dimensions, Care & Maintenance, Shipping & Returns) */}
            {activeAccordionList.length > 0 && (
              <div className="border-t border-[#e5e3dc] divide-y divide-[#e5e3dc] pt-2">
                {activeAccordionList.map((sec) => (
                  <div key={sec.id} className="py-4">
                    <button
                      onClick={() => toggleAccordion(sec.id)}
                      className="w-full flex items-center justify-between text-left text-xs font-mono font-bold uppercase tracking-wider text-[#121212]"
                    >
                      <span>{sec.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openAccordion === sec.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openAccordion === sec.id && (
                      <div className="mt-3 text-xs text-neutral-600 leading-relaxed font-normal whitespace-pre-line">
                        {sec.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Social Share Suite: WhatsApp, Telegram, Facebook, Copy Link */}
          <div className="pt-4 border-t border-[#e5e3dc] space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">
              Share Object With Friends & Collectors
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {/* WhatsApp Share Button with Auto Message */}
              <button
                onClick={() => {
                  const url = window.location.href;
                  const text = `*${product.title}* (₹${formattedPrice})\nDiscover handcrafted living objects by The Cozy Theory:\n${url}`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white rounded border border-[#25D366]/30 transition-colors font-medium"
                title="Share on WhatsApp with preview"
              >
                <span>WhatsApp</span>
              </button>

              {/* Telegram Share Button */}
              <button
                onClick={() => {
                  const url = window.location.href;
                  const text = `${product.title} (₹${formattedPrice}) — The Cozy Theory`;
                  window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc] hover:text-white rounded border border-[#0088cc]/30 transition-colors font-medium"
                title="Share on Telegram"
              >
                <span>Telegram</span>
              </button>

              {/* Facebook Share Button */}
              <button
                onClick={() => {
                  const url = window.location.href;
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1877f2]/10 text-[#1877f2] hover:bg-[#1877f2] hover:text-white rounded border border-[#1877f2]/30 transition-colors font-medium"
                title="Share on Facebook"
              >
                <span>Facebook</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied! Paste anywhere on WhatsApp, Telegram, or Facebook for instant preview card.");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded border border-neutral-300 transition-colors"
                title="Copy Link"
              >
                <Share2 className="w-3 h-3" />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like / Related Objects Grid */}
      <section className="border-t border-[#e5e3dc] py-16 bg-[#f7f5ef]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-1">
                Curated Archive
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#121212]">
                You May Also Like
              </h3>
            </div>
            <Link
              href="/collections/all-products"
              className="text-xs font-mono uppercase underline hover:text-neutral-500"
            >
              View All Objects →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
