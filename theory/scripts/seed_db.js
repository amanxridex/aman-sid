const { createClient } = require("@supabase/supabase-js");
const { NOTICE_PRODUCTS, CATEGORIES_LIST } = require("../lib/products.js");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jvvrjgukgrlwmvbgtvch.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2dnJqZ3VrZ3Jsd212Ymd0dmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMjU4NTYsImV4cCI6MjEwNTgwMTg1Nn0.Fm-mgxcHkZiqOL79_5rXFDrwx-R2r2IzHpdTyzr3Fec";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
  console.log("Seeding categories...");
  const categoriesToInsert = CATEGORIES_LIST.map((cat, index) => ({
    id: cat.handle,
    label: cat.label,
    handle: cat.handle,
    filter: cat.filter,
    description: `${cat.label} by The Cozy Theory — artisanal homeware and decor.`,
    display_order: index,
  }));

  const { error: catError } = await supabase
    .from("categories")
    .upsert(categoriesToInsert, { onConflict: "handle" });

  if (catError) {
    console.error("Error inserting categories:", catError);
    process.exit(1);
  }
  console.log(`Successfully seeded ${categoriesToInsert.length} categories.`);

  console.log(`Seeding ${NOTICE_PRODUCTS.length} products in batches...`);
  const BATCH_SIZE = 50;
  let totalInserted = 0;

  for (let i = 0; i < NOTICE_PRODUCTS.length; i += BATCH_SIZE) {
    const chunk = NOTICE_PRODUCTS.slice(i, i + BATCH_SIZE).map((p) => ({
      id: p.id,
      title: p.title || "Untitled Object",
      handle: p.handle,
      price: parseFloat(p.price) || 0,
      compare_at_price: p.compare_at_price ? parseFloat(p.compare_at_price) : null,
      images: p.images || [],
      product_type: p.product_type || "Homeware",
      category: p.category || "Objects",
      tags: p.tags || [],
      available: p.available !== false,
      description: p.description || "",
      inventory_quantity: 25,
    }));

    const { error: prodError } = await supabase
      .from("products")
      .upsert(chunk, { onConflict: "id" });

    if (prodError) {
      console.error(`Error inserting batch ${i} - ${i + chunk.length}:`, prodError);
      process.exit(1);
    }

    totalInserted += chunk.length;
    console.log(`Inserted batch: ${totalInserted} / ${NOTICE_PRODUCTS.length}`);
  }

  // Also seed initial sample discounts
  const sampleDiscounts = [
    {
      id: "disc_welcome10",
      code: "COZY10",
      type: "percentage",
      value: 10,
      min_requirement: 999,
      status: "active",
      usage_count: 14,
    },
    {
      id: "disc_festive20",
      code: "FESTIVE20",
      type: "percentage",
      value: 20,
      min_requirement: 2499,
      status: "active",
      usage_count: 32,
    },
    {
      id: "disc_flat500",
      code: "THEORY500",
      type: "fixed_amount",
      value: 500,
      min_requirement: 3000,
      status: "active",
      usage_count: 8,
    },
  ];

  await supabase.from("discounts").upsert(sampleDiscounts, { onConflict: "code" });
  console.log("Seeded sample discounts.");

  console.log("Database seeding completed successfully!");
}

seed().catch((err) => {
  console.error("Fatal error seeding database:", err);
  process.exit(1);
});
