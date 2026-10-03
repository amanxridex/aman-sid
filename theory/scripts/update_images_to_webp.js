const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jvvrjgukgrlwmvbgtvch.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2dnJqZ3VrZ3Jsd212Ymd0dmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMjU4NTYsImV4cCI6MjEwNTgwMTg1Nn0.Fm-mgxcHkZiqOL79_5rXFDrwx-R2r2IzHpdTyzr3Fec";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function updateDb() {
  console.log("Fetching all products from Supabase...");
  const { data: products, error } = await supabase.from("products").select("*");
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  console.log(`Found ${products.length} products in DB. Updating image paths to .webp...`);
  for (const p of products) {
    if (Array.isArray(p.images)) {
      const updatedImages = p.images.map((img) =>
        typeof img === "string" ? img.replace(/\.png$/i, ".webp") : img
      );

      const { error: updateErr } = await supabase
        .from("products")
        .update({ images: updatedImages })
        .eq("id", p.id);

      if (updateErr) {
        console.error(`Failed to update product ${p.id} (${p.title}):`, updateErr);
      } else {
        console.log(`Updated ${p.title} -> ${updatedImages.length} webp images`);
      }
    }
  }
  console.log("DB update completed.");
}

function updateLocalFiles() {
  // 1. Update lib/products.js
  const libProductsPath = path.join(__dirname, "../lib/products.js");
  if (fs.existsSync(libProductsPath)) {
    let content = fs.readFileSync(libProductsPath, "utf8");
    // Replace all /products/drive/....png with .webp
    const updated = content.replace(/(\/products\/drive\/[^"'\n\r]+?)\.png/g, "$1.webp");
    fs.writeFileSync(libProductsPath, updated, "utf8");
    console.log("Updated lib/products.js to use .webp");
  }

  // 2. Update app/pages/our-story/page.js
  const ourStoryPath = path.join(__dirname, "../app/pages/our-story/page.js");
  if (fs.existsSync(ourStoryPath)) {
    let content = fs.readFileSync(ourStoryPath, "utf8");
    const updated = content.replace(/(\/products\/drive\/[^"'\n\r]+?)\.png/g, "$1.webp");
    fs.writeFileSync(ourStoryPath, updated, "utf8");
    console.log("Updated app/pages/our-story/page.js to use .webp");
  }
}

async function main() {
  updateLocalFiles();
  await updateDb();
}

main().catch(console.error);
