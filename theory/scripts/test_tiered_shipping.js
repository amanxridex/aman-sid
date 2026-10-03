function parseProductSpecifications(raw) {
  let content = '';
  if (typeof raw === 'string') {
    try {
      const obj = JSON.parse(raw);
      content = obj?.sections?.materialDimensions?.content || '';
    } catch (e) {
      content = raw;
    }
  } else if (typeof raw === 'object' && raw) {
    content = raw.sections?.materialDimensions?.content || raw.materialDimensions?.content || '';
  }

  const specs = {};
  if (!content) return specs;

  const lines = content.split(/[\r\n]+/);
  lines.forEach((line) => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim().toLowerCase();
      const val = parts.slice(1).join(':').trim();
      if (key.includes('material')) specs.material = val;
      else if (key.includes('dimension')) specs.dimensions = val;
      else if (key.includes('weight')) specs.weight = val;
      else if (key.includes('finish')) specs.finish = val;
      else if (key.includes('origin')) specs.origin = val;
    }
  });

  return specs;
}

function getProductWeightInGrams(product) {
  if (typeof product?.weight === 'number' && product.weight > 0) {
    return product.weight;
  }
  const specs = parseProductSpecifications(product?.description);
  const rawWeight = specs.weight || '';
  if (!rawWeight) return 650; // default 650g for handcrafted ceramic

  const m = rawWeight.match(/(?:approx\s*)?([0-9.]+)\s*(kg|g|gm|grams|kgs)?(?:\s*-\s*([0-9.]+)\s*(kg|g|gm|grams|kgs)?)?/i);
  if (!m) return 650;

  let val1 = parseFloat(m[1]);
  let unit1 = (m[2] || 'g').toLowerCase();
  let g1 = unit1.startsWith('k') ? val1 * 1000 : val1;

  if (m[3]) {
    let val2 = parseFloat(m[3]);
    let unit2 = (m[4] || unit1 || 'g').toLowerCase();
    let g2 = unit2.startsWith('k') ? val2 * 1000 : val2;
    return Math.round((g1 + g2) / 2);
  }
  return Math.round(g1);
}

function calculateTieredShipping(items, subtotal, threshold = 2999) {
  let totalGrams = 0;
  (items || []).forEach((it) => {
    const grams = getProductWeightInGrams(it);
    const qty = it.quantity || 1;
    totalGrams += grams * qty;
  });

  const totalKg = (totalGrams / 1000).toFixed(2);
  const isFree = subtotal >= threshold || (items || []).length === 0;

  let baseRate = 99;
  let tierLabel = 'Standard Parcel (Up to 1 kg)';

  if (totalGrams <= 1000) {
    baseRate = 99;
    tierLabel = 'Standard Parcel (Up to 1 kg)';
  } else if (totalGrams <= 2500) {
    baseRate = 149;
    tierLabel = 'Medium Fragile Box (1–2.5 kg)';
  } else if (totalGrams <= 5000) {
    baseRate = 199;
    tierLabel = 'Heavyweight Ceramic Parcel (2.5–5 kg)';
  } else {
    baseRate = 249;
    tierLabel = 'Bulk Fragile Shipment (> 5 kg)';
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

const sampleItem = {
  title: 'Flower Plate',
  description: JSON.stringify({
    sections: {
      materialDimensions: {
        content: 'Material: Ceramic\nDimension:8.5*8.5*1 Inch\nWeight: Approx 450g - 1.5kg\nFinish: Glossy'
      }
    }
  }),
  quantity: 2
};

console.log('Specs:', parseProductSpecifications(sampleItem.description));
console.log('Single Weight:', getProductWeightInGrams(sampleItem));
console.log('Shipping (subtotal 1100):', calculateTieredShipping([sampleItem], 1100));
console.log('Shipping (subtotal 3500):', calculateTieredShipping([sampleItem], 3500));
