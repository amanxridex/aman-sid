import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "News & Journal | The Cozy Theory",
  description: "Dispatches and stories behind artisanal ceramics, handcrafted textiles, and warm living spaces.",
};

export const BLOG_POSTS = [
  {
    handle: "bring-warmth-home-the-living-philosophy-of-the-cozy-theory",
    title: "Bringing Warmth Home: The Living Philosophy of The Cozy Theory",
    date: "August 24, 2024",
    excerpt: "How deliberate craftsmanship and honest tactile materials transform ordinary rooms into sanctuaries of warmth.",
    image: "https://cdn.shopify.com/s/files/1/0826/5053/0110/files/06_f701ce34-3d80-4167-87f5-e3dd0ec7dc5f.jpg?v=1765797590&width=800",
    readTime: "4 min read",
    author: "The Cozy Theory",
  },
  {
    handle: "the-birth-of-the-cozy-theory-from-concept-to-artisanal-objects",
    title: "The Birth of The Cozy Theory: From Concept to Artisanal Objects",
    date: "July 15, 2024",
    excerpt: "Why we abandoned generic interior mass-production to curate objects for warm living. An interview with our team.",
    image: "https://cdn.shopify.com/s/files/1/0826/5053/0110/files/Two_Odd_x_Notice_Aditya_Sinha-1.jpg?v=1788185403&width=800",
    readTime: "6 min read",
    author: "Editorial Team",
  },
  {
    handle: "overcoming-common-hurdles-when-shopping-for-home-decor-online",
    title: "Overcoming Common Hurdles When Curating Space Online",
    date: "June 28, 2024",
    excerpt: "Scale, tactile density, and architectural placement. How to select focal art pieces that anchor modern rooms.",
    image: "https://cdn.shopify.com/s/files/1/0826/5053/0110/files/YUV0134copy.jpg?v=1764335586&width=800",
    readTime: "5 min read",
    author: "The Cozy Theory",
  },
  {
    handle: "melting-edge-design-that-s-hot-fresh",
    title: "Warm Earth & Glaze: The Organic Tactility of Modern Stoneware",
    date: "May 10, 2024",
    excerpt: "Deconstructing the fluid curves and hand-glazed finishes of our latest ceramic releases.",
    image: "https://cdn.shopify.com/s/files/1/0888/0121/4761/files/Product_79-01.png?v=1784392136",
    readTime: "3 min read",
    author: "The Cozy Theory",
  },
];

import { getBlogPosts, getStoreSettings } from "@/lib/supabase";

export const revalidate = 60; // Revalidate every minute

export default async function BlogNewsPage() {
  const [dbPosts, settings] = await Promise.all([
    getBlogPosts(),
    getStoreSettings(),
  ]);
  const posts = dbPosts && dbPosts.length > 0 ? dbPosts : BLOG_POSTS;

  // Check if Journal has been toggled to hidden by admin
  if (settings?.journal_visible === false) {
    return (
      <div className="bg-[#fffdf8] min-h-screen py-24 px-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-5 font-mono">
          <span className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-neutral-400 block font-bold">
            The Cozy Theory Journal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#121212]">
            Journal Currently In Preparation
          </h1>
          <p className="text-xs text-neutral-600 leading-relaxed font-sans">
            Our editorial dispatches, drop stories, and living philosophy articles are currently being prepared. Check back soon for new dispatches.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#121212] hover:bg-neutral-800 text-white text-xs font-mono uppercase font-bold tracking-wider transition-colors shadow-sm"
            >
              <span>Explore Homeware Archive →</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fffdf8] min-h-screen py-12 md:py-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 pb-8 border-b border-[#e5e3dc]">
          <span className="text-[10px] md:text-xs font-mono tracking-[0.25em] uppercase text-neutral-500 block">
            Journal
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-[#121212]">
            News &amp; Dispatches
          </h1>
          <p className="text-xs md:text-sm font-mono text-neutral-600 max-w-lg mx-auto">
            Design essays, material investigations, and drop backstories directly from our team.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {posts.map((post) => (
            <Link
              key={post.handle}
              href={`/blogs/news/${post.handle}`}
              className="group flex flex-col space-y-4 border border-[#e5e3dc] bg-white p-4 sm:p-6 hover:border-black transition-colors"
            >
              <div className="aspect-[16/10] bg-neutral-900 overflow-hidden relative">
                <img
                  src={post.image || "https://cdn.shopify.com/s/files/1/0826/5053/0110/files/06_f701ce34-3d80-4167-87f5-e3dd0ec7dc5f.jpg?v=1765797590&width=800"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <span>
                      {post.created_at
                        ? new Date(post.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : post.date || "Recent"}
                    </span>
                    <span>{post.read_time || post.readTime || "4 min read"}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#121212] group-hover:underline">
                    {post.title}
                  </h2>
                  <p className="text-xs md:text-sm text-neutral-600 font-normal leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-2 text-xs font-mono uppercase font-bold text-black group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

