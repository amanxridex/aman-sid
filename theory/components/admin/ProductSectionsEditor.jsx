"use client";

import { DEFAULT_PRODUCT_SECTIONS } from "@/lib/productSections";
import {
  FileText,
  Box,
  Heart,
  Truck,
  RotateCcw,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ProductSectionsEditor({ sections, onChange }) {
  const currentSections = sections || DEFAULT_PRODUCT_SECTIONS;

  const sectionConfig = [
    {
      key: "objectDetails",
      title: "Object Details",
      icon: FileText,
      description: "Artisanal craftsmanship, design philosophy, and object narrative.",
      placeholder: "Write details about this handcrafted object...",
    },
    {
      key: "materialDimensions",
      title: "Material & Dimensions",
      icon: Box,
      description: "Stoneware type, exact measurements, weight, and origin.",
      placeholder: "E.g. Material: Artisanal Stoneware\nWeight: 850g\nFinish: Matte glaze",
    },
    {
      key: "careMaintenance",
      title: "Care & Maintenance",
      icon: Heart,
      description: "Washing instructions, wiping guidance, and longevity tips.",
      placeholder: "E.g. Wipe clean with a soft dry cloth. Avoid harsh chemical abrasives...",
    },
    {
      key: "shippingReturns",
      title: "Shipping & Returns",
      icon: Truck,
      description: "Delivery timelines, insured shipping terms, and 50% damage policy.",
      placeholder: "E.g. • Standard domestic courier delivery across India\n• 50% refund if damaged in transit",
    },
  ];

  const handleToggle = (key) => {
    const isCurrentlyEnabled = currentSections[key]?.enabled !== false;
    onChange({
      ...currentSections,
      [key]: {
        ...currentSections[key],
        enabled: !isCurrentlyEnabled,
      },
    });
  };

  const handleContentChange = (key, newContent) => {
    onChange({
      ...currentSections,
      [key]: {
        ...currentSections[key],
        content: newContent,
      },
    });
  };

  const handleResetToDefault = (key) => {
    const defaultData = DEFAULT_PRODUCT_SECTIONS[key];
    onChange({
      ...currentSections,
      [key]: {
        ...defaultData,
      },
    });
  };

  const enabledCount = sectionConfig.filter(
    (cfg) => currentSections[cfg.key]?.enabled !== false
  ).length;

  return (
    <div className="bg-white border border-[#e5e3dc] rounded-lg p-5 sm:p-6 space-y-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5e3dc]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#121212] font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#001540]" />
              <span>Product Accordions &amp; Website Specifications</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              {enabledCount} of 4 Active
            </span>
          </div>
          <p className="text-xs font-mono text-neutral-500 mt-1">
            Toggle each option ON to show on the storefront, or OFF to inactivate and hide it. Customize the content for this specific object below.
          </p>
        </div>
      </div>

      {/* 4 Accordion Cards */}
      <div className="space-y-4">
        {sectionConfig.map((cfg, index) => {
          const sectionData = currentSections[cfg.key] || DEFAULT_PRODUCT_SECTIONS[cfg.key];
          const isEnabled = sectionData.enabled !== false;
          const Icon = cfg.icon;

          return (
            <div
              key={cfg.key}
              className={`border rounded-lg p-4 transition-all duration-200 ${
                isEnabled
                  ? "bg-[#fffdf8] border-[#e5e3dc] shadow-2xs"
                  : "bg-neutral-50/70 border-dashed border-neutral-300 opacity-80"
              }`}
            >
              {/* Card Header & Toggle */}
              <div className="flex items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#e5e3dc]/70">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${
                      isEnabled
                        ? "bg-[#121212] text-white"
                        : "bg-neutral-200 text-neutral-400"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono uppercase text-[#121212] tracking-wide">
                        {index + 1}. {cfg.title}
                      </span>
                      {isEnabled ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <Eye className="w-3 h-3 text-emerald-600" />
                          <span>Visible on Website</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-neutral-200/70 text-neutral-600 border border-neutral-300">
                          <EyeOff className="w-3 h-3 text-neutral-400" />
                          <span>Hidden / Inactive</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                      {cfg.description}
                    </p>
                  </div>
                </div>

                {/* 1-Click ON / OFF Switch */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[11px] font-mono font-bold uppercase ${
                      isEnabled ? "text-emerald-700" : "text-neutral-400"
                    }`}
                  >
                    {isEnabled ? "ON" : "OFF"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggle(cfg.key)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isEnabled ? "bg-emerald-600" : "bg-neutral-300"
                    }`}
                    title={isEnabled ? "Click to Turn OFF" : "Click to Turn ON"}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Content Textarea */}
              <div className="pt-3 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                  <span>Section Content for this Product:</span>
                  <button
                    type="button"
                    onClick={() => handleResetToDefault(cfg.key)}
                    className="text-neutral-400 hover:text-black flex items-center gap-1 underline transition-colors"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Reset to Default</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={sectionData.content || ""}
                  onChange={(e) => handleContentChange(cfg.key, e.target.value)}
                  placeholder={cfg.placeholder}
                  disabled={!isEnabled}
                  className={`w-full text-xs font-mono p-3 border rounded transition-colors focus:outline-none leading-relaxed ${
                    isEnabled
                      ? "bg-white border-[#e5e3dc] text-neutral-800 focus:border-black focus:ring-1 focus:ring-black"
                      : "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed resize-none"
                  }`}
                />
                {!isEnabled && (
                  <p className="text-[10px] font-mono text-amber-700 flex items-center gap-1">
                    <span>⚠️ This section is turned OFF and will NOT be shown to customers on the website.</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
