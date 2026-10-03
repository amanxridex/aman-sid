"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { NOTICE_PRODUCTS, CATEGORIES_LIST } from "@/lib/products";
import {
  getProducts,
  getCategories,
  getOrders,
  createProduct as dbCreateProduct,
  updateProduct as dbUpdateProduct,
  deleteProduct as dbDeleteProduct,
  createCategory as dbCreateCategory,
  updateCategory as dbUpdateCategory,
  deleteCategory as dbDeleteCategory,
  updateOrderStatus as dbUpdateOrderStatus,
  getCustomers as dbGetCustomers,
  getDiscounts as dbGetDiscounts,
  createDiscount as dbCreateDiscount,
  updateDiscount as dbUpdateDiscount,
  deleteDiscount as dbDeleteDiscount,
  toggleDiscountStatus as dbToggleDiscountStatus,
  getDbMetrics,
  getRealAnalytics,
  getStoreSettings as dbGetStoreSettings,
  updateStoreSettings as dbUpdateStoreSettings,
  DEFAULT_STORE_SETTINGS,
  getContactInquiries as dbGetContactInquiries,
  deleteContactInquiry as dbDeleteContactInquiry,
  getBlogPosts as dbGetBlogPosts,
  createBlogPost as dbCreateBlogPost,
  updateBlogPost as dbUpdateBlogPost,
  deleteBlogPost as dbDeleteBlogPost,
} from "@/lib/supabase";

const StoreContext = createContext(null);

export const INITIAL_COLLECTIONS = [
  {
    id: "col-all",
    handle: "all-products",
    title: "All Objects",
    label: "All Objects",
    description: "Complete archive of artisanal homeware and living objects.",
    image: "/products/drive/Lemon Ceramic Vase with Handles.webp",
    itemCount: 18,
  },
  {
    id: "col-ceramics",
    handle: "everyday-ceramics",
    title: "Everyday Ceramics",
    label: "Everyday Ceramics",
    description: "Handcrafted stoneware, daily mugs, and glazed bowls.",
    image: "/products/drive/Flower-Shaped Ceramic Decorative Plate.webp",
    itemCount: 0,
  },
  {
    id: "col-tableware",
    handle: "tableware",
    title: "Tableware & Dining",
    label: "Tableware & Dining",
    description: "Porcelain & stoneware dining plates, ramen bowls, and oil pourers.",
    image: "/products/drive/3D Lemon Scalloped Serving Platter.webp",
    itemCount: 0,
  },
  {
    id: "col-vases",
    handle: "vases-planters",
    title: "Vases & Planters",
    label: "Vases & Planters",
    description: "Contemporary ceramic and stoneware vases for botanical stems.",
    image: "/products/drive/Lemon Ceramic Vase  Planter.webp",
    itemCount: 0,
  },
  {
    id: "col-linen",
    handle: "home-linen",
    title: "Home Linen & Bedding",
    label: "Home Linen & Bedding",
    description: "Pure washed cotton bedsheets, quilted covers, and runners.",
    image: "/products/drive/ChatGPT Image Sep 17_ 2026_ 10_30_21 AM.webp",
    itemCount: 0,
  },
  {
    id: "col-candles",
    handle: "candles-holders",
    title: "Candles & Holders",
    label: "Candles & Holders",
    description: "Sculptural candleholders and ambient t-light vessels.",
    image: "/products/drive/MARLBORO RED ASH TRAY CAMEL ASH TRAY CIGARETTE ASHTRAY.webp",
    itemCount: 0,
  },
  {
    id: "col-pottery",
    handle: "blue-pottery",
    title: "Traditional Blue Pottery",
    label: "Traditional Blue Pottery",
    description: "Classic blue pottery pieces crafted with authentic floral motifs.",
    image: "/products/drive/TT-176 Tulip Garden Ceramic Vase  Planter.webp",
    itemCount: 0,
  },
  {
    id: "col-decor",
    handle: "decorative-objects",
    title: "Decorative Objects",
    label: "Decorative Objects",
    description: "Handcrafted figurines, bookends, and organic conversation pieces.",
    image: "/products/drive/Pomegranate Ceramic Vase.webp",
    itemCount: 0,
  },
  {
    id: "col-festive",
    handle: "merry-bright",
    title: "Festive & Merry",
    label: "Festive & Merry",
    description: "Heirloom holiday figurines, winter village pieces, and seasonal tabletop items.",
    image: "/products/drive/Pomegranate Ceramic Vase  Planter.webp",
    itemCount: 0,
  },
];

