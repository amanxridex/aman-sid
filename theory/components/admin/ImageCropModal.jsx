"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Crop,
  RotateCw,
  FlipHorizontal,
  ZoomIn,
  ZoomOut,
  Sun,
  Contrast,
  Check,
  RefreshCw,
  Maximize2,
  Info,
  Sliders,
} from "lucide-react";

export default function ImageCropModal({
  isOpen,
  onClose,
  imageSrc,
  onApply,
  title = "Edit & Crop Image",
  recommendedWidth = 1000,
  recommendedHeight = 1000,
  initialAspect = "1:1", // "1:1" | "4:5" | "16:9" | "21:9" | "free"
}) {
  const [aspect, setAspect] = useState(initialAspect);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState(false);
  const [brightness, setBrightness] = useState(100); // 60 to 140
  const [contrastVal, setContrastVal] = useState(100); // 60 to 140
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [origDimensions, setOrigDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const previewCanvasRef = useRef(null);
  const imgElementRef = useRef(null);

  // Sync aspect when initialAspect changes
  useEffect(() => {
    if (initialAspect) setAspect(initialAspect);
  }, [initialAspect, isOpen]);

  // Load image to determine native dimensions
  useEffect(() => {
    if (!imageSrc || !isOpen) return;
    setImageLoaded(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgElementRef.current = img;
      setOrigDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setImageLoaded(true);
      // Reset adjustments
      setZoom(1);
      setRotation(0);
      setFlipH(false);
      setBrightness(100);
      setContrastVal(100);
      setPan({ x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [imageSrc, isOpen]);

  // Calculate target aspect ratio number
  const getAspectNumeric = useCallback(() => {
    switch (aspect) {
      case "1:1":
        return 1;
      case "4:5":
        return 4 / 5;
      case "16:9":
        return 16 / 9;
      case "21:9":
        return 21 / 9;
      case "free":
      default:
        return origDimensions.width && origDimensions.height
          ? origDimensions.width / origDimensions.height
          : 1;
    }
  }, [aspect, origDimensions]);

  // Redraw preview canvas
  const drawPreview = useCallback(() => {
    const canvas = previewCanvasRef.current;
    const img = imgElementRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext("2d");
    const targetAspect = getAspectNumeric();

    // Canvas size (fixed preview resolution)
    const cw = 500;
    const ch = Math.round(cw / targetAspect);
    canvas.width = cw;
    canvas.height = ch;

    ctx.clearRect(0, 0, cw, ch);

    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrastVal}%)`;

    ctx.save();
    ctx.translate(cw / 2 + pan.x, ch / 2 + pan.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, 1);

    // Calculate scaling to cover canvas based on target aspect
    const isRotated90 = rotation % 180 !== 0;
    const imgW = isRotated90 ? img.naturalHeight : img.naturalWidth;
    const imgH = isRotated90 ? img.naturalWidth : img.naturalHeight;

    const scaleFactor = Math.max(cw / imgW, ch / imgH) * zoom;
    const drawW = img.naturalWidth * scaleFactor;
    const drawH = img.naturalHeight * scaleFactor;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }, [
    imageLoaded,
    getAspectNumeric,
    brightness,
    contrastVal,
    pan,
    rotation,
    flipH,
    zoom,
  ]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Export cropped high-res image
  const handleApply = () => {
    const img = imgElementRef.current;
    if (!img) return;

    const targetAspect = getAspectNumeric();
    // High-res export canvas
    const exportCanvas = document.createElement("canvas");
    let exportW = recommendedWidth || 1000;
    let exportH = Math.round(exportW / targetAspect);

    // Guard max resolution
    if (exportW > 2400) {
      exportW = 2400;
      exportH = Math.round(exportW / targetAspect);
    }

    exportCanvas.width = exportW;
    exportCanvas.height = exportH;

    const ctx = exportCanvas.getContext("2d");
    ctx.filter = `brightness(${brightness}%) contrast(${contrastVal}%)`;

    ctx.save();
    // Scale pan according to export ratio
    const previewCw = 500;
    const ratio = exportW / previewCw;

    ctx.translate(exportW / 2 + pan.x * ratio, exportH / 2 + pan.y * ratio);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, 1);

    const isRotated90 = rotation % 180 !== 0;
    const imgW = isRotated90 ? img.naturalHeight : img.naturalWidth;
    const imgH = isRotated90 ? img.naturalWidth : img.naturalHeight;

    const scaleFactor = Math.max(exportW / imgW, exportH / imgH) * zoom;
    const drawW = img.naturalWidth * scaleFactor;
    const drawH = img.naturalHeight * scaleFactor;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    const outputDataUrl = exportCanvas.toDataURL("image/webp", 0.92);
    onApply(outputDataUrl);
    onClose();
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setBrightness(100);
    setContrastVal(100);
    setPan({ x: 0, y: 0 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fffdf8] border border-[#001540]/20 rounded-lg shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#001540] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Crop className="w-4 h-4 text-sky-300" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              {title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/70 hover:text-white transition-colors rounded hover:bg-white/10"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suggested Dimension Notice Banner */}
        <div className="px-5 py-2.5 bg-[#f0f4fa] border-b border-[#d8e2f0] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#001540] flex-shrink-0" />
            <span className="text-[#001540]">
              <strong>Suggested Dimensions:</strong> {recommendedWidth} × {recommendedHeight} px ({initialAspect} Aspect Ratio)
            </span>
          </div>
          {origDimensions.width > 0 && (
            <div className="text-[11px] text-neutral-600 bg-white px-2.5 py-1 rounded border border-[#d8e2f0]">
              Original: <strong className="text-black">{origDimensions.width} × {origDimensions.height} px</strong>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Left Canvas Preview Area (7 cols) */}
          <div className="md:col-span-7 flex flex-col items-center justify-center bg-neutral-900 rounded p-4 relative min-h-[340px] select-none">
            <div
              className="relative overflow-hidden rounded border border-neutral-700 shadow-inner flex items-center justify-center cursor-grab active:cursor-grabbing max-h-[380px]"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              title="Click & drag to reposition image"
            >
              <canvas
                ref={previewCanvasRef}
                className="max-w-full max-h-[360px] object-contain block"
              />
              <span className="absolute bottom-2 right-2 text-[10px] font-mono text-white/60 bg-black/60 px-2 py-0.5 rounded pointer-events-none">
                Drag to pan
              </span>
            </div>

            {/* Quick Canvas Controls */}
            <div className="flex items-center gap-2 mt-3 text-white/80">
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-[11px] font-mono flex items-center gap-1.5 transition-colors"
                title="Rotate 90 degrees"
              >
                <RotateCw className="w-3 h-3" />
                <span>Rotate</span>
              </button>
              <button
                type="button"
                onClick={() => setFlipH((f) => !f)}
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-[11px] font-mono flex items-center gap-1.5 transition-colors"
                title="Flip horizontally"
              >
                <FlipHorizontal className="w-3 h-3" />
                <span>Flip</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-[11px] font-mono flex items-center gap-1.5 transition-colors"
                title="Reset adjustments"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Right Adjustments & Controls Area (5 cols) */}
          <div className="md:col-span-5 space-y-4 text-xs font-mono">
            
            {/* Aspect Ratio Selector */}
            <div className="space-y-1.5">
              <label className="text-neutral-700 font-bold uppercase tracking-wider block text-[11px]">
                Aspect Ratio Frame
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "1:1", label: "1:1 Square (Products)" },
                  { id: "4:5", label: "4:5 Portrait (Spotlight)" },
                  { id: "16:9", label: "16:9 Wide (Banner)" },
                  { id: "free", label: "Original Ratio" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAspect(item.id)}
                    className={`py-1.5 px-2 text-center rounded border transition-colors text-[10px] uppercase font-semibold ${
                      aspect === item.id
                        ? "bg-[#001540] text-white border-[#001540]"
                        : "bg-white text-neutral-700 border-[#e5e3dc] hover:border-black"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Zoom / Scale Slider */}
            <div className="space-y-1 bg-white p-3 border border-[#e5e3dc] rounded">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-neutral-500" />
                  Scale / Zoom
                </span>
                <span className="text-neutral-600 font-semibold">{zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="3.0"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-[#001540] cursor-pointer"
              />
            </div>

            {/* Brightness Slider */}
            <div className="space-y-1 bg-white p-3 border border-[#e5e3dc] rounded">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-neutral-500" />
                  Brightness
                </span>
                <span className="text-neutral-600 font-semibold">{brightness}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="140"
                step="2"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                className="w-full accent-[#001540] cursor-pointer"
              />
            </div>

            {/* Contrast Slider */}
            <div className="space-y-1 bg-white p-3 border border-[#e5e3dc] rounded">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                  <Contrast className="w-3.5 h-3.5 text-neutral-500" />
                  Contrast
                </span>
                <span className="text-neutral-600 font-semibold">{contrastVal}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="140"
                step="2"
                value={contrastVal}
                onChange={(e) => setContrastVal(parseInt(e.target.value, 10))}
                className="w-full accent-[#001540] cursor-pointer"
              />
            </div>

            {/* Tips Card */}
            <div className="p-3 bg-[#faf8f5] border border-[#e5e3dc] rounded text-[11px] text-neutral-600 space-y-1">
              <p className="font-bold text-[#001540] uppercase">Pro-Tip:</p>
              <p>
                Square (1:1) keeps your catalog neat &amp; aligned. You can zoom in and drag to center the product before saving.
              </p>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-[#f5f2eb] border-t border-[#e5e3dc] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-800 border border-[#e5e3dc] rounded text-xs font-mono font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2 bg-[#001540] hover:bg-[#002266] text-white rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Apply &amp; Save Image</span>
          </button>
        </div>

      </div>
    </div>
  );
}
