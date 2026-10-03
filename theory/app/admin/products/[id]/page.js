"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getProductById } from "@/lib/supabase";
import {
  ArrowLeft,
  Save,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Plus,
  X,
  ExternalLink,
  Layers,
  DollarSign,
  Tag,
  Package,
} from "lucide-react";
import ProductImageUploader from "@/components/admin/ProductImageUploader";
import {
  DEFAULT_PRODUCT_SECTIONS,
  parseProductSections,
  serializeProductSections,
} from "@/lib/productSections";
import ProductSectionsEditor from "@/components/admin/ProductSectionsEditor";

export default function EditProductPage({ params }) {
  const unwrappedParams = use(params);
  const productId = unwrappedParams?.id;
  const router = useRouter();
  const { products, collections, updateProduct, deleteProduct } = useStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [sections, setSections] = useState(DEFAULT_PRODUCT_SECTIONS);
  const hasLoadedRef = useRef(false);

  const [formData, setFormData] = useState({
    title: "",
    handle: "",
    description: "",
    product_type: "Tableware & Dining",
    category: "Tableware & Dining",
    price: "0",
    compare_at_price: "",
    inventory_quantity: 25,
    available: true,
    tags: "",
    images: [],
  });

  useEffect(() => {
    hasLoadedRef.current = false;
  }, [productId]);

  // Load product data
  useEffect(() => {
    if (hasLoadedRef.current) return;

    async function loadData() {
      // 1. Try finding in StoreContext first
      const foundInStore = products.find(
        (p) => String(p.id) === String(productId) || p.handle === productId
      );

      if (foundInStore) {
        populateForm(foundInStore);
        setLoading(false);
        hasLoadedRef.current = true;
        return;
      }

      // 2. Fetch directly from Supabase
      try {
        setLoading(true);
        const dbProduct = await getProductById(productId);
        if (dbProduct) {
          populateForm(dbProduct);
          hasLoadedRef.current = true;
        } else {
          setErrorMsg("Product not found in database.");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setErrorMsg("Failed to load product from database.");
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadData();
    }
  }, [productId, products]);

  const populateForm = (p) => {
    const { descriptionText, sections: parsedSections } = parseProductSections(
      p.description
    );
    setSections(parsedSections);

    setFormData({
      id: p.id,
      title: p.title || "",
      handle: p.handle || "",
      description: descriptionText || "",
      product_type: p.product_type || p.category || "Tableware & Dining",
      category: p.category || p.product_type || "Tableware & Dining",
      price: String(p.price || 0),
      compare_at_price: p.compare_at_price ? String(p.compare_at_price) : "",
      inventory_quantity: p.inventory_quantity ?? p.inventory ?? 25,
      available: p.available !== false,
      tags: Array.isArray(p.tags) ? p.tags.join(", ") : String(p.tags || ""),
      images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []),
    });
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a product title.");
      return;
    }
    if (formData.images.length === 0) {
      alert("Please keep at least one product image.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const tagList = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const encodedDescription = serializeProductSections(
        formData.description,
        sections
      );

      const updates = {
        title: formData.title.trim(),
        handle: formData.handle.trim(),
        description: encodedDescription,
        product_type: formData.product_type,
        category: formData.category || formData.product_type,
        price: parseFloat(formData.price) || 0,
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        inventory_quantity: parseInt(formData.inventory_quantity, 10) || 0,
        available: formData.available,
        tags: tagList,
        images: formData.images,
      };

      await updateProduct(formData.id || productId, updates);
      setSuccessMsg("Product successfully saved & synced to Supabase DB in real time!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Save error:", err);
      setErrorMsg("Failed to save product to Supabase. Check console or network.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${formData.title}" from Supabase? This action is permanent.`)) {
      try {
        await deleteProduct(formData.id || productId);
        router.push("/admin/products");
      } catch (err) {
        alert("Failed to delete product from database.");
      }
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center font-mono text-xs text-neutral-500 space-y-3">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
        <p>Loading product details from Supabase...</p>
      </div>
    );
  }

  const primaryImage = formData.images[0] || "/og-image.jpg";
  const numPrice = parseFloat(formData.price) || 0;
  const numCompare = parseFloat(formData.compare_at_price) || 0;
  const discountPct = numCompare > numPrice ? Math.round(((numCompare - numPrice) / numCompare) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Top Header */}
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
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <Link href="/admin" className="hover:text-black">Admin</Link>
              <span>/</span>
              <Link href="/admin/products" className="hover:text-black">Catalog</Link>
              <span>/</span>
              <span className="text-black font-semibold">Edit Product</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#121212] mt-0.5 line-clamp-1">
              {formData.title || "Edit Product"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/products/${formData.handle}`}
            target="_blank"
            className="px-3 py-2 bg-[#f5f2eb] hover:bg-[#ede9e0] text-black text-xs font-mono rounded border border-[#e5e3dc] transition-colors inline-flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live ↗</span>
          </Link>

          <button
            onClick={handleDelete}
            className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded transition-colors"
            title="Delete product from database"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-[#121212] hover:bg-neutral-800 text-white text-xs font-bold font-mono uppercase tracking-wider rounded transition-colors shadow-sm disabled:opacity-50 inline-flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving to Supabase...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 text-xs font-mono flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-300 rounded text-rose-900 text-xs font-mono flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Form Left, Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Inputs (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* General Information Card */}
          <div className="bg-white border border-[#e5e3dc] rounded p-5 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#121212] font-mono border-b border-[#e5e3dc] pb-2">
              General Information
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-600 font-semibold block">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. 3D Lemon Scalloped Serving Platter"
                className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-xs font-mono text-black focus:outline-none focus:border-black focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-600 font-semibold block">
                URL Handle / Slug
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-neutral-400">/products/</span>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  placeholder="3d-lemon-scalloped-serving-platter"
                  className="flex-1 bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-xs font-mono text-black focus:outline-none focus:border-black focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-600 font-semibold block">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Handcrafted stoneware piece finished with artisan glaze..."
                className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-xs font-mono text-black focus:outline-none focus:border-black focus:bg-white"
              />
            </div>
          </div>

          {/* Card: 4 Product Accordion Sections (Object Details, Material & Dimensions, Care, Shipping) */}
          <ProductSectionsEditor sections={sections} onChange={setSections} />

          {/* Pricing & Inventory Card */}
          <div className="bg-white border border-[#e5e3dc] rounded p-5 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#121212] font-mono border-b border-[#e5e3dc] pb-2">
              Pricing &amp; Inventory (Direct Supabase DB)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-600 font-semibold block">
                  Price (INR ₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-mono text-neutral-400">₹</span>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1850"
                    className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded pl-7 pr-3 py-2 text-xs font-mono font-bold text-black focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-600 font-semibold block">
                  Compare-at Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-mono text-neutral-400">₹</span>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={formData.compare_at_price}
                    onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                    placeholder="Optional original price"
                    className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded pl-7 pr-3 py-2 text-xs font-mono text-black focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-600 font-semibold block">
                  Inventory Stock
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={formData.inventory_quantity}
                  onChange={(e) => setFormData({ ...formData, inventory_quantity: e.target.value })}
                  placeholder="50"
                  className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-xs font-mono text-black focus:outline-none focus:border-black focus:bg-white"
                />
              </div>
            </div>

            {discountPct > 0 && (
              <div className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded inline-block">
                Save {discountPct}% Customer Discount applied on storefront
              </div>
            )}
          </div>

          {/* Media & Images Gallery with Computer File Upload & Drag-and-Drop */}
          <ProductImageUploader
            images={formData.images}
            onChange={(newImages) =>
              setFormData((prev) => ({ ...prev, images: newImages }))
            }
            maxImages={8}
          />

        </div>

        {/* Right Column: Status & Live Preview (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Status & Category Card */}
          <div className="bg-white border border-[#e5e3dc] rounded p-5 space-y-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#121212] font-mono border-b border-[#e5e3dc] pb-2">
              Organization &amp; Status
            </h2>

            {/* Availability Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-600 font-semibold block">
                Storefront Availability
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, available: !formData.available })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.available ? "bg-emerald-600" : "bg-neutral-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.available ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-xs font-mono font-bold">
                  {formData.available ? (
                    <span className="text-emerald-700">Active (Live on Website)</span>
                  ) : (
                    <span className="text-neutral-500">Draft / Hidden</span>
                  )}
                </span>
              </div>
            </div>

            {/* Category / Product Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-600 font-semibold block">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                    product_type: e.target.value,
                  })
                }
                className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-xs font-mono text-black focus:outline-none focus:border-black focus:bg-white"
              >
                {collections.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-600 font-semibold block">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Ceramics, Tableware, New Drop"
                className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-xs font-mono text-black focus:outline-none focus:border-black focus:bg-white"
              />
            </div>
          </div>

          {/* Live Storefront Card Preview */}
          <div className="bg-white border border-[#e5e3dc] rounded p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#e5e3dc] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#121212] font-mono">
                Live Storefront Card Preview
              </h2>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">● Real Time</span>
            </div>

            <div className="bg-[#fffdf8] border border-[#e5e3dc] rounded overflow-hidden max-w-xs mx-auto shadow-sm">
              <div className="aspect-square relative bg-neutral-100 overflow-hidden">
                <img
                  src={primaryImage}
                  alt={formData.title}
                  className="w-full h-full object-cover"
                />
                {!formData.available && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-neutral-900 text-white text-[9px] font-mono font-bold uppercase tracking-wider rounded">
                    Sold Out
                  </span>
                )}
                {discountPct > 0 && formData.available && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-700 text-white text-[9px] font-mono font-bold uppercase tracking-wider rounded">
                    Save {discountPct}%
                  </span>
                )}
              </div>

              <div className="p-3.5 space-y-1 font-mono text-xs">
                <div className="text-[10px] text-neutral-400 uppercase tracking-widest truncate">
                  {formData.category}
                </div>
                <div className="font-bold text-[#121212] line-clamp-1">
                  {formData.title || "Product Title"}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-extrabold text-[#121212]">
                    Rs. {numPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  {numCompare > numPrice && (
                    <span className="text-[11px] text-neutral-400 line-through">
                      Rs. {numCompare.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-[#f5f2eb] border border-[#e5e3dc] rounded p-4 space-y-3 font-mono text-xs">
            <div className="text-neutral-600 font-semibold">Database Sync Note:</div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Edits made here are immediately applied to the live Supabase database and reflected on the customer storefront in real time.
            </p>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-2.5 bg-[#121212] hover:bg-neutral-800 text-white font-bold uppercase tracking-wider rounded transition-colors shadow-sm disabled:opacity-50 text-xs"
            >
              {saving ? "Syncing with Supabase..." : "Save Product Directly"}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
