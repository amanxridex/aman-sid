"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  Plus,
  Search,
  SlidersHorizontal,
  ExternalLink,
  Trash2,
  Package,
  Layers,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit,
  X,
  Save,
  Check,
  Tag,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";
import {
  DEFAULT_PRODUCT_SECTIONS,
  parseProductSections,
  serializeProductSections,
} from "@/lib/productSections";
import ProductSectionsEditor from "@/components/admin/ProductSectionsEditor";

export default function AdminProductsPage() {
  const { products, collections, deleteProduct, updateProduct } = useStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // all, in-stock, sold-out
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [modalSections, setModalSections] = useState(DEFAULT_PRODUCT_SECTIONS);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState("");
  const [newModalImageUrl, setNewModalImageUrl] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      search.trim() === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.handle.toLowerCase().includes(search.toLowerCase()) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (categoryFilter !== "all") {
      const lowerType = (p.product_type || p.category || "").toLowerCase();
      const lowerFilter = categoryFilter.toLowerCase();
      if (!lowerType.includes(lowerFilter)) return false;
    }

    if (statusFilter === "in-stock" && !p.available) return false;
    if (statusFilter === "sold-out" && p.available) return false;

    return true;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginated = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleDelete = (id, title) => {
    if (confirm(`Are you sure you want to remove "${title}" from Supabase catalog?`)) {
      deleteProduct(id);
    }
  };

  // Quick 1-click status toggle directly to Supabase
  const handleToggleAvailable = async (product) => {
    setTogglingId(product.id);
    try {
      await updateProduct(product.id, { available: !product.available });
    } catch (err) {
      alert("Failed to update status in Supabase.");
    } finally {
      setTogglingId(null);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    const { descriptionText, sections: parsedSections } = parseProductSections(
      product.description
    );
    setModalSections(parsedSections);

    setEditForm({
      id: product.id,
      title: product.title || "",
      handle: product.handle || "",
      description: descriptionText || "",
      product_type: product.product_type || product.category || "Tableware & Dining",
      category: product.category || product.product_type || "Tableware & Dining",
      price: String(product.price || 0),
      compare_at_price: product.compare_at_price ? String(product.compare_at_price) : "",
      inventory_quantity: product.inventory_quantity ?? product.inventory ?? 25,
      available: product.available !== false,
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : String(product.tags || ""),
      images: Array.isArray(product.images) ? [...product.images] : (product.images ? [product.images] : []),
    });
    setEditSuccessMsg("");
    setNewModalImageUrl("");
  };

  const handleCloseEditModal = () => {
    setEditingProduct(null);
    setEditForm(null);
    setEditSuccessMsg("");
  };

  // Save edits directly to Supabase DB in real time
  const handleSaveModal = async (e) => {
    if (e) e.preventDefault();
    if (!editForm.title.trim()) {
      alert("Product title cannot be empty.");
      return;
    }
    if (editForm.images.length === 0) {
      alert("Product must have at least one image.");
      return;
    }

    setSavingEdit(true);
    setEditSuccessMsg("");

    try {
      const tagList = editForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const encodedDescription = serializeProductSections(
        editForm.description,
        modalSections
      );

      const updates = {
        title: editForm.title.trim(),
        handle: editForm.handle.trim(),
        description: encodedDescription,
        product_type: editForm.product_type,
        category: editForm.category,
        price: parseFloat(editForm.price) || 0,
        compare_at_price: editForm.compare_at_price ? parseFloat(editForm.compare_at_price) : null,
        inventory_quantity: parseInt(editForm.inventory_quantity, 10) || 0,
        available: editForm.available,
        tags: tagList,
        images: editForm.images,
      };

      await updateProduct(editForm.id, updates);
      setEditSuccessMsg("Saved & synced to Supabase DB!");
      setTimeout(() => {
        setEditSuccessMsg("");
      }, 3000);
    } catch (err) {
      console.error("Error saving product to Supabase:", err);
      alert("Failed to save product to Supabase. Check console.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleAddModalImage = (e) => {
    if (e) e.preventDefault();
    if (newModalImageUrl.trim()) {
      setEditForm((prev) => ({
        ...prev,
        images: [...prev.images, newModalImageUrl.trim()],
      }));
      setNewModalImageUrl("");
    }
  };

  const handleRemoveModalImage = (idxToRemove) => {
    setEditForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== idxToRemove),
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-[#e5e3dc]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Link href="/admin" className="hover:text-black">Admin</Link>
            <span>/</span>
            <span className="text-black font-semibold">Catalog</span>
            <span className="text-neutral-300">•</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Supabase Live Sync
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-[#121212] mt-1">
            Products ({products.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#121212] hover:bg-neutral-800 text-white rounded text-xs font-mono uppercase font-bold transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-3 sm:p-4 bg-white border border-[#e5e3dc] rounded flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between shadow-xs">
        
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title, handle, or tags..."
            className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded pl-9 pr-4 py-2 text-xs font-mono text-black placeholder:text-neutral-500 focus:outline-none focus:border-black focus:bg-white"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>

        {/* Category & Status Selectors */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          
          <div className="flex items-center gap-1.5 bg-[#f5f2eb] border border-[#e5e3dc] px-2.5 sm:px-3 py-1.5 rounded text-xs font-mono flex-1 sm:flex-initial">
            <Layers className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-neutral-800 focus:outline-none cursor-pointer w-full text-xs"
              aria-label="Filter by Category"
            >
              <option value="all">All Categories</option>
              {collections.map((c) => (
                <option key={c.id} value={c.title}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f5f2eb] border border-[#e5e3dc] px-2.5 sm:px-3 py-1.5 rounded text-xs font-mono flex-1 sm:flex-initial">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-neutral-800 focus:outline-none cursor-pointer w-full text-xs"
              aria-label="Filter by Status"
            >
              <option value="all">All Inventory</option>
              <option value="in-stock">In Stock (Active)</option>
              <option value="sold-out">Draft / Out of Stock</option>
            </select>
          </div>

        </div>
      </div>

      {/* MOBILE PRODUCTS CARDS (Optimized for Phones) */}
      <div className="block md:hidden space-y-3">
        {paginated.map((product) => {
          const stock = product.inventory_quantity ?? product.inventory ?? 0;
          return (
            <div
              key={product.id}
              className="bg-white border border-[#e5e3dc] rounded p-3.5 shadow-xs space-y-3 font-mono text-xs"
            >
              <div className="flex items-start gap-3">
                <img
                  src={product.images && product.images[0] ? product.images[0] : "/og-image.jpg"}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded border border-[#e5e3dc] bg-neutral-100 flex-shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="font-bold text-[#121212] line-clamp-2 text-xs">
                    {product.title}
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate">
                    {product.category || product.product_type || "Homeware"}
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      onClick={() => handleToggleAvailable(product)}
                      disabled={togglingId === product.id}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-colors ${
                        product.available
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100"
                      }`}
                      title="Click to toggle availability in Supabase"
                    >
                      {togglingId === product.id ? "Updating..." : product.available ? "Active" : "Out of Stock"}
                    </button>
                    <span className="text-[10px] text-neutral-500">
                      {stock} in stock
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#e5e3dc]">
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">Price</span>
                  <span className="font-bold text-sm text-[#121212]">
                    Rs. {Number(product.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(product)}
                    className="px-2.5 py-1.5 bg-[#121212] hover:bg-neutral-800 text-white rounded text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                    title="Edit product in real time"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <Link
                    href={`/products/${product.handle}`}
                    target="_blank"
                    className="p-1.5 bg-[#f5f2eb] hover:bg-[#eae6dd] text-black rounded text-[11px] border border-[#e5e3dc] transition-colors"
                    title="View live storefront"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleDelete(product.id, product.title)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {paginated.length === 0 && (
          <div className="py-12 bg-white border border-[#e5e3dc] rounded text-center text-neutral-500 font-mono text-xs">
            No products found matching &ldquo;{search}&rdquo;
          </div>
        )}
      </div>

      {/* DESKTOP PRODUCTS TABLE */}
      <div className="hidden md:block bg-white border border-[#e5e3dc] rounded overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-[#e5e3dc] bg-[#faf8f5] text-neutral-600 uppercase text-[10px]">
                <th className="py-3 px-4 w-14">Media</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Inventory</th>
                <th className="py-3 px-4">Price (INR)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e3dc]">
              {paginated.map((product) => {
                const stock = product.inventory_quantity ?? product.inventory ?? 0;
                return (
                  <tr key={product.id} className="hover:bg-[#faf8f5] transition-colors group">
                    <td className="py-3 px-4">
                      <img
                        src={product.images && product.images[0] ? product.images[0] : "/og-image.jpg"}
                        alt={product.title}
                        className="w-10 h-12 object-cover rounded border border-[#e5e3dc] bg-neutral-100"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="font-bold text-[#121212] group-hover:text-[#001540] transition-colors line-clamp-1 max-w-sm text-left hover:underline cursor-pointer"
                        title="Click to edit product"
                      >
                        {product.title}
                      </button>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        /products/{product.handle}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      {product.category || product.product_type || "Homeware"}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleAvailable(product)}
                        disabled={togglingId === product.id}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          product.available
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100"
                        }`}
                        title="Click to toggle availability in Supabase"
                      >
                        {togglingId === product.id ? "Saving..." : product.available ? "Active" : "Draft / Out"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-neutral-600 font-medium">
                      {stock} in stock
                    </td>
                    <td className="py-3 px-4 font-bold text-[#121212] whitespace-nowrap">
                      Rs. {Number(product.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                      {/* Direct Edit Button */}
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="px-2.5 py-1.5 bg-[#121212] hover:bg-neutral-800 text-white rounded text-[11px] font-semibold inline-flex items-center gap-1 transition-colors shadow-xs"
                        title="Edit product details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {/* View on live store */}
                      <Link
                        href={`/products/${product.handle}`}
                        target="_blank"
                        className="p-1.5 bg-[#f5f2eb] hover:bg-[#eae6dd] text-black rounded inline-flex items-center gap-1 transition-colors border border-[#e5e3dc]"
                        title="View live on customer storefront"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(product.id, product.title)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded inline-flex items-center gap-1 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-neutral-500 font-mono">
                    No products found matching &ldquo;{search}&rdquo;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REAL-TIME PRODUCT EDIT MODAL */}
      {editingProduct && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-4xl bg-white border border-[#121212] shadow-2xl rounded-lg overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e3dc] bg-[#faf8f5]">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-[#121212] text-white rounded">
                  <Edit className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-[#121212] font-mono line-clamp-1">
                    Edit Product // {editForm.title}
                  </h2>
                  <div className="text-[11px] font-mono text-neutral-500 flex items-center gap-2">
                    <span>ID: {editForm.id}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      Real-time Supabase Sync
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/products/${editForm.id}`}
                  className="px-2.5 py-1 text-xs font-mono text-neutral-600 hover:text-black border border-[#e5e3dc] rounded hover:bg-neutral-100 hidden sm:inline-flex items-center gap-1"
                  title="Open full dedicated page"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Full Page</span>
                </Link>

                <button
                  onClick={handleCloseEditModal}
                  className="p-1.5 hover:bg-neutral-200 text-neutral-700 hover:text-black rounded transition-colors"
                  aria-label="Close edit modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notification Banner inside Modal */}
            {editSuccessMsg && (
              <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold">{editSuccessMsg}</span>
              </div>
            )}

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 font-mono text-xs">
              
              {/* Row 1: Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold block">
                    Product Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white text-xs"
                    placeholder="e.g. 3D Lemon Scalloped Serving Platter"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold block">
                    URL Slug / Handle
                  </label>
                  <input
                    type="text"
                    value={editForm.handle}
                    onChange={(e) => setEditForm({ ...editForm, handle: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white text-xs"
                    placeholder="3d-lemon-scalloped-serving-platter"
                  />
                </div>
              </div>

              {/* Row 2: Price, Compare Price, Inventory, Status */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#faf8f5] border border-[#e5e3dc] rounded">
                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold block">
                    Price (₹ INR) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-neutral-400">₹</span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="w-full bg-white border border-[#e5e3dc] rounded pl-6 pr-2.5 py-1.5 text-black font-bold focus:outline-none focus:border-black text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold block">
                    Compare Price (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-neutral-400">₹</span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={editForm.compare_at_price}
                      onChange={(e) => setEditForm({ ...editForm, compare_at_price: e.target.value })}
                      placeholder="Optional"
                      className="w-full bg-white border border-[#e5e3dc] rounded pl-6 pr-2.5 py-1.5 text-black focus:outline-none focus:border-black text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold block">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={editForm.inventory_quantity}
                    onChange={(e) => setEditForm({ ...editForm, inventory_quantity: e.target.value })}
                    className="w-full bg-white border border-[#e5e3dc] rounded px-2.5 py-1.5 text-black font-bold focus:outline-none focus:border-black text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold block">
                    Live Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, available: !editForm.available })}
                    className={`w-full py-1.5 px-2 rounded font-bold border transition-colors text-center cursor-pointer ${
                      editForm.available
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                        : "bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100"
                    }`}
                  >
                    {editForm.available ? "✓ Active (Live)" : "✕ Draft / Out"}
                  </button>
                </div>
              </div>

              {/* Row 3: Category & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold block">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        category: e.target.value,
                        product_type: e.target.value,
                      })
                    }
                    className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white text-xs"
                  >
                    {collections.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-700 font-bold block">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white text-xs"
                    placeholder="Tableware, Ceramics, Artisanal"
                  />
                </div>
              </div>

              {/* Row 4: Description */}
              <div className="space-y-1.5">
                <label className="text-neutral-700 font-bold block">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-2 text-black focus:outline-none focus:border-black focus:bg-white text-xs"
                  placeholder="Detailed product notes, dimensions, and craft details..."
                />
              </div>

              {/* Row 4.5: 4 Product Accordion Sections */}
              <ProductSectionsEditor
                sections={modalSections}
                onChange={setModalSections}
              />

              {/* Row 5: Images List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-neutral-700 font-bold block">
                    Product Images ({editForm.images.length})
                  </label>
                  <span className="text-[10px] text-neutral-400">
                    First image is primary thumbnail
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {editForm.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square bg-[#f5f2eb] rounded border border-[#e5e3dc] overflow-hidden"
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumb ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 px-1 py-0.2 bg-[#121212] text-white text-[8px] font-bold rounded">
                          Primary
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveModalImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new image input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newModalImageUrl}
                    onChange={(e) => setNewModalImageUrl(e.target.value)}
                    placeholder="Paste image path (e.g. /products/drive/Lemon.webp or URL)"
                    className="flex-1 bg-[#fdfbf7] border border-[#e5e3dc] rounded px-3 py-1.5 text-xs text-black focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={handleAddModalImage}
                    className="px-3 py-1.5 bg-[#f5f2eb] hover:bg-neutral-200 border border-[#e5e3dc] text-black font-semibold rounded inline-flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#e5e3dc] bg-[#faf8f5] font-mono text-xs">
              <Link
                href={`/products/${editForm.handle}`}
                target="_blank"
                className="text-neutral-500 hover:text-black inline-flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live View ↗</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 border border-[#e5e3dc] hover:bg-neutral-100 text-neutral-700 rounded transition-colors"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handleSaveModal}
                  disabled={savingEdit}
                  className="px-5 py-2 bg-[#121212] hover:bg-neutral-800 text-white font-bold uppercase tracking-wider rounded transition-colors shadow-sm disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {savingEdit ? (
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

          </div>
        </div>
      )}

    </div>
  );
}
