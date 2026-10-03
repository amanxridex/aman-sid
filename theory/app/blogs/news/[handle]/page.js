import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BLOG_POSTS } from "../page";
import { getBlogPostByHandle, getBlogPosts, getStoreSettings } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const dbPost = await getBlogPostByHandle(handle);
  const post = dbPost || BLOG_POSTS.find((p) => p.handle === handle);
  if (!post) return { title: "Article Not Found | The Cozy Theory" };
  return {
    title: `${post.title} | The Cozy Theory Journal`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }) {
  const { handle } = await params;
  const [dbPost, settings] = await Promise.all([
    getBlogPostByHandle(handle),
    getStoreSettings(),
  ]);

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
            Our editorial dispatches and articles are currently being prepared. Check back soon.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#121212] hover:bg-neutral-800 text-white text-xs font-mono uppercase font-bold tracking-wider transition-colors shadow-sm"
            >
              <span>Return to Store →</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const post = dbPost || BLOG_POSTS.find((p) => p.handle === handle);

  if (!post) {
    notFound();
  }

  const formattedDate = post.created_at
    ? new Date(post.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : post.date || "Recent";

  // Split content by paragraphs if text
  const paragraphs = post.content ? post.content.split("\n\n").filter(Boolean) : [];

  return (
    <article className="bg-[#fffdf8] min-h-screen py-12 md:py-20">
      <div className="max-w-[900px] mx-auto px-4 md:px-8 space-y-10">
        
        {/* Back Link */}
        <Link
          href="/blogs/news"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase text-neutral-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4 pb-6 border-b border-[#e5e3dc]">
          <div className="flex items-center gap-3 text-xs font-mono text-neutral-500">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{post.read_time || post.readTime || "4 min read"}</span>
            <span>•</span>
            <span className="text-black font-semibold">{post.author || "Derick Martin"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-[#121212] leading-[1.05]">
            {post.title}
          </h1>
        </div>

        {/* Featured Image */}
        <div className="aspect-[16/9] bg-neutral-900 border border-[#e5e3dc] overflow-hidden">
          <img
            src={post.image || "https://cdn.shopify.com/s/files/1/0826/5053/0110/files/06_f701ce34-3d80-4167-87f5-e3dd0ec7dc5f.jpg?v=1765797590&width=800"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Copy */}
        <div className="text-sm md:text-base leading-relaxed space-y-6 text-neutral-800 font-normal">
          {post.excerpt && (
            <p className="text-base md:text-lg font-medium text-neutral-900 leading-relaxed border-l-2 border-black pl-4 py-1 italic">
              {post.excerpt}
            </p>
          )}

          {paragraphs.length > 0 ? (
            paragraphs.map((p, idx) => (
              <p key={idx} className="leading-relaxed whitespace-pre-line">
                {p}
              </p>
            ))
          ) : (
            <>
              <p>
                When we first began exploring the industrial topography of Mumbai, we noticed how physical forms shape our subconscious memory of place. The Marine Drive tetrapods, cast in thousands of tons of concrete, resist the Arabian Sea&apos;s relentless monsoon swells. They do not bend; they absorb and disperse energy.
              </p>
              <p>
                Bringing this brutalist architectural principle into interior spaces was an exercise in tactile balance. We downscaled the geometry into hand-poured concrete and solid milled brass, preserving the brutalist honesty of the original maritime design while turning it into an undeniable tabletop monolith.
              </p>
              <blockquote className="p-6 bg-[#f7f5ef] border-l-4 border-[#121212] font-mono text-xs md:text-sm text-neutral-700 italic">
                &ldquo;An object in your living room should not seek approval. It should stand with authority and invite conversation.&rdquo;
              </blockquote>
              <p>
                Each piece is individually numbered and finished with archival coatings to ensure it endures the test of time, collecting its own unique patina and history in your gallery space.
              </p>
            </>
          )}
        </div>

        {/* Article Footer CTA */}
        <div className="pt-10 border-t border-[#e5e3dc] flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            href="/collections/all-products"
            className="px-6 py-3.5 bg-[#121212] text-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            Explore Related Objects →
          </Link>
          <Link
            href="/blogs/news"
            className="text-xs font-mono uppercase underline hover:text-neutral-500"
          >
            Read More Dispatches
          </Link>
        </div>

      </div>
    </article>
  );
}
