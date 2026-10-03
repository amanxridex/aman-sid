import { useState } from "react";
import Link from "next/link";
import { Plus, X, ShoppingBag, ExternalLink } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { LOOKBOOK_SPOTS } from "@/lib/products";

export default function LookbookSection({ hotspots, onAddToCart }) {
  const { storeSettings, products } = useStore();
  const [activeSpot, setActiveSpot] = useState(null);

  const bannerImage =
    storeSettings?.lookbook_image ||
    "https://cdn.shopify.com/s/files/1/0826/5053/0110/files/Two_Odd_x_Notice_Aditya_Sinha-1.jpg?v=1788185403&width=1600&format=webp";
  const title = storeSettings?.lookbook_title || "Shop The Look";
  const subtitle = storeSettings?.lookbook_subtitle || "Curated Atmosphere";
  const description =
    storeSettings?.lookbook_text ||
    "Tap the illuminated hotspots on the art arrangement to inspect and add individual conversation objects directly to your bag.";

  const spotsToRender =
    storeSettings?.lookbook_spots &&
    Array.isArray(storeSettings.lookbook_spots) &&
    storeSettings.lookbook_spots.length > 0
      ? storeSettings.lookbook_spots
      : hotspots && Array.isArray(hotspots) && hotspots.length > 0
      ? hotspots
      : LOOKBOOK_SPOTS;

  return (
    <section className="py-16 md:py-24 bg-[#f3f3f3] border-y border-[#e5e3dc] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-500 block mb-1">
              {subtitle}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-[#121212]">
              {title}
            </h2>
          </div>
          <p className="text-xs md:text-sm font-mono text-neutral-600 max-w-md">
            {description}
          </p>
        </div>

        {/* Main Lifestyle Photo Container with interactive Hotspots */}
        <div className="relative w-full aspect-[4/3] md:aspect-[21/9] max-h-[680px] bg-neutral-900 border border-[#e5e3dc] overflow-hidden group">
          <img
            src={bannerImage}
            alt="The Cozy Theory Curated Objects in living space"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />

          {/* Hotspot Pins */}
          {spotsToRender.map((spot, idx) => {
            const matchedProduct = products?.find(
              (p) => String(p.id) === String(spot.productId)
            );
            const productHandle =
              matchedProduct?.handle ||
              spot.handle ||
              String(spot.productTitle || "")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
            const displayTitle = matchedProduct?.title || spot.productTitle || "Artisanal Object";
            const displayPrice = matchedProduct?.price ?? spot.price ?? 0;
            const displayImage =
              (Array.isArray(matchedProduct?.images) && matchedProduct.images[0]) ||
              matchedProduct?.image ||
              spot.image ||
              "";
            const formattedPrice = Number(displayPrice || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            const spotTop = String(spot.top || "50%").includes("%") ? spot.top : `${spot.top}%`;
            const spotLeft = String(spot.left || "50%").includes("%") ? spot.left : `${spot.left}%`;

            return (
              <div
                key={spot.id || idx}
                style={{ top: spotTop, left: spotLeft }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <button
                  type="button"
                  onClick={() => setActiveSpot(activeSpot?.id === spot.id ? null : spot)}
                  className="hotspot-pin w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#121212] text-white border-2 border-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  aria-label={`Inspect ${displayTitle}`}
                >
                  {activeSpot?.id === spot.id ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>

                {/* Popover Product Card */}
                {activeSpot?.id === spot.id && (
                  <div className="absolute top-11 left-1/2 -translate-x-1/2 w-64 md:w-72 bg-[#fffdf8] border border-[#121212] shadow-2xl p-3.5 z-30 animate-in fade-in zoom-in duration-200">
                    <div className="flex gap-3 items-center">
                      <Link
                        href={`/products/${productHandle}`}
                        className="block w-16 h-16 shrink-0 bg-[#faf8f5] border border-[#e5e3dc] overflow-hidden"
                      >
                        <img
                          src={displayImage}
                          alt={displayTitle}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${productHandle}`}
                          className="text-xs font-bold uppercase tracking-tight text-[#121212] hover:text-[#001540] truncate block transition-colors"
                        >
                          {displayTitle}
                        </Link>
                        <p className="text-xs font-mono font-bold text-neutral-800 mt-0.5">
                          Rs. {formattedPrice}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onAddToCart({
                                id: matchedProduct?.id || spot.productId,
                                title: displayTitle,
                                price: parseFloat(String(displayPrice).replace(/,/g, "")) || 0,
                                images: [displayImage],
                              });
                              setActiveSpot(null);
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#001540] hover:bg-[#002266] text-[#fffdf8] text-[10px] font-mono tracking-wider uppercase transition-colors shadow-xs"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add To Bag</span>
                          </button>
                          <Link
                            href={`/products/${productHandle}`}
                            className="text-[10px] font-mono text-neutral-500 hover:text-black uppercase underline"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
