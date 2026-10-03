import { NOTICE_PRODUCTS } from "@/lib/products";
import { getProducts } from "@/lib/supabase";
import CollectionClient from "./CollectionClient";

export async function generateStaticParams() {
  const collectionHandles = [
    "all",
    "all-products",
    "everyday-ceramics",
    "tableware",
    "serveware",
    "vases-planters",
    "vases",
    "decorative-objects",
    "decor",
    "candles-holders",
    "candles",
    "home-linen",
    "bedding",
    "merry-bright",
    "festive",
    "blue-pottery",
    "storage-solutions",
    "year-round",
    "new-arrivals",
    "latest-collection",
    "bestsellers",
    "shop",
  ];

  return collectionHandles.map((handle) => ({
    handle,
  }));
}

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const titleFormatted = handle
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${titleFormatted} | The Cozy Theory`,
    description: `Browse ${titleFormatted} collection by The Cozy Theory. Curated artisanal homeware, everyday ceramics, and textiles.`,
  };
}

export default async function CollectionPage({ params }) {
  const { handle } = await params;
  const { products } = await getProducts({ limit: 1000 });
  return <CollectionClient handle={handle} allProducts={products || NOTICE_PRODUCTS} />;
}
