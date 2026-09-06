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
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

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
  }, [renderFrame, TOTAL_FRAMES]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[450vh] bg-black"
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Hardware Accelerated Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block w-full h-full object-cover pointer-events-none"
        />
      </div>
    </div>
  );
}
