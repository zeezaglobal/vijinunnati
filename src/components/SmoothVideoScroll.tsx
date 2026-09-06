"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

const TOTAL_FRAMES = 240;
const getFramePath = (index: number) =>
  `/frames/frame_${String(index).padStart(4, "0")}.jpg`;

export default function SmoothVideoScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

  const [loadedCount, setLoadedCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastDrawnFrameRef = useRef<number>(-1);

  // Draw a specific frame image onto the canvas respecting aspect-ratio cover
  const drawImageCover = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate aspect-ratio cover
    const hRatio = canvasWidth / img.naturalWidth;
    const vRatio = canvasHeight / img.naturalHeight;
    const ratio = Math.max(hRatio, vRatio);

    const drawWidth = img.naturalWidth * ratio;
    const drawHeight = img.naturalHeight * ratio;
    const offsetX = (canvasWidth - drawWidth) / 2;
    const offsetY = (canvasHeight - drawHeight) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Render a frame by index, finding nearest loaded frame if current isn't loaded yet
  const renderFrame = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));
      let img = imagesRef.current[clamped];

      // Fallback to nearest loaded frame
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const prev = clamped - offset;
          if (
            prev >= 0 &&
            imagesRef.current[prev] &&
            imagesRef.current[prev]!.complete &&
            imagesRef.current[prev]!.naturalWidth > 0
          ) {
            img = imagesRef.current[prev];
            break;
          }
          const next = clamped + offset;
          if (
            next < TOTAL_FRAMES &&
            imagesRef.current[next] &&
            imagesRef.current[next]!.complete &&
            imagesRef.current[next]!.naturalWidth > 0
          ) {
            img = imagesRef.current[next];
            break;
          }
        }
      }

      if (img && img.complete && img.naturalWidth > 0) {
        drawImageCover(img);
        lastDrawnFrameRef.current = clamped;
      }
    },
    [drawImageCover]
  );

  // Resize canvas according to window size and DPR for ultra-sharp Retina rendering
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    // Redraw current frame on resize
    if (lastDrawnFrameRef.current >= 0) {
      renderFrame(lastDrawnFrameRef.current);
    }
  }, [renderFrame]);

  // Preload frames progressively
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES).fill(null);

    // 1. Immediately load frame 1 for instantaneous visual feedback
    const firstImg = new Image();
    firstImg.src = getFramePath(1);
    firstImg.onload = () => {
      imagesRef.current[0] = firstImg;
      setLoadedCount((c) => c + 1);
      handleResize();
      renderFrame(0);
    };

    // 2. Concurrently preload all remaining frames
    let loaded = 1;
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      const frameIdx = i - 1;
      img.onload = () => {
        imagesRef.current[frameIdx] = img;
        loaded++;
        setLoadedCount(loaded);
      };
      img.onerror = () => {
        loaded++;
        setLoadedCount(loaded);
      };
    }
  }, [handleResize, renderFrame]);

  // Resize listener
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Scroll tracking with RAF Lerp (Linear Interpolation) loop for butter-smooth scrubbing
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollableDistance = rect.height - window.innerHeight;

      if (totalScrollableDistance <= 0) return;

      const progress = Math.min(
        Math.max(-rect.top / totalScrollableDistance, 0),
        1
      );
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // The animation loop continuously lerps currentFrame towards targetFrame
    const updateMotion = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;

      // When difference is noticeable, interpolate smoothly
      if (Math.abs(diff) > 0.02) {
        // Damping factor 0.09 creates that signature Apple silky inertia
        currentFrameRef.current += diff * 0.09;
        renderFrame(Math.round(currentFrameRef.current));
      } else if (
        Math.round(currentFrameRef.current) !==
        Math.round(targetFrameRef.current)
      ) {
        currentFrameRef.current = targetFrameRef.current;
        renderFrame(Math.round(currentFrameRef.current));
      }

      rafIdRef.current = requestAnimationFrame(updateMotion);
    };

    rafIdRef.current = requestAnimationFrame(updateMotion);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [renderFrame]);

  // Helper to scroll smoothly past the video to the main content
  const scrollToContent = () => {
    if (!containerRef.current) return;
    const targetY =
      containerRef.current.offsetTop + containerRef.current.offsetHeight;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const progressPercent = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  // Milestone opacities for overlays
  const getMilestoneOpacity = (
    progress: number,
    start: number,
    peakStart: number,
    peakEnd: number,
    end: number
  ) => {
    if (progress < start || progress > end) return 0;
    if (progress < peakStart) return (progress - start) / (peakStart - start);
    if (progress > peakEnd) return (end - progress) / (end - peakEnd);
    return 1;
  };

  const opacity1 = getMilestoneOpacity(scrollProgress, 0.0, 0.0, 0.12, 0.22);
  const opacity2 = getMilestoneOpacity(scrollProgress, 0.26, 0.35, 0.45, 0.54);
  const opacity3 = getMilestoneOpacity(scrollProgress, 0.58, 0.67, 0.77, 0.86);
  const opacity4 = getMilestoneOpacity(scrollProgress, 0.88, 0.94, 1.0, 1.0);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[450vh] bg-black text-white"
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Hardware Accelerated Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block w-full h-full object-cover pointer-events-none"
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

        {/* Top Floating Nav / Skip Button */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-zinc-300 uppercase">
              Vjinunnati • Interactive Intro
            </span>
          </div>

          <button
            onClick={scrollToContent}
            className="text-xs font-medium tracking-wide uppercase px-4 py-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer text-zinc-200 hover:text-white"
          >
            Skip Intro ↓
          </button>
        </div>

        {/* Text Storyline Overlays */}

        {/* Beat 1: Initial Hero */}
        <div
          style={{
            opacity: opacity1,
            transform: `translateY(${(1 - opacity1) * 20}px)`,
            pointerEvents: opacity1 > 0.2 ? "auto" : "none",
          }}
          className="absolute inset-x-6 flex flex-col items-center justify-center text-center transition-all duration-300 z-10"
        >
          <p className="text-sm md:text-base font-mono tracking-widest uppercase text-emerald-400 mb-3">
            Welcome to the Experience
          </p>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white max-w-4xl drop-shadow-2xl">
            Precision in Motion.
          </h1>
          <p className="text-zinc-300 text-sm md:text-lg mt-4 max-w-xl">
            Scroll smoothly down to explore the journey and unveil what lies ahead.
          </p>
          <div className="mt-8 flex flex-col items-center gap-2">
            <span className="text-xs tracking-widest uppercase font-mono text-zinc-400">
              Scroll to explore
            </span>
            <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center p-1">
              <div className="w-1.5 h-2 bg-white rounded-full animate-bounce" />
            </div>
          </div>
        </div>

        {/* Beat 2: Feature Highlight 1 */}
        <div
          style={{
            opacity: opacity2,
            transform: `translateY(${(1 - opacity2) * 20}px)`,
            pointerEvents: opacity2 > 0.2 ? "auto" : "none",
          }}
          className="absolute inset-x-8 md:inset-x-24 flex flex-col items-start justify-center max-w-2xl transition-all duration-300 z-10"
        >
          <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase mb-2">
            Chapter 01 • Architecture
          </span>
          <h2 className="text-3xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Crafted for Unmatched Speed.
          </h2>
          <p className="text-zinc-300 text-sm md:text-lg mt-4 leading-relaxed">
            Every frame decoded and rendered in synchrony with your fingertips.
            Engineered with zero compromises on performance.
          </p>
        </div>

        {/* Beat 3: Feature Highlight 2 */}
        <div
          style={{
            opacity: opacity3,
            transform: `translateY(${(1 - opacity3) * 20}px)`,
            pointerEvents: opacity3 > 0.2 ? "auto" : "none",
          }}
          className="absolute inset-x-8 md:inset-x-24 flex flex-col items-end text-right justify-center max-w-2xl ml-auto transition-all duration-300 z-10"
        >
          <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase mb-2">
            Chapter 02 • Seamless Flow
          </span>
          <h2 className="text-3xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Fluid Interactive Canvas.
          </h2>
          <p className="text-zinc-300 text-sm md:text-lg mt-4 leading-relaxed">
            Dynamic viewport scaling, Retina pixel mapping, and inertia damping
            harmonize to create a responsive storytelling journey.
          </p>
        </div>

        {/* Beat 4: Finale & CTA */}
        <div
          style={{
            opacity: opacity4,
            transform: `translateY(${(1 - opacity4) * 20}px)`,
            pointerEvents: opacity4 > 0.2 ? "auto" : "none",
          }}
          className="absolute inset-x-6 flex flex-col items-center justify-center text-center transition-all duration-300 z-10"
        >
          <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase mb-2">
            Ready to Begin
          </span>
          <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tight">
            Step Into the Next Chapter.
          </h2>
          <p className="text-zinc-300 text-sm md:text-lg mt-4 max-w-xl">
            Continue scrolling down to explore features, documentation, and the
            ecosystem.
          </p>
          <button
            onClick={scrollToContent}
            className="mt-8 px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all shadow-xl hover:scale-105 cursor-pointer"
          >
            Enter Website ↓
          </button>
        </div>

        {/* Bottom Status Bar with Preload & Scroll Progress */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
          {/* Scroll Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="w-28 md:w-44 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-75 ease-out"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>

          {/* Preload status pill (fades away when 100% loaded) */}
          <div
            className={`transition-opacity duration-700 ${
              progressPercent >= 100 ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[11px] font-mono text-zinc-400 backdrop-blur-md">
              Caching assets: {progressPercent}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
