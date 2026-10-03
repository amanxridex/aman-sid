import { createClient } from "@supabase/supabase-js";
import { NOTICE_PRODUCTS, CATEGORIES_LIST, LOOKBOOK_SPOTS, HERO_SLIDES } from "./products.js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jvvrjgukgrlwmvbgtvch.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2dnJqZ3VrZ3Jsd212Ymd0dmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMjU4NTYsImV4cCI6MjEwNTgwMTg1Nn0.Fm-mgxcHkZiqOL79_5rXFDrwx-R2r2IzHpdTyzr3Fec";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Fetch products from Supabase with search, filter, and sorting.
 * Gracefully falls back to local data if query fails or network is offline.
 */
export async function getProducts({
  category = null,
  search = "",
  limit = null,
  offset = 0,
  sort = "default",
} = {}) {
  try {
    let query = supabase.from("products").select("*", { count: "exact" });

    if (category && category !== "all" && category !== "all-products") {
      // Check if matching category handle or product_type or tags
      query = query.or(
        `category.ilike.%${category}%,product_type.ilike.%${category}%,tags.cs.{${category}}`
      );
    }

    if (search && search.trim() !== "") {
      const term = search.trim();
      query = query.or(`title.ilike.%${term}%,handle.ilike.%${term}%,description.ilike.%${term}%`);
    }

    if (sort === "price-asc") {
      query = query.order("price", { ascending: true });
    } else if (sort === "price-desc") {
      query = query.order("price", { ascending: false });
    } else if (sort === "newest") {
      query = query.order("created_at", { ascending: false });
    } else if (sort === "title-asc") {
      query = query.order("title", { ascending: true });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    if (limit) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data, count, error } = await query;

    if (error || !data) {
      // Fallback to local products only on database failure
      return {
        products: NOTICE_PRODUCTS,
        total: NOTICE_PRODUCTS.length,
        fromDb: false,
      };
    }

    const normalized = data.map((p) => ({
      ...p,
      inventory: p.inventory_quantity ?? p.inventory ?? 25,
      inventory_quantity: p.inventory_quantity ?? p.inventory ?? 25,
      price: parseFloat(p.price) || 0,
      compare_at_price: p.compare_at_price ? parseFloat(p.compare_at_price) : null,
      images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []),
      tags: Array.isArray(p.tags) ? p.tags : [],
    }));

    return {
      products: normalized,
      total: count || normalized.length,
      fromDb: true,
    };
  } catch (err) {
    console.error("Error in getProducts from Supabase:", err);
    return {
      products: NOTICE_PRODUCTS,
      total: NOTICE_PRODUCTS.length,
      fromDb: false,
    };
  }
}

/**
 * Fetch a single product by handle
 */
export async function getProductByHandle(handle) {
  if (!handle) return null;
  const normalizedHandle = String(handle).trim().toLowerCase();

  try {
    let { data, error } = await supabase
      .from("products")
      .select("*")
      .ilike("handle", handle)
      .maybeSingle();

    if (!data && !isNaN(handle)) {
      const resById = await supabase
        .from("products")
        .select("*")
        .eq("id", handle)
        .maybeSingle();
      data = resById.data;
    }

    if (error || !data) {
      return (
        NOTICE_PRODUCTS.find(
          (p) =>
            p.handle.toLowerCase() === normalizedHandle ||
            String(p.id) === String(handle)
        ) || null
      );
    }
    return {
      ...data,
      inventory: data.inventory_quantity ?? data.inventory ?? 25,
      inventory_quantity: data.inventory_quantity ?? data.inventory ?? 25,
      price: parseFloat(data.price) || 0,
      compare_at_price: data.compare_at_price ? parseFloat(data.compare_at_price) : null,
      images: Array.isArray(data.images) ? data.images : (data.images ? [data.images] : []),
      tags: Array.isArray(data.tags) ? data.tags : [],
    };
  } catch (err) {
    console.error("Error in getProductByHandle from Supabase:", err);
    return (
      NOTICE_PRODUCTS.find(
        (p) =>
          p.handle.toLowerCase() === normalizedHandle ||
          String(p.id) === String(handle)
      ) || null
    );
  }
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return NOTICE_PRODUCTS.find((p) => String(p.id) === String(id)) || null;
    }
    return {
      ...data,
      inventory: data.inventory_quantity ?? data.inventory ?? 25,
      inventory_quantity: data.inventory_quantity ?? data.inventory ?? 25,
      price: parseFloat(data.price) || 0,
      compare_at_price: data.compare_at_price ? parseFloat(data.compare_at_price) : null,
      images: Array.isArray(data.images) ? data.images : (data.images ? [data.images] : []),
      tags: Array.isArray(data.tags) ? data.tags : [],
    };
  } catch (err) {
    console.error("Error in getProductById from Supabase:", err);
    return NOTICE_PRODUCTS.find((p) => String(p.id) === String(id)) || null;
  }
}