function normalizeOrder(o) {
  const customerName = o.customer_name || o.customer?.name || "Customer";
  const customerEmail = o.customer_email || o.customer?.email || "";
  const city = o.shipping_address?.city || o.customer?.city || "India";
  const items = Array.isArray(o.items) ? o.items : [];
  const itemsCount = o.itemsCount || items.reduce((s, it) => s + (it.quantity || 1), 0);
  const total = parseFloat(o.total) || 0;
  const fulfillmentStatus = o.fulfillment_status || o.fulfillmentStatus || "Unfulfilled";
  const financialStatus =
    o.payment_status === "paid"
      ? `Paid (${o.payment_method || "Online"})`
      : o.financialStatus || "COD Pending";
  const date = o.created_at
    ? new Date(o.created_at).toLocaleString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : o.date || "Recent";

  return {
    ...o,
    id: o.id,
    customer: {
      name: customerName,
      email: customerEmail,
      city: city,
      phone: o.customer_phone || "",
    },
    customer_name: customerName,
    customer_email: customerEmail,
    items,
    itemsCount,
    total,
    financialStatus,
    fulfillmentStatus,
    fulfillment_status: fulfillmentStatus,
    date,
    created_at: o.created_at,
  };
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(NOTICE_PRODUCTS);
  const [collections, setCollections] = useState(INITIAL_COLLECTIONS);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [storeSettings, setStoreSettings] = useState(DEFAULT_STORE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [isDbConnected, setIsDbConnected] = useState(true);

  const [analytics, setAnalytics] = useState({
    activeVisitors: 1,
    todayVisitors: 0,
    todaySessions: 0,
    todayPageViews: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    totalSales: 0,
    totalOrders: 0,
    topPages: [],
    devices: { mobilePct: 0, desktopPct: 0, tabletPct: 0, mobileCount: 0, desktopCount: 0, tabletCount: 0 },
    sources: [],
  });

  // Load from Supabase on mount
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, ordRes, custRes, discRes, mtrRes, trafficRes, settingsRes, inqRes, blogRes] = await Promise.all([
        getProducts({ limit: 1000 }),
        getCategories(),
        getOrders(),
        dbGetCustomers(),
        dbGetDiscounts(),
        getDbMetrics(),
        getRealAnalytics(),
        dbGetStoreSettings(),
        dbGetContactInquiries(),
        dbGetBlogPosts({ includeUnpublished: true }),
      ]);

      if (prodRes && prodRes.products && prodRes.products.length > 0) {
        setProducts(prodRes.products);
        setIsDbConnected(prodRes.fromDb);
      }

      if (catRes && catRes.length > 0) {
        const formattedCats = catRes.map((c) => ({
          id: c.id || c.handle,
          handle: c.handle,
          title: c.label || c.name || c.title,
          label: c.label || c.name || c.title,
          description: c.description || "",
          image: c.image_url || c.image || "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/Product_79-01.png?v=1784392136",
          itemCount: 0,
        }));
        setCollections(formattedCats);
      }

      if (ordRes) {
        setOrders(ordRes.map(normalizeOrder));
      }

      if (custRes) {
        setCustomers(custRes);
      }

      if (discRes) {
        setDiscounts(discRes);
      }

      if (settingsRes) {
        setStoreSettings(settingsRes);
      }

      if (inqRes) {
        setInquiries(inqRes);
      }

      if (blogRes) {
        setBlogPosts(blogRes);
      }

      setAnalytics({
        totalSales: mtrRes?.totalSales || 0,
        totalOrders: mtrRes?.totalOrders || (ordRes ? ordRes.length : 0),
        averageOrderValue: mtrRes?.averageOrderValue || 0,
        unfulfilledOrders: mtrRes?.unfulfilledOrders || 0,
        conversionRate: mtrRes?.conversionRate || 0,
        activeVisitors: trafficRes?.activeVisitors || 1,
        todayVisitors: trafficRes?.todayVisitors || 0,
        todayPageViews: trafficRes?.todayPageViews || 0,
        todaySessions: trafficRes?.todaySessions || 0,
        topPages: trafficRes?.topPages || [],
        devices: trafficRes?.devices || { mobilePct: 0, desktopPct: 0, tabletPct: 0, mobileCount: 0, desktopCount: 0, tabletCount: 0 },
        sources: trafficRes?.sources || [],
      });
    } catch (err) {
      console.error("Failed to load initial Supabase data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Live visitor tracking pulse from real Supabase events
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const traffic = await getRealAnalytics();
        if (traffic) {
          setAnalytics((prev) => ({
            ...prev,
            activeVisitors: traffic.activeVisitors,
            todayVisitors: traffic.todayVisitors,
            todayPageViews: traffic.todayPageViews,
            todaySessions: traffic.todaySessions,
            topPages: traffic.topPages,
            devices: traffic.devices,
            sources: traffic.sources,
          }));
        }
      } catch (e) {
        // Silently handle
      }
    }, 15000);
    return () => clearInterval(timer);
  }, []);


  // Add new product (syncs directly to Supabase)
  const addProduct = async (newProd) => {
    try {
      const created = await dbCreateProduct(newProd);
      setProducts((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error("Failed to insert product into DB, adding to local state:", err);
      const slug =
        newProd.handle ||
        newProd.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const fallbackProd = {
        id: Date.now(),
        handle: slug,
        title: newProd.title,
        description: newProd.description || "",
        product_type: newProd.product_type || "Homeware",
        price: parseFloat(newProd.price || 0),
        compare_at_price: newProd.compare_at_price ? parseFloat(newProd.compare_at_price) : null,
        available: newProd.available !== false,
        inventory_quantity: 25,
        images: Array.isArray(newProd.images) ? newProd.images : [],
        tags: newProd.tags || [],
      };
      setProducts((prev) => [fallbackProd, ...prev]);
      return fallbackProd;
    }
  };

  // Delete product (syncs to Supabase)
  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
    try {
      await dbDeleteProduct(id);
    } catch (err) {
      console.error("Failed to delete from DB:", err);
      await refreshData();
      throw err;
    }
  };

  // Update product (syncs to Supabase in real time)
  const updateProduct = async (id, updates) => {
    // 1. Optimistic update for instant UI feedback
    setProducts((prev) =>
      prev.map((p) => (String(p.id) === String(id) ? { ...p, ...updates } : p))
    );
    try {
      const saved = await dbUpdateProduct(id, updates);
      if (saved) {
        setProducts((prev) =>
          prev.map((p) => (String(p.id) === String(id) ? { ...p, ...saved } : p))
        );
        return saved;
      }
      return null;
    } catch (err) {
      console.error("Failed to update product in DB:", err);
      await refreshData();
      throw err;
    }
  };

  // Add new collection (syncs to Supabase)
  const addCollection = async (newCol) => {
    try {
      const created = await dbCreateCategory(newCol);
      const formatted = {
        id: created.id,
        handle: created.handle,
        title: created.label || created.title,
        label: created.label || created.title,
        description: created.description || "",
        image: created.image_url || created.image || "/products/drive/Lemon Ceramic Vase with Handles.webp",
        image_url: created.image_url || created.image || "/products/drive/Lemon Ceramic Vase with Handles.webp",
        display_order: created.display_order ?? 10,
        filter: created.filter || created.handle,
        itemCount: 0,
      };
      setCollections((prev) => [...prev, formatted]);
      return formatted;
    } catch (err) {
      console.error("Failed to insert collection in DB:", err);
      const slug =
        newCol.handle ||
        (newCol.label || newCol.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const fallbackCol = {
        id: "col-" + Date.now(),
        handle: slug,
        title: newCol.title || newCol.label || "New Category",
        label: newCol.title || newCol.label || "New Category",
        description: newCol.description || "",
        image: newCol.image || newCol.image_url || "/products/drive/Lemon Ceramic Vase with Handles.webp",
        image_url: newCol.image || newCol.image_url || "/products/drive/Lemon Ceramic Vase with Handles.webp",
        display_order: 10,
        filter: slug,
        itemCount: 0,
      };
      setCollections((prev) => [...prev, fallbackCol]);
      return fallbackCol;
    }
  };

  // Update existing collection / category (syncs to Supabase in real time)
  const updateCollection = async (id, updates) => {
    setCollections((prev) =>
      prev.map((c) =>
        String(c.id) === String(id) || c.handle === id
          ? {
              ...c,
              ...updates,
              title: updates.label || updates.title || c.title,
              label: updates.label || updates.title || c.label,
              image: updates.image_url || updates.image || c.image,
              image_url: updates.image_url || updates.image || c.image_url,
            }
          : c
      )
    );

    try {
      const saved = await dbUpdateCategory(id, updates);
      if (saved) {
        setCollections((prev) =>
          prev.map((c) =>
            String(c.id) === String(id) || c.handle === id
              ? {
                  ...c,
                  ...saved,
                  title: saved.label || saved.title,
                  label: saved.label || saved.title,
                  image: saved.image_url || saved.image,
                  image_url: saved.image_url || saved.image,
                }
              : c
          )
        );
        return saved;
      }
      return null;
    } catch (err) {
      console.error("Failed to update category in Supabase:", err);
      await refreshData();
      throw err;
    }
  };

  // Delete collection / category (syncs to Supabase in real time)
  const deleteCollection = async (id) => {
    setCollections((prev) =>
      prev.filter((c) => String(c.id) !== String(id) && c.handle !== id)
    );

    try {
      await dbDeleteCategory(id);
      return true;
    } catch (err) {
      console.error("Failed to delete category in Supabase:", err);
      await refreshData();
      throw err;
    }
  };

  // Update order status (syncs to Supabase)
  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              fulfillmentStatus: newStatus,
              fulfillment_status: newStatus,
            }
          : o
      )
    );
    try {
      await dbUpdateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error("Failed to update order status in DB:", err);
    }
  };

  // Discount actions (sync to Supabase)
  const addDiscount = async (discountData) => {
    try {
      const created = await dbCreateDiscount(discountData);
      await refreshData();
      return created;
    } catch (err) {
      console.error("Failed to add discount in Supabase:", err);
      throw err;
    }
  };

  const updateDiscount = async (id, updates) => {
    try {
      const updated = await dbUpdateDiscount(id, updates);
      await refreshData();
      return updated;
    } catch (err) {
      console.error("Failed to update discount in Supabase:", err);
      throw err;
    }
  };

  const deleteDiscount = async (id) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id && d.code !== id));
    try {
      await dbDeleteDiscount(id);
      await refreshData();
    } catch (err) {
      console.error("Failed to delete discount in Supabase:", err);
      throw err;
    }
  };

  const toggleDiscountStatus = async (id, currentStatus) => {
    try {
      const updated = await dbToggleDiscountStatus(id, currentStatus);
      await refreshData();
      return updated;
    } catch (err) {
      console.error("Failed to toggle discount status in Supabase:", err);
      throw err;
    }
  };

  // Delete inquiry (syncs to Supabase)
  const deleteInquiry = async (id) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    try {
      await dbDeleteContactInquiry(id);
    } catch (err) {
      console.error("Failed to delete inquiry in Supabase:", err);
      await refreshData();
      throw err;
    }
  };

  // Blog article actions (syncs to Supabase blog_posts)
  const addBlogPost = async (postData) => {
    try {
      const created = await dbCreateBlogPost(postData);
      await refreshData();
      return created;
    } catch (err) {
      console.error("Failed to create blog post in Supabase:", err);
      throw err;
    }
  };

  const updateBlogPost = async (id, updates) => {
    try {
      const updated = await dbUpdateBlogPost(id, updates);
      await refreshData();
      return updated;
    } catch (err) {
      console.error("Failed to update blog post in Supabase:", err);
      throw err;
    }
  };

  const deleteBlogPost = async (id) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
    try {
      await dbDeleteBlogPost(id);
      await refreshData();
      return true;
    } catch (err) {
      console.error("Failed to delete blog post in Supabase:", err);
      await refreshData();
      throw err;
    }
  };

  const toggleBlogPostPublish = async (id, currentPublished) => {
    try {
      const updated = await dbUpdateBlogPost(id, { published: !currentPublished });
      await refreshData();
      return updated;
    } catch (err) {
      console.error("Failed to toggle blog post publish status:", err);
      throw err;
    }
  };

  // Update store and brand settings (syncs to Supabase in real time)
  const updateStoreSettings = async (newSettings) => {
    // Optimistic local state update
    setStoreSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));

    try {
      const saved = await dbUpdateStoreSettings(newSettings);
      if (saved) {
        setStoreSettings(saved);
        return saved;
      }
      return null;
    } catch (err) {
      console.error("Failed to update store settings in Supabase:", err);
      await refreshData();
      throw err;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        collections,
        orders,
        customers,
        discounts,
        inquiries,
        blogPosts,
        storeSettings,
        analytics,
        loading,
        isDbConnected,
        refreshData,
        addProduct,
        deleteProduct,
        updateProduct,
        addCollection,
        updateCollection,
        deleteCollection,
        addCategory: addCollection,
        updateCategory: updateCollection,
        deleteCategory: deleteCollection,
        updateOrderStatus,
        addDiscount,
        updateDiscount,
        deleteDiscount,
        toggleDiscountStatus,
        deleteInquiry,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        toggleBlogPostPublish,
        updateStoreSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    return {
      products: NOTICE_PRODUCTS,
      collections: INITIAL_COLLECTIONS,
      orders: [],
      customers: [],
      discounts: [],
      inquiries: [],
      blogPosts: [],
      storeSettings: DEFAULT_STORE_SETTINGS,
      analytics: { activeVisitors: 24, todayVisitors: 1428, totalSales: 12418, totalOrders: 5 },
      loading: false,
      isDbConnected: true,
      refreshData: () => {},
      addProduct: () => {},
      deleteProduct: () => {},
      updateProduct: () => {},
      addCollection: () => {},
      updateCollection: () => {},
      deleteCollection: () => {},
      addCategory: () => {},
      updateCategory: () => {},
      deleteCategory: () => {},
      updateOrderStatus: () => {},
      addDiscount: () => {},
      updateDiscount: () => {},
      deleteDiscount: () => {},
      toggleDiscountStatus: () => {},
      deleteInquiry: () => {},
      addBlogPost: () => {},
      updateBlogPost: () => {},
      deleteBlogPost: () => {},
      toggleBlogPostPublish: () => {},
      updateStoreSettings: () => {},
    };
  }
  return context;
}
