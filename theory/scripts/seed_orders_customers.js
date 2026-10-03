const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jvvrjgukgrlwmvbgtvch.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2dnJqZ3VrZ3Jsd212Ymd0dmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMjU4NTYsImV4cCI6MjEwNTgwMTg1Nn0.Fm-mgxcHkZiqOL79_5rXFDrwx-R2r2IzHpdTyzr3Fec";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const INITIAL_ORDERS = [
  {
    id: "TCT-894120",
    customer_name: "Aarav Mehta",
    customer_email: "aarav.mehta@gmail.com",
    customer_phone: "+91 98201 44321",
    shipping_address: {
      address: "Flat 402, Sea Green Apartments, Worli",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400018",
    },
    items: [
      { id: 10122515054889, title: "TT-251 Ceramic Chicken Condiment Jar with Spoon", price: 1350, quantity: 1, image: "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/Product9-01.png?v=1784242846" },
      { id: 9636648026409, title: "Pure Washed Cotton Queen Bedsheet (No. 15)", price: 2000, quantity: 1, image: "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/DSC00422_eee0df88-82cb-49a4-818d-182c056960b2.jpg?v=1740976529" },
    ],
    subtotal: 3350,
    shipping_cost: 0,
    discount: 220,
    total: 3130,
    payment_method: "UPI (Google Pay)",
    payment_status: "paid",
    fulfillment_status: "Dispatched",
    notes: "Please deliver between 10am - 4pm",
    created_at: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
  },
  {
    id: "TCT-894088",
    customer_name: "Diya Narang",
    customer_email: "diya.narang@outlook.com",
    customer_phone: "+91 97412 88921",
    shipping_address: {
      address: "Villa 12, Indiranagar 100ft Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
    },
    items: [
      { id: 10041732333865, title: "THD009 Lemon Ceramic Storage Jar with Lid", price: 860, quantity: 1, image: "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/ChatGPTImageJul18_2026_03_42_52PM.png?v=1784370778" },
      { id: 10042215366953, title: "THD082 Abstract Giraffe Figurine Set (Set of 2)", price: 1600, quantity: 1, image: "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/ChatGPT_Image_Jul_18_2026_03_28_57_PM.png?v=1784368849" },
    ],
    subtotal: 2460,
    shipping_cost: 0,
    discount: 0,
    total: 2460,
    payment_method: "Credit Card (HDFC)",
    payment_status: "paid",
    fulfillment_status: "Unfulfilled",
    notes: "Fragile packaging requested",
    created_at: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
  },
  {
    id: "TCT-893954",
    customer_name: "Rohan Varma",
    customer_email: "rohan.v@gmail.com",
    customer_phone: "+91 99100 23145",
    shipping_address: {
      address: "B-4/12 Hauz Khas Enclave",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110016",
    },
    items: [
      { id: 9826885697833, title: "THD242 VASE", price: 800, quantity: 2, image: "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/ChatGPTImageJul18_2026_11_18_29PM.png?v=1784397111" },
    ],
    subtotal: 1600,
    shipping_cost: 99,
    discount: 0,
    total: 1699,
    payment_method: "Cash on Delivery",
    payment_status: "pending",
    fulfillment_status: "Dispatched",
    notes: "Call before dispatch",
    created_at: new Date(Date.now() - 3600 * 1000 * 14).toISOString(),
  },
  {
    id: "TCT-893812",
    customer_name: "Ananya Deshmukh",
    customer_email: "ananya.d@gmail.com",
    customer_phone: "+91 98230 77123",
    shipping_address: {
      address: "Penthouse 9, Koregaon Park Lane 5",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
    },
    items: [
      { id: 10122515054889, title: "TT-251 Ceramic Chicken Condiment Jar with Spoon", price: 1350, quantity: 2, image: "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/Product9-01.png?v=1784242846" },
      { id: 9636648026409, title: "Pure Washed Cotton Queen Bedsheet (No. 15)", price: 2000, quantity: 1, image: "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/DSC00422_eee0df88-82cb-49a4-818d-182c056960b2.jpg?v=1740976529" },
    ],
    subtotal: 4700,
    shipping_cost: 0,
    discount: 470,
    total: 4230,
    payment_method: "UPI (Paytm)",
    payment_status: "paid",
    fulfillment_status: "Delivered",
    notes: "",
    created_at: new Date(Date.now() - 3600 * 1000 * 28).toISOString(),
  },
  {
    id: "TCT-893701",
    customer_name: "Vikram Sengupta",
    customer_email: "vikram.s@yahoo.co.in",
    customer_phone: "+91 98300 99451",
    shipping_address: {
      address: "Flat 2B, Ballygunge Circular Road",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700019",
    },
    items: [
      { id: 9826885697833, title: "THD242 VASE", price: 800, quantity: 1, image: "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/ChatGPTImageJul18_2026_11_18_29PM.png?v=1784397111" },
    ],
    subtotal: 800,
    shipping_cost: 99,
    discount: 0,
    total: 899,
    payment_method: "UPI (PhonePe)",
    payment_status: "paid",
    fulfillment_status: "Delivered",
    notes: "",
    created_at: new Date(Date.now() - 3600 * 1000 * 40).toISOString(),
  },
];

const INITIAL_CUSTOMERS = [
  {
    id: "cust-01",
    name: "Aarav Mehta",
    email: "aarav.mehta@gmail.com",
    phone: "+91 98201 44321",
    city: "Mumbai, MH",
    orders_count: 3,
    total_spent: 8450,
  },
  {
    id: "cust-02",
    name: "Diya Narang",
    email: "diya.narang@outlook.com",
    phone: "+91 97412 88921",
    city: "Bengaluru, KA",
    orders_count: 2,
    total_spent: 6710,
  },
  {
    id: "cust-03",
    name: "Ananya Deshmukh",
    email: "ananya.d@gmail.com",
    phone: "+91 98230 77123",
    city: "Pune, MH",
    orders_count: 4,
    total_spent: 14200,
  },
  {
    id: "cust-04",
    name: "Rohan Varma",
    email: "rohan.v@gmail.com",
    phone: "+91 99100 23145",
    city: "New Delhi, DL",
    orders_count: 1,
    total_spent: 1699,
  },
  {
    id: "cust-05",
    name: "Vikram Sengupta",
    email: "vikram.s@yahoo.co.in",
    phone: "+91 98300 99451",
    city: "Kolkata, WB",
    orders_count: 2,
    total_spent: 3499,
  },
];

async function seed() {
  console.log("Seeding initial orders...");
  const { error: ordErr } = await supabase.from("orders").upsert(INITIAL_ORDERS, { onConflict: "id" });
  if (ordErr) {
    console.error("Orders error:", ordErr);
    process.exit(1);
  }
  console.log("Seeded orders successfully.");

  console.log("Seeding initial customers...");
  const { error: custErr } = await supabase.from("customers").upsert(INITIAL_CUSTOMERS, { onConflict: "email" });
  if (custErr) {
    console.error("Customers error:", custErr);
    process.exit(1);
  }
  console.log("Seeded customers successfully.");
}

seed();
