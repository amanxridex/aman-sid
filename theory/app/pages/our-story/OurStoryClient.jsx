"use client";

import Link from "next/link";
import { 
  Coffee, 
  Smile, 
  Home, 
  ArrowLeft, 
  ArrowRight,
  Flower2,
  Sun,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { DEFAULT_OUR_STORY } from "@/lib/supabase";
import ScrollColorFrame from "@/components/ScrollColorFrame";

export default function OurStoryClient() {
  const { storeSettings } = useStore();
  const ourStory = storeSettings?.our_story || DEFAULT_OUR_STORY;

  const chapter1Image = ourStory.chapter1_image || DEFAULT_OUR_STORY.chapter1_image;
  const chapter1Title = ourStory.chapter1_title || DEFAULT_OUR_STORY.chapter1_title;
  const chapter1Subtitle = ourStory.chapter1_subtitle || DEFAULT_OUR_STORY.chapter1_subtitle;

  const chapter2Image = ourStory.chapter2_image || DEFAULT_OUR_STORY.chapter2_image;
  const chapter2Title = ourStory.chapter2_title || DEFAULT_OUR_STORY.chapter2_title;
  const chapter2Subtitle = ourStory.chapter2_subtitle || DEFAULT_OUR_STORY.chapter2_subtitle;

  return (
    <div className="bg-[#fffdf8] min-h-screen text-[#121212]">
      {/* Top Breadcrumb & Badge */}
      <div className="border-b border-[#e5e3dc] bg-[#fffdf8]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-neutral-500 hover:text-[#001540] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-neutral-400">
            <span>thecozytheory.in</span>
            <span>•</span>
            <span className="text-[#001540] font-bold">Our Story</span>
          </div>
        </div>
      </div>

      {/* Editorial Hero Header */}
      <div className="border-b border-[#e5e3dc] bg-[#121212] text-[#fffdf8] py-16 md:py-24 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#001540]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 relative z-10">
          <div className="inline-flex items-center px-3 py-1 bg-white/10 text-blue-400 border border-white/10 text-[10px] font-mono uppercase tracking-[0.25em] font-semibold">
            The Cozy Theory Narrative
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tight leading-[0.92]">
            Our Story.
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-neutral-300 font-serif italic max-w-2xl leading-relaxed">
            &ldquo;There was always something comforting about the little things.&rdquo;
          </p>
        </div>
      </div>

      {/* Main Narrative Layout */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24 space-y-20">

        {/* Chapter 1: The Little Things */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#001540] font-bold block">
              {chapter1Subtitle}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#121212] leading-tight">
              {chapter1Title}
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
              <p>
                There was always something comforting about the little things.
              </p>
              <p>
                A favourite cup waiting on the kitchen shelf. A vase catching the afternoon light. A plate brought out when friends stayed a little longer than planned. The small objects that quietly turn a house into a place that feels like yours.
              </p>
              <p className="text-base sm:text-lg font-serif italic text-neutral-900 pt-2 border-l-2 border-[#001540] pl-4">
                The Cozy Theory was born from that feeling.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            {/* Full Natural Color Frame */}
            <ScrollColorFrame
              src={chapter1Image}
              alt={chapter1Title}
              aspectRatio="aspect-[4/5]"
            />
          </div>
        </div>

        {/* Chapter 2: The Philosophy Quote Banner */}
        <div className="p-8 sm:p-12 md:p-16 bg-[#faf8f2] border border-[#e5e3dc] text-center space-y-6 relative">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#e5e3dc] text-[#001540] mx-auto shadow-xs">
            <Home className="w-5 h-5" />
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-neutral-900 leading-snug">
              &ldquo;We believe a home doesn&apos;t have to be perfect to be beautiful. It just needs to feel like you.&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-xl mx-auto font-normal">
              So we curate pieces that bring a little warmth, character, and charm into everyday spaces — from the table where stories are shared to the quiet corners that belong only to you.
            </p>
          </div>
        </div>

        {/* Chapter 3: Three Facets */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#001540] font-bold block">
              Curated With Intention
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#121212]">
              Pieces That Live With You
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-[#e5e3dc] space-y-3 hover:border-[#001540] transition-colors">
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                Playful
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Some pieces are playful — adding delightful character and effortless joy into your daily surroundings.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#e5e3dc] space-y-3 hover:border-[#001540] transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#001540] flex items-center justify-center">
                <Coffee className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                Timeless
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Some are timeless — enduring shapes crafted from honest stoneware clay and classic pottery traditions.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#e5e3dc] space-y-3 hover:border-[#001540] transition-colors">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Smile className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                Joyful
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Some simply make you smile when you walk past them, catching unexpected sunlight in the quiet corners of your room.
              </p>
            </div>
          </div>

          {/* Guiding Thought Card */}
          <div className="p-6 sm:p-8 bg-white border-l-4 border-l-[#001540] border border-[#e5e3dc] space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#001540] font-bold">
              The Guiding Principle
            </div>
            <p className="text-sm sm:text-base font-medium text-neutral-900">
              But each one is chosen with the same thought: <span className="font-extrabold uppercase text-[#001540]">make the everyday feel a little more special.</span>
            </p>
          </div>
        </div>

        {/* Chapter 4: What We Are For */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center pt-8 border-t border-[#e5e3dc]">
          <div className="lg:col-span-5 order-2 lg:order-1">
            {/* Full Natural Color Frame */}
            <ScrollColorFrame
              src={chapter2Image}
              alt={chapter2Title}
              aspectRatio="aspect-[4/5]"
            />
          </div>

          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#001540] font-bold block">
              {chapter2Subtitle}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#121212] leading-tight">
              {chapter2Title}
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
              <p>
                The Cozy Theory is for slow mornings, spontaneous dinners, flowers picked on the way home, beautifully imperfect moments, and all the little details that make a space feel lived in.
              </p>
              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <p className="text-lg sm:text-xl font-serif italic text-neutral-900">
                  &ldquo;Because home isn&apos;t just where you live. It&apos;s where you get to be yourself.&rdquo;
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 bg-neutral-900 text-white font-mono text-xs uppercase tracking-[0.2em] font-bold">
                    Stay Cozy. Stay You.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Footer Banner */}
        <div className="p-8 sm:p-12 bg-[#121212] text-[#fffdf8] border border-neutral-800 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-blue-400">
            <Flower2 className="w-3.5 h-3.5" />
            Join The Sanctuary
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight max-w-xl mx-auto">
            Find Pieces That Feel Like You.
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Discover artisanal ceramics and everyday objects crafted to bring warmth into your home.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-mono">
            <Link
              href="/collections"
              className="px-6 py-3.5 bg-[#001540] text-white hover:bg-[#002266] transition-colors uppercase font-bold tracking-wider inline-flex items-center gap-2"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            {storeSettings?.journal_visible !== false && (
              <Link
                href="/blogs/news"
                className="px-6 py-3.5 bg-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-700 transition-colors uppercase font-bold tracking-wider"
              >
                Read Journal
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
