const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jvvrjgukgrlwmvbgtvch.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2dnJqZ3VrZ3Jsd212Ymd0dmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMjU4NTYsImV4cCI6MjEwNTgwMTg1Nn0.Fm-mgxcHkZiqOL79_5rXFDrwx-R2r2IzHpdTyzr3Fec";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const initialSettings = {
    brand_name: "THE COZY THEORY",
    brand_tagline: "STAY COZY, STAY YOU",
    about_text: "The Cozy Theory curates everyday objects, dining accents, and soft furnishings that transform your living space into a sanctuary of warmth, texture, and individual expression. We believe in everyday rituals elevated by honest materials.",
    header_subtitle: "Artisanal Homeware",
    footer_newsletter_title: "Join Our Circle",
    footer_newsletter_text: "Be first to gain access to limited seasonal drops, archival ceramics, and private collector offers.",
    announcements: [
      "FREE SHIPPING ABOVE 9999/-",
      "50% REFUND IF DAMAGED",
      "THE COZY THEORY // ARTISANAL HOMEWARE",
      "100% HANDCRAFTED STONEWARE"
    ]
  };

  const payload = {
    handle: "store_settings",
    title: "Store Settings Configuration",
    excerpt: "Global store settings and branding content",
    content: JSON.stringify(initialSettings),
    author: "Admin",
    published: false, // ensures it never displays as a public blog post
    read_time: "1 min",
    image: "",
    updated_at: new Date().toISOString()
  };

  // Upsert into blog_posts
  const { data: existing } = await supabase.from("blog_posts").select("id").eq("handle", "store_settings").maybeSingle();

  if (existing) {
    const { data, error } = await supabase.from("blog_posts").update(payload).eq("handle", "store_settings").select();
    console.log("Updated settings in Supabase:", data, error);
  } else {
    const { data, error } = await supabase.from("blog_posts").insert([payload]).select();
    console.log("Inserted settings in Supabase:", data, error);
  }

  // Retrieve test
  const { data: fetched } = await supabase.from("blog_posts").select("content").eq("handle", "store_settings").single();
  console.log("Retrieved parsed settings:", JSON.parse(fetched.content));
}

test();