/**
 * Fetch all categories
 */
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return CATEGORIES_LIST.map((c) => ({
        ...c,
        id: c.id || c.handle,
        title: c.label || c.title,
        label: c.label || c.title,
        image: c.image_url || c.image || "/products/drive/Lemon Ceramic Vase with Handles.webp",
        image_url: c.image_url || c.image || "/products/drive/Lemon Ceramic Vase with Handles.webp",
      }));
    }
    return data.map((c) => ({
      ...c,
      id: c.id || c.handle,
      title: c.label || c.title || c.name,
      label: c.label || c.title || c.name,
      image: c.image_url || c.image || "/products/drive/Lemon Ceramic Vase with Handles.webp",
      image_url: c.image_url || c.image || "/products/drive/Lemon Ceramic Vase with Handles.webp",
    }));
  } catch (err) {
    console.error("Error in getCategories from Supabase:", err);
    return CATEGORIES_LIST.map((c) => ({
      ...c,
      id: c.id || c.handle,
      title: c.label || c.title,
      label: c.label || c.title,
      image: c.image_url || c.image || "/products/drive/Lemon Ceramic Vase with Handles.webp",
    }));
  }
}

/**
 * Insert a new product into Supabase
 */
export async function createProduct(prod) {
  const slug =
    prod.handle ||
    prod.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const row = {
    id: prod.id || Date.now(),
    title: prod.title,
    handle: slug,
    price: parseFloat(prod.price) || 0,
    compare_at_price: prod.compare_at_price ? parseFloat(prod.compare_at_price) : null,
    images: Array.isArray(prod.images) ? prod.images : [prod.images].filter(Boolean),
    product_type: prod.product_type || "Homeware",
    category: prod.category || prod.product_type || "Serveware",
    tags: Array.isArray(prod.tags) ? prod.tags : (prod.tags || "").split(",").map((s) => s.trim()).filter(Boolean),
    available: prod.available !== false,
    description: prod.description || "",
    inventory_quantity: prod.inventory !== undefined ? Number(prod.inventory) : 25,
  };

  const { data, error } = await supabase
    .from("products")
    .upsert([row], { onConflict: "id" })
    .select()
    .single();

  if (error) {
    console.error("Failed to insert product in Supabase:", error);
    throw error;
  }
  return {
    ...data,
    inventory: data.inventory_quantity,
  };
}

/**
 * Update an existing product directly in Supabase
 */
export async function updateProduct(id, updates) {
  const payload = {};
  if (updates.title !== undefined) payload.title = String(updates.title).trim();
  if (updates.handle !== undefined) payload.handle = String(updates.handle).trim();
  if (updates.description !== undefined) payload.description = String(updates.description || "");
  if (updates.price !== undefined) payload.price = parseFloat(updates.price) || 0;
  if (updates.compare_at_price !== undefined) {
    payload.compare_at_price =
      updates.compare_at_price !== null && updates.compare_at_price !== "" && !isNaN(updates.compare_at_price)
        ? parseFloat(updates.compare_at_price)
        : null;
  }
  if (updates.images !== undefined) {
    payload.images = Array.isArray(updates.images) ? updates.images : [updates.images].filter(Boolean);
  }
  if (updates.product_type !== undefined) payload.product_type = String(updates.product_type);
  if (updates.category !== undefined) payload.category = String(updates.category);
  if (updates.tags !== undefined) {
    payload.tags = Array.isArray(updates.tags)
      ? updates.tags
      : String(updates.tags).split(",").map((t) => t.trim()).filter(Boolean);
  }
  if (updates.available !== undefined) payload.available = Boolean(updates.available);
  if (updates.inventory_quantity !== undefined) {
    payload.inventory_quantity = parseInt(updates.inventory_quantity, 10) || 0;
  } else if (updates.inventory !== undefined) {
    payload.inventory_quantity = parseInt(updates.inventory, 10) || 0;
  }
  payload.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update product in Supabase:", error);
    throw error;
  }
  return {
    ...data,
    inventory: data.inventory_quantity,
  };
}

/**
 * Delete a product
 */
export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("Failed to delete product in Supabase:", error);
    throw error;
  }
  return true;
}

/**
 * Create a new order in Supabase & record customer
 */
