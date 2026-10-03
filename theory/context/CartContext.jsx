"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

/**
 * Triggers a 60fps GPU-accelerated fly-to-cart animation.
 * Moves a cloned visual thumbnail from the originating element/click position
 * along a curved parabolic path to the Header Shopping Bag icon.
 */
function triggerFlyToCart(imageUrl, sourceEventOrRect) {
  if (typeof window === "undefined" || !imageUrl) return;

  try {
    const cartBtn =
      document.getElementById("header-cart-btn") ||
      document.querySelector('[data-cart-target="true"]') ||
      document.querySelector('[aria-label="View Shopping Bag"]');

    if (!cartBtn) return;

    // 1. Determine origin bounding rectangle
    let startRect = null;
    if (sourceEventOrRect) {
      if (typeof sourceEventOrRect.getBoundingClientRect === "function") {
        startRect = sourceEventOrRect.getBoundingClientRect();
      } else if (sourceEventOrRect.currentTarget || sourceEventOrRect.target) {
        const el = sourceEventOrRect.currentTarget || sourceEventOrRect.target;
        // Search for nearest product image or container
        const nearbyImg =
          el.closest(".group")?.querySelector("img") ||
          document.getElementById("main-product-image") ||
          el.querySelector("img");
        startRect = (nearbyImg || el).getBoundingClientRect();
      } else if (typeof sourceEventOrRect.left === "number" && typeof sourceEventOrRect.top === "number") {
        startRect = sourceEventOrRect;
      }
    }

    if (!startRect || startRect.width === 0 || startRect.height === 0) {
      // Fallback: check main product image or viewport center
      const mainImg = document.getElementById("main-product-image");
      if (mainImg) {
        startRect = mainImg.getBoundingClientRect();
      } else {
        startRect = {
          left: window.innerWidth / 2 - 35,
          top: window.innerHeight / 2 - 35,
          width: 70,
          height: 70,
        };
      }
    }

    const cartRect = cartBtn.getBoundingClientRect();

    // 2. Create the flying flyer element
    const flyer = document.createElement("div");
    flyer.className = "tct-flying-cart-item";
    Object.assign(flyer.style, {
      position: "fixed",
      left: "0px",
      top: "0px",
      width: "64px",
      height: "64px",
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow: "0 14px 35px rgba(0, 21, 64, 0.35), 0 4px 12px rgba(0,0,0,0.18)",
      border: "2px solid #001540",
      backgroundColor: "#fffdf8",
      zIndex: "999999",
      pointerEvents: "none",
      willChange: "transform, opacity",
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      transformOrigin: "center center",
    });

    document.body.appendChild(flyer);

    // Coordinate math: center-to-center
    const startX = startRect.left + startRect.width / 2 - 32;
    const startY = startRect.top + startRect.height / 2 - 32;
    const targetX = cartRect.left + cartRect.width / 2 - 32;
    const targetY = cartRect.top + cartRect.height / 2 - 32;

    // Organic parabolic arc (peaks gracefully higher in the vertical plane)
    const midX = (startX + targetX) / 2;
    const midY = Math.min(startY, targetY) - 110;

    const keyframes = [
      {
        transform: `translate3d(${startX}px, ${startY}px, 0) scale(1) rotate(0deg)`,
        opacity: 1,
        offset: 0,
      },
      {
        transform: `translate3d(${startX + (midX - startX) * 0.3}px, ${startY - 50}px, 0) scale(1.15) rotate(-5deg)`,
        opacity: 1,
        offset: 0.22,
      },
      {
        transform: `translate3d(${midX}px, ${midY}px, 0) scale(1.08) rotate(-10deg)`,
        opacity: 0.95,
        offset: 0.52,
      },
      {
        transform: `translate3d(${targetX - (targetX - midX) * 0.25}px, ${midY + (targetY - midY) * 0.55}px, 0) scale(0.65) rotate(8deg)`,
        opacity: 0.8,
        offset: 0.8,
      },
      {
        transform: `translate3d(${targetX}px, ${targetY}px, 0) scale(0.22) rotate(18deg)`,
        opacity: 0.45,
        offset: 0.96,
      },
      {
        transform: `translate3d(${targetX}px, ${targetY}px, 0) scale(0.06) rotate(25deg)`,
        opacity: 0,
        offset: 1,
      },
    ];

    const animation = flyer.animate(keyframes, {
      duration: 1250, // Slower, graceful, and clearly visible trajectory
      easing: "cubic-bezier(0.22, 0.9, 0.32, 1)",
      fill: "forwards",
    });

    const cleanup = () => {
      if (flyer && flyer.parentNode) {
        flyer.parentNode.removeChild(flyer);
      }
    };

    animation.onfinish = () => {
      cleanup();

      // Trigger cart button bounce animation on landing
      try {
        cartBtn.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.4)" },
            { transform: "scale(0.9)" },
            { transform: "scale(1.12)" },
            { transform: "scale(1)" },
          ],
          {
            duration: 450,
            easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          }
        );
      } catch (e) {
        // ignore
      }
    };

    animation.oncancel = cleanup;
    // Guaranteed fallback removal
    setTimeout(cleanup, 2200);
  } catch (err) {
    console.error("Fly to cart animation error:", err);
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load cart from localStorage on mount (validates stored items)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("notice_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem("notice_cart", JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const addToCart = (product, qty = 1, sourceEventOrRect = null) => {
    // 1. Trigger fly animation
    const imgUrl = (product.images && product.images[0]) || "";
    if (imgUrl) {
      triggerFlyToCart(imgUrl, sourceEventOrRect);
    }

    // 2. Add or increment in cart
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          handle: product.handle,
          price: product.price,
          images: product.images || [],
          quantity: qty,
          description: product.description || "",
        },
      ];
    });

    // 3. Open cart drawer right after flying animation lands
    setTimeout(() => {
      setIsCartOpen(true);
    }, 1300);
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeItem(id);
    } else {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        totalCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
