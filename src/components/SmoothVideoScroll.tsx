"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import NextImage from "next/image";

const DEFAULT_TOTAL_FRAMES = 145;
const getFramePath = (index: number) =>
  `/frames/frame_${String(index).padStart(4, "0")}.jpg`;

export default function SmoothVideoScroll({
  totalFrames = DEFAULT_TOTAL_FRAMES,
}: {
  totalFrames?: number;
}) {
  const TOTAL_FRAMES = totalFrames;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

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
    const firstImg = new window.Image();
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
        const img = new window.Image();
        const frameIdx = i - 1;
        img.onload = () => {
          imagesRef.current[frameIdx] = img;
          if (Math.abs(frameIdx - Math.floor(currentFrameRef.current)) <= 2) {
            renderFrame(Math.floor(currentFrameRef.current));
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

  // Play animation on click
  const handleContainerClick = useCallback(() => {
    if (isPlaying || isCompleted) return;

    setIsPlaying(true);

    const startTime = performance.now();
    const duration = 2800; // Duration in ms to play from frame 0 to end (2.8s)
    const VIDEO_END_FRAME = TOTAL_FRAMES - 1;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Frame scrubbing up to progress = 1.0
      const targetFrame = Math.min(
        Math.floor(progress * TOTAL_FRAMES),
        VIDEO_END_FRAME
      );
      currentFrameRef.current = targetFrame;
      renderFrame(targetFrame);

      // Text reveal during final 35% of animation
      const TEXT_START_PROGRESS = 0.65;
      const textProgress = Math.max(
        0,
        Math.min(1, (progress - TEXT_START_PROGRESS) / (1 - TEXT_START_PROGRESS))
      );

      if (textRef.current) {
        textRef.current.style.opacity = `${textProgress}`;
        textRef.current.style.transform = `translateY(${
          (1 - textProgress) * 24
        }px) scale(${0.96 + textProgress * 0.04})`;
        textRef.current.style.pointerEvents =
          textProgress > 0.7 ? "auto" : "none";
      }

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
        setIsCompleted(true);
      }
    };

    rafIdRef.current = requestAnimationFrame(animate);
  }, [isPlaying, isCompleted, renderFrame, TOTAL_FRAMES]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <div
      onClick={handleContainerClick}
      className={`relative w-full h-screen h-[100dvh] bg-black text-white overflow-hidden flex items-center justify-center select-none ${
        !isCompleted ? "cursor-pointer" : ""
      }`}
    >
      {/* Hardware Accelerated Canvas for frame video playback */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full object-cover pointer-events-none z-0"
      />

      {/* Tap/Click to Play prompt overlay before click */}
      {!isPlaying && !isCompleted && (
        <div className="absolute z-20 bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse pointer-events-none">
          <div className="px-5 py-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-sans tracking-widest uppercase shadow-lg flex items-center gap-2">
            <span>Tap to open invitation</span>
            <span className="text-amber-300">✨</span>
          </div>
        </div>
      )}

      {/* Text Revealed Overlay with 5.PNG as background */}
      <div
        ref={textRef}
        style={{ opacity: 0, transform: "translateY(24px) scale(0.96)" }}
        className="absolute inset-0 flex flex-col items-center justify-start pt-48 sm:pt-64 pb-6 px-6 pointer-events-none z-10 overflow-hidden"
      >
        {/* Background photo 5.PNG */}
        <div className="absolute inset-0 z-0">
          <NextImage
            src="/5.PNG"
            alt="Vijin and Unnati"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Text fitted inside the top black space above the couple */}
        <div className="relative z-10 max-w-xl w-full flex flex-col items-center text-center">
          {/* Top Decorative Accent */}
          <div className="flex items-center justify-center gap-3 mb-2 sm:mb-3">
            <div className="h-[1px] w-8 sm:w-12 bg-amber-300/40" />
            <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase font-sans font-medium text-amber-300">
              Together with their families
            </span>
            <div className="h-[1px] w-8 sm:w-12 bg-amber-300/40" />
          </div>

          {/* Main Names: Vijin weds Unnati */}
          <h1 className="font-script text-5xl sm:text-7xl md:text-8xl text-white tracking-normal font-normal leading-none">
            <span className="inline-block text-white">Vijin</span>
            <span className="inline-block mx-2 sm:mx-4 text-2xl sm:text-4xl text-amber-200/90 font-normal">
              weds
            </span>
            <span className="inline-block text-white">Unnati</span>
          </h1>

          {/* Subtitle & Scroll Button fitted cleanly */}
          <div className="mt-3 sm:mt-4 flex flex-col items-center gap-3">
            <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-amber-200/80 font-sans font-medium">
              Save The Date
            </span>

            <a
              href="#events"
              className="mt-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-black/40 backdrop-blur-md text-[10px] sm:text-xs font-mono tracking-widest uppercase text-amber-200 hover:text-white hover:bg-black/60 transition-all pointer-events-auto cursor-pointer shadow-lg"
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
