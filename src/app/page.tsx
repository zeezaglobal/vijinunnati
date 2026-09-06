"use client";

import SmoothVideoScroll from "@/components/SmoothVideoScroll";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black">
      {/* 1. Full-screen butter-smooth video scroll intro */}
      <SmoothVideoScroll />

      {/* 2. Seamless continuation section following the video */}
      <section className="relative z-20 bg-zinc-950 border-t border-white/10 px-6 py-24 md:py-36">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono uppercase tracking-wider">
              <span>Overview</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white max-w-3xl leading-tight">
              Designed for impact. Built with Next.js and high-performance animation.
            </h2>
            <p className="text-zinc-400 text-base md:text-xl max-w-2xl mt-2 leading-relaxed">
              Your video scroll animation is fully integrated with canvas frame decoding,
              Retina pixel mapping, and linear inertia damping.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="p-8 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm hover:border-white/20 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-lg mb-6 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                60/120 FPS Rendering
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Scrubbing is driven via canvas requestAnimationFrame with zero dropped frames or browser seeking hiccups.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm hover:border-white/20 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-mono text-lg mb-6 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Lerp Inertia Physics
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Smooth deceleration and momentum tracking ensure mouse wheels and trackpad flicks feel fluid and organic.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm hover:border-white/20 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-mono text-lg mb-6 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Responsive & Retina
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Dynamic aspect-ratio cover automatically scales across mobiles, tablets, MacBooks, and ultra-wide screens.
              </p>
            </div>
          </div>

          {/* Quick Action Footer */}
          <div className="mt-20 pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <Image
                src="/next.svg"
                alt="Next.js"
                width={70}
                height={15}
                className="invert opacity-70"
              />
              <span>• Powered by Next.js 16 App Router</span>
            </div>

            <a
              href="#top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-xs font-mono tracking-wider uppercase text-zinc-400 hover:text-white transition-colors"
            >
              Back to Top ↑
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
