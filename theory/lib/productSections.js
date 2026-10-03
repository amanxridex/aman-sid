/**
 * Standard 4 Product Accordion Sections
 * (Object Details, Material & Dimensions, Care & Maintenance, Shipping & Returns)
 */

export const DEFAULT_PRODUCT_SECTIONS = {
  objectDetails: {
    key: "objectDetails",
    accordionId: "details",
    title: "Object Details",
    enabled: true,
    content:
      "The Cozy Theory crafts artisanal objects, everyday ceramics, and pure linens to stay cozy, stay you. Designed with organic balances and tactile finishes to bring character to every room.\n\nEach piece undergoes meticulous quality inspection before dispatch, ensuring every surface reflects warmth and elegance.",
  },
  materialDimensions: {
    key: "materialDimensions",
    accordionId: "dimensions",
    title: "Material & Dimensions",
    enabled: true,
    content:
      "Material: Artisanal Stoneware / Handcrafted Ceramic\nWeight: Approx 450g - 1.5kg\nFinish: Hand-applied organic ceramic glaze\nOrigin: Handcrafted in India",
  },
  careMaintenance: {
    key: "careMaintenance",
    accordionId: "care",
    title: "Care & Maintenance",
    enabled: true,
    content:
      "Wipe clean with a dry or gently damp microfiber cloth. Avoid harsh chemical cleaners or abrasive scouring pads. Handle with care to preserve artisanal stoneware finish.",
  },
  shippingReturns: {
    key: "shippingReturns",
    accordionId: "shipping",
    title: "Shipping & Returns",
    enabled: true,
    content:
      "• Complimentary standard domestic delivery across India on orders above Rs. 9,999.\n• Enjoy Rs. 500 off on orders above Rs. 5,999.\n• In the rare event of transit mishap, 50% refund or replacement provided if damaged.\n• Dispatches within 24–48 hours with delivery across India.",
  },
};

/**
 * Parses raw product description column from DB or object.
 * Returns { descriptionText, sections }
 */
export function parseProductSections(raw) {
  if (!raw || raw === "None") {
    return {
      descriptionText: "",
      sections: JSON.parse(JSON.stringify(DEFAULT_PRODUCT_SECTIONS)),
    };
  }

  // If already an object
  if (typeof raw === "object") {
    if (raw.sections) {
      return {
        descriptionText: raw.text || raw.descriptionText || "",
        sections: mergeWithDefaults(raw.sections),
      };
    }
    return {
      descriptionText: "",
      sections: mergeWithDefaults(raw),
    };
  }

  // If JSON string in DB
  if (typeof raw === "string" && raw.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          descriptionText: parsed.text || parsed.descriptionText || "",
          sections: mergeWithDefaults(parsed.sections || parsed),
        };
      }
    } catch (e) {
      // Fall through to plain text
    }
  }

  // Plain string description
  const defaultClone = JSON.parse(JSON.stringify(DEFAULT_PRODUCT_SECTIONS));
  if (raw && raw !== "None") {
    // If there's an existing custom text description, use it as Object Details content
    defaultClone.objectDetails.content = raw;
  }

  return {
    descriptionText: raw === "None" ? "" : raw,
    sections: defaultClone,
  };
}

function mergeWithDefaults(userSections) {
  const merged = JSON.parse(JSON.stringify(DEFAULT_PRODUCT_SECTIONS));
  if (!userSections || typeof userSections !== "object") return merged;

  for (const key of Object.keys(DEFAULT_PRODUCT_SECTIONS)) {
    if (userSections[key]) {
      merged[key] = {
        ...merged[key],
        ...userSections[key],
        enabled: userSections[key].enabled !== false, // default true
        content:
          userSections[key].content !== undefined
            ? userSections[key].content
            : merged[key].content,
      };
    }
  }
  return merged;
}

/**
 * Serializes description text and the 4 sections into a JSON string
 * to store cleanly in Supabase products.description column.
 */
export function serializeProductSections(descriptionText, sections) {
  return JSON.stringify({
    text: (descriptionText || "").trim(),
    sections: {
      objectDetails: {
        title: "Object Details",
        enabled: sections?.objectDetails?.enabled !== false,
        content: sections?.objectDetails?.content || "",
      },
      materialDimensions: {
        title: "Material & Dimensions",
        enabled: sections?.materialDimensions?.enabled !== false,
        content: sections?.materialDimensions?.content || "",
      },
      careMaintenance: {
        title: "Care & Maintenance",
        enabled: sections?.careMaintenance?.enabled !== false,
        content: sections?.careMaintenance?.content || "",
      },
      shippingReturns: {
        title: "Shipping & Returns",
        enabled: sections?.shippingReturns?.enabled !== false,
        content: sections?.shippingReturns?.content || "",
      },
    },
  });
}

