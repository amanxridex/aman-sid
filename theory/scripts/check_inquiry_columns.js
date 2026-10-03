const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jvvrjgukgrlwmvbgtvch.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2dnJqZ3VrZ3Jsd212Ymd0dmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMjU4NTYsImV4cCI6MjEwNTgwMTg1Nn0.Fm-mgxcHkZiqOL79_5rXFDrwx-R2r2IzHpdTyzr3Fec";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  const { data } = await supabase.from("contact_inquiries").select("*").limit(1);
  console.log("Sample inquiry row:", data[0]);
  
  // Try inserting with phone
  const { data: d2, error: err2 } = await supabase.from("contact_inquiries").insert([
    {
      name: "Test Phone",
      email: "test@phone.com",
      phone: "+91-7558085343",
      subject: "Test",
      message: "Test message"
    }
  ]).select();
  console.log("Insert with phone:", d2, "error:", err2);
}

test();
