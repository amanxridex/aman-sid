const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jvvrjgukgrlwmvbgtvch.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2dnJqZ3VrZ3Jsd212Ymd0dmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMjU4NTYsImV4cCI6MjEwNTgwMTg1Nn0.Fm-mgxcHkZiqOL79_5rXFDrwx-R2r2IzHpdTyzr3Fec";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const products = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../scratch/final_drive_products.json"), "utf8")
  );

  console.log(`Inserting ${products.length} products into Supabase public.products...`);

  const toInsert = products.map((p) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    price: parseFloat(p.price) || 0,
    compare_at_price: null,
    images: p.images,
    product_type: p.product_type,
    category: p.category,
    tags: p.tags,
    available: true,
    description: p.description || "None",
    inventory_quantity: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase
    .from("products")
    .upsert(toInsert, { onConflict: "id" })
    .select();

  if (error) {
    console.error("Supabase insert error:", error);
    process.exit(1);
  }

  console.log(`Successfully inserted/updated ${data.length} products in database!`);
  process.exit(0);
}

main();
