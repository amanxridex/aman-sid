"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  ArrowLeft,
  Plus,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  DollarSign,
  Tag,
  Layers,
  ExternalLink,
} from "lucide-react";
import { DEFAULT_PRODUCT_SECTIONS, serializeProductSections } from "@/lib/productSections";
import ProductSectionsEditor from "@/components/admin/ProductSectionsEditor";
import ProductImageUploader from "@/components/admin/ProductImageUploader";

export default function AddNewProductPage() {
  const router = useRouter();
  const { collections, addProduct } = useStore();

  const [formData, setFormData] = useState({
    title: "",
    handle: "",
    description: "",
    product_type: "Tableware & Dining",
    price: "1850",
    compare_at_price: "2450",
    cost: "950",
    inventory: "30",
    sku: "TCT-CER-01",
    available: true,
    tags: "Curated Living, Artisanal Stoneware, New Drop",
    images: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProduct, setCreatedProduct] = useState(null);
  const [sections, setSections] = useState(DEFAULT_PRODUCT_SECTIONS);

  // Auto-generate slug when title changes (if handle hasn't been manually detached)
  const handleTitleChange = (val) => {
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setFormData((prev) => ({
      ...prev,
      title: val,
      handle: prev.handle === "" || prev.handle === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") ? autoSlug : prev.handle,
    }));
  };

  const handleSaveProduct = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a product title.");
      return;
    }
    if (formData.images.length === 0) {
      alert("Please add at least one product image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const tagList = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const encodedDescription = serializeProductSections(
        formData.description,
        sections
      );

      const saved = await addProduct({
        ...formData,
        description: encodedDescription,
        tags: tagList,
      });

      setIsSubmitting(false);
      setCreatedProduct(saved);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5e3dc]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 bg-[#f5f2eb] hover:bg-[#ede9e0] text-neutral-700 hover:text-black rounded transition-colors border border-[#e5e3dc]"
            aria-label="Back to products list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#001540] font-bold">
              Catalog Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#121212] mt-0.5">
              Add New Product
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-[#f5f2eb] hover:bg-[#ede9e0] text-neutral-700 text-xs font-mono rounded border border-[#e5e3dc] transition-colors"
          >
            Discard
          </Link>
          <button
            onClick={handleSaveProduct}
            disabled={isSubmitting}
            className="px-5 py-2 bg-[#121212] hover:bg-neutral-800 text-white text-xs font-bold font-mono uppercase tracking-wider rounded transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? "Publishing Object..." : "Save & Publish"}
          </button>
        </div>
      </div>

      {/* Success Notification Modal */}
      {createdProduct && (
        <div className="p-6 bg-emerald-50 border border-emerald-300 rounded space-y-4 animate-in fade-in">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-700 flex-shrink-0" />
              <div>
                <h3 className="text-base font-bold text-emerald-950">
                  Product Successfully Published to THE COZY THEORY!
                </h3>
                <p className="text-xs font-mono text-emerald-800 mt-0.5">
                  &ldquo;{createdProduct.title}&rdquo; is now live and browseable on the customer storefront.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCreatedProduct(null)}
              className="text-xs font-mono text-neutral-500 hover:text-black"
            >
              Dismiss
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/products/${createdProduct.handle}`}
              target="_blank"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-mono font-bold uppercase rounded transition-colors shadow"
            >
              <span>View Live Product Page ↗</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/admin/products"
              className="px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-mono rounded border border-[#e5e3dc] transition-colors"
            >
              Back to Products List
            </Link>
          </div>
        </div>
      )}

      {/* Main Grid: Form Left (8 Cols), Sidebar Right (4 Cols) */}
      <form onSubmit={handleSaveProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Title, Description, Media, Pricing */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card: Title & Description */}
          <div className="p-6 bg-white border border-[#e5e3dc] rounded space-y-4 shadow-xs">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-1.5 font-semibold">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="E.g. Scalloped Ceramic Serving Bowl in Olive Glaze"
                className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded px-4 py-3 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-1.5 font-semibold">
                Custom URL Handle / Slug
              </label>
              <div className="flex items-center bg-[#f5f2eb] border border-[#e5e3dc] rounded px-3 text-xs font-mono text-neutral-500">
                <span>/products/</span>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  placeholder="scalloped-ceramic-serving-bowl"
                  className="w-full bg-transparent py-2.5 text-black focus:outline-none pl-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-1.5 font-semibold">
                Description & Craftsmanship Details
              </label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the tactile texture, artisanal stoneware material, glaze finish, and ritual purpose of this piece..."
                className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded p-4 text-xs font-mono text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors leading-relaxed"
              />
            </div>
          </div>

          {/* Card: 4 Product Accordion Sections (Object Details, Material & Dimensions, Care, Shipping) */}
          <ProductSectionsEditor sections={sections} onChange={setSections} />

          {/* Card: Media & Product Imagery with Computer Upload and Drag & Drop Reordering */}
          <ProductImageUploader
            images={formData.images}
            onChange={(newImages) => setFormData((prev) => ({ ...prev, images: newImages }))}
            maxImages={8}
          />

          {/* Card: Pricing */}
          <div className="p-6 bg-white border border-[#e5e3dc] rounded space-y-4 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#121212]">
              Pricing (INR ₹)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-1.5 font-semibold">
                  Price (Selling) *
                </label>
                <div className="flex items-center bg-[#f5f2eb] border border-[#e5e3dc] rounded px-3 text-xs font-mono text-black">
                  <span className="text-neutral-500">₹</span>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-transparent py-2.5 pl-2 text-black focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-1.5 font-semibold">
                  Compare-at Price
                </label>
                <div className="flex items-center bg-[#f5f2eb] border border-[#e5e3dc] rounded px-3 text-xs font-mono text-black">
                  <span className="text-neutral-500">₹</span>
                  <input
                    type="number"
                    value={formData.compare_at_price}
                    onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                    className="w-full bg-transparent py-2.5 pl-2 text-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 block mb-1.5 font-semibold">
                  Cost per Item
                </label>
                <div className="flex items-center bg-[#f5f2eb] border border-[#e5e3dc] rounded px-3 text-xs font-mono text-black">
                  <span className="text-neutral-500">₹</span>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="w-full bg-transparent py-2.5 pl-2 text-neutral-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Profit margin summary */}
            {formData.price && formData.cost && (
              <div className="p-3 bg-[#faf8f5] border border-[#e5e3dc] rounded text-xs font-mono flex justify-between items-center text-neutral-600">
                <span>Calculated Profit Margin:</span>
                <span className="text-emerald-700 font-bold">
                  ₹{(Number(formData.price) - Number(formData.cost)).toFixed(2)} ({(((Number(formData.price) - Number(formData.cost)) / Number(formData.price)) * 100).toFixed(1)}%)
                </span>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Organization, Inventory, Status */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card: Status & Visibility */}
          <div className="p-6 bg-white border border-[#e5e3dc] rounded space-y-4 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#121212]">
              Status & Publishing
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-[#faf8f5] border border-[#e5e3dc] rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="accent-[#121212] w-4 h-4"
                />
                <div>
                  <div className="text-xs font-bold text-[#121212] uppercase font-mono">
                    {formData.available ? "Active & In Stock" : "Draft / Out of Stock"}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Live on customer catalog and discoverable in search
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Card: Category & Collection */}
          <div className="p-6 bg-white border border-[#e5e3dc] rounded space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#121212]">
                Category Selection
              </h2>
              <Link href="/admin/collections/new" className="text-xs font-mono text-[#001540] font-bold hover:underline">
                + New
              </Link>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-neutral-600 block mb-1.5 font-semibold">
                Primary Product Type *
              </label>
              <select
                value={formData.product_type}
                onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded px-3 py-2.5 text-xs font-mono text-black focus:outline-none focus:border-black focus:bg-white"
              >
                {collections.map((col) => (
                  <option key={col.id} value={col.title}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-neutral-600 block mb-1.5 font-semibold">
                Product Tags (Comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Curated Living, Ceramic, Stoneware"
                className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded px-3 py-2.5 text-xs font-mono text-black focus:outline-none focus:border-black focus:bg-white"
              />
            </div>
          </div>

          {/* Card: Inventory */}
          <div className="p-6 bg-white border border-[#e5e3dc] rounded space-y-4 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#121212]">
              Inventory & Tracking
            </h2>

            <div>
              <label className="text-xs font-mono uppercase text-neutral-600 block mb-1.5 font-semibold">
                Stock Inventory Quantity
              </label>
              <input
                type="number"
                value={formData.inventory}
                onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded px-3 py-2 text-xs font-mono text-black focus:outline-none focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-neutral-600 block mb-1.5 font-semibold">
                SKU (Stock Keeping Unit)
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded px-3 py-2 text-xs font-mono text-black focus:outline-none focus:border-black focus:bg-white"
              />
            </div>
          </div>

          {/* Bottom Save Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#121212] hover:bg-neutral-800 text-white text-xs font-bold font-mono uppercase tracking-widest rounded transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Publishing..." : "Save Product to Catalog"}
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}
