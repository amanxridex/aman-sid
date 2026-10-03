"use client";

import { useState, useRef } from "react";
import {
  Upload,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
  Plus,
  Link as LinkIcon,
  Check,
  AlertCircle,
  Move,
  Crop,
  Sliders,
} from "lucide-react";
import ImageCropModal from "@/components/admin/ImageCropModal";

export default function ProductImageUploader({
  images = [],
  onChange,
  maxImages = 8,
}) {
  const [urlInput, setUrlInput] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  // Crop / Adjust Modal State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [cropTargetIndex, setCropTargetIndex] = useState(null); // null means appending new

  // Handle local file upload from computer
  const handleFileChange = (e) => {
    setUploadError("");
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      setUploadError(`Maximum of ${maxImages} images reached.`);
      return;
    }

    // If single file uploaded, open crop & adjust modal with dimension suggestions
    if (files.length === 1) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select a valid image file (PNG, JPG, WebP).");
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setCropImageSrc(loadEvent.target?.result);
        setCropTargetIndex(null); // appending new
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // If multiple files uploaded, read them all
    const filesToProcess = files.slice(0, remainingSlots);
    const readPromises = filesToProcess.map((file) => {
      return new Promise((resolve) => {
        if (!file.type.startsWith("image/")) {
          resolve(null);
          return;
        }
        const reader = new FileReader();
        reader.onload = (loadEvent) => resolve(loadEvent.target?.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then((results) => {
      const validImages = results.filter(Boolean);
      if (validImages.length > 0) {
        onChange([...images, ...validImages]);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  };

  // Callback when crop modal applies edited image
  const handleCropApply = (editedDataUrl) => {
    if (cropTargetIndex !== null && cropTargetIndex >= 0) {
      // Editing an existing image
      const updated = [...images];
      updated[cropTargetIndex] = editedDataUrl;
      onChange(updated);
    } else {
      // Appending newly uploaded image
      if (images.length < maxImages) {
        onChange([...images, editedDataUrl]);
      }
    }
  };

  // Open crop dialog for an existing image
  const handleOpenEditModal = (index) => {
    setCropImageSrc(images[index]);
    setCropTargetIndex(index);
    setCropModalOpen(true);
  };

  // Handle adding image from URL
  const handleAddUrl = (e) => {
    if (e) e.preventDefault();
    setUploadError("");
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (images.length >= maxImages) {
      setUploadError(`Maximum of ${maxImages} images reached.`);
      return;
    }

    // Open crop modal for URL image to allow adjustment
    setCropImageSrc(trimmed);
    setCropTargetIndex(null);
    setCropModalOpen(true);
    setUrlInput("");
  };

  // Remove image
  const handleRemove = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  // Set as primary / hero image (move to index 0)
  const handleSetPrimary = (index) => {
    if (index === 0) return;
    const target = images[index];
    const remaining = images.filter((_, idx) => idx !== index);
    onChange([target, ...remaining]);
  };

  // Move image left (swap with index - 1)
  const handleMoveLeft = (index) => {
    if (index === 0) return;
    const updated = [...images];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  // Move image right (swap with index + 1)
  const handleMoveRight = (index) => {
    if (index >= images.length - 1) return;
    const updated = [...images];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...images];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    onChange(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="p-6 bg-white border border-[#e5e3dc] rounded space-y-5 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e5e3dc] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#121212]">
              Media &amp; Product Imagery
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#f5f2eb] text-[#001540] rounded font-semibold border border-[#e5e3dc]">
              {images.length} / {maxImages} Uploaded
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            <strong>First image</strong> is the Hero photo in catalogs. <strong>Second image</strong> is the hover flip photo. Drag cards to reorder.
          </p>
        </div>

        {images.length > 1 && (
          <span className="text-[11px] font-mono text-neutral-500 bg-[#faf8f5] px-2.5 py-1 rounded border border-[#e5e3dc] flex items-center gap-1.5 self-start sm:self-auto">
            <Move className="w-3 h-3 text-neutral-400" />
            <span>Drag cards to reorder</span>
          </span>
        )}
      </div>

      {uploadError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-700 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* DRAG & DROP CARDS GRID */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {images.map((img, idx) => {
            const isHero = idx === 0;
            const isHoverFlip = idx === 1;
            const isDragging = draggedIndex === idx;
            const isDragOver = dragOverIndex === idx;

            return (
              <div
                key={idx}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e, idx)}
                className={`relative aspect-square rounded overflow-hidden flex flex-col justify-between border-2 transition-all cursor-grab active:cursor-grabbing group bg-[#f5f2eb] ${
                  isHero
                    ? "border-[#001540] shadow-md ring-2 ring-[#001540]/20"
                    : "border-[#e5e3dc] hover:border-neutral-700"
                } ${isDragging ? "opacity-30 scale-95" : "opacity-100"} ${
                  isDragOver ? "ring-2 ring-[#001540] border-[#001540]" : ""
                }`}
              >
                {/* Image */}
                <img
                  src={img}
                  alt={`Product Image ${idx + 1}`}
                  className="w-full h-full object-cover pointer-events-none select-none"
                />

                {/* Status Badges */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 pointer-events-none">
                  {isHero && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#001540] text-white text-[9px] font-mono font-bold uppercase rounded shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Hero (Primary)
                    </span>
                  )}
                  {isHoverFlip && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#001540]/90 text-white text-[9px] font-mono font-bold uppercase rounded shadow-sm">
                      Hover Flip
                    </span>
                  )}
                  {!isHero && !isHoverFlip && (
                    <span className="px-1.5 py-0.5 bg-black/75 text-white text-[9px] font-mono rounded">
                      #{idx + 1}
                    </span>
                  )}
                </div>

                {/* Hover Action Overlay & Reorder Controls */}
                <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-20">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/90 font-bold">
                      Position #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(idx);
                        }}
                        className="p-1 bg-white/90 hover:bg-white text-black rounded transition-colors"
                        title="Crop / Adjust Image"
                      >
                        <Crop className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(idx);
                        }}
                        className="p-1 bg-rose-600 hover:bg-rose-500 text-white rounded transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Positioning Actions */}
                  <div className="space-y-1.5 pt-4">
                    {!isHero && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetPrimary(idx);
                        }}
                        className="w-full py-1 bg-white hover:bg-neutral-100 text-black text-[10px] font-mono font-bold rounded uppercase tracking-wider transition-colors shadow-sm"
                      >
                        Make Hero
                      </button>
                    )}

                    <div className="flex items-center justify-between gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveLeft(idx);
                        }}
                        className="flex-1 py-1 bg-white/90 hover:bg-white text-black disabled:opacity-40 text-[10px] font-mono rounded flex items-center justify-center transition-colors"
                        title="Move left"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx >= images.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveRight(idx);
                        }}
                        className="flex-1 py-1 bg-white/90 hover:bg-white text-black disabled:opacity-40 text-[10px] font-mono rounded flex items-center justify-center transition-colors"
                        title="Move right"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State Prompt */
        <div className="p-8 text-center bg-[#faf8f5] border-2 border-dashed border-[#e5e3dc] rounded space-y-2">
          <ImageIcon className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#121212] font-mono">
            No Product Images Added Yet
          </h3>
          <p className="text-[11px] font-mono text-neutral-500 max-w-sm mx-auto">
            Upload from your computer or enter an image URL. The first image added will automatically become the product’s <strong>Hero photo</strong>.
          </p>
        </div>
      )}

      {/* COMPUTER UPLOAD ZONE */}
      {images.length < maxImages && (
        <div className="space-y-4 pt-2">
          
          {/* File Picker / Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 border-2 border-dashed border-[#d5d2c8] hover:border-[#001540] bg-[#faf8f5] hover:bg-[#f5f2eb] rounded text-center cursor-pointer transition-all space-y-2 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/png,image/jpeg,image/webp,image/jpg,image/avif"
              className="hidden"
            />
            <div className="w-10 h-10 rounded-full bg-white border border-[#e5e3dc] group-hover:border-[#001540] flex items-center justify-center mx-auto text-[#001540] transition-colors">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#121212] block">
                Choose Image Files from Your Computer
              </span>
              <span className="text-[11px] font-mono text-neutral-500 block mt-0.5">
                Recommended 1000 × 1000 px • Crop &amp; adjust dialog will appear • Up to {maxImages} images
              </span>
            </div>
          </div>

          {/* Alternative: Add Image by URL */}
          <div className="pt-2 border-t border-[#e5e3dc] space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block font-semibold">
              Or paste image URL:
            </span>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/product-photo.webp"
                className="flex-1 bg-[#f5f2eb] border border-[#e5e3dc] rounded px-3 py-2 text-xs font-mono text-black placeholder:text-neutral-400 focus:outline-none focus:border-[#001540] focus:bg-white transition-colors"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddUrl();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-4 py-2 bg-[#001540] hover:bg-[#002266] text-white rounded text-xs font-mono font-semibold transition-colors"
              >
                Add URL
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Image Crop & Adjust Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={cropImageSrc}
        onApply={handleCropApply}
        title="Crop & Adjust Product Image"
        recommendedWidth={1000}
        recommendedHeight={1000}
        initialAspect="1:1"
      />

    </div>
  );
}
