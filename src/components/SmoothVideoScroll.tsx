"use client";

import React, { useEffect, useRef, useCallback } from "react";

const DEFAULT_TOTAL_FRAMES = 145;
const getFramePath = (index: number) =>
  `/frames/frame_${String(index).padStart(4, "0")}.jpg`;

export default function SmoothVideoScroll({
  totalFrames = DEFAULT_TOTAL_FRAMES,
}: {
  totalFrames?: number;
}) {
  const TOTAL_FRAMES = totalFrames;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
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
      if (clamped === lastDrawnFrameRef.current) return;

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
    [drawImageCover, TOTAL_FRAMES]
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
      const lastIndex = lastDrawnFrameRef.current;
      lastDrawnFrameRef.current = -1;
      renderFrame(lastIndex);
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
      handleResize();
      renderFrame(0);
    };

    // 2. Concurrently preload all remaining frames
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      const frameIdx = i - 1;
      img.onload = () => {
        imagesRef.current[frameIdx] = img;
      };
    }
  }, [handleResize, renderFrame, TOTAL_FRAMES]);

  // Resize listener
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Scroll tracking with RAF Lerp loop driving both video frame and text reveal
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
      targetProgressRef.current = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Constant parameters
    const VIDEO_END_PROGRESS = 0.65; // Video completes at 65% scroll
    const TEXT_START_PROGRESS = 0.65; // Text begins fading in at 65% scroll

    const updateMotion = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;

      // Lerp smoothing with 0.08 damping factor
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.08;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = currentProgressRef.current;

      // 1. Scrub video: 0.0 to VIDEO_END_PROGRESS maps to frame 0 -> 144
      const videoRatio = Math.min(p / VIDEO_END_PROGRESS, 1);
      const targetFrame = Math.round(videoRatio * (TOTAL_FRAMES - 1));
      renderFrame(targetFrame);

      // 2. Reveal text: TEXT_START_PROGRESS to 1.0 maps to text opacity 0 -> 1
      const rawTextProgress = Math.max(
        0,
        Math.min(1, (p - TEXT_START_PROGRESS) / (1 - TEXT_START_PROGRESS))
      );

      if (textRef.current) {
        textRef.current.style.opacity = `${rawTextProgress}`;
        textRef.current.style.transform = `translateY(${
          (1 - rawTextProgress) * 24
        }px) scale(${0.96 + rawTextProgress * 0.04})`;
        textRef.current.style.pointerEvents =
          rawTextProgress > 0.7 ? "auto" : "none";
      }

      rafIdRef.current = requestAnimationFrame(updateMotion);
    };

    rafIdRef.current = requestAnimationFrame(updateMotion);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [renderFrame, TOTAL_FRAMES]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380vh] bg-white text-zinc-900"
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-white">
        {/* Hardware Accelerated Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block w-full h-full object-cover pointer-events-none"
        />

        {/* Text revealed on the white page: "Vijin weds Unnati" */}
        <div
          ref={textRef}
          style={{ opacity: 0, transform: "translateY(24px) scale(0.96)" }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none select-none z-10"
        >
          <div className="max-w-4xl flex flex-col items-center">
            {/* Elegant Top Decorative Accent */}
            <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8">
              <div className="h-[1px] w-12 sm:w-20 bg-amber-700/30" />
              <span className="text-[11px] sm:text-xs tracking-[0.35em] uppercase font-sans font-medium text-amber-900/70">
                Together with their families
              </span>
              <div className="h-[1px] w-12 sm:w-20 bg-amber-700/30" />
            </div>

            {/* Main Names: Vijin weds Unnati in romantic wedding script */}
            <h1 className="font-script text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] text-zinc-900 tracking-normal font-normal leading-tight">
              <span className="block text-zinc-950">Vijin</span>
              <span className="block my-1 sm:my-3 text-3xl sm:text-5xl md:text-6xl text-amber-800/85 font-normal">
                weds
              </span>
              <span className="block text-zinc-950">Unnati</span>
            </h1>

            {/* Subtle Divider & Subtitle */}
            <div className="mt-8 sm:mt-12 flex items-center justify-center gap-3">
              <div className="h-[1px] w-10 sm:w-16 bg-zinc-300" />
              <span className="text-xs sm:text-sm tracking-[0.3em] uppercase text-zinc-500 font-sans font-medium">
                Save The Date
              </span>
              <div className="h-[1px] w-10 sm:w-16 bg-zinc-300" />
            </div>

            {/* Scroll Indicator to Celebrations */}
            <a
              href="#events"
              className="mt-6 sm:mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-800/20 bg-amber-50/50 text-xs font-mono tracking-widest uppercase text-amber-900/80 hover:bg-amber-100/60 transition-all pointer-events-auto cursor-pointer shadow-sm"
            >
              <span>Celebration Itinerary</span>
              <span className="animate-bounce">↓</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
