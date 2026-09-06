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
  const currentTargetFrameRef = useRef(0);
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
    if (canvasWidth === 0 || canvasHeight === 0 || img.naturalWidth === 0 || img.naturalHeight === 0) return;

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
      let actualDrawnIndex = clamped;

      // Fallback to nearest loaded frame
      if (!img || !img.complete || img.naturalWidth === 0) {
        let found = false;
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const prev = clamped - offset;
          if (
            prev >= 0 &&
            imagesRef.current[prev] &&
            imagesRef.current[prev]!.complete &&
            imagesRef.current[prev]!.naturalWidth > 0
          ) {
            img = imagesRef.current[prev];
            actualDrawnIndex = prev;
            found = true;
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
            actualDrawnIndex = next;
            found = true;
            break;
          }
        }
        if (!found) return;
      }

      if (img && img.complete && img.naturalWidth > 0) {
        if (actualDrawnIndex === lastDrawnFrameRef.current) return;
        drawImageCover(img);
        lastDrawnFrameRef.current = actualDrawnIndex;
      }
    },
    [drawImageCover, TOTAL_FRAMES]
  );

  // Resize canvas according to container size and DPR for ultra-sharp Retina rendering
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const parent = canvas.parentElement;
    const width = (parent && parent.clientWidth > 0) ? parent.clientWidth : window.innerWidth;
    const height = (parent && parent.clientHeight > 0) ? parent.clientHeight : window.innerHeight;

    if (width === 0 || height === 0) return;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Redraw current frame on resize
    if (lastDrawnFrameRef.current >= 0) {
      const lastIndex = lastDrawnFrameRef.current;
      lastDrawnFrameRef.current = -1;
      renderFrame(lastIndex);
    } else {
      renderFrame(0);
    }
  }, [renderFrame]);

  // Preload frames progressively in small controlled batches for rapid mobile streaming
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES).fill(null);

    // 1. Immediately load frame 1 for instant visual display
    const firstImg = new Image();
    firstImg.onload = () => {
      imagesRef.current[0] = firstImg;
      handleResize();
      renderFrame(0);
    };
    firstImg.src = getFramePath(1);
    if (firstImg.complete && firstImg.naturalWidth > 0) {
      imagesRef.current[0] = firstImg;
      handleResize();
      renderFrame(0);
    }

    // 2. Preload remaining frames in batches of 8 so mobile Wi-Fi doesn't stall
    let nextIdxToLoad = 2;
    const BATCH_SIZE = 8;

    const loadNextBatch = () => {
      if (nextIdxToLoad > TOTAL_FRAMES) return;
      const start = nextIdxToLoad;
      const end = Math.min(start + BATCH_SIZE - 1, TOTAL_FRAMES);
      nextIdxToLoad = end + 1;

      for (let i = start; i <= end; i++) {
        const img = new Image();
        const frameIdx = i - 1;
        img.onload = () => {
          imagesRef.current[frameIdx] = img;
          // If this frame matches where the user is currently scrolled, redraw immediately
          if (Math.abs(frameIdx - currentTargetFrameRef.current) <= 2) {
            renderFrame(currentTargetFrameRef.current);
          }
        };
        img.src = getFramePath(i);
        if (img.complete && img.naturalWidth > 0) {
          imagesRef.current[frameIdx] = img;
        }
      }

      // Schedule next batch swiftly
      if (nextIdxToLoad <= TOTAL_FRAMES) {
        setTimeout(loadNextBatch, 40);
      }
    };

    // Begin batch preloading
    loadNextBatch();
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
      const container = containerRef.current;
      const containerHeight = container.offsetHeight || container.clientHeight;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const totalScrollableDistance = containerHeight - windowHeight;

      if (totalScrollableDistance <= 0) return;

      const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const containerTop = container.offsetTop || 0;
      const scrolled = scrollTop - containerTop;

      const progress = Math.min(
        Math.max(scrolled / totalScrollableDistance, 0),
        1
      );
      targetProgressRef.current = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });
    handleScroll();

    // Constant parameters
    const VIDEO_END_PROGRESS = 0.65; // Video completes at 65% scroll
    const TEXT_START_PROGRESS = 0.65; // Text begins fading in at 65% scroll

    const updateMotion = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;

      // Responsive lerp: fast follow on touch, smooth settle
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.2;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = currentProgressRef.current;

      // 1. Scrub video: 0.0 to VIDEO_END_PROGRESS maps to frame 0 -> 144
      const videoRatio = Math.min(p / VIDEO_END_PROGRESS, 1);
      const targetFrame = Math.round(videoRatio * (TOTAL_FRAMES - 1));
      currentTargetFrameRef.current = targetFrame;
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
      window.removeEventListener("touchmove", handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [renderFrame, TOTAL_FRAMES]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380vh] bg-white text-zinc-900"
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden flex items-center justify-center bg-white">
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
