"use client";

import { useState, useEffect, useRef } from "react";
import { useStore } from "@/context/StoreContext";
import { NOTICE_PRODUCTS, LOOKBOOK_SPOTS, HERO_SLIDES, CATEGORIES_LIST } from "@/lib/products";
import { DEFAULT_FOOTER_SECTIONS, DEFAULT_FAQS, DEFAULT_OUR_STORY } from "@/lib/supabase";
import {
  Settings,
  Save,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Megaphone,
  FileText,
  Compass,
  Plus,
  Trash2,
  AlertCircle,
  HelpCircle,
  Crop,
  Image as ImageIcon,
  Upload,
  Sliders,
  Layout,
  Layers,
  MapPin,
  Crosshair,
  Move,
  Tag,
  ShoppingBag,
  ExternalLink,
  Link as LinkIcon,
  BookOpen,
} from "lucide-react";
import ImageCropModal from "@/components/admin/ImageCropModal";

export default function AdminSettingsPage() {
  const { storeSettings, updateStoreSettings, products } = useStore();
  const availableProducts = products && products.length > 0 ? products : NOTICE_PRODUCTS;

  const [formData, setFormData] = useState({
    brand_name: "THE COZY THEORY",
    brand_tagline: "STAY COZY, STAY YOU",
    header_story_label: "Our Story",
    header_tagline: "",
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
    // Homepage Manifesto Section
    manifesto_tagline: "Living Manifesto // Stay Cozy, Stay You",
    manifesto_title: "WARMTH.\nTEXTURE.\nOBJECTS.",
    manifesto_text:
      "Some objects blend into the background. Ours are made to be touched, lived with, and passed down. The Cozy Theory crafts everyday ceramics, tactile vessels, and washed home linen for people who refuse cold, generic spaces.",
    manifesto_button_text: "Explore All Objects →",
    manifesto_button_url: "/collections/all-products",
    manifesto_image:
      "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/Product9-01.png?v=1784242846",
    manifesto_product_title: "TT-251 Ceramic Chicken Condiment Jar with Spoon",
    manifesto_product_url: "/products/tt-251-ceramic-chicken-condiment-jar-with-spoon",
    // Homepage Shop The Look Section
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
  });

  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("brand");

  // Interactive Hotspot Management State
  const [selectedSpotIndex, setSelectedSpotIndex] = useState(0);
  const bannerPreviewRef = useRef(null);

  // Image Crop & Adjust Modal State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropTargetField, setCropTargetField] = useState("");
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [cropConfig, setCropConfig] = useState({
    w: 1000,
    h: 1000,
    aspect: "1:1",
    title: "Crop Image",
  });

  const manifestoFileRef = useRef(null);
  const lookbookFileRef = useRef(null);
  const storyChap1FileRef = useRef(null);
  const storyChap2FileRef = useRef(null);

  // Sync with store settings when loaded
  useEffect(() => {
    if (storeSettings) {
      setFormData({
        brand_name: storeSettings.brand_name || "THE COZY THEORY",
        brand_tagline: storeSettings.brand_tagline || "STAY COZY, STAY YOU",
        header_story_label: storeSettings.header_story_label || "Our Story",
        header_tagline: storeSettings.header_tagline || "",
        show_header_tagline: Boolean(storeSettings.show_header_tagline),
        journal_visible: storeSettings.journal_visible !== false,
        about_title: storeSettings.about_title || "THE COZY THEORY",
        about_tagline: storeSettings.about_tagline || "STAY COZY, STAY YOU",
        about_description:
          storeSettings.about_description ||
          "The Cozy Theory curates everyday objects, dining accents, and soft furnishings that transform your living space into a sanctuary of warmth, texture, and individual expression. We believe in everyday rituals elevated by honest materials.",
        footer_newsletter_title:
          storeSettings.footer_newsletter_title || "Join The Cozy Theory Collector List",
        footer_newsletter_text:
          storeSettings.footer_newsletter_text ||
          "Be first to gain access to limited seasonal drops, archival ceramics, and private offers.",
        footer_tagline:
          storeSettings.footer_tagline ||
          "Stay cozy, stay you. The Cozy Theory crafts everyday homeware, everyday ceramics, and tactile objects for warm living spaces.",
        footer_instagram_url:
          storeSettings.footer_instagram_url || "https://www.instagram.com/the.cozy.theory?stkn=MWxpY3UyOTZoMXpiYg==",
        footer_pinterest_url:
          storeSettings.footer_pinterest_url || "https://pin.it/229oxMjQD",
        footer_sections:
          Array.isArray(storeSettings.footer_sections) && storeSettings.footer_sections.length > 0
            ? storeSettings.footer_sections
            : DEFAULT_FOOTER_SECTIONS,
        announcements:
          Array.isArray(storeSettings.announcements) && storeSettings.announcements.length > 0
            ? storeSettings.announcements
            : [
                "FREE SHIPPING ABOVE 9999/-",
                "50% REFUND IF DAMAGED",
                "THE COZY THEORY // ARTISANAL HOMEWARE",
                "100% HANDCRAFTED STONEWARE",
              ],
        manifesto_tagline:
          storeSettings.manifesto_tagline || "OUR STORY // STAY COZY, STAY YOU",
        manifesto_title: storeSettings.manifesto_title || "OUR STORY.",
        manifesto_text:
          storeSettings.manifesto_text ||
          "There was always something comforting about the little things. A favourite cup waiting on the kitchen shelf. A vase catching the afternoon light. A plate brought out when friends stayed a little longer than planned. The small objects that quietly turn a house into a place that feels like yours.",
        manifesto_button_text: storeSettings.manifesto_button_text || "Read More →",
        manifesto_button_url: storeSettings.manifesto_button_url || "/pages/our-story",
        manifesto_image:
          storeSettings.manifesto_image ||
          "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/Product9-01.png?v=1784242846",
        manifesto_product_title:
          storeSettings.manifesto_product_title ||
          "TT-251 Ceramic Chicken Condiment Jar with Spoon",
        manifesto_product_url:
          storeSettings.manifesto_product_url ||
          "/products/tt-251-ceramic-chicken-condiment-jar-with-spoon",
        lookbook_title: storeSettings.lookbook_title || "Shop The Look",
        lookbook_subtitle: storeSettings.lookbook_subtitle || "Curated Atmosphere",
        lookbook_text:
          storeSettings.lookbook_text ||
          "Tap the illuminated hotspots on the art arrangement to inspect and add individual conversation objects directly to your bag.",
        lookbook_image:
          storeSettings.lookbook_image ||
          "https://cdn.shopify.com/s/files/1/0826/5053/0110/files/Two_Odd_x_Notice_Aditya_Sinha-1.jpg?v=1788185403&width=1600&format=webp",
        lookbook_spots:
          Array.isArray(storeSettings.lookbook_spots) && storeSettings.lookbook_spots.length > 0
            ? storeSettings.lookbook_spots
            : LOOKBOOK_SPOTS,
        hero_slides:
          Array.isArray(storeSettings.hero_slides) && storeSettings.hero_slides.length > 0
            ? storeSettings.hero_slides
            : HERO_SLIDES,
        faqs:
          Array.isArray(storeSettings.faqs) && storeSettings.faqs.length > 0
            ? storeSettings.faqs
            : DEFAULT_FAQS,
        our_story: storeSettings.our_story || DEFAULT_OUR_STORY,
      });
    }
  }, [storeSettings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddAnnouncement = () => {
    const trimmed = newAnnouncement.trim().toUpperCase();
    if (!trimmed) return;
    setFormData((prev) => ({
      ...prev,
      announcements: [...prev.announcements, trimmed],
    }));
    setNewAnnouncement("");
  };

  const handleRemoveAnnouncement = (index) => {
    setFormData((prev) => ({
      ...prev,
      announcements: prev.announcements.filter((_, i) => i !== index),
    }));
  };

  // Image upload & crop triggers
  const handleManifestoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCropImageSrc(ev.target?.result);
      setCropTargetField("manifesto_image");
      setCropConfig({
        w: 800,
        h: 1000,
        aspect: "4:5",
        title: "Crop & Adjust Spotlight Image (Living Manifesto)",
      });
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleLookbookFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCropImageSrc(ev.target?.result);
      setCropTargetField("lookbook_image");
      setCropConfig({
        w: 1600,
        h: 750,
        aspect: "21:9",
        title: "Crop & Adjust Shop The Look Banner",
      });
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropApply = (editedDataUrl) => {
    if (!cropTargetField) return;
    if (cropTargetField.startsWith("hero_slide_")) {
      const parts = cropTargetField.split("_");
      const idx = parseInt(parts[2], 10);
      const subfield = parts[3] === "mobile" ? "mobileImage" : "desktopImage";
      setFormData((prev) => {
        const updated = [...(prev.hero_slides || [])];
        if (updated[idx]) {
          updated[idx] = { ...updated[idx], [subfield]: editedDataUrl };
        }
        return { ...prev, hero_slides: updated };
      });
    } else if (cropTargetField.startsWith("our_story_")) {
      const fieldKey = cropTargetField.replace("our_story_", "");
      setFormData((prev) => ({
        ...prev,
        our_story: {
          ...(prev.our_story || DEFAULT_OUR_STORY),
          [fieldKey]: editedDataUrl,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [cropTargetField]: editedDataUrl,
      }));
    }
  };

  const handleStoryImageUpload = (chapterField, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setCropImageSrc(uploadEvent.target.result);
      setCropTargetField(`our_story_${chapterField}`);
      setCropConfig({
        w: 800,
        h: 1000,
        aspect: "4:5",
        title: `Crop & Adjust ${chapterField === "chapter1_image" ? "Chapter 1" : "Chapter 2"} Story Photo (4:5 Portrait)`,
      });
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleStoryChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      our_story: {
        ...(prev.our_story || DEFAULT_OUR_STORY),
        [field]: value,
      },
    }));
  };

  // Hero Slides Operations
  const handleAddSlide = () => {
    const newSlide = {
      id: "slide_" + Date.now(),
      title: "NEW CURATED COLLECTION",
      subtitle: "THE COZY THEORY // NEW ARRIVALS",
      description: "Handcrafted stoneware, tactile vessels, and deliberate interior statements designed for warm, mindful spaces.",
      desktopImage: "/products/drive/Lemon Ceramic Vase  Planter.webp",
      mobileImage: "/products/drive/Lemon Ceramic Vase  Planter.webp",
      ctaText: "Explore Collection",
      ctaLink: "/collections/all-products",
      secondaryCta: "View All Objects",
      secondaryCtaLink: "/collections/all-products",
    };
    setFormData((prev) => ({
      ...prev,
      hero_slides: [...(prev.hero_slides || []), newSlide],
    }));
  };

  const handleAddPresetSlide = (type) => {
    let preset;
    if (type === "christmas") {
      preset = {
        id: "slide_" + Date.now(),
        title: "MERRY & BRIGHT CHRISTMAS",
        subtitle: "THE COZY THEORY // FESTIVE 2026",
        description: "Heirloom holiday figurines, warm glowing village scenes, and handcrafted ceramic seasonal centerpieces.",
        desktopImage: "/products/drive/Pomegranate Ceramic Vase  Planter.webp",
        mobileImage: "/products/drive/Pomegranate Ceramic Vase  Planter.webp",
        ctaText: "Shop Christmas",
        ctaLink: "/collections/merry-bright",
        secondaryCta: "View All Objects",
        secondaryCtaLink: "/collections/all-products",
      };
    } else if (type === "decorative") {
      preset = {
        id: "slide_" + Date.now(),
        title: "CONVERSATIONAL SCULPTURES",
        subtitle: "THE COZY THEORY // DECORATIVE OBJECTS",
        description: "Delicate relief sculptures, architectural figurines, and organic tabletop conversation pieces.",
        desktopImage: "/products/drive/Pomegranate Ceramic Vase.webp",
        mobileImage: "/products/drive/Pomegranate Ceramic Vase.webp",
        ctaText: "Shop Decorative Objects",
        ctaLink: "/collections/decorative-objects",
        secondaryCta: "View All Objects",
        secondaryCtaLink: "/collections/all-products",
      };
    } else if (type === "ceramics") {
      preset = {
        id: "slide_" + Date.now(),
        title: "EVERYDAY ARTISANAL CERAMICS",
        subtitle: "THE COZY THEORY // CRAFT ARCHIVE",
        description: "Tactile stoneware bowls, daily coffee mugs, and hand-glazed breakfast sets made to be touched and lived with.",
        desktopImage: "/products/drive/Flower-Shaped Ceramic Decorative Plate.webp",
        mobileImage: "/products/drive/Flower-Shaped Ceramic Decorative Plate.webp",
        ctaText: "Explore Ceramics",
        ctaLink: "/collections/everyday-ceramics",
        secondaryCta: "View All Objects",
        secondaryCtaLink: "/collections/all-products",
      };
    }
    if (preset) {
      setFormData((prev) => ({
        ...prev,
        hero_slides: [...(prev.hero_slides || []), preset],
      }));
    }
  };

  const handleRemoveSlide = (index) => {
    if ((formData.hero_slides || []).length <= 1) {
      alert("You must keep at least 1 hero banner slide for the homepage.");
      return;
    }
    if (confirm("Are you sure you want to remove this hero banner slide?")) {
      setFormData((prev) => ({
        ...prev,
        hero_slides: prev.hero_slides.filter((_, i) => i !== index),
      }));
    }
  };

  const handleMoveSlide = (index, dir) => {
    const slides = [...(formData.hero_slides || [])];
    const targetIndex = index + dir;
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    const [moved] = slides.splice(index, 1);
    slides.splice(targetIndex, 0, moved);
    setFormData((prev) => ({ ...prev, hero_slides: slides }));
  };

  const handleSlideChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.hero_slides || [])];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, hero_slides: updated };
    });
  };

  const handleSlideUpload = (index, file, isMobile = false) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      setCropImageSrc(dataUrl);
      setCropTargetField(`hero_slide_${index}_${isMobile ? "mobile" : "desktop"}`);
      setCropConfig({
        w: 1600,
        h: 820,
        aspect: isMobile ? "9:16" : "21:9",
        title: `Crop & Adjust Banner #${index + 1} (${isMobile ? "Mobile" : "Desktop"})`,
      });
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // FAQ Operations
  const handleAddFaq = () => {
    const newFaq = {
      id: "faq_" + Date.now(),
      q: "New Frequently Asked Question?",
      a: "Write the detailed answer here.",
      linkText: "",
      linkUrl: "",
      hidden: false,
    };
    setFormData((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), newFaq],
    }));
  };

  const handleToggleFaqHidden = (index) => {
    setFormData((prev) => {
      const updated = [...(prev.faqs || [])];
      if (updated[index]) {
        updated[index] = { ...updated[index], hidden: !updated[index].hidden };
      }
      return { ...prev, faqs: updated };
    });
  };

  const handleRemoveFaq = (index) => {
    if (confirm("Are you sure you want to delete this FAQ question?")) {
      setFormData((prev) => ({
        ...prev,
        faqs: prev.faqs.filter((_, i) => i !== index),
      }));
    }
  };

  const handleMoveFaq = (index, dir) => {
    const faqs = [...(formData.faqs || [])];
    const targetIndex = index + dir;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;
    const [moved] = faqs.splice(index, 1);
    faqs.splice(targetIndex, 0, moved);
    setFormData((prev) => ({ ...prev, faqs: faqs }));
  };

  const handleFaqChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.faqs || [])];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, faqs: updated };
    });
  };

  const handleResetFaqs = () => {
    if (confirm("Reset all FAQ questions and answers to default verified store guidelines?")) {
      setFormData((prev) => ({ ...prev, faqs: DEFAULT_FAQS }));
    }
  };

  // Lookbook Hotspot Operations
  const handleAddSpot = () => {
    const defaultProduct = availableProducts[0] || {};
    const newSpot = {
      id: `spot_${Date.now()}`,
      productId: defaultProduct.id || 10200000000001,
      productTitle: defaultProduct.title || "Artisanal Object",
      price: String(defaultProduct.price || "0.00"),
      top: "50%",
      left: "50%",
      image:
        (Array.isArray(defaultProduct.images) && defaultProduct.images[0]) ||
        defaultProduct.image ||
        "",
      handle: defaultProduct.handle || "",
    };

    setFormData((prev) => {
      const currentSpots = Array.isArray(prev.lookbook_spots) ? prev.lookbook_spots : [];
      const updated = [...currentSpots, newSpot];
      setSelectedSpotIndex(updated.length - 1);
      return {
        ...prev,
        lookbook_spots: updated,
      };
    });
  };

  const handleRemoveSpot = (indexToRemove) => {
    setFormData((prev) => {
      const currentSpots = Array.isArray(prev.lookbook_spots) ? prev.lookbook_spots : [];
      const updated = currentSpots.filter((_, i) => i !== indexToRemove);
      return {
        ...prev,
        lookbook_spots: updated,
      };
    });
    setSelectedSpotIndex((prev) => Math.max(0, prev - 1));
  };

  const handleSpotProductChange = (index, newProductId) => {
    const matched = availableProducts.find((p) => String(p.id) === String(newProductId));
    if (!matched) return;

    setFormData((prev) => {
      const currentSpots = [...(Array.isArray(prev.lookbook_spots) ? prev.lookbook_spots : [])];
      if (!currentSpots[index]) return prev;

      currentSpots[index] = {
        ...currentSpots[index],
        productId: matched.id,
        productTitle: matched.title,
        price: String(matched.price || "0.00"),
        image:
          (Array.isArray(matched.images) && matched.images[0]) ||
          matched.image ||
          "",
        handle: matched.handle || "",
      };
      return {
        ...prev,
        lookbook_spots: currentSpots,
      };
    });
  };

  const handleSpotPositionChange = (index, axis, value) => {
    const num = Math.min(96, Math.max(4, parseInt(value, 10) || 0));
    setFormData((prev) => {
      const currentSpots = [...(Array.isArray(prev.lookbook_spots) ? prev.lookbook_spots : [])];
      if (!currentSpots[index]) return prev;

      currentSpots[index] = {
        ...currentSpots[index],
        [axis]: `${num}%`,
      };
      return {
        ...prev,
        lookbook_spots: currentSpots,
      };
    });
  };

  const handleBannerClick = (e) => {
    if (!bannerPreviewRef.current) return;
    const currentSpots = formData.lookbook_spots || [];
    if (currentSpots.length === 0) return;
    const activeIdx = Math.min(selectedSpotIndex, currentSpots.length - 1);
    if (activeIdx < 0) return;

    const rect = bannerPreviewRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const leftPercent = Math.round(Math.min(95, Math.max(5, (clickX / rect.width) * 100)));
    const topPercent = Math.round(Math.min(92, Math.max(8, (clickY / rect.height) * 100)));

    setFormData((prev) => {
      const spots = [...(Array.isArray(prev.lookbook_spots) ? prev.lookbook_spots : [])];
      if (!spots[activeIdx]) return prev;
      spots[activeIdx] = {
        ...spots[activeIdx],
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
      };
      return { ...prev, lookbook_spots: spots };
    });
  };

  // Footer Navigation Sections Handlers
  const handleFooterSectionTitleChange = (sectionIdx, newTitle) => {
    setFormData((prev) => {
      const currentSections = [...(Array.isArray(prev.footer_sections) ? prev.footer_sections : DEFAULT_FOOTER_SECTIONS)];
      if (!currentSections[sectionIdx]) return prev;
      currentSections[sectionIdx] = {
        ...currentSections[sectionIdx],
        title: newTitle,
      };
      return { ...prev, footer_sections: currentSections };
    });
  };

  const handleFooterLinkChange = (sectionIdx, linkIdx, field, value) => {
    setFormData((prev) => {
      const currentSections = [...(Array.isArray(prev.footer_sections) ? prev.footer_sections : DEFAULT_FOOTER_SECTIONS)];
      if (!currentSections[sectionIdx]) return prev;
      const links = [...(currentSections[sectionIdx].links || [])];
      if (!links[linkIdx]) return prev;
      links[linkIdx] = {
        ...links[linkIdx],
        [field]: value,
      };
      currentSections[sectionIdx] = {
        ...currentSections[sectionIdx],
        links,
      };
      return { ...prev, footer_sections: currentSections };
    });
  };

  const handleAddFooterLink = (sectionIdx) => {
    setFormData((prev) => {
      const currentSections = [...(Array.isArray(prev.footer_sections) ? prev.footer_sections : DEFAULT_FOOTER_SECTIONS)];
      if (!currentSections[sectionIdx]) return prev;
      const links = [...(currentSections[sectionIdx].links || [])];
      links.push({
        id: `link_${Date.now()}`,
        label: "New Link",
        url: "/collections/all-products",
      });
      currentSections[sectionIdx] = {
        ...currentSections[sectionIdx],
        links,
      };
      return { ...prev, footer_sections: currentSections };
    });
  };

  const handleRemoveFooterLink = (sectionIdx, linkIdx) => {
    setFormData((prev) => {
      const currentSections = [...(Array.isArray(prev.footer_sections) ? prev.footer_sections : DEFAULT_FOOTER_SECTIONS)];
      if (!currentSections[sectionIdx]) return prev;
      const links = currentSections[sectionIdx].links?.filter((_, i) => i !== linkIdx) || [];
      currentSections[sectionIdx] = {
        ...currentSections[sectionIdx],
        links,
      };
      return { ...prev, footer_sections: currentSections };
    });
  };

  const handleResetFooterSections = () => {
    setFormData((prev) => ({
      ...prev,
      footer_sections: DEFAULT_FOOTER_SECTIONS,
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSaveSuccess(false);

    try {
      await updateStoreSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error("Save settings error:", err);
      setErrorMsg("Failed to save to Supabase: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e3dc] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#001540] font-bold">
              Database Configuration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#121212] mt-1">
            Brand &amp; Store Settings
          </h1>
          <p className="text-xs font-mono text-neutral-500 mt-1">
            Manage your brand identity, homepage banners, spotlight images, taglines, and live announcements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-[#001540] hover:bg-[#002266] text-white rounded text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving to Supabase...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved &amp; Live!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded text-xs font-mono text-emerald-800 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>
              ✓ Brand and store settings saved successfully to Supabase. Frontend updated in real time!
            </span>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded text-xs font-mono text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#e5e3dc] overflow-x-auto pb-1 text-xs font-mono uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("brand")}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === "brand"
              ? "border-[#001540] text-[#001540] font-bold"
              : "border-transparent text-neutral-500 hover:text-black"
          }`}
        >
          Brand &amp; About Bio
        </button>
        <button
          onClick={() => setActiveTab("homepage")}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === "homepage"
              ? "border-[#001540] text-[#001540] font-bold"
              : "border-transparent text-neutral-500 hover:text-black"
          }`}
        >
          Homepage Media &amp; Banners
        </button>
        <button
          onClick={() => setActiveTab("announcements")}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === "announcements"
              ? "border-[#001540] text-[#001540] font-bold"
              : "border-transparent text-neutral-500 hover:text-black"
          }`}
        >
          Announcement Bar ({formData.announcements.length})
        </button>
        <button
          onClick={() => setActiveTab("header")}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === "header"
              ? "border-[#001540] text-[#001540] font-bold"
              : "border-transparent text-neutral-500 hover:text-black"
          }`}
        >
          Header &amp; Tagline
        </button>
        <button
          onClick={() => setActiveTab("footer")}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === "footer"
              ? "border-[#001540] text-[#001540] font-bold"
              : "border-transparent text-neutral-500 hover:text-black"
          }`}
        >
          Footer, Menus &amp; Socials
        </button>
        <button
          onClick={() => setActiveTab("faqs")}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === "faqs"
              ? "border-[#001540] text-[#001540] font-bold"
              : "border-transparent text-neutral-500 hover:text-black"
          }`}
        >
          FAQ &amp; Help Center ({(formData.faqs || []).length})
        </button>
        <button
          onClick={() => setActiveTab("our_story")}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === "our_story"
              ? "border-[#001540] text-[#001540] font-bold"
              : "border-transparent text-neutral-500 hover:text-black"
          }`}
        >
          Our Story Pictures &amp; Text
        </button>
      </div>

      {/* Tab 1: Brand & About Bio (User's Exact Screenshot Content) */}
      {activeTab === "brand" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Edit Form */}
          <div className="lg:col-span-7 bg-white border border-[#e5e3dc] p-6 space-y-6 rounded shadow-xs">
            <div className="border-b border-[#e5e3dc] pb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#121212]">
                Brand Identity &amp; Bio
              </h2>
              <p className="text-xs font-mono text-neutral-500 mt-0.5">
                Edit the text that appears on the website footer and brand descriptions.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  name="brand_name"
                  value={formData.brand_name}
                  onChange={handleChange}
                  className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono font-bold focus:outline-none focus:border-black rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  name="brand_tagline"
                  value={formData.brand_tagline}
                  onChange={handleChange}
                  className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold">
                    About / Bio Description
                  </label>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {formData.about_description.length} characters
                  </span>
                </div>
                <textarea
                  name="about_description"
                  rows={5}
                  value={formData.about_description}
                  onChange={handleChange}
                  placeholder="Enter your brand narrative..."
                  className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-3 text-xs font-mono focus:outline-none focus:border-black rounded leading-relaxed"
                />
                <p className="text-[11px] font-mono text-neutral-500 mt-1">
                  This narrative appears directly under THE COZY THEORY in the website footer.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#e5e3dc] flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-[#121212] hover:bg-neutral-800 text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-colors"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Live Preview Panel (Looks exactly like the footer screenshot!) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-neutral-500 font-semibold">
              <Eye className="w-4 h-4 text-[#001540]" />
              <span>Live Website Preview</span>
            </div>

            {/* Simulated Dark Footer Container */}
            <div className="bg-[#121212] text-[#fffdf8] p-6 sm:p-8 rounded-lg border border-neutral-800 shadow-xl space-y-4">
              <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-neutral-500 border-b border-neutral-800 pb-2">
                FOOTER DISPLAY PREVIEW
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-[-0.04em] text-2xl uppercase font-sans text-white">
                    {formData.brand_name || "THE COZY THEORY"}
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#001540] inline-block -mt-2"></span>
                </div>

                <span className="text-[10px] font-mono tracking-[0.25em] text-blue-400 uppercase font-bold block">
                  {formData.brand_tagline || "STAY COZY, STAY YOU"}
                </span>

                <p className="text-xs text-neutral-400 leading-relaxed font-normal pt-1">
                  {formData.about_description ||
                    "Enter your brand story to preview how it will appear to visitors."}
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#faf8f2] border border-[#e5e3dc] rounded text-[11px] font-mono text-neutral-600 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-[#001540] flex-shrink-0 mt-0.5" />
              <span>
                Any edit saved here updates the Supabase database and instantly syncs across all pages of the storefront without redeployment.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Announcement Bar */}
      {activeTab === "announcements" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#e5e3dc] p-6 space-y-6 rounded shadow-xs">
            <div className="border-b border-[#e5e3dc] pb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#121212]">
                Announcement Bar Marquee Messages
              </h2>
              <p className="text-xs font-mono text-neutral-500 mt-0.5">
                These phrases continuously scroll on the top vibrant blue bar of your website.
              </p>
            </div>

            {/* Add New Announcement */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAnnouncement();
                  }
                }}
                placeholder="e.g. FESTIVE DROPS LIVE // FREE SHIPPING ON 9999+"
                className="flex-1 bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded uppercase"
              />
              <button
                type="button"
                onClick={handleAddAnnouncement}
                className="px-4 py-2.5 bg-[#121212] hover:bg-neutral-800 text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Message</span>
              </button>
            </div>

            {/* Announcements List */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-mono uppercase text-neutral-400 font-semibold">
                Active Marquee Phrases ({formData.announcements.length})
              </div>

              {formData.announcements.length === 0 ? (
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded text-center text-xs font-mono text-neutral-500">
                  No announcements set. Default phrases will be used.
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 border border-[#e5e3dc] rounded bg-[#faf8f2]">
                  {formData.announcements.map((msg, idx) => (
                    <div
                      key={idx}
                      className="p-3 flex items-center justify-between gap-4 text-xs font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-neutral-900 uppercase">{msg}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAnnouncement(idx)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors"
                        title="Delete announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Blue Bar Preview */}
            <div className="pt-4 border-t border-[#e5e3dc] space-y-2">
              <div className="text-xs font-mono uppercase text-neutral-500 font-semibold">
                Live Announcement Bar Preview
              </div>
              <div className="w-full bg-[#001540] text-white text-xs font-mono uppercase tracking-[0.15em] py-3 px-4 overflow-hidden rounded shadow-sm">
                <div className="flex items-center gap-4 whitespace-nowrap overflow-x-auto">
                  {formData.announcements.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 flex-shrink-0">
                      <span>{item}</span>
                      <span className="text-blue-200">•</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#e5e3dc] flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-[#001540] hover:bg-[#002266] text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-colors"
              >
                {saving ? "Saving..." : "Save Announcements"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Header & Top Tagline */}
      {activeTab === "header" && (
        <div className="bg-white border border-[#e5e3dc] p-6 space-y-6 rounded shadow-xs max-w-3xl">
          <div className="border-b border-[#e5e3dc] pb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#121212]">
              Header Navigation &amp; Top Subtitle
            </h2>
            <p className="text-xs font-mono text-neutral-500 mt-0.5">
              Control the top left story link and brand indicators in the main header.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                Top Left Navigation Link Label
              </label>
              <input
                type="text"
                name="header_story_label"
                value={formData.header_story_label}
                onChange={handleChange}
                placeholder="Our Story"
                className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded"
              />
              <p className="text-[11px] font-mono text-neutral-500 mt-1">
                Links to /pages/our-story on desktop.
              </p>
            </div>

            <div className="p-4 bg-[#faf8f2] border border-[#e5e3dc] rounded space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-neutral-800 font-bold block">
                    Show Secondary Tagline Beside &ldquo;Our Story&rdquo;
                  </span>
                  <p className="text-[11px] font-mono text-neutral-500">
                    Previously displayed &ldquo;Artisanal Studio&rdquo;. Keep unchecked for a clean, minimalist header.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="show_header_tagline"
                    checked={formData.show_header_tagline}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#001540]"></div>
                </label>
              </div>

              {formData.show_header_tagline && (
                <div className="pt-2 border-t border-[#e5e3dc]">
                  <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                    Custom Tagline Text
                  </label>
                  <input
                    type="text"
                    name="header_tagline"
                    value={formData.header_tagline}
                    onChange={handleChange}
                    placeholder="e.g. Curated Homeware"
                    className="w-full bg-white border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#e5e3dc] flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-[#121212] hover:bg-neutral-800 text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-colors"
            >
              {saving ? "Saving..." : "Save Header Settings"}
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Footer, Menus & Socials */}
      {activeTab === "footer" && (
        <div className="space-y-8">
          {/* Section 1: Social Media Profiles (Instagram & Pinterest) */}
          <div className="bg-white border border-[#e5e3dc] p-6 space-y-6 rounded shadow-xs">
            <div className="border-b border-[#e5e3dc] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#121212] flex items-center gap-2">
                  <span>Social Media Profiles</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#f0f4fa] text-[#001540] rounded font-semibold border border-[#d8e2f0]">
                    Footer Bottom Bar
                  </span>
                </h2>
                <p className="text-xs font-mono text-neutral-500 mt-0.5">
                  Set the live links for The Cozy Theory Instagram and Pinterest profiles shown in the footer bottom bar.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Instagram URL Card */}
              <div className="p-4 bg-[#faf8f5] border border-[#e5e3dc] rounded space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase text-neutral-800 font-bold flex items-center gap-1.5">
                    <svg className="w-4 h-4 fill-pink-600" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Instagram Profile URL</span>
                  </label>
                  {formData.footer_instagram_url && (
                    <a
                      href={formData.footer_instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-[#001540] hover:underline flex items-center gap-1 font-bold"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  name="footer_instagram_url"
                  value={formData.footer_instagram_url}
                  onChange={handleChange}
                  placeholder="https://www.instagram.com/the.cozy.theory?stkn=MWxpY3UyOTZoMXpiYg=="
                  className="w-full bg-white border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded text-neutral-900"
                />
                <p className="text-[10px] font-mono text-neutral-500">
                  Target for &ldquo;INSTAGRAM&rdquo; link in the website footer bottom bar.
                </p>
              </div>

              {/* Pinterest URL Card */}
              <div className="p-4 bg-[#faf8f5] border border-[#e5e3dc] rounded space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase text-neutral-800 font-bold flex items-center gap-1.5">
                    <svg className="w-4 h-4 fill-rose-600" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                    </svg>
                    <span>Pinterest Page URL</span>
                  </label>
                  {formData.footer_pinterest_url && (
                    <a
                      href={formData.footer_pinterest_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-[#001540] hover:underline flex items-center gap-1 font-bold"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  name="footer_pinterest_url"
                  value={formData.footer_pinterest_url}
                  onChange={handleChange}
                  placeholder="https://pin.it/229oxMjQD"
                  className="w-full bg-white border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded text-neutral-900"
                />
                <p className="text-[10px] font-mono text-neutral-500">
                  Target for &ldquo;PINTEREST&rdquo; link in the website footer bottom bar.
                </p>
              </div>
            </div>
          </div>

          {/* Section 1.5: Journal & Blog Visibility Control */}
          <div className="bg-white border border-[#e5e3dc] p-6 space-y-4 rounded shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e3dc] pb-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#121212] flex items-center gap-2">
                  <span>Journal &amp; News Visibility</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold border ${
                    formData.journal_visible !== false
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-amber-50 text-amber-800 border-amber-300"
                  }`}>
                    {formData.journal_visible !== false ? "Visible on Storefront" : "Hidden from Storefront"}
                  </span>
                </h2>
                <p className="text-xs font-mono text-neutral-500 mt-1">
                  Control whether the &ldquo;Journal&rdquo; link is displayed in the website footer &ldquo;About&rdquo; column, header navigation, and brand story pages.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/admin/blogs"
                  className="px-3 py-1.5 bg-[#faf8f5] hover:bg-[#f0ece1] text-[#001540] border border-[#e5e3dc] rounded text-xs font-mono uppercase font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Edit Journal Articles</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </Link>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-1.5 bg-[#001540] hover:bg-[#002266] text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-colors"
                >
                  {saving ? "Saving..." : "Save Visibility"}
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#faf8f5] border border-[#e5e3dc] rounded flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase font-bold text-neutral-900 block">
                  Show Journal in Footer &amp; Header Menus
                </span>
                <p className="text-[11px] font-mono text-neutral-500">
                  Turn this switch off to completely hide the Journal link from customers while you curate or draft articles.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  name="journal_visible"
                  checked={formData.journal_visible !== false}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#001540]"></div>
              </label>
            </div>
          </div>

          {/* Section 2: Footer Navigation Menus (4 Columns) - User's Edit Request */}
          <div className="bg-white border border-[#e5e3dc] p-6 space-y-6 rounded shadow-xs">
            <div className="border-b border-[#e5e3dc] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#121212] flex items-center gap-2">
                  <span>Footer Navigation Menus (4 Columns)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-semibold border border-emerald-200">
                    Pure Cotton Linen Removed
                  </span>
                </h2>
                <p className="text-xs font-mono text-neutral-500 mt-0.5">
                  Edit column titles, add new links, or delete unwanted links across all 4 footer navigation categories.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetFooterSections}
                className="px-3 py-1.5 bg-[#faf8f5] hover:bg-neutral-200 text-neutral-700 border border-[#e5e3dc] rounded text-[11px] font-mono uppercase font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                title="Reset columns and links back to default homeware structure"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset All to Defaults</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
              {(formData.footer_sections || DEFAULT_FOOTER_SECTIONS).map((section, sIdx) => (
                <div
                  key={section.id || sIdx}
                  className="p-4 bg-[#faf8f5] border border-[#e5e3dc] rounded space-y-4 shadow-2xs"
                >
                  {/* Column Header */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1 font-bold">
                      <span>Column {sIdx + 1}</span>
                      <span>({(section.links || []).length} links)</span>
                    </div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-700 font-bold mb-1">
                      Menu Title:
                    </label>
                    <input
                      type="text"
                      value={section.title || ""}
                      onChange={(e) => handleFooterSectionTitleChange(sIdx, e.target.value)}
                      placeholder="Column Title"
                      className="w-full bg-white border border-[#e5e3dc] p-2 text-xs font-mono font-bold uppercase focus:outline-none focus:border-black rounded text-neutral-900"
                    />
                  </div>

                  {/* Links List */}
                  <div className="space-y-2.5 pt-2 border-t border-[#e5e3dc]">
                    <div className="text-[10px] font-mono uppercase text-neutral-500 font-semibold">
                      Links in this column:
                    </div>

                    {(section.links || []).map((link, lIdx) => (
                      <div
                        key={link.id || lIdx}
                        className="p-2.5 bg-white border border-[#e5e3dc] rounded space-y-2 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-neutral-400 font-bold">
                            #{lIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFooterLink(sIdx, lIdx)}
                            className="p-1 text-neutral-400 hover:text-rose-600 transition-colors"
                            title="Delete this link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={link.label || ""}
                            onChange={(e) =>
                              handleFooterLinkChange(sIdx, lIdx, "label", e.target.value)
                            }
                            placeholder="Link Display Text"
                            className="w-full bg-[#faf8f5] border border-[#e5e3dc] px-2 py-1 text-xs font-mono focus:outline-none focus:border-black rounded text-neutral-900"
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            value={link.url || ""}
                            onChange={(e) =>
                              handleFooterLinkChange(sIdx, lIdx, "url", e.target.value)
                            }
                            placeholder="/collections/... or /pages/..."
                            className="w-full bg-[#faf8f5] border border-[#e5e3dc] px-2 py-1 text-[11px] font-mono focus:outline-none focus:border-black rounded text-neutral-600"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddFooterLink(sIdx)}
                      className="w-full py-2 bg-white hover:bg-neutral-100 text-[#001540] border border-dashed border-[#001540]/30 rounded text-[11px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Add Link</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Newsletter & Tagline */}
          <div className="bg-white border border-[#e5e3dc] p-6 space-y-6 rounded shadow-xs max-w-3xl">
            <div className="border-b border-[#e5e3dc] pb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#121212]">
                Newsletter &amp; Footer Notes
              </h2>
              <p className="text-xs font-mono text-neutral-500 mt-0.5">
                Customize the newsletter invitation and bottom drawer tagline.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                  Newsletter Invitation Title
                </label>
                <input
                  type="text"
                  name="footer_newsletter_title"
                  value={formData.footer_newsletter_title}
                  onChange={handleChange}
                  className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                  Newsletter Subtitle / Incentive
                </label>
                <input
                  type="text"
                  name="footer_newsletter_text"
                  value={formData.footer_newsletter_text}
                  onChange={handleChange}
                  className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                  Drawer Footer Tagline / Note
                </label>
                <textarea
                  name="footer_tagline"
                  rows={3}
                  value={formData.footer_tagline}
                  onChange={handleChange}
                  className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#e5e3dc] flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-[#001540] hover:bg-[#002266] text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-colors flex items-center gap-2 shadow-xs"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to Supabase...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Footer, Menus &amp; Socials</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Homepage Media & Banners */}
      {activeTab === "homepage" && (
        <div className="space-y-8">
          
          {/* Section 1: Hero Slideshow Banners (Rotating Full-Width Banners) */}
          <div className="bg-white border border-[#e5e3dc] p-6 space-y-6 rounded shadow-xs">
            <div className="border-b border-[#e5e3dc] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#121212] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#001540]" />
                    <span>Hero Slideshow Banners &amp; Collections</span>
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#f0f4fa] text-[#001540] rounded font-semibold border border-[#d8e2f0]">
                    {(formData.hero_slides || []).length} Active Banners
                  </span>
                </div>
                <p className="text-xs font-mono text-neutral-500 mt-0.5">
                  Manage rotating banners on the homepage. Add banners for seasonal collections (Christmas, Decorative Objects, etc.) and link buttons directly to collection pages.
                </p>
              </div>

              {/* Add Banner Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="px-4 py-2 bg-[#001540] hover:bg-[#002266] text-white rounded text-xs font-mono uppercase font-bold tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Banner</span>
                </button>
              </div>
            </div>

            {/* Quick Presets Bar */}
            <div className="p-3 bg-[#faf8f5] border border-[#e5e3dc] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <span className="text-[11px] font-mono text-neutral-600 font-semibold uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-neutral-600" />
                <span>Quick Add Collection Presets:</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddPresetSlide("christmas")}
                  className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 rounded text-[11px] font-mono font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>🎄 + Festive &amp; Christmas Banner</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPresetSlide("decorative")}
                  className="px-2.5 py-1.5 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 rounded text-[11px] font-mono font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>🏛️ + Decorative Objects Banner</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPresetSlide("ceramics")}
                  className="px-2.5 py-1.5 bg-white hover:bg-blue-50 text-[#001540] border border-blue-200 rounded text-[11px] font-mono font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>🏺 + Everyday Ceramics Banner</span>
                </button>
              </div>
            </div>

            {/* Slides Cards List */}
            <div className="space-y-6">
              {(formData.hero_slides || []).map((slide, sIdx) => (
                <div
                  key={slide.id || sIdx}
                  className="p-5 bg-[#faf8f5] border border-[#e5e3dc] rounded space-y-5 shadow-2xs"
                >
                  {/* Slide Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#e5e3dc]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#001540] text-white flex items-center justify-center text-xs font-mono font-bold">
                        {sIdx + 1}
                      </span>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#121212]">
                        {slide.title || `Banner Slide #${sIdx + 1}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(sIdx, -1)}
                        disabled={sIdx === 0}
                        className="p-1.5 text-neutral-500 hover:text-black disabled:opacity-30 disabled:hover:text-neutral-500 border border-[#e5e3dc] bg-white rounded transition-colors cursor-pointer"
                        title="Move Slide Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(sIdx, 1)}
                        disabled={sIdx === (formData.hero_slides || []).length - 1}
                        className="p-1.5 text-neutral-500 hover:text-black disabled:opacity-30 disabled:hover:text-neutral-500 border border-[#e5e3dc] bg-white rounded transition-colors cursor-pointer"
                        title="Move Slide Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlide(sIdx)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 border border-[#e5e3dc] bg-white rounded transition-colors ml-2 cursor-pointer"
                        title="Delete Banner Slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Grid Layout: Visual Preview & Inputs */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Visual Preview & Image Picker */}
                    <div className="lg:col-span-5 space-y-3">
                      <div className="relative aspect-[21/9] bg-neutral-900 rounded overflow-hidden border border-[#e5e3dc] shadow-inner group">
                        <img
                          src={slide.desktopImage || slide.mobileImage || "/placeholder.png"}
                          alt={slide.title || "Banner Preview"}
                          className="w-full h-full object-cover brightness-[0.85]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                          {slide.subtitle && (
                            <span className="text-[8px] font-mono tracking-widest uppercase px-1.5 py-0.5 bg-white/20 rounded w-fit mb-1">
                              {slide.subtitle}
                            </span>
                          )}
                          <h4 className="text-xs font-extrabold uppercase truncate">
                            {slide.title || "Slide Title"}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-[9px] font-mono font-bold uppercase bg-white text-black px-2 py-0.5">
                              {slide.ctaText || "CTA Button"}
                            </span>
                            {slide.secondaryCta && (
                              <span className="text-[9px] font-mono uppercase border border-white/50 px-2 py-0.5 text-white">
                                {slide.secondaryCta}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Image Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="cursor-pointer px-3 py-1.5 bg-[#001540] hover:bg-[#002266] text-white rounded text-[11px] font-mono font-bold uppercase flex items-center gap-1.5 transition-colors shadow-2xs">
                          <Upload className="w-3 h-3" />
                          <span>Upload Desktop Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleSlideUpload(sIdx, file, false);
                              e.target.value = "";
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setCropImageSrc(slide.desktopImage);
                            setCropTargetField(`hero_slide_${sIdx}_desktop`);
                            setCropConfig({
                              w: 1600,
                              h: 820,
                              aspect: "21:9",
                              title: `Crop & Adjust Banner #${sIdx + 1} (Desktop)`,
                            });
                            setCropModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-800 border border-[#e5e3dc] rounded text-[11px] font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Crop className="w-3 h-3" />
                          <span>Crop / Edit Picture</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-neutral-600 font-semibold mb-1">
                          Direct Desktop Image URL:
                        </label>
                        <input
                          type="text"
                          value={slide.desktopImage || ""}
                          onChange={(e) => handleSlideChange(sIdx, "desktopImage", e.target.value)}
                          placeholder="/products/drive/... or https://..."
                          className="w-full bg-white border border-[#e5e3dc] px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-black rounded text-neutral-900"
                        />
                      </div>
                    </div>

                    {/* Slide Text & Button Links Configuration */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono uppercase text-neutral-700 font-bold mb-1">
                            Slide Headline / Title:
                          </label>
                          <input
                            type="text"
                            value={slide.title || ""}
                            onChange={(e) => handleSlideChange(sIdx, "title", e.target.value)}
                            placeholder="e.g. ARTISANAL LIVING OBJECTS"
                            className="w-full bg-white border border-[#e5e3dc] p-2 text-xs font-mono font-bold uppercase focus:outline-none focus:border-black rounded text-neutral-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono uppercase text-neutral-700 font-bold mb-1">
                            Slide Subtitle Badge:
                          </label>
                          <input
                            type="text"
                            value={slide.subtitle || ""}
                            onChange={(e) => handleSlideChange(sIdx, "subtitle", e.target.value)}
                            placeholder="e.g. THE COZY THEORY // COLLECTION 01"
                            className="w-full bg-white border border-[#e5e3dc] p-2 text-xs font-mono uppercase focus:outline-none focus:border-black rounded text-neutral-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase text-neutral-700 font-semibold mb-1">
                          Editorial Description Text:
                        </label>
                        <textarea
                          rows={2}
                          value={slide.description || ""}
                          onChange={(e) => handleSlideChange(sIdx, "description", e.target.value)}
                          placeholder="Handcrafted stoneware, tactile vessels, and deliberate interior statements..."
                          className="w-full bg-white border border-[#e5e3dc] p-2 text-xs font-mono focus:outline-none focus:border-black rounded text-neutral-800"
                        />
                      </div>

                      {/* Primary CTA Button & Collection Link Picker */}
                      <div className="p-3 bg-white border border-[#e5e3dc] rounded space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono uppercase text-[#001540] font-bold">
                            Primary CTA Button (Solid White Button)
                          </span>
                          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                            Navigates to Collection
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                              Button Display Text:
                            </label>
                            <input
                              type="text"
                              value={slide.ctaText || ""}
                              onChange={(e) => handleSlideChange(sIdx, "ctaText", e.target.value)}
                              placeholder="e.g. Explore Tableware"
                              className="w-full bg-[#faf8f5] border border-[#e5e3dc] p-2 text-xs font-mono font-bold uppercase focus:outline-none focus:border-black rounded text-neutral-900"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                              Target Collection Page:
                            </label>
                            <select
                              value={slide.ctaLink || "/collections/all-products"}
                              onChange={(e) => handleSlideChange(sIdx, "ctaLink", e.target.value)}
                              className="w-full bg-[#faf8f5] border border-[#e5e3dc] p-2 text-xs font-mono focus:outline-none focus:border-black rounded text-neutral-900 font-semibold"
                            >
                              <option value="/collections/tableware">Tableware &amp; Dining (/collections/tableware)</option>
                              <option value="/collections/vases-planters">Vases &amp; Planters (/collections/vases-planters)</option>
                              <option value="/collections/decorative-objects">Decorative Objects (/collections/decorative-objects)</option>
                              <option value="/collections/merry-bright">Festive &amp; Christmas (/collections/merry-bright)</option>
                              <option value="/collections/everyday-ceramics">Everyday Ceramics (/collections/everyday-ceramics)</option>
                              <option value="/collections/blue-pottery">Traditional Blue Pottery (/collections/blue-pottery)</option>
                              <option value="/collections/home-linen">Home Linen &amp; Bedding (/collections/home-linen)</option>
                              <option value="/collections/candles-holders">Candles &amp; Holders (/collections/candles-holders)</option>
                              <option value="/collections/all-products">All Objects (/collections/all-products)</option>
                              <option value="#catalog">Scroll to Homepage Catalog (#catalog)</option>
                              {slide.ctaLink && ![
                                "/collections/tableware",
                                "/collections/vases-planters",
                                "/collections/decorative-objects",
                                "/collections/merry-bright",
                                "/collections/everyday-ceramics",
                                "/collections/blue-pottery",
                                "/collections/home-linen",
                                "/collections/candles-holders",
                                "/collections/all-products",
                                "#catalog"
                              ].includes(slide.ctaLink) && (
                                <option value={slide.ctaLink}>Custom: {slide.ctaLink}</option>
                              )}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-0.5">
                            Or enter custom link URL:
                          </label>
                          <input
                            type="text"
                            value={slide.ctaLink || ""}
                            onChange={(e) => handleSlideChange(sIdx, "ctaLink", e.target.value)}
                            placeholder="/collections/... or /products/..."
                            className="w-full bg-[#faf8f5] border border-[#e5e3dc] px-2 py-1 text-[11px] font-mono focus:outline-none focus:border-black rounded text-neutral-700"
                          />
                        </div>
                      </div>

                      {/* Secondary CTA Button */}
                      <div className="p-3 bg-white border border-[#e5e3dc] rounded space-y-3">
                        <span className="text-[11px] font-mono uppercase text-neutral-700 font-bold block">
                          Secondary CTA Button (Outlined Button)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                              Button Display Text:
                            </label>
                            <input
                              type="text"
                              value={slide.secondaryCta || ""}
                              onChange={(e) => handleSlideChange(sIdx, "secondaryCta", e.target.value)}
                              placeholder="e.g. View All Objects"
                              className="w-full bg-[#faf8f5] border border-[#e5e3dc] p-2 text-xs font-mono uppercase focus:outline-none focus:border-black rounded text-neutral-900"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                              Target URL:
                            </label>
                            <input
                              type="text"
                              value={slide.secondaryCtaLink || "/collections/all-products"}
                              onChange={(e) => handleSlideChange(sIdx, "secondaryCtaLink", e.target.value)}
                              placeholder="/collections/all-products or #catalog"
                              className="w-full bg-[#faf8f5] border border-[#e5e3dc] p-2 text-xs font-mono focus:outline-none focus:border-black rounded text-neutral-900"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Save for Hero Slides */}
            <div className="pt-4 border-t border-[#e5e3dc] flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 bg-[#001540] hover:bg-[#002266] text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to Supabase...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Hero Slides &amp; Banners</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section 2: Curated Atmosphere / Shop The Look Banner */}
          <div className="bg-white border border-[#e5e3dc] p-6 space-y-6 rounded shadow-xs">
            <div className="border-b border-[#e5e3dc] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#121212]">
                    Curated Atmosphere // Shop The Look Banner
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#f0f4fa] text-[#001540] rounded font-semibold border border-[#d8e2f0]">
                    Homepage Section
                  </span>
                </div>
                <p className="text-xs font-mono text-neutral-500 mt-0.5">
                  The wide interactive banner displaying hotspot object pins on the homepage.
                </p>
              </div>
              <div className="text-[11px] font-mono text-neutral-600 bg-[#faf8f5] px-3 py-1.5 rounded border border-[#e5e3dc]">
                Recommended Dimensions: <strong className="text-[#001540]">1600 × 750 px</strong> (21:9 Wide)
              </div>
            </div>

            {/* Banner Preview & Image Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Preview Container with Hotspot Pins */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-neutral-700 font-semibold flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5 text-[#001540]" />
                    <span>Interactive Banner Preview</span>
                  </span>
                  {(formData.lookbook_spots || []).length > 0 && (
                    <span className="text-[11px] font-mono text-neutral-500">
                      Targeting: <strong className="text-[#001540]">Pin #{selectedSpotIndex + 1}</strong>
                    </span>
                  )}
                </div>

                <div
                  ref={bannerPreviewRef}
                  onClick={handleBannerClick}
                  className="relative aspect-[21/9] bg-neutral-900 border-2 border-dashed border-neutral-300 hover:border-[#001540] rounded overflow-hidden shadow-inner cursor-crosshair group select-none transition-colors"
                  title="Click anywhere on the photo to relocate the active product pin"
                >
                  <img
                    src={formData.lookbook_image}
                    alt="Shop The Look Banner Preview"
                    className="w-full h-full object-cover pointer-events-none"
                  />

                  {/* Hotspots overlay on banner preview */}
                  {(formData.lookbook_spots || []).map((spot, idx) => {
                    const isSelected = selectedSpotIndex === idx;
                    const topVal = String(spot.top || "50%").includes("%") ? spot.top : `${spot.top}%`;
                    const leftVal = String(spot.left || "50%").includes("%") ? spot.left : `${spot.left}%`;

                    return (
                      <div
                        key={spot.id || idx}
                        style={{ top: topVal, left: leftVal }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSpotIndex(idx);
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group/pin"
                      >
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs shadow-xl transition-all ${
                            isSelected
                              ? "bg-[#001540] text-white ring-4 ring-sky-400 scale-110 shadow-sky-500/50"
                              : "bg-[#121212] text-white border-2 border-white hover:scale-105"
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                        {/* Number badge & tooltip */}
                        <div
                          className={`absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-bold ${
                            isSelected ? "bg-sky-400 text-[#001540]" : "bg-neutral-800 text-neutral-200 border border-white"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className={`absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-mono shadow-md pointer-events-none transition-opacity ${
                          isSelected ? "bg-[#001540] text-white opacity-100 z-30 ring-1 ring-white/20" : "bg-black/85 text-neutral-200 opacity-0 group-hover/pin:opacity-100 z-20"
                        }`}>
                          #{idx + 1}: {spot.productTitle || "Product Pin"}
                        </div>
                      </div>
                    );
                  })}

                  {/* Positioning Guide Banner */}
                  {(formData.lookbook_spots || []).length > 0 && (
                    <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono rounded flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3 h-3 text-sky-400 flex-shrink-0" />
                        <span className="truncate">
                          Click photo to place <strong>Pin #{selectedSpotIndex + 1}</strong>: {formData.lookbook_spots[selectedSpotIndex]?.productTitle || "Object"}
                        </span>
                      </div>
                      <span className="text-neutral-400 flex-shrink-0 ml-2">
                        {formData.lookbook_spots[selectedSpotIndex]?.left || "50%"}, {formData.lookbook_spots[selectedSpotIndex]?.top || "50%"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Banner Image Actions */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <input
                    type="file"
                    ref={lookbookFileRef}
                    onChange={handleLookbookFileChange}
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => lookbookFileRef.current?.click()}
                    className="px-3.5 py-2 bg-[#001540] hover:bg-[#002266] text-white rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload &amp; Change Banner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCropImageSrc(formData.lookbook_image);
                      setCropTargetField("lookbook_image");
                      setCropConfig({
                        w: 1600,
                        h: 750,
                        aspect: "21:9",
                        title: "Crop & Adjust Shop The Look Banner",
                      });
                      setCropModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-neutral-100 text-neutral-800 border border-[#e5e3dc] rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    <span>Crop / Edit Picture</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        lookbook_image:
                          "https://cdn.shopify.com/s/files/1/0826/5053/0110/files/Two_Odd_x_Notice_Aditya_Sinha-1.jpg?v=1788185403&width=1600&format=webp",
                      }));
                    }}
                    className="px-3 py-2 bg-white hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 border border-[#e5e3dc] rounded text-xs font-mono flex items-center gap-1 transition-colors"
                    title="Reset to default photoshoot image"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Image</span>
                  </button>
                </div>
              </div>

              {/* Banner Details & Text Settings */}
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                    Banner Image URL
                  </label>
                  <input
                    type="text"
                    name="lookbook_image"
                    value={formData.lookbook_image}
                    onChange={handleChange}
                    className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded text-neutral-800"
                    placeholder="https://... or upload with button above"
                  />
                  <p className="text-[10px] font-mono text-neutral-500 mt-1">
                    Direct image URL or base64 from image upload.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    name="lookbook_subtitle"
                    value={formData.lookbook_subtitle}
                    onChange={handleChange}
                    className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    name="lookbook_title"
                    value={formData.lookbook_title}
                    onChange={handleChange}
                    className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                    Description Text
                  </label>
                  <textarea
                    rows={2}
                    name="lookbook_text"
                    value={formData.lookbook_text}
                    onChange={handleChange}
                    className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded"
                  />
                </div>
              </div>
            </div>

            {/* HOTSPOT PINS & TAGGING SECTION */}
            <div className="pt-6 border-t border-[#e5e3dc] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#121212]">
                      Tagged Product Pins ({(formData.lookbook_spots || []).length})
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#001540] text-white rounded font-bold">
                      Interactive Hotspots
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-500 mt-0.5">
                    Tag 1, 2, 3, or more products on this lifestyle photo. Visitors tap each &ldquo;+&rdquo; pin on the homepage to inspect the product and add it to their bag.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddSpot}
                  className="px-4 py-2 bg-[#001540] hover:bg-[#002266] text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Plus Button (Tag Product)</span>
                </button>
              </div>

              {/* Pins Grid / List */}
              {(!formData.lookbook_spots || formData.lookbook_spots.length === 0) ? (
                <div className="p-8 bg-[#faf8f5] border border-dashed border-[#e5e3dc] rounded text-center space-y-3">
                  <Tag className="w-8 h-8 text-neutral-400 mx-auto" />
                  <p className="text-xs font-mono text-neutral-600">
                    No product pins tagged yet on this banner.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddSpot}
                    className="px-4 py-2 bg-[#001540] text-white rounded text-xs font-mono uppercase font-bold"
                  >
                    + Add Your First Product Pin
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {formData.lookbook_spots.map((spot, idx) => {
                    const isSelected = selectedSpotIndex === idx;
                    const leftNum = parseInt(spot.left, 10) || 50;
                    const topNum = parseInt(spot.top, 10) || 50;

                    return (
                      <div
                        key={spot.id || idx}
                        onClick={() => setSelectedSpotIndex(idx)}
                        className={`p-4 rounded border transition-all space-y-4 cursor-pointer ${
                          isSelected
                            ? "bg-[#f5f8fc] border-[#001540] shadow-md ring-1 ring-[#001540]"
                            : "bg-[#faf8f5] border-[#e5e3dc] hover:border-neutral-400"
                        }`}
                      >
                        {/* Pin Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-[#e5e3dc]">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                                isSelected
                                  ? "bg-[#001540] text-white ring-2 ring-sky-300"
                                  : "bg-neutral-800 text-white"
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#121212]">
                              Pin #{idx + 1}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isSelected ? (
                              <span className="text-[10px] font-mono px-2 py-0.5 bg-sky-100 text-[#001540] rounded font-bold border border-sky-300">
                                Active on Photo
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSpotIndex(idx);
                                }}
                                className="text-[10px] font-mono text-neutral-500 hover:text-black uppercase underline"
                              >
                                Select Pin
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveSpot(idx);
                              }}
                              className="p-1 text-neutral-400 hover:text-rose-600 transition-colors"
                              title="Delete this hotspot pin"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Product Picker Dropdown */}
                        <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
                          <label className="block text-[11px] font-mono uppercase text-neutral-700 font-semibold">
                            Assigned Product:
                          </label>
                          <select
                            value={spot.productId || ""}
                            onChange={(e) => handleSpotProductChange(idx, e.target.value)}
                            className="w-full bg-white border border-[#e5e3dc] p-2 text-xs font-mono focus:outline-none focus:border-[#001540] rounded text-neutral-900"
                          >
                            {availableProducts.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.title} — Rs. {Number(p.price || 0).toLocaleString("en-IN")}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Product Preview Snippet */}
                        <div className="flex items-center gap-3 p-2 bg-white border border-[#e5e3dc] rounded">
                          <img
                            src={spot.image || "/placeholder.png"}
                            alt={spot.productTitle}
                            className="w-12 h-12 object-cover rounded border border-neutral-200 shrink-0 bg-neutral-100"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-[#121212] truncate">
                              {spot.productTitle}
                            </p>
                            <p className="text-[11px] font-mono text-neutral-600 font-semibold mt-0.5">
                              Rs. {Number(spot.price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>

                        {/* Position Controls (Horizontal & Vertical) */}
                        <div className="space-y-3 pt-1" onClick={(e) => e.stopPropagation()}>
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-600 mb-1">
                              <span className="font-semibold uppercase">Horizontal (Left %):</span>
                              <span className="font-bold text-[#001540]">{spot.left || `${leftNum}%`}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min={4}
                                max={96}
                                value={leftNum}
                                onChange={(e) => handleSpotPositionChange(idx, "left", e.target.value)}
                                className="flex-1 accent-[#001540] cursor-pointer"
                              />
                              <input
                                type="number"
                                min={4}
                                max={96}
                                value={leftNum}
                                onChange={(e) => handleSpotPositionChange(idx, "left", e.target.value)}
                                className="w-14 bg-white border border-[#e5e3dc] px-1.5 py-0.5 text-xs font-mono text-center rounded"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-600 mb-1">
                              <span className="font-semibold uppercase">Vertical (Top %):</span>
                              <span className="font-bold text-[#001540]">{spot.top || `${topNum}%`}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min={6}
                                max={94}
                                value={topNum}
                                onChange={(e) => handleSpotPositionChange(idx, "top", e.target.value)}
                                className="flex-1 accent-[#001540] cursor-pointer"
                              />
                              <input
                                type="number"
                                min={6}
                                max={94}
                                value={topNum}
                                onChange={(e) => handleSpotPositionChange(idx, "top", e.target.value)}
                                className="w-14 bg-white border border-[#e5e3dc] px-1.5 py-0.5 text-xs font-mono text-center rounded"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="text-[10px] font-mono text-neutral-500 bg-neutral-100/70 p-2 rounded flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-[#001540] shrink-0" />
                          <span>Click directly on the photo above to set location.</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Save for Section 1 */}
            <div className="pt-4 border-t border-[#e5e3dc] flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 bg-[#001540] hover:bg-[#002266] text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-colors flex items-center gap-2 shadow-xs"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to Supabase...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Banner &amp; Tagged Pins</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section 2: Our Story Narrative / Spotlight Showcase */}
          <div className="bg-white border border-[#e5e3dc] p-6 space-y-6 rounded shadow-xs">
            <div className="border-b border-[#e5e3dc] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#121212]">
                    Our Story Narrative // Spotlight Object Showcase
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#f0f4fa] text-[#001540] rounded font-semibold border border-[#d8e2f0]">
                    Homepage Section
                  </span>
                </div>
                <p className="text-xs font-mono text-neutral-500 mt-0.5">
                  The dark editorial section on the homepage highlighting Our Story and the featured spotlight object.
                </p>
              </div>
              <div className="text-[11px] font-mono text-neutral-600 bg-[#faf8f5] px-3 py-1.5 rounded border border-[#e5e3dc]">
                Recommended Dimensions: <strong className="text-[#001540]">800 × 1000 px</strong> (4:5 Portrait)
              </div>
            </div>

            {/* Editorial Showcase Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Spotlight Image Card & Actions */}
              <div className="lg:col-span-5 space-y-3">
                <div className="relative aspect-[4/5] bg-neutral-900 border border-[#e5e3dc] rounded overflow-hidden shadow-inner group">
                  <img
                    src={formData.manifesto_image}
                    alt={formData.manifesto_product_title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3 p-3 bg-black/80 backdrop-blur-sm border border-neutral-700 text-white rounded">
                    <span className="text-[9px] font-mono text-sky-300 uppercase tracking-widest block mb-0.5">
                      Spotlight Object
                    </span>
                    <p className="text-xs font-mono font-bold truncate">
                      {formData.manifesto_product_title}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCropImageSrc(formData.manifesto_image);
                        setCropTargetField("manifesto_image");
                        setCropConfig({
                          w: 800,
                          h: 1000,
                          aspect: "4:5",
                          title: "Crop & Adjust Spotlight Image (Living Manifesto)",
                        });
                        setCropModalOpen(true);
                      }}
                      className="px-4 py-2 bg-white text-black text-xs font-mono font-bold rounded shadow-md hover:bg-neutral-100 flex items-center gap-1.5 transition-transform active:scale-95"
                    >
                      <Crop className="w-3.5 h-3.5" />
                      <span>Crop / Adjust Image</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    ref={manifestoFileRef}
                    onChange={handleManifestoFileChange}
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => manifestoFileRef.current?.click()}
                    className="px-4 py-2 bg-[#001540] hover:bg-[#002266] text-white rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Computer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCropImageSrc(formData.manifesto_image);
                      setCropTargetField("manifesto_image");
                      setCropConfig({
                        w: 800,
                        h: 1000,
                        aspect: "4:5",
                        title: "Crop & Adjust Spotlight Image (Living Manifesto)",
                      });
                      setCropModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-neutral-100 text-neutral-800 border border-[#e5e3dc] rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    <span>Crop Current</span>
                  </button>
                </div>
              </div>

              {/* Manifesto Text Form */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                    Spotlight Image URL or Data
                  </label>
                  <input
                    type="text"
                    name="manifesto_image"
                    value={formData.manifesto_image}
                    onChange={handleChange}
                    className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded text-neutral-800"
                    placeholder="https://... or upload from computer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                      Spotlight Product Title
                    </label>
                    <input
                      type="text"
                      name="manifesto_product_title"
                      value={formData.manifesto_product_title}
                      onChange={handleChange}
                      className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                      Spotlight Product URL
                    </label>
                    <input
                      type="text"
                      name="manifesto_product_url"
                      value={formData.manifesto_product_url}
                      onChange={handleChange}
                      className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                    Section Tagline
                  </label>
                  <input
                    type="text"
                    name="manifesto_tagline"
                    value={formData.manifesto_tagline}
                    onChange={handleChange}
                    className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                    Main Headline (use enter for line breaks)
                  </label>
                  <textarea
                    rows={3}
                    name="manifesto_title"
                    value={formData.manifesto_title}
                    onChange={handleChange}
                    className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                    Manifesto Body Text
                  </label>
                  <textarea
                    rows={3}
                    name="manifesto_text"
                    value={formData.manifesto_text}
                    onChange={handleChange}
                    className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      name="manifesto_button_text"
                      value={formData.manifesto_button_text}
                      onChange={handleChange}
                      className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-700 font-semibold mb-1">
                      Button Target URL
                    </label>
                    <input
                      type="text"
                      name="manifesto_button_url"
                      value={formData.manifesto_button_url}
                      onChange={handleChange}
                      className="w-full bg-[#faf8f2] border border-[#e5e3dc] p-2.5 text-xs font-mono focus:outline-none focus:border-black rounded"
                    />
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Bottom Save Action */}
          <div className="pt-4 border-t border-[#e5e3dc] flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-[#001540] hover:bg-[#002266] text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-colors shadow-sm"
            >
              {saving ? "Saving to Supabase..." : "Save Homepage Media Settings"}
            </button>
          </div>

        </div>
      )}

      {/* Tab 6: FAQ & Help Center Questions Management */}
      {activeTab === "faqs" && (
        <div className="space-y-6">
          <div className="bg-white border border-[#e5e3dc] p-6 space-y-6 rounded shadow-xs">
            {/* Header */}
            <div className="border-b border-[#e5e3dc] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#121212] flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#001540]" />
                    <span>Frequently Asked Questions (FAQ) Manager</span>
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#f0f4fa] text-[#001540] rounded font-semibold border border-[#d8e2f0]">
                    {(formData.faqs || []).length} Questions Total
                  </span>
                </div>
                <p className="text-xs font-mono text-neutral-500 mt-0.5">
                  Edit questions, write answers, toggle visibility (hide/show), and add direct policy links. Hidden questions stay saved here in draft mode without appearing to customers.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="/pages/faq"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-white hover:bg-neutral-100 text-[#001540] border border-[#e5e3dc] rounded text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Live FAQ Page</span>
                </a>
                <button
                  type="button"
                  onClick={handleResetFaqs}
                  className="px-3 py-2 bg-white hover:bg-neutral-100 text-neutral-600 border border-[#e5e3dc] rounded text-xs font-mono font-semibold uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Reset to default store FAQ guidelines"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Defaults</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="px-4 py-2 bg-[#001540] hover:bg-[#002266] text-white rounded text-xs font-mono uppercase font-bold tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Question</span>
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {(formData.faqs || []).map((faq, idx) => {
                const isHidden = Boolean(faq.hidden);

                return (
                  <div
                    key={faq.id || idx}
                    className={`p-4 border rounded transition-all space-y-4 ${
                      isHidden
                        ? "bg-neutral-50/70 border-neutral-300 opacity-75"
                        : "bg-[#faf8f5] border-[#e5e3dc] shadow-2xs"
                    }`}
                  >
                    {/* Item Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#e5e3dc]">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                            isHidden
                              ? "bg-neutral-400 text-white"
                              : "bg-[#001540] text-white"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#121212]">
                          Question #{idx + 1}
                        </span>
                        {isHidden ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold flex items-center gap-1">
                            <EyeOff className="w-3 h-3 text-amber-700" />
                            <span>Hidden from Customers</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded font-bold flex items-center gap-1">
                            <Eye className="w-3 h-3 text-emerald-700" />
                            <span>Live on Website</span>
                          </span>
                        )}
                      </div>

                      {/* Controls: Hide/Show Toggle, Reorder, Delete */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleFaqHidden(idx)}
                          className={`px-2.5 py-1 text-xs font-mono font-bold uppercase rounded border transition-colors flex items-center gap-1 cursor-pointer ${
                            isHidden
                              ? "bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100"
                              : "bg-white text-neutral-700 border-[#e5e3dc] hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300"
                          }`}
                          title={isHidden ? "Unhide this question" : "Hide this question from customers"}
                        >
                          {isHidden ? (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Unhide (Publish)</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                              <span>Hide Question</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMoveFaq(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 text-neutral-500 hover:text-black disabled:opacity-30 border border-[#e5e3dc] bg-white rounded transition-colors cursor-pointer"
                          title="Move Question Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveFaq(idx, 1)}
                          disabled={idx === (formData.faqs || []).length - 1}
                          className="p-1 text-neutral-500 hover:text-black disabled:opacity-30 border border-[#e5e3dc] bg-white rounded transition-colors cursor-pointer"
                          title="Move Question Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="p-1 text-neutral-400 hover:text-rose-600 border border-[#e5e3dc] bg-white rounded transition-colors ml-1 cursor-pointer"
                          title="Delete FAQ Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Question & Answer Inputs */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-neutral-700 font-bold mb-1">
                          Question:
                        </label>
                        <input
                          type="text"
                          value={faq.q || ""}
                          onChange={(e) => handleFaqChange(idx, "q", e.target.value)}
                          placeholder="e.g. What payment methods are supported at checkout?"
                          className="w-full bg-white border border-[#e5e3dc] p-2.5 text-xs font-mono font-bold uppercase focus:outline-none focus:border-black rounded text-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase text-neutral-700 font-bold mb-1">
                          Answer Text:
                        </label>
                        <textarea
                          rows={3}
                          value={faq.a || ""}
                          onChange={(e) => handleFaqChange(idx, "a", e.target.value)}
                          placeholder="Write the comprehensive answer to this question..."
                          className="w-full bg-white border border-[#e5e3dc] p-2.5 text-xs font-mono leading-relaxed focus:outline-none focus:border-black rounded text-neutral-800"
                        />
                      </div>

                      {/* Optional Action Link (e.g. Check the refund policy) */}
                      <div className="p-3 bg-white border border-[#e5e3dc] rounded space-y-2">
                        <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold block">
                          Optional Policy / Route Link (e.g. Check refund policy)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              value={faq.linkText || ""}
                              onChange={(e) => handleFaqChange(idx, "linkText", e.target.value)}
                              placeholder="Link Display Text (e.g. Check the refund policy →)"
                              className="w-full bg-[#faf8f5] border border-[#e5e3dc] px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-black rounded text-neutral-900"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={faq.linkUrl || ""}
                              onChange={(e) => handleFaqChange(idx, "linkUrl", e.target.value)}
                              placeholder="Target URL (e.g. /pages/refund-policy)"
                              className="w-full bg-[#faf8f5] border border-[#e5e3dc] px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-black rounded text-neutral-900"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Save Action */}
            <div className="pt-4 border-t border-[#e5e3dc] flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-[#001540] hover:bg-[#002266] text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to Supabase...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save FAQ Questions &amp; Visibility</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Our Story Pictures & Text */}
      {activeTab === "our_story" && (
        <div className="space-y-8">
          {/* Header Card */}
          <div className="bg-white border border-[#e5e3dc] p-6 rounded shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e3dc] pb-4">
              <div>
                <h2 className="text-base font-bold uppercase tracking-wider text-[#121212] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#001540]" />
                  <span>Our Story Pictures &amp; Editorial</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-50 text-[#001540] rounded font-semibold border border-blue-200">
                    /pages/our-story
                  </span>
                </h2>
                <p className="text-xs font-mono text-neutral-500 mt-1">
                  Upload, crop, and customize the photography and headlines featured on The Cozy Theory brand story page.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="/pages/our-story"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-[#faf8f5] hover:bg-[#f0ece1] text-neutral-800 border border-[#e5e3dc] rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#001540]" />
                  <span>View Live Page</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 bg-[#001540] hover:bg-[#002266] text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Feature Note Banner */}
            <div className="p-4 bg-[#faf8f2] border border-[#e5e3dc] rounded flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-[#001540] mt-0.5 shrink-0" />
              <div className="text-xs font-mono text-neutral-700 leading-relaxed">
                <strong>Interactive Scroll Feature Enabled:</strong> Both photographs feature dynamic scroll transitions. As visitors read the story paragraphs next to each photo, the image smoothly emerges in vivid full color. When visitors scroll away or past it, it automatically returns to monochromatic black &amp; white. Hovering over either picture always reveals full color.
              </div>
            </div>
          </div>

          {/* Hidden File Inputs for Image Crop */}
          <input
            type="file"
            ref={storyChap1FileRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleStoryImageUpload("chapter1_image", e)}
          />
          <input
            type="file"
            ref={storyChap2FileRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleStoryImageUpload("chapter2_image", e)}
          />

          {/* Chapters Editorial Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chapter 1 Photo Card */}
            <div className="bg-white border border-[#e5e3dc] p-6 rounded shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#e5e3dc] pb-3">
                <div>
                  <span className="text-[10px] font-mono text-[#001540] uppercase tracking-widest font-bold block">
                    Chapter 01
                  </span>
                  <h3 className="text-sm font-bold uppercase text-neutral-900">
                    That Familiar Warmth
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
                  4:5 Portrait
                </span>
              </div>

              {/* Photo Preview & Upload Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                <div className="sm:col-span-5">
                  <div className="aspect-[4/5] bg-[#faf8f2] border border-[#e5e3dc] rounded overflow-hidden shadow-xs relative group">
                    <img
                      src={formData.our_story?.chapter1_image || DEFAULT_OUR_STORY.chapter1_image}
                      alt="Chapter 1 Preview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        type="button"
                        onClick={() => storyChap1FileRef.current?.click()}
                        className="px-3 py-1.5 bg-white text-[#121212] text-[11px] font-mono uppercase font-bold rounded shadow flex items-center gap-1.5"
                      >
                        <Crop className="w-3.5 h-3.5" />
                        <span>Change / Crop</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-7 space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-700 font-bold mb-1">
                      Upload New Photo:
                    </label>
                    <button
                      type="button"
                      onClick={() => storyChap1FileRef.current?.click()}
                      className="w-full py-2 px-3 bg-[#faf8f5] hover:bg-[#f0ece1] text-[#001540] border border-[#e5e3dc] rounded text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload &amp; Crop Photo (4:5)</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-700 font-bold mb-1">
                      Or Direct Image URL / Path:
                    </label>
                    <input
                      type="text"
                      value={formData.our_story?.chapter1_image || ""}
                      onChange={(e) => handleStoryChange("chapter1_image", e.target.value)}
                      placeholder="/products/drive/... or https://..."
                      className="w-full bg-white border border-[#e5e3dc] p-2 text-xs font-mono focus:outline-none focus:border-black rounded text-neutral-900"
                    />
                  </div>

                  {/* Preset Quick Selectors */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold block mb-1.5">
                      Curated Ceramic Presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "Tulip Garden Vase", url: "/products/drive/TT-176 Tulip Garden Ceramic Vase  Planter.webp" },
                        { label: "Lemon Ceramic Vase", url: "/products/drive/Lemon Ceramic Vase  Planter.webp" },
                        { label: "Flower Plate", url: "/products/drive/Flower-Shaped Ceramic Decorative Plate.webp" },
                        { label: "Pomegranate Vase", url: "/products/drive/Pomegranate Ceramic Vase.webp" },
                      ].map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => handleStoryChange("chapter1_image", preset.url)}
                          className="px-2 py-1 bg-white hover:bg-neutral-100 text-neutral-700 border border-[#e5e3dc] rounded text-[10px] font-mono transition-colors cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="space-y-3 pt-3 border-t border-[#e5e3dc]">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-700 font-bold mb-1">
                    Chapter 1 Subtitle / Tagline:
                  </label>
                  <input
                    type="text"
                    value={formData.our_story?.chapter1_subtitle || ""}
                    onChange={(e) => handleStoryChange("chapter1_subtitle", e.target.value)}
                    placeholder="Chapter 01 // That Familiar Warmth"
                    className="w-full bg-[#faf8f5] border border-[#e5e3dc] p-2 text-xs font-mono focus:outline-none focus:border-black rounded text-neutral-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-700 font-bold mb-1">
                    Chapter 1 Main Heading:
                  </label>
                  <input
                    type="text"
                    value={formData.our_story?.chapter1_title || ""}
                    onChange={(e) => handleStoryChange("chapter1_title", e.target.value)}
                    placeholder="A favourite cup. A vase in afternoon light."
                    className="w-full bg-[#faf8f5] border border-[#e5e3dc] p-2 text-xs font-mono focus:outline-none focus:border-black rounded text-neutral-900 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Chapter 2 Photo Card */}
            <div className="bg-white border border-[#e5e3dc] p-6 rounded shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#e5e3dc] pb-3">
                <div>
                  <span className="text-[10px] font-mono text-[#001540] uppercase tracking-widest font-bold block">
                    Chapter 02
                  </span>
                  <h3 className="text-sm font-bold uppercase text-neutral-900">
                    Lived-In Moments
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded">
                  4:5 Portrait
                </span>
              </div>

              {/* Photo Preview & Upload Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                <div className="sm:col-span-5">
                  <div className="aspect-[4/5] bg-[#faf8f2] border border-[#e5e3dc] rounded overflow-hidden shadow-xs relative group">
                    <img
                      src={formData.our_story?.chapter2_image || DEFAULT_OUR_STORY.chapter2_image}
                      alt="Chapter 2 Preview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        type="button"
                        onClick={() => storyChap2FileRef.current?.click()}
                        className="px-3 py-1.5 bg-white text-[#121212] text-[11px] font-mono uppercase font-bold rounded shadow flex items-center gap-1.5"
                      >
                        <Crop className="w-3.5 h-3.5" />
                        <span>Change / Crop</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-7 space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-700 font-bold mb-1">
                      Upload New Photo:
                    </label>
                    <button
                      type="button"
                      onClick={() => storyChap2FileRef.current?.click()}
                      className="w-full py-2 px-3 bg-[#faf8f5] hover:bg-[#f0ece1] text-[#001540] border border-[#e5e3dc] rounded text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload &amp; Crop Photo (4:5)</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-700 font-bold mb-1">
                      Or Direct Image URL / Path:
                    </label>
                    <input
                      type="text"
                      value={formData.our_story?.chapter2_image || ""}
                      onChange={(e) => handleStoryChange("chapter2_image", e.target.value)}
                      placeholder="/products/drive/... or https://..."
                      className="w-full bg-white border border-[#e5e3dc] p-2 text-xs font-mono focus:outline-none focus:border-black rounded text-neutral-900"
                    />
                  </div>

                  {/* Preset Quick Selectors */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold block mb-1.5">
                      Curated Ceramic Presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "Pomegranate Vase", url: "/products/drive/Pomegranate Ceramic Vase.webp" },
                        { label: "Handles Ceramic Vase", url: "/products/drive/Lemon Ceramic Vase with Handles.webp" },
                        { label: "Scalloped Platter", url: "/products/drive/3D Lemon Scalloped Serving Platter.webp" },
                        { label: "Chicken Condiment Jar", url: "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/Product9-01.png?v=1784242846" },
                      ].map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => handleStoryChange("chapter2_image", preset.url)}
                          className="px-2 py-1 bg-white hover:bg-neutral-100 text-neutral-700 border border-[#e5e3dc] rounded text-[10px] font-mono transition-colors cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="space-y-3 pt-3 border-t border-[#e5e3dc]">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-700 font-bold mb-1">
                    Chapter 2 Subtitle / Tagline:
                  </label>
                  <input
                    type="text"
                    value={formData.our_story?.chapter2_subtitle || ""}
                    onChange={(e) => handleStoryChange("chapter2_subtitle", e.target.value)}
                    placeholder="Chapter 02 // Lived-In Moments"
                    className="w-full bg-[#faf8f5] border border-[#e5e3dc] p-2 text-xs font-mono focus:outline-none focus:border-black rounded text-neutral-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-700 font-bold mb-1">
                    Chapter 2 Main Heading:
                  </label>
                  <input
                    type="text"
                    value={formData.our_story?.chapter2_title || ""}
                    onChange={(e) => handleStoryChange("chapter2_title", e.target.value)}
                    placeholder="Slow mornings & spontaneous dinners."
                    className="w-full bg-[#faf8f5] border border-[#e5e3dc] p-2 text-xs font-mono focus:outline-none focus:border-black rounded text-neutral-900 font-bold"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Save Action Banner */}
          <div className="p-4 bg-white border border-[#e5e3dc] rounded flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-500">
              Changes sync instantly to the live storefront upon saving.
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-[#001540] hover:bg-[#002266] text-white rounded text-xs font-mono uppercase font-bold tracking-wider transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving to Supabase...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Our Story Pictures &amp; Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Image Crop & Adjust Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={cropImageSrc}
        onApply={handleCropApply}
        title={cropConfig.title}
        recommendedWidth={cropConfig.w}
        recommendedHeight={cropConfig.h}
        initialAspect={cropConfig.aspect}
      />
    </div>
  );
}