export async function createOrder(order) {
  const orderId = order.id || "TCT-" + Math.floor(100000 + Math.random() * 900000);

  const orderRow = {
    id: orderId,
    customer_name: order.customer_name || `${order.shipping_address?.firstName || ""} ${order.shipping_address?.lastName || ""}`.trim() || "Customer",
    customer_email: order.customer_email || order.contact?.email || "",
    customer_phone: order.customer_phone || order.contact?.phone || "",
    shipping_address: order.shipping_address || {},
    items: order.items || [],
    subtotal: parseFloat(order.subtotal) || 0,
    shipping_cost: parseFloat(order.shipping_cost) || 0,
    discount: parseFloat(order.discount) || 0,
    total: parseFloat(order.total) || 0,
    payment_method: order.payment_method || "COD",
    payment_status: order.payment_status || "paid",
    fulfillment_status: order.fulfillment_status || "Unfulfilled",
    notes: order.notes || "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // 1. Insert order
  const { data: insertedOrder, error: orderErr } = await supabase
    .from("orders")
    .insert([orderRow])
    .select()
    .single();

  if (orderErr) {
    console.error("Error creating order in Supabase:", orderErr);
    // Don't crash user flow if network glitch, return local object
    return orderRow;
  }

  // 2. Upsert customer
  if (orderRow.customer_email) {
    try {
      // Check existing customer
      const { data: existingCust } = await supabase
        .from("customers")
        .select("*")
        .eq("email", orderRow.customer_email)
        .maybeSingle();

      if (existingCust) {
        await supabase
          .from("customers")
          .update({
            orders_count: (existingCust.orders_count || 0) + 1,
            total_spent: (parseFloat(existingCust.total_spent) || 0) + orderRow.total,
            phone: orderRow.customer_phone || existingCust.phone,
            city: orderRow.shipping_address?.city || existingCust.city,
          })
          .eq("id", existingCust.id);
      } else {
        await supabase.from("customers").insert([
          {
            id: "cust-" + Date.now(),
            name: orderRow.customer_name,
            email: orderRow.customer_email,
            phone: orderRow.customer_phone,
            city: orderRow.shipping_address?.city || "",
            orders_count: 1,
            total_spent: orderRow.total,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (custErr) {
      console.warn("Could not upsert customer stats:", custErr);
    }
  }

  return insertedOrder;
}

/**
 * Fetch all orders
 */
export async function getOrders() {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching orders:", err);
    return [];
  }
}

/**
 * Fetch orders for a specific customer phone number
 */
export async function getOrdersByPhone(phone) {
  if (!phone) return [];
  const raw = String(phone).trim();
  const digits = raw.replace(/\D/g, "");
  const last10 = digits.length >= 10 ? digits.slice(-10) : digits;

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .or(`customer_phone.ilike.%${last10}%,customer_phone.ilike.%${raw}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders by phone:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Error in getOrdersByPhone:", err);
    return [];
  }
}

/**
 * Fetch or resolve customer profile by phone number
 */
export async function getCustomerByPhone(phone) {
  if (!phone) return null;
  const raw = String(phone).trim();
  const digits = raw.replace(/\D/g, "");
  const last10 = digits.length >= 10 ? digits.slice(-10) : digits;

  try {
    // 1. Check in customers table
    const { data: cust } = await supabase
      .from("customers")
      .select("*")
      .or(`phone.ilike.%${last10}%,phone.ilike.%${raw}%`)
      .maybeSingle();

    if (cust) {
      return cust;
    }

    // 2. If not found in customers table, resolve from orders table
    const orders = await getOrdersByPhone(phone);
    if (orders && orders.length > 0) {
      const latest = orders[0];
      const totalSpent = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
      return {
        id: "cust-" + last10,
        name: latest.customer_name || "Collector",
        email: latest.customer_email || "",
        phone: latest.customer_phone || raw,
        city: latest.shipping_address?.city || "India",
        orders_count: orders.length,
        total_spent: totalSpent,
        created_at: latest.created_at,
      };
    }

    return null;
  } catch (err) {
    console.error("Error in getCustomerByPhone:", err);
    return null;
  }
}

/**
 * Update order fulfillment or payment status
 */
export async function updateOrderStatus(orderId, updates) {
  const payload = typeof updates === "string" ? { fulfillment_status: updates } : updates;
  const { data, error } = await supabase
    .from("orders")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update order status in Supabase:", error);
    throw error;
  }
  return data;
}

/**
 * Fetch customers
 */
export async function getCustomers() {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("total_spent", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching customers:", err);
    return [];
  }
}

/**
 * Fetch discounts
 */
export async function getDiscounts() {
  try {
    const { data, error } = await supabase
      .from("discounts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const now = new Date();
    return (data || []).map((d) => {
      const rawStatus = d.status || "active";
      let isLiveNow = false;
      let effectiveStatus = "active";
      let scheduledStart = null;
      let scheduledEnd = null;

      if (rawStatus === "inactive") {
        isLiveNow = false;
        effectiveStatus = "inactive";
      } else if (rawStatus.startsWith("scheduled:")) {
        const parts = rawStatus.replace("scheduled:", "").split("|");
        scheduledStart = parts[0] ? new Date(parts[0]) : null;
        scheduledEnd = parts[1] ? new Date(parts[1]) : null;

        if (scheduledStart && now >= scheduledStart) {
          if (!scheduledEnd || now <= scheduledEnd) {
            isLiveNow = true;
            effectiveStatus = "active";
          } else {
            isLiveNow = false;
            effectiveStatus = "expired";
          }
        } else {
          isLiveNow = false;
          effectiveStatus = "scheduled";
        }
      } else {
        isLiveNow = true;
        effectiveStatus = "active";
      }

      return {
        ...d,
        rawStatus,
        status: rawStatus,
        effectiveStatus,
        isLiveNow,
        scheduledStart: scheduledStart ? scheduledStart.toISOString() : null,
        scheduledEnd: scheduledEnd ? scheduledEnd.toISOString() : null,
      };
    });
  } catch (err) {
    console.error("Error fetching discounts:", err);
    return [];
  }
}

/**
 * Fetch only active/live discounts (for users on the storefront)
 */
export async function getLiveDiscounts() {
  const all = await getDiscounts();
  return all.filter((d) => d.isLiveNow);
}

/**
 * Create a new discount code in Supabase
 */
export async function createDiscount(discount) {
  const upper = String(discount.code || "").trim().toUpperCase();
  if (!upper) throw new Error("Coupon code is required");

  let statusValue = "active";
  if (discount.scheduleType === "scheduled" && discount.startsAt) {
    statusValue = `scheduled:${new Date(discount.startsAt).toISOString()}`;
    if (discount.expiresAt) {
      statusValue += `|${new Date(discount.expiresAt).toISOString()}`;
    }
  } else if (discount.status === "inactive") {
    statusValue = "inactive";
  }

  const row = {
    id: discount.id || "disc_" + Date.now(),
    code: upper,
    type: discount.type === "fixed_amount" ? "fixed_amount" : "percentage",
    value: parseFloat(discount.value) || 10,
    min_requirement: parseFloat(discount.min_requirement) || 0,
    status: statusValue,
    usage_count: 0,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("discounts")
    .upsert([row], { onConflict: "code" })
    .select()
    .single();

  if (error) {
    console.error("Error creating discount in Supabase:", error);
    throw error;
  }
  return data;
}

/**
 * Update an existing discount code in Supabase
 */
export async function updateDiscount(id, updates) {
  const payload = {};
  if (updates.code !== undefined) payload.code = String(updates.code).trim().toUpperCase();
  if (updates.type !== undefined) payload.type = updates.type;
  if (updates.value !== undefined) payload.value = parseFloat(updates.value) || 0;
  if (updates.min_requirement !== undefined) {
    payload.min_requirement = parseFloat(updates.min_requirement) || 0;
  }
  if (updates.status !== undefined) payload.status = updates.status;

  let query = supabase.from("discounts").update(payload);
  if (id) {
    query = query.or(`id.eq.${id},code.eq.${id}`);
  }

  const { data, error } = await query.select();

  if (error) {
    console.error("Error updating discount in Supabase:", error);
    throw error;
  }
  return data && data.length > 0 ? data[0] : null;
}

/**
 * Delete a discount code from Supabase
 */
export async function deleteDiscount(id) {
  const { error } = await supabase
    .from("discounts")
    .delete()
    .or(`id.eq.${id},code.eq.${id}`);
  if (error) {
    console.error("Error deleting discount from Supabase:", error);
    throw error;
  }
  return true;
}

/**
 * Toggle discount active/inactive in Supabase
 */
export async function toggleDiscountStatus(id, currentStatus) {
  const isCurrentlyActive = currentStatus === "active" || currentStatus?.startsWith("scheduled:");
  const newStatus = isCurrentlyActive ? "inactive" : "active";

  return updateDiscount(id, { status: newStatus });
}

/**
 * Insert collection / category into Supabase
 */
export async function createCategory(cat) {
  const slug =
    cat.handle ||
    (cat.label || cat.title || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const row = {
    id: cat.id || slug,
    label: (cat.label || cat.title || "New Category").trim(),
    handle: slug,
    filter: cat.filter || slug,
    description: cat.description || "",
    image_url: cat.image_url || cat.image || "/products/drive/Lemon Ceramic Vase with Handles.webp",
    display_order: cat.display_order !== undefined ? Number(cat.display_order) : 10,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("categories")
    .upsert([row], { onConflict: "handle" })
    .select()
    .single();

  if (error) {
    console.error("Failed to insert category in Supabase:", error);
    throw error;
  }
  return {
    ...data,
    title: data.label,
    image: data.image_url,
  };
}

/**
 * Update an existing collection / category in Supabase
 */
export async function updateCategory(id, updates) {
  const payload = {};
  if (updates.label !== undefined) payload.label = String(updates.label).trim();
  if (updates.title !== undefined && !payload.label) payload.label = String(updates.title).trim();
  if (updates.handle !== undefined) payload.handle = String(updates.handle).trim();
  if (updates.description !== undefined) payload.description = String(updates.description || "");
  if (updates.image_url !== undefined) payload.image_url = String(updates.image_url || "");
  else if (updates.image !== undefined) payload.image_url = String(updates.image || "");
  if (updates.filter !== undefined) payload.filter = String(updates.filter || "");
  if (updates.display_order !== undefined) payload.display_order = Number(updates.display_order) || 0;

  let query = supabase.from("categories").update(payload);
  if (id) {
    query = query.or(`id.eq.${id},handle.eq.${id}`);
  }

  const { data, error } = await query.select();

  if (error) {
    console.error("Failed to update category in Supabase:", error);
    throw error;
  }

  const updated = data && data.length > 0 ? data[0] : null;
  if (!updated) {
    throw new Error(`Category ${id} not found in database.`);
  }

  return {
    ...updated,
    title: updated.label,
    image: updated.image_url,
  };
}

/**
 * Delete a category from Supabase
 */
export async function deleteCategory(id) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .or(`id.eq.${id},handle.eq.${id}`);

  if (error) {
    console.error("Failed to delete category in Supabase:", error);
    throw error;
  }
  return true;
}

/**
 * Fetch a single category by its handle
 */
export async function getCategoryByHandle(handle) {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("handle", handle)
      .maybeSingle();

    if (error || !data) return null;
    return {
      ...data,
      title: data.label,
      image: data.image_url,
    };
  } catch (err) {
    console.error("Error fetching category by handle:", err);
    return null;
  }
}

/**
 * Real-time Database Metrics for Admin Dashboard
 */
export async function getDbMetrics() {
  try {
    const [prodRes, ordRes, custRes, eventsRes] = await Promise.all([
      supabase.from("products").select("id, available, inventory_quantity", { count: "exact" }),
      supabase.from("orders").select("id, total, fulfillment_status, payment_status, created_at"),
      supabase.from("customers").select("id, total_spent", { count: "exact" }),
      supabase.from("analytics_events").select("id", { count: "exact" }),
    ]);

    const productsCount = prodRes.count || prodRes.data?.length || 0;
    const orders = ordRes.data || [];
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
    const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
    const unfulfilledOrders = orders.filter((o) => o.fulfillment_status === "Unfulfilled").length;
    const customersCount = custRes.count || custRes.data?.length || 0;
    const totalEvents = eventsRes.count || (eventsRes.data ? eventsRes.data.length : 0);
    const conversionRate = totalEvents > 0 ? ((totalOrders / totalEvents) * 100).toFixed(2) : "0.00";

    return {
      productsCount,
      totalOrders,
      totalSales,
      averageOrderValue,
      unfulfilledOrders,
      customersCount,
      conversionRate,
      totalEvents,
    };
  } catch (err) {
    console.error("Error calculating DB metrics:", err);
    return null;
  }
}

/**
 * Record real page view in Supabase analytics_events table
 */
export async function recordPageView(path, referrer = "") {
  if (typeof window === "undefined") return;
  try {
    let sessionId = sessionStorage.getItem("tct_session_id");
    if (!sessionId) {
      sessionId = "sess_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now();
      sessionStorage.setItem("tct_session_id", sessionId);
    }

    await supabase.from("analytics_events").insert([
      {
        event_type: "page_view",
        path: path || window.location.pathname,
        referrer: referrer || (document.referrer ? document.referrer.slice(0, 200) : "direct"),
        metadata: {
          session_id: sessionId,
          screen: `${window.innerWidth}x${window.innerHeight}`,
        },
      },
    ]);
  } catch (err) {
    // Non-blocking telemetry
  }
}

/**
 * Fetch real traffic analytics from Supabase analytics_events table
 */
export async function getRealAnalytics() {
  try {
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [recentEventsRes, todayEventsRes, allEventsRes] = await Promise.all([
      supabase
        .from("analytics_events")
        .select("metadata")
        .gte("created_at", fifteenMinsAgo),
      supabase
        .from("analytics_events")
        .select("id, path, referrer, metadata, created_at")
        .gte("created_at", twentyFourHoursAgo),
      supabase
        .from("analytics_events")
        .select("id, path, referrer, metadata, created_at")
        .order("created_at", { ascending: false })
        .limit(300),
    ]);

    const activeSessions = new Set(
      (recentEventsRes.data || [])
        .map((e) => e.metadata?.session_id)
        .filter(Boolean)
    );

    const activeVisitors = Math.max(1, activeSessions.size);
    const todayEvents = todayEventsRes.data || [];
    const todayPageViews = todayEvents.length;
    const todayVisitors = Math.max(1, new Set(todayEvents.map((e) => e.metadata?.session_id || e.id)).size);

    // Aggregate real paths
    const pathCounts = {};
    const eventsPool = allEventsRes.data && allEventsRes.data.length > 0 ? allEventsRes.data : todayEvents;
    eventsPool.forEach((e) => {
      const p = e.path || "/";
      pathCounts[p] = (pathCounts[p] || 0) + 1;
    });

    const topPages = Object.entries(pathCounts)
      .map(([path, visits]) => ({ path, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 6);

    // Aggregate real devices from screen
    let mobileCount = 0;
    let desktopCount = 0;
    let tabletCount = 0;

    eventsPool.forEach((e) => {
      const screen = e.metadata?.screen || "";
      const width = parseInt(screen.split("x")[0], 10) || 1200;
      if (width < 768) mobileCount++;
      else if (width <= 1024) tabletCount++;
      else desktopCount++;
    });

    const totalDevices = mobileCount + desktopCount + tabletCount || 1;
    const devices = {
      mobilePct: Math.round((mobileCount / totalDevices) * 100) || 50,
      desktopPct: Math.round((desktopCount / totalDevices) * 100) || 45,
      tabletPct: Math.round((tabletCount / totalDevices) * 100) || 5,
      mobileCount,
      desktopCount,
      tabletCount,
    };

    // Aggregate real referrers
    const sourceCounts = { Direct: 0, Social: 0, Search: 0, Internal: 0 };
    eventsPool.forEach((e) => {
      const ref = (e.referrer || "").toLowerCase();
      if (!ref || ref === "direct") sourceCounts.Direct++;
      else if (ref.includes("instagram") || ref.includes("facebook") || ref.includes("t.co")) sourceCounts.Social++;
      else if (ref.includes("google") || ref.includes("bing")) sourceCounts.Search++;
      else sourceCounts.Internal++;
    });

    const totalSources = Object.values(sourceCounts).reduce((a, b) => a + b, 0) || 1;
    const sources = [
      { source: "Direct Store Visitors", share: Math.round((sourceCounts.Direct / totalSources) * 100) || 60, visitors: sourceCounts.Direct, color: "bg-[#121212]" },
      { source: "Social & Instagram", share: Math.round((sourceCounts.Social / totalSources) * 100) || 20, visitors: sourceCounts.Social, color: "bg-pink-600" },
      { source: "Google Organic Search", share: Math.round((sourceCounts.Search / totalSources) * 100) || 15, visitors: sourceCounts.Search, color: "bg-emerald-600" },
      { source: "Direct Brand Links", share: Math.round((sourceCounts.Internal / totalSources) * 100) || 5, visitors: sourceCounts.Internal, color: "bg-amber-600" },
    ];

    return {
      activeVisitors,
      todayPageViews,
      todayVisitors,
      todaySessions: todayVisitors,
      topPages,
      devices,
      sources,
    };
  } catch (err) {
    console.error("Error fetching real analytics:", err);
    return {
      activeVisitors: 1,
      todayPageViews: 1,
      todayVisitors: 1,
      todaySessions: 1,
      topPages: [],
      devices: { mobilePct: 60, desktopPct: 35, tabletPct: 5, mobileCount: 1, desktopCount: 1, tabletCount: 0 },
      sources: [],
    };
  }
}

/**
 * Save newsletter subscriber to Supabase
 */
export async function subscribeNewsletter(email) {
  if (!email || !email.includes("@")) return false;
  try {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .upsert([{ email: email.trim().toLowerCase() }], { onConflict: "email" });
    if (error) {
      console.warn("Newsletter subscription warn:", error);
    }
    return true;
  } catch (err) {
    console.error("Error subscribing to newsletter:", err);
    return false;
  }
}

/**
 * Save contact inquiry to Supabase
 */
export async function submitContactInquiry({ name, email, subject, message, phone }) {
  try {
    let fullMessage = message || "";
    if (phone && phone.trim()) {
      fullMessage = `[Phone: ${phone.trim()}]\n\n${fullMessage}`;
    }

    const { data, error } = await supabase
      .from("contact_inquiries")
      .insert([
        {
          name: name ? String(name).trim() : "Visitor",
          email: email ? String(email).trim().toLowerCase() : "",
          subject: subject ? String(subject).trim() : "General Customer Inquiry",
          message: fullMessage,
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] };
  } catch (err) {
    console.error("Error submitting contact inquiry:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all contact inquiries from Supabase
 */
export async function getContactInquiries() {
  try {
    const [inqRes, settings] = await Promise.all([
      supabase.from("contact_inquiries").select("*").order("created_at", { ascending: false }),
      getStoreSettings(),
    ]);

    if (inqRes.error) throw inqRes.error;

    const deletedIds = new Set(Array.isArray(settings?.deleted_inquiry_ids) ? settings.deleted_inquiry_ids : []);

    return (inqRes.data || [])
      .filter((inq) => !deletedIds.has(inq.id) && !deletedIds.has(Number(inq.id)))
      .map((inq) => {
        let phone = null;
        let cleanMessage = inq.message || "";
        const phoneMatch = cleanMessage.match(/^\[Phone:\s*([^\]]+)\]\s*/i);
        if (phoneMatch) {
          phone = phoneMatch[1].trim();
          cleanMessage = cleanMessage.replace(phoneMatch[0], "");
        }

        return {
          ...inq,
          phone,
          message: cleanMessage,
          cleanMessage,
          dateFormatted: inq.created_at
            ? new Date(inq.created_at).toLocaleString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Recently",
        };
      });
  } catch (err) {
    console.error("Error fetching contact inquiries:", err);
    return [];
  }
}

/**
 * Delete a contact inquiry from Supabase
 */
export async function deleteContactInquiry(id) {
  try {
    // 1. Attempt direct Supabase deletion
    await supabase.from("contact_inquiries").delete().eq("id", id);

    // 2. Persist in store_settings.deleted_inquiry_ids to guarantee DB sync
    const settings = await getStoreSettings();
    const existingDeleted = Array.isArray(settings?.deleted_inquiry_ids) ? settings.deleted_inquiry_ids : [];
    const updatedDeleted = Array.from(new Set([...existingDeleted, id, Number(id)]));
    await updateStoreSettings({
      ...settings,
      deleted_inquiry_ids: updatedDeleted,
    });

    return true;
  } catch (err) {
    console.error("Error deleting contact inquiry:", err);
    throw err;
  }
}

/**
 * Validate a discount code directly against Supabase discounts table
 */
export async function validateDiscountCode(code, subtotal) {
  const upper = String(code || "").trim().toUpperCase();
  if (!upper) return { valid: false, message: "Please enter a code" };

  try {
    const { data: coupon, error } = await supabase
      .from("discounts")
      .select("*")
      .eq("code", upper)
      .maybeSingle();

    if (coupon) {
      const rawStatus = coupon.status || "active";

      // 1. Inactive check
      if (rawStatus === "inactive") {
        return {
          valid: false,
          message: `Discount code ${upper} is currently inactive.`,
        };
      }

      // 2. Scheduled go-live check
      if (rawStatus.startsWith("scheduled:")) {
        const parts = rawStatus.replace("scheduled:", "").split("|");
        const startsAt = parts[0] ? new Date(parts[0]) : null;
        const expiresAt = parts[1] ? new Date(parts[1]) : null;
        const now = new Date();

        if (startsAt && now < startsAt) {
          const formattedTime = startsAt.toLocaleString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          return {
            valid: false,
            message: `Discount code ${upper} will go live on ${formattedTime}.`,
          };
        }

        if (expiresAt && now > expiresAt) {
          return {
            valid: false,
            message: `Discount code ${upper} has expired.`,
          };
        }
      }

      // 3. Minimum requirement check
      const minReq = parseFloat(coupon.min_requirement) || 0;
      if (subtotal < minReq) {
        return {
          valid: false,
          message: `Minimum order amount of ₹${minReq.toLocaleString("en-IN")} required for code ${upper}.`,
        };
      }

      const val = parseFloat(coupon.value);
      return {
        valid: true,
        type: coupon.type,
        value: val,
        message:
          coupon.type === "percentage"
            ? `${val}% discount applied!`
            : `₹${val} flat discount applied!`,
      };
    }

    return { valid: false, message: "Invalid discount code." };
  } catch (err) {
    console.error("Error validating discount code:", err);
    return { valid: false, message: "Invalid discount code." };
  }
}

/**
 * Fetch all published blog posts from Supabase
 */
export async function getBlogPosts({ includeUnpublished = false } = {}) {
  try {
    let query = supabase
      .from("blog_posts")
      .select("*")
      .neq("handle", "store_settings")
      .order("created_at", { ascending: false });
    if (!includeUnpublished) {
      query = query.eq("published", true);
    }
    const { data, error } = await query;
    if (error) {
      console.warn("Could not fetch blog posts from Supabase:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Error fetching blog posts:", err);
    return [];
  }
}

/**
 * Fetch a single blog post by its slug/handle
 */
export async function getBlogPostByHandle(handle) {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("handle", handle)
      .maybeSingle();

    if (error) {
      console.warn("Error fetching blog post by handle:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Error in getBlogPostByHandle:", err);
    return null;
  }
}

/**
 * Create a new blog post
 */
export async function createBlogPost(post) {
  const slug =
    post.handle ||
    post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const row = {
    title: post.title,
    handle: slug,
    excerpt: post.excerpt || "",
    content: post.content || "",
    image: post.image || "https://cdn.shopify.com/s/files/1/0826/5053/0110/files/06_f701ce34-3d80-4167-87f5-e3dd0ec7dc5f.jpg?v=1765797590&width=800",
    read_time: post.read_time || "4 min read",
    author: post.author || "Derick Martin",
    published: post.published !== false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("blog_posts")
    .insert([row])
    .select()
    .single();

  if (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
  return data;
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(id, updates) {
  const row = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("blog_posts")
    .update(row)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating blog post in Supabase:", error);
    throw error;
  }
  return data;
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
  return true;
}

/**
 * Default Footer Navigation Sections
 */
export const DEFAULT_FOOTER_SECTIONS = [
  {
    id: "homeware",
    title: "Homeware",
    links: [
      { id: "h1", label: "All Objects", url: "/collections/all-products" },
      { id: "h2", label: "Everyday Ceramics", url: "/collections/everyday-ceramics" },
      { id: "h3", label: "Tableware & Dining", url: "/collections/tableware" },
      { id: "h4", label: "Serveware Platters", url: "/collections/serveware" },
    ],
  },
  {
    id: "decor",
    title: "Decor & Living",
    links: [
      { id: "d1", label: "Vases & Planters", url: "/collections/vases-planters" },
      { id: "d2", label: "Candles & Holders", url: "/collections/candles-holders" },
      { id: "d3", label: "Traditional Blue Pottery", url: "/collections/blue-pottery" },
      { id: "d4", label: "Merry & Bright Festive", url: "/collections/merry-bright" },
    ],
  },
  {
    id: "about",
    title: "About",
    links: [
      { id: "a1", label: "Our Story", url: "/pages/our-story" },
      { id: "a2", label: "About The Cozy Theory", url: "/pages/about" },
      { id: "a3", label: "Journal", url: "/blogs/news" },
      { id: "a4", label: "Contact Us", url: "/pages/contact" },
      { id: "a5", label: "FAQs & Care Guides", url: "/pages/faq" },
    ],
  },
  {
    id: "policies",
    title: "Policies",
    links: [
      { id: "p1", label: "Shipping & Return Policy", url: "/pages/shipping-and-return-policy" },
      { id: "p2", label: "Refund Policy", url: "/pages/refund-policy" },
      { id: "p3", label: "Terms and Conditions", url: "/pages/terms-and-conditions" },
      { id: "p4", label: "Privacy Policy", url: "/pages/privacy-policy" },
      { id: "p5", label: "Pricing & GST", url: "/pages/pricing-policy" },
    ],
  },
];

export const DEFAULT_FAQS = [
  {
    id: "faq-1",
    q: "What is The Cozy Theory design philosophy?",
    a: "The Cozy Theory crafts everyday ceramics, artisanal tabletop objects, and pure cotton home linen. Our pieces celebrate tactile materiality, warm tones, and honest craftsmanship to bring comfort and presence into modern living spaces.",
    hidden: false,
  },
  {
    id: "faq-2",
    q: "How long does shipping take within India?",
    a: "All domestic orders across India are dispatched within 24–48 business hours via standard courier partners (BlueDart / Delhivery). Standard transit takes 2–4 business days for metro areas.",
    hidden: false,
  },
  {
    id: "faq-3",
    q: "Are shipping costs included?",
    a: "Orders above Rs. 9,999 qualify for complimentary standard shipping across India. For orders below Rs. 9,999, a flat shipping fee of Rs. 99 applies at checkout. Plus, enjoy Rs. 500 off on orders above Rs. 5,999.",
    hidden: false,
  },
  {
    id: "faq-4",
    q: "How should I care for handcrafted ceramics and pottery?",
    a: "Our glazed stoneware and ceramics are food-safe. To preserve fine hand-painted glazes, gentle hand washing with mild dish soap and a soft sponge is recommended.",
    hidden: false,
  },
  {
    id: "faq-5",
    q: "What is the return and replacement policy?",
    a: "We provide a 50% refund if any object arrives damaged in transit. An opening/unboxing video showing the sealed package being opened and the damaged contents is required (photos alone are not sufficient). Check the refund policy for full claim guidelines.",
    linkText: "Check the refund policy →",
    linkUrl: "/pages/refund-policy",
    hidden: false,
  },
  {
    id: "faq-6",
    q: "How do I care for pure cotton bedsheets and linen?",
    a: "Machine wash on a gentle cycle in cold water using mild detergent. Tumble dry on low or line dry in the shade to preserve natural fiber softness and color longevity.",
    hidden: false,
  },
  {
    id: "faq-7",
    q: "What payment methods are supported at checkout?",
    a: "We support 100% secure payments via Razorpay, PhonePe, and all UPI applications (Google Pay, Paytm, BHIM, etc.), as well as credit/debit cards and net banking. Cash on Delivery (COD) is not accepted.",
    hidden: false,
  },
];

export const DEFAULT_OUR_STORY = {
  chapter1_image: "/products/drive/TT-176 Tulip Garden Ceramic Vase  Planter.webp",
  chapter1_subtitle: "Chapter 01 // That Familiar Warmth",
  chapter1_title: "A favourite cup. A vase in afternoon light.",
  chapter2_image: "/products/drive/Pomegranate Ceramic Vase.webp",
  chapter2_subtitle: "Chapter 02 // Lived-In Moments",
  chapter2_title: "Slow mornings & spontaneous dinners.",
};

/**
 * Default Store & Brand Settings
 */
export const DEFAULT_STORE_SETTINGS = {
  brand_name: "THE COZY THEORY",
  brand_tagline: "STAY COZY, STAY YOU",
  header_story_label: "Our Story",
  header_tagline: "Curated Homeware",
  show_header_tagline: false,
  journal_visible: true,
  about_title: "THE COZY THEORY",
  about_tagline: "STAY COZY, STAY YOU",
  about_description:
    "The Cozy Theory curates everyday objects, dining accents, and soft furnishings that transform your living space into a sanctuary of warmth, texture, and individual expression. We believe in everyday rituals elevated by honest materials.",
  footer_newsletter_title: "Join The Cozy Theory Collector List",
  footer_newsletter_text:
    "Be first to gain access to limited seasonal drops, archival ceramics, and private offers.",
  footer_tagline:
    "Stay cozy, stay you. The Cozy Theory crafts everyday homeware, everyday ceramics, and tactile objects for warm living spaces.",
  footer_instagram_url: "https://www.instagram.com/the.cozy.theory?stkn=MWxpY3UyOTZoMXpiYg==",
  footer_pinterest_url: "https://pin.it/229oxMjQD",
  footer_sections: DEFAULT_FOOTER_SECTIONS,
  announcements: [
    "FREE SHIPPING ABOVE 9999/-",
    "50% REFUND IF DAMAGED",
    "THE COZY THEORY // ARTISANAL HOMEWARE",
    "100% HANDCRAFTED STONEWARE",
  ],
  manifesto_tagline: "OUR STORY // STAY COZY, STAY YOU",
  manifesto_title: "OUR STORY.",
  manifesto_text:
    "There was always something comforting about the little things. A favourite cup waiting on the kitchen shelf. A vase catching the afternoon light. A plate brought out when friends stayed a little longer than planned. The small objects that quietly turn a house into a place that feels like yours.",
  manifesto_button_text: "Read More →",
  manifesto_button_url: "/pages/our-story",
  manifesto_image:
    "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/Product9-01.png?v=1784242846",
  manifesto_product_title:
    "TT-251 Ceramic Chicken Condiment Jar with Spoon",
  manifesto_product_url:
    "/products/tt-251-ceramic-chicken-condiment-jar-with-spoon",
  lookbook_title: "Shop The Look",
  lookbook_subtitle: "Curated Atmosphere",
  lookbook_text:
    "Tap the illuminated hotspots on the art arrangement to inspect and add individual conversation objects directly to your bag.",
  lookbook_image:
    "https://cdn.shopify.com/s/files/1/0826/5053/0110/files/Two_Odd_x_Notice_Aditya_Sinha-1.jpg?v=1788185403&width=1600&format=webp",
  lookbook_spots: LOOKBOOK_SPOTS,
  hero_slides: HERO_SLIDES,
  faqs: DEFAULT_FAQS,
  our_story: DEFAULT_OUR_STORY,
};

/**
 * Fetch store and brand settings directly from Supabase
 */
export async function getStoreSettings() {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("content")
      .eq("handle", "store_settings")
      .maybeSingle();

    if (error || !data || !data.content) {
      return DEFAULT_STORE_SETTINGS;
    }

    try {
      const parsed = JSON.parse(data.content);
      return {
        ...DEFAULT_STORE_SETTINGS,
        ...parsed,
      };
    } catch (parseErr) {
      console.error("Error parsing store_settings JSON:", parseErr);
      return DEFAULT_STORE_SETTINGS;
    }
  } catch (err) {
    console.error("Error loading store settings from Supabase:", err);
    return DEFAULT_STORE_SETTINGS;
  }
}

/**
 * Update store and brand settings directly in Supabase
 */
export async function updateStoreSettings(settings) {
  const merged = {
    ...DEFAULT_STORE_SETTINGS,
    ...settings,
  };

  const payload = {
    handle: "store_settings",
    title: "Store Settings Configuration",
    excerpt: "Global store settings, branding, and announcement bar configuration",
    content: JSON.stringify(merged),
    author: "Admin",
    published: false,
    read_time: "1 min",
    updated_at: new Date().toISOString(),
  };

  try {
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("handle", "store_settings")
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("blog_posts")
        .update(payload)
        .eq("handle", "store_settings")
        .select();

      if (error) throw error;
      return merged;
    } else {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert([{ ...payload, id: "settings_" + Date.now() }])
        .select();

      if (error) throw error;
      return merged;
    }
  } catch (err) {
    console.error("Error updating store settings in Supabase:", err);
    throw err;
  }
}