/**
 * Parses individual specification lines from material & dimensions section
 * (Material, Dimension, Weight, Finish, Origin)
 */
export function parseProductSpecifications(raw) {
  let content = "";
  if (typeof raw === "string") {
    try {
      const obj = JSON.parse(raw);
      content = obj?.sections?.materialDimensions?.content || "";
    } catch (e) {
      content = raw;
    }
  } else if (typeof raw === "object" && raw) {
    content =
      raw.sections?.materialDimensions?.content ||
      raw.materialDimensions?.content ||
      "";
  }

  const specs = {};
  if (!content) return specs;

  const lines = content.split(/[\r\n]+/);
  lines.forEach((line) => {
    const parts = line.split(":");
    if (parts.length >= 2) {
      const key = parts[0].trim().toLowerCase();
      const val = parts.slice(1).join(":").trim();
      if (key.includes("material")) specs.material = val;
      else if (key.includes("dimension")) specs.dimensions = val;
      else if (key.includes("weight")) specs.weight = val;
      else if (key.includes("finish")) specs.finish = val;
      else if (key.includes("origin")) specs.origin = val;
    }
  });

  return specs;
}

/**
 * Extracts numeric weight in grams from product weight string or specification
 */
export function getProductWeightInGrams(product) {
  if (typeof product?.weight === "number" && product.weight > 0) {
    return product.weight;
  }
  const specs = parseProductSpecifications(product?.description);
  const rawWeight = specs.weight || "";
  if (!rawWeight) return 650; // default 650g for handcrafted ceramic homeware

  const m = rawWeight.match(
    /(?:approx\s*)?([0-9.]+)\s*(kg|g|gm|grams|kgs)?(?:\s*-\s*([0-9.]+)\s*(kg|g|gm|grams|kgs)?)?/i
  );
  if (!m) return 650;

  let val1 = parseFloat(m[1]);
  let unit1 = (m[2] || "g").toLowerCase();
  let g1 = unit1.startsWith("k") ? val1 * 1000 : val1;

  if (m[3]) {
    let val2 = parseFloat(m[3]);
    let unit2 = (m[4] || unit1 || "g").toLowerCase();
    let g2 = unit2.startsWith("k") ? val2 * 1000 : val2;
    return Math.round((g1 + g2) / 2);
  }
  return Math.round(g1);
}

/**
 * Calculates tiered standard shipping rates based on cumulative cart weight:
 * - Up to 1 kg: ₹99
 * - 1 kg to 2.5 kg: ₹149
 * - 2.5 kg to 5 kg: ₹199
 * - Above 5 kg: ₹249
 * - Orders above freeThreshold (default ₹2,999): ₹0 (Free Shipping)
 */
export function calculateTieredShipping(items, subtotal, threshold = 2999) {
  let totalGrams = 0;
  (items || []).forEach((it) => {
    const grams = getProductWeightInGrams(it);
    const qty = it.quantity || 1;
    totalGrams += grams * qty;
  });

  const totalKg = (totalGrams / 1000).toFixed(2);
  const isFree = subtotal >= threshold || (items || []).length === 0;

  let baseRate = 99;
  let tierLabel = "Standard Parcel (Up to 1 kg)";

  if (totalGrams <= 1000) {
    baseRate = 99;
    tierLabel = "Standard Parcel (Up to 1 kg)";
  } else if (totalGrams <= 2500) {
    baseRate = 149;
    tierLabel = "Medium Fragile Box (1–2.5 kg)";
  } else if (totalGrams <= 5000) {
    baseRate = 199;
    tierLabel = "Heavyweight Ceramic Parcel (2.5–5 kg)";
  } else {
    baseRate = 249;
    tierLabel = "Bulk Fragile Shipment (> 5 kg)";
  }

  return {
    totalWeightGrams: totalGrams,
    totalWeightKg: totalKg,
    shippingFee: isFree ? 0 : baseRate,
    baseRate,
    tierLabel,
    isFree,
    freeThreshold: threshold,
    amountNeededForFree: Math.max(0, threshold - subtotal),
  };
}
