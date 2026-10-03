"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  getDiscounts as dbGetDiscounts,
  createDiscount as dbCreateDiscount,
  updateDiscount as dbUpdateDiscount,
  deleteDiscount as dbDeleteDiscount,
  toggleDiscountStatus as dbToggleDiscountStatus,
} from "@/lib/supabase";
import {
  Tag,
  Plus,
  Copy,
  Clock,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Zap,
  Power,
  RefreshCw,
  Search,
} from "lucide-react";

export default function AdminDiscountsPage() {
  const { discounts: storeDiscounts, refreshData } = useStore();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "active", "scheduled", "inactive"
  const [copiedCode, setCopiedCode] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null); // null when creating, coupon obj when editing

  // Form Fields
  const [formCode, setFormCode] = useState("");
  const [formType, setFormType] = useState("percentage"); // "percentage" | "fixed_amount"
  const [formValue, setFormValue] = useState("15");
  const [formMinRequirement, setFormMinRequirement] = useState("0");
  const [formScheduleType, setFormScheduleType] = useState("now"); // "now" | "scheduled" | "inactive"
  const [formStartsAt, setFormStartsAt] = useState("");
  const [formHasExpiresAt, setFormHasExpiresAt] = useState(false);
  const [formExpiresAt, setFormExpiresAt] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load discounts from DB
  const loadDiscounts = async () => {
    try {
      setLoading(true);
      const data = await dbGetDiscounts();
      setCoupons(data);
    } catch (err) {
      console.error("Error loading discounts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiscounts();
  }, [storeDiscounts]);

  // Periodic tick every 15s to update scheduled countdowns / live status in real time
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 15000);
    return () => clearInterval(timer);
  }, []);

  // Format Helper for local datetime-local input (YYYY-MM-DDTHH:mm)
  const getLocalDateTimeString = (dateObj) => {
    const d = new Date(dateObj);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setFormCode("");
    setFormType("percentage");
    setFormValue("15");
    setFormMinRequirement("0");
    setFormScheduleType("now");

    // Default scheduled time to 1 hour from now
    const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);
    setFormStartsAt(getLocalDateTimeString(oneHourLater));
    setFormHasExpiresAt(false);
    setFormExpiresAt("");
    setFormError("");
    setShowModal(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (c) => {
    setEditingCoupon(c);
    setFormCode(c.code);
    setFormType(c.type || "percentage");
    setFormValue(String(c.value || 10));
    setFormMinRequirement(String(c.min_requirement || 0));

    const rawStatus = c.status || "active";
    if (rawStatus === "inactive") {
      setFormScheduleType("inactive");
      const defaultStart = new Date(Date.now() + 60 * 60 * 1000);
      setFormStartsAt(getLocalDateTimeString(defaultStart));
      setFormHasExpiresAt(false);
      setFormExpiresAt("");
    } else if (rawStatus.startsWith("scheduled:")) {
      setFormScheduleType("scheduled");
      const parts = rawStatus.replace("scheduled:", "").split("|");
      if (parts[0]) setFormStartsAt(getLocalDateTimeString(new Date(parts[0])));
      if (parts[1]) {
        setFormHasExpiresAt(true);
        setFormExpiresAt(getLocalDateTimeString(new Date(parts[1])));
      } else {
        setFormHasExpiresAt(false);
        setFormExpiresAt("");
      }
    } else {
      setFormScheduleType("now");
      const defaultStart = new Date(Date.now() + 60 * 60 * 1000);
      setFormStartsAt(getLocalDateTimeString(defaultStart));
      setFormHasExpiresAt(false);
      setFormExpiresAt("");
    }

    setFormError("");
    setShowModal(true);
  };

  // Submit Create or Edit
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError("");

    const upperCode = formCode.trim().toUpperCase();
    if (!upperCode) {
      setFormError("Coupon code is required.");
      return;
    }

    const val = parseFloat(formValue);
    if (isNaN(val) || val <= 0) {
      setFormError("Please enter a valid discount amount/percentage.");
      return;
    }
    if (formType === "percentage" && val > 95) {
      setFormError("Percentage discount cannot exceed 95%.");
      return;
    }

    const minReq = parseFloat(formMinRequirement) || 0;

    let finalStatus = "active";
    if (formScheduleType === "inactive") {
      finalStatus = "inactive";
    } else if (formScheduleType === "scheduled") {
      if (!formStartsAt) {
        setFormError("Please specify the date and time when the code should go live.");
        return;
      }
      const startDate = new Date(formStartsAt);
      if (isNaN(startDate.getTime())) {
        setFormError("Invalid start date and time.");
        return;
      }

      finalStatus = `scheduled:${startDate.toISOString()}`;

      if (formHasExpiresAt && formExpiresAt) {
        const endDate = new Date(formExpiresAt);
        if (isNaN(endDate.getTime())) {
          setFormError("Invalid expiration date and time.");
          return;
        }
        if (endDate <= startDate) {
          setFormError("Expiration date must be after the go-live start date.");
          return;
        }
        finalStatus += `|${endDate.toISOString()}`;
      }
    } else {
      finalStatus = "active";
    }

    setIsSubmitting(true);
    try {
      if (editingCoupon) {
        await dbUpdateDiscount(editingCoupon.id, {
          code: upperCode,
          type: formType,
          value: val,
          min_requirement: minReq,
          status: finalStatus,
        });
      } else {
        await dbCreateDiscount({
          code: upperCode,
          type: formType,
          value: val,
          min_requirement: minReq,
          status: finalStatus,
        });
      }

      await loadDiscounts();
      if (refreshData) await refreshData();
      setShowModal(false);
    } catch (err) {
      console.error("Save discount error:", err);
      setFormError(err.message || "Failed to save discount code to database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1-Click Toggle Active / Inactive
  const handleToggleStatus = async (coupon) => {
    setActionLoadingId(coupon.id);
    try {
      await dbToggleDiscountStatus(coupon.id, coupon.status);
      await loadDiscounts();
      if (refreshData) await refreshData();
    } catch (err) {
      console.error("Error toggling discount status:", err);
      alert("Failed to toggle status: " + (err.message || "Database error"));
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (coupon) => {
    if (!window.confirm(`Are you sure you want to permanently delete coupon "${coupon.code}"?`)) {
      return;
    }
    setActionLoadingId(coupon.id);
    try {
      await dbDeleteDiscount(coupon.id);
      await loadDiscounts();
      if (refreshData) await refreshData();
    } catch (err) {
      console.error("Error deleting discount:", err);
      alert("Failed to delete coupon: " + (err.message || "Database error"));
    } finally {
      setActionLoadingId(null);
    }
  };

  // Copy to clipboard
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Quick Preset Helper for Schedule Picker
  const applyPreset = (hoursFromNow) => {
    const target = new Date(Date.now() + hoursFromNow * 3600 * 1000);
    setFormStartsAt(getLocalDateTimeString(target));
  };

  const applyTomorrowMorning = () => {
    const target = new Date();
    target.setDate(target.getDate() + 1);
    target.setHours(9, 0, 0, 0);
    setFormStartsAt(getLocalDateTimeString(target));
  };

  // Filtered coupons
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      // Search matching
      const matchesSearch =
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(c.value).includes(searchQuery);

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter === "all") return true;
      if (statusFilter === "active") return c.effectiveStatus === "active" && c.isLiveNow;
      if (statusFilter === "scheduled") return c.effectiveStatus === "scheduled";
      if (statusFilter === "inactive") return c.effectiveStatus === "inactive" || c.status === "inactive";
      return true;
    });
  }, [coupons, searchQuery, statusFilter, tick]);

  // Counts
  const counts = useMemo(() => {
    let active = 0;
    let scheduled = 0;
    let inactive = 0;
    coupons.forEach((c) => {
      if (c.effectiveStatus === "active" && c.isLiveNow) active++;
      else if (c.effectiveStatus === "scheduled") scheduled++;
      else inactive++;
    });
    return { total: coupons.length, active, scheduled, inactive };
  }, [coupons, tick]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5e3dc]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Link href="/admin" className="hover:text-black">
              Admin
            </Link>
            <span>/</span>
            <span className="text-black font-semibold">Promotions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#121212] mt-1 flex items-center gap-3">
            <span>Discount Codes &amp; Coupons</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Live DB
            </span>
          </h1>
          <p className="text-xs font-mono text-neutral-500 mt-1">
            Create instant or scheduled coupons. Scheduled codes automatically go live at your chosen date &amp; time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDiscounts}
            disabled={loading}
            title="Refresh coupons"
            className="p-2 border border-[#e5e3dc] rounded bg-white hover:bg-[#faf8f5] text-neutral-600 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-black" : ""}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#121212] hover:bg-neutral-800 text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Discount Code</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setStatusFilter("all")}
          className={`p-3.5 rounded border text-left transition-all ${
            statusFilter === "all"
              ? "bg-white border-[#121212] shadow-sm ring-1 ring-[#121212]"
              : "bg-white border-[#e5e3dc] hover:bg-[#faf8f5]"
          }`}
        >
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
            All Coupons
          </div>
          <div className="text-2xl font-bold font-mono text-[#121212] mt-1">{counts.total}</div>
          <div className="text-[10px] font-mono text-neutral-400 mt-0.5">In database</div>
        </button>

        <button
          onClick={() => setStatusFilter("active")}
          className={`p-3.5 rounded border text-left transition-all ${
            statusFilter === "active"
              ? "bg-emerald-50/50 border-emerald-600 shadow-sm ring-1 ring-emerald-600"
              : "bg-white border-[#e5e3dc] hover:bg-[#faf8f5]"
          }`}
        >
          <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Live on Site</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">{counts.active}</div>
          <div className="text-[10px] font-mono text-emerald-600/80 mt-0.5">Active &amp; usable now</div>
        </button>

        <button
          onClick={() => setStatusFilter("scheduled")}
          className={`p-3.5 rounded border text-left transition-all ${
            statusFilter === "scheduled"
              ? "bg-amber-50/50 border-amber-600 shadow-sm ring-1 ring-amber-600"
              : "bg-white border-[#e5e3dc] hover:bg-[#faf8f5]"
          }`}
        >
          <div className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-semibold flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Scheduled</span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1">{counts.scheduled}</div>
          <div className="text-[10px] font-mono text-amber-600/80 mt-0.5">Upcoming date &amp; time</div>
        </button>

        <button
          onClick={() => setStatusFilter("inactive")}
          className={`p-3.5 rounded border text-left transition-all ${
            statusFilter === "inactive"
              ? "bg-neutral-100 border-neutral-600 shadow-sm ring-1 ring-neutral-600"
              : "bg-white border-[#e5e3dc] hover:bg-[#faf8f5]"
          }`}
        >
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-semibold flex items-center gap-1.5">
            <Power className="w-3 h-3 text-neutral-400" />
            <span>Inactive</span>
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-600 mt-1">{counts.inactive}</div>
          <div className="text-[10px] font-mono text-neutral-400 mt-0.5">Disabled or paused</div>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 border border-[#e5e3dc] rounded">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search code (e.g. COZY10)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-[#faf8f5] border border-[#e5e3dc] rounded focus:outline-none focus:border-black focus:bg-white transition-colors uppercase"
          />
        </div>

        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All" },
            { id: "active", label: "Live Now" },
            { id: "scheduled", label: "Scheduled" },
            { id: "inactive", label: "Inactive" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded text-xs font-mono whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? "bg-[#121212] text-white font-bold"
                  : "bg-transparent text-neutral-600 hover:bg-[#faf8f5]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-[#e5e3dc] rounded overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#e5e3dc] bg-[#faf8f5] flex justify-between items-center text-xs font-mono text-neutral-600">
          <span className="font-semibold text-black">
            Coupons ({filteredCoupons.length})
          </span>
          <span className="text-[11px] text-neutral-500">
            Click switch to toggle Active / Inactive anytime
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-neutral-400 flex flex-col items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#121212]" />
            <span>Loading coupons from Supabase...</span>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-neutral-400">
            No discount codes match your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-[#e5e3dc] bg-[#faf8f5] text-neutral-500 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 font-semibold">Coupon Code</th>
                  <th className="py-3 px-4 font-semibold">Discount</th>
                  <th className="py-3 px-4 font-semibold">Min. Order</th>
                  <th className="py-3 px-4 font-semibold">Redemptions</th>
                  <th className="py-3 px-4 font-semibold">Timing / Go-Live</th>
                  <th className="py-3 px-4 font-semibold">Status &amp; Toggle</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e3dc]">
                {filteredCoupons.map((c) => {
                  const isLive = c.isLiveNow && c.effectiveStatus === "active";
                  const isScheduled = c.effectiveStatus === "scheduled";
                  const isInactive = c.effectiveStatus === "inactive" || c.status === "inactive";
                  const isLoadingThis = actionLoadingId === c.id;

                  // Scheduled display calculation
                  let scheduleInfo = null;
                  if (c.status && c.status.startsWith("scheduled:")) {
                    const parts = c.status.replace("scheduled:", "").split("|");
                    const start = parts[0] ? new Date(parts[0]) : null;
                    const end = parts[1] ? new Date(parts[1]) : null;
                    const now = new Date();

                    if (start) {
                      const formattedStart = start.toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      if (now < start) {
                        const diffMs = start - now;
                        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                        const countdownStr =
                          diffHours > 24
                            ? `in ${Math.floor(diffHours / 24)}d ${diffHours % 24}h`
                            : diffHours > 0
                            ? `in ${diffHours}h ${diffMins}m`
                            : `in ${diffMins}m`;

                        scheduleInfo = {
                          type: "upcoming",
                          label: `Goes live ${formattedStart}`,
                          countdown: countdownStr,
                        };
                      } else {
                        scheduleInfo = {
                          type: "live_now",
                          label: `Went live ${formattedStart}`,
                        };
                      }
                    }

                    if (end) {
                      const formattedEnd = end.toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      scheduleInfo = {
                        ...(scheduleInfo || {}),
                        endLabel: `Expires: ${formattedEnd}`,
                      };
                    }
                  }

                  return (
                    <tr key={c.id || c.code} className="hover:bg-[#faf8f5] transition-colors">
                      {/* Code */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-[#001540] shrink-0" />
                          <span className="font-bold text-[#121212] tracking-wide text-sm">
                            {c.code}
                          </span>
                          <button
                            onClick={() => handleCopy(c.code)}
                            title="Copy code"
                            className="p-1 hover:bg-[#ede9e0] rounded text-neutral-400 hover:text-black transition-colors"
                          >
                            {copiedCode === c.code ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Value */}
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        {c.type === "fixed_amount"
                          ? `₹${Number(c.value).toLocaleString("en-IN")} OFF`
                          : `${c.value}% OFF`}
                        <div className="text-[10px] text-neutral-400 font-normal">
                          {c.type === "fixed_amount" ? "Flat Amount" : "Percentage"}
                        </div>
                      </td>

                      {/* Min Order */}
                      <td className="py-3.5 px-4 text-neutral-600">
                        {parseFloat(c.min_requirement) > 0 ? (
                          <span>₹{Number(c.min_requirement).toLocaleString("en-IN")}</span>
                        ) : (
                          <span className="text-neutral-400 font-normal">No Minimum</span>
                        )}
                      </td>

                      {/* Redemptions */}
                      <td className="py-3.5 px-4 text-neutral-600">
                        <span className="font-semibold text-black">{c.usage_count || 0}</span> used
                      </td>

                      {/* Timing / Schedule */}
                      <td className="py-3.5 px-4">
                        {isLive && !scheduleInfo && (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                            <Zap className="w-3 h-3 text-emerald-600" />
                            <span>Live Right Now</span>
                          </div>
                        )}
                        {isScheduled && scheduleInfo && (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-amber-800 font-bold text-[11px]">
                              <Clock className="w-3 h-3 text-amber-600 animate-spin-slow" />
                              <span>{scheduleInfo.countdown}</span>
                            </div>
                            <div className="text-[10px] text-neutral-500 font-mono">
                              {scheduleInfo.label}
                            </div>
                            {scheduleInfo.endLabel && (
                              <div className="text-[9px] text-neutral-400">
                                {scheduleInfo.endLabel}
                              </div>
                            )}
                          </div>
                        )}
                        {isLive && scheduleInfo && (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                              <span>Live on Website</span>
                            </div>
                            <div className="text-[10px] text-neutral-500">
                              {scheduleInfo.label}
                            </div>
                          </div>
                        )}
                        {isInactive && (
                          <div className="text-neutral-400 text-[11px] font-mono flex items-center gap-1">
                            <Power className="w-3 h-3" />
                            <span>Turned Off</span>
                          </div>
                        )}
                      </td>

                      {/* Status & 1-Click Toggle */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          {/* Toggle Switch */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(c)}
                            disabled={isLoadingThis}
                            title={isInactive ? "Click to Activate" : "Click to Deactivate"}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              isLive
                                ? "bg-emerald-600"
                                : isScheduled
                                ? "bg-amber-500"
                                : "bg-neutral-300"
                            } ${isLoadingThis ? "opacity-50 cursor-wait" : ""}`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                isInactive ? "translate-x-0" : "translate-x-4"
                              }`}
                            />
                          </button>

                          {/* Status Badge */}
                          {isLive && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                              Active
                            </span>
                          )}
                          {isScheduled && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider inline-flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              Scheduled
                            </span>
                          )}
                          {isInactive && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200 uppercase tracking-wider">
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(c)}
                            title="Edit code and schedule"
                            className="p-1.5 bg-[#f5f2eb] hover:bg-[#eae6dd] text-neutral-700 hover:text-black border border-[#e5e3dc] rounded text-[11px] font-semibold transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(c)}
                            disabled={isLoadingThis}
                            title="Delete coupon"
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-800 border border-rose-200 rounded text-[11px] font-semibold transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Create / Edit Discount */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#e5e3dc] rounded-lg w-full max-w-lg p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e3dc]">
              <div>
                <h3 className="text-base font-bold uppercase text-[#121212] tracking-tight">
                  {editingCoupon ? "Edit Discount Code" : "Create New Discount Code"}
                </h3>
                <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                  Set code, discount amount, and exact go-live schedule.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-black font-mono text-lg px-2"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Coupon Code */}
              <div>
                <label className="text-xs font-mono uppercase text-neutral-600 block mb-1 font-semibold">
                  Coupon Code *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    placeholder="E.g. DIWALI25, FESTIVE20"
                    className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded px-3 py-2.5 text-xs font-mono text-black font-bold uppercase focus:outline-none focus:border-black focus:bg-white tracking-wider"
                  />
                  <Tag className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-3" />
                </div>
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase text-neutral-600 block mb-1 font-semibold">
                    Discount Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded px-3 py-2.5 text-xs font-mono text-black focus:outline-none focus:border-black focus:bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-neutral-600 block mb-1 font-semibold">
                    {formType === "percentage" ? "Percentage (%) *" : "Flat Value (₹) *"}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={formType === "percentage" ? 95 : 100000}
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder={formType === "percentage" ? "15" : "500"}
                    className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded px-3 py-2.5 text-xs font-mono text-black font-semibold focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>
              </div>

              {/* Minimum Order Requirement */}
              <div>
                <label className="text-xs font-mono uppercase text-neutral-600 block mb-1 font-semibold">
                  Minimum Order Requirement (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={formMinRequirement}
                  onChange={(e) => setFormMinRequirement(e.target.value)}
                  placeholder="0 (no minimum)"
                  className="w-full bg-[#f5f2eb] border border-[#e5e3dc] rounded px-3 py-2.5 text-xs font-mono text-black focus:outline-none focus:border-black focus:bg-white"
                />
                <span className="text-[10px] font-mono text-neutral-400 mt-1 block">
                  Leave 0 if this coupon applies with no minimum cart requirement.
                </span>
              </div>

              {/* Schedule / Go-Live Choice */}
              <div className="pt-2 border-t border-[#e5e3dc] space-y-3">
                <label className="text-xs font-mono uppercase text-[#121212] block font-bold tracking-wider">
                  Go-Live Timing &amp; Scheduling
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Option 1: Right Now */}
                  <label
                    className={`border rounded p-3 cursor-pointer transition-all flex flex-col justify-between ${
                      formScheduleType === "now"
                        ? "border-[#121212] bg-[#faf8f5] shadow-xs ring-1 ring-[#121212]"
                        : "border-[#e5e3dc] hover:bg-[#faf8f5]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="scheduleType"
                        value="now"
                        checked={formScheduleType === "now"}
                        onChange={() => setFormScheduleType("now")}
                        className="text-black focus:ring-black"
                      />
                      <span className="text-xs font-mono font-bold text-black flex items-center gap-1">
                        <Zap className="w-3 h-3 text-emerald-600" />
                        Right Now
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 mt-2 block">
                      Goes live immediately on website
                    </span>
                  </label>

                  {/* Option 2: Schedule Date & Time */}
                  <label
                    className={`border rounded p-3 cursor-pointer transition-all flex flex-col justify-between ${
                      formScheduleType === "scheduled"
                        ? "border-amber-600 bg-amber-50/50 shadow-xs ring-1 ring-amber-600"
                        : "border-[#e5e3dc] hover:bg-[#faf8f5]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="scheduleType"
                        value="scheduled"
                        checked={formScheduleType === "scheduled"}
                        onChange={() => setFormScheduleType("scheduled")}
                        className="text-amber-600 focus:ring-amber-600"
                      />
                      <span className="text-xs font-mono font-bold text-black flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Schedule
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 mt-2 block">
                      Choose date &amp; time to launch
                    </span>
                  </label>

                  {/* Option 3: Save Inactive */}
                  <label
                    className={`border rounded p-3 cursor-pointer transition-all flex flex-col justify-between ${
                      formScheduleType === "inactive"
                        ? "border-neutral-700 bg-neutral-100 shadow-xs ring-1 ring-neutral-700"
                        : "border-[#e5e3dc] hover:bg-[#faf8f5]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="scheduleType"
                        value="inactive"
                        checked={formScheduleType === "inactive"}
                        onChange={() => setFormScheduleType("inactive")}
                        className="text-black focus:ring-black"
                      />
                      <span className="text-xs font-mono font-bold text-black flex items-center gap-1">
                        <Power className="w-3 h-3 text-neutral-400" />
                        Inactive
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 mt-2 block">
                      Draft / Disabled for now
                    </span>
                  </label>
                </div>

                {/* If Scheduled is chosen, show datetime-local picker and quick presets */}
                {formScheduleType === "scheduled" && (
                  <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded space-y-3 animate-fadeIn">
                    <div>
                      <label className="text-xs font-mono uppercase text-amber-900 block mb-1 font-semibold flex items-center justify-between">
                        <span>Go-Live Date &amp; Time *</span>
                        <span className="text-[10px] text-amber-700 lowercase font-normal">
                          (your local time)
                        </span>
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={formStartsAt}
                        onChange={(e) => setFormStartsAt(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded px-3 py-2 text-xs font-mono text-black focus:outline-none focus:border-amber-600 font-semibold"
                      />
                    </div>

                    {/* Quick Presets */}
                    <div>
                      <div className="text-[10px] font-mono uppercase text-amber-800 font-semibold mb-1">
                        Quick Launch Presets:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => applyPreset(1)}
                          className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-200 rounded text-[10px] font-mono text-amber-900 transition-colors"
                        >
                          +1 Hour
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPreset(3)}
                          className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-200 rounded text-[10px] font-mono text-amber-900 transition-colors"
                        >
                          +3 Hours
                        </button>
                        <button
                          type="button"
                          onClick={applyTomorrowMorning}
                          className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-200 rounded text-[10px] font-mono text-amber-900 transition-colors"
                        >
                          Tomorrow 9:00 AM
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPreset(48)}
                          className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-200 rounded text-[10px] font-mono text-amber-900 transition-colors"
                        >
                          +2 Days
                        </button>
                      </div>
                    </div>

                    {/* Optional Expiration Date */}
                    <div className="pt-2 border-t border-amber-200/60">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-amber-900">
                        <input
                          type="checkbox"
                          checked={formHasExpiresAt}
                          onChange={(e) => setFormHasExpiresAt(e.target.checked)}
                          className="rounded text-amber-600 focus:ring-amber-500"
                        />
                        <span className="font-semibold">Set an expiration date &amp; time</span>
                      </label>

                      {formHasExpiresAt && (
                        <div className="mt-2">
                          <input
                            type="datetime-local"
                            value={formExpiresAt}
                            onChange={(e) => setFormExpiresAt(e.target.value)}
                            className="w-full bg-white border border-amber-300 rounded px-3 py-2 text-xs font-mono text-black focus:outline-none focus:border-amber-600"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#e5e3dc]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#f5f2eb] hover:bg-[#ede9e0] text-neutral-700 text-xs font-mono rounded border border-[#e5e3dc] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#121212] hover:bg-neutral-800 text-white text-xs font-bold font-mono uppercase tracking-wider rounded transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingCoupon ? "Update Code" : "Create Code"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
