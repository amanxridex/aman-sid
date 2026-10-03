"use client";

import { useMemo } from "react";
import { useStore } from "@/context/StoreContext";

export default function AnnouncementBar() {
  const { discounts, storeSettings } = useStore();

  const announcements = useMemo(() => {
    // Filter only live discounts (not scheduled for future, not inactive)
    const activeDiscounts = (discounts || []).filter((d) => d.isLiveNow);

    const list = [];

    // Prioritize active discount announcements
    if (activeDiscounts.length > 0) {
      activeDiscounts.forEach((d) => {
        const valStr =
          d.type === "fixed_amount" ? `RS. ${d.value} OFF` : `${d.value}% OFF`;
        const minStr =
          parseFloat(d.min_requirement) > 0
            ? ` ON ORDERS OVER RS. ${Number(d.min_requirement).toLocaleString("en-IN")}`
            : "";
        list.push(`USE CODE ${d.code} FOR ${valStr}${minStr}`);
        list.push("•");
      });
    }

    // Dynamic brand announcements from storeSettings or default
    const configuredList =
      Array.isArray(storeSettings?.announcements) && storeSettings.announcements.length > 0
        ? storeSettings.announcements
        : [
            "FREE SHIPPING ABOVE 9999/-",
            "50% REFUND IF DAMAGED",
            "THE COZY THEORY // ARTISANAL HOMEWARE",
            "100% HANDCRAFTED STONEWARE",
          ];

    const standardWithDots = [];
    configuredList.forEach((text) => {
      standardWithDots.push(text);
      standardWithDots.push("•");
    });

    return [...list, ...standardWithDots];
  }, [discounts, storeSettings]);

  return (
    <aside
      aria-label="Announcement"
      className="w-full bg-[#001540] text-white text-[11px] md:text-xs tracking-[0.15em] uppercase py-2.5 overflow-hidden select-none z-30 relative shadow-sm"
    >
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {[...announcements, ...announcements].map((item, idx) => (
          <span
            key={idx}
            className={`mx-3 md:mx-4 font-mono font-medium ${
              item === "•" ? "text-sky-200/60 scale-75" : "text-white"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </aside>
  );
}
