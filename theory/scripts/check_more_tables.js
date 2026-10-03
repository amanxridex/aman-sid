const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jvvrjgukgrlwmvbgtvch.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2dnJqZ3VrZ3Jsd212Ymd0dmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMjU4NTYsImV4cCI6MjEwNTgwMTg1Nn0.Fm-mgxcHkZiqOL79_5rXFDrwx-R2r2IzHpdTyzr3Fec";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  // Let's test if we can do an RPC or check what tables exist
  const candidateTables = [
    "site_settings",
    "store_settings",
    "settings",
    "config",
    "pages",
    "content",
    "meta",
    "brand",
    "categories",
    "products",
    "discounts",
    "orders",
    "customers",
    "analytics_events",
    "newsletter_subscribers",
    "contact_inquiries",
    "blog_posts"
  ];
  for (const t of candidateTables) {
    const { error } = await supabase.from(t).select("*").limit(0);
    if (!error) {
      console.log(`FOUND: ${t}`);
    }
  }
}

test();
