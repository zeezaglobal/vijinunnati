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
  const scratchCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isScratchComplete, setIsScratchComplete] = useState(false);

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
    if (
      canvasWidth === 0 ||
      canvasHeight === 0 ||
      img.naturalWidth === 0 ||
      img.naturalHeight === 0
    )
      return;

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
    const width =
      parent && parent.clientWidth > 0 ? parent.clientWidth : window.innerWidth;
    const height =
      parent && parent.clientHeight > 0
        ? parent.clientHeight
        : window.innerHeight;

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
        Math.min(
          1,
          (progress - TEXT_START_PROGRESS) / (1 - TEXT_START_PROGRESS)
        )
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

  const ScratchCard = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawingRef = useRef(false);
    const scratchedPixelsRef = useRef(0);

    const setupCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(dpr, dpr);

      // Scratch surface
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);

      gradient.addColorStop(0, "#D4AF55");
      gradient.addColorStop(0.5, "#F3D98B");
      gradient.addColorStop(1, "#B88A32");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Text on scratch surface
      ctx.fillStyle = "#6B4615";
      ctx.font = "600 11px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "2px";

      ctx.fillText("SCRATCH TO REVEAL", rect.width / 2, rect.height / 2);
    }, []);

    useEffect(() => {
      setupCanvas();

      window.addEventListener("resize", setupCanvas);

      return () => {
        window.removeEventListener("resize", setupCanvas);
      };
    }, [setupCanvas]);

    const scratch = (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.globalCompositeOperation = "destination-out";

      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      scratchedPixelsRef.current += 1;

      // Reveal after enough scratching
      if (scratchedPixelsRef.current > 35) {
        setIsScratchComplete(true);
      }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      isDrawingRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);

      scratch(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return;

      scratch(e.clientX, e.clientY);
    };

    const handlePointerUp = () => {
      isDrawingRef.current = false;
    };

    return (
      <div className="relative mt-4 w-[230px] sm:w-[260px] h-[70px] sm:h-[78px]">
        {/* Date underneath */}
        <div
          className="
            absolute
            inset-0
            flex
            flex-col
            items-center
            justify-center
            rounded-xl
            border
            border-[#D6B56A]
            bg-[#FFF8E7]
            shadow-[0_4px_15px_rgba(0,0,0,0.2)]
          "
        >
          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.35em]
              text-[#80602D]
              font-sans
              mb-1
            "
          >
            Our Wedding Date
          </span>

          <span
            className="
              font-serif
              text-2xl
              sm:text-3xl
              tracking-[0.15em]
              font-semibold
              text-[#6B3F12]
            "
          >
            22 · 11 · 2026
          </span>
        </div>

        {/* Scratch surface */}
        {!isScratchComplete && (
          <canvas
            ref={canvasRef}
            className="
              absolute
              inset-0
              w-full
              h-full
              rounded-xl
              cursor-pointer
              touch-none
            "
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        )}
      </div>
    );
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`relative w-full h-screen h-[100dvh] bg-[#f3e6d2] text-white overflow-hidden flex items-center justify-center select-none ${
        !isCompleted ? "cursor-pointer" : ""
      }`}
    >
      {/* =========================================================
          FRAME VIDEO CANVAS
      ========================================================= */}
      <canvas
        ref={canvasRef}
        className="
          absolute
          inset-0
          block
          w-full
          h-full
          object-cover
          pointer-events-none
          z-0
        "
      />

      {/* =========================================================
          TAP TO OPEN INVITATION
      ========================================================= */}
      {!isPlaying && !isCompleted && (
        <div
          className="
            absolute
            z-20
            bottom-12
            left-1/2
            -translate-x-1/2
            flex
            flex-col
            items-center
            gap-2
            animate-pulse
            pointer-events-none
          "
        >
          <div
            className="
              px-5
              py-2.5
              rounded-full
              bg-black/60
              backdrop-blur-md
              border
              border-white/20
              text-white
              text-xs
              sm:text-sm
              font-sans
              tracking-widest
              uppercase
              shadow-lg
              flex
              items-center
              gap-2
            "
          >
            <span>Tap to open invitation</span>

            <span className="text-amber-300">✨</span>
          </div>
        </div>
      )}

      {/* =========================================================
          INVITATION REVEAL
      ========================================================= */}
      <div
  ref={textRef}
  style={{
    opacity: 0,
    transform: "translateY(24px) scale(0.96)",
  }}
  className="
    absolute
    inset-0
    flex
    items-center
    justify-center
    px-5
    py-10
    pointer-events-none
    z-10
    overflow-hidden
  "
>
        {/* =======================================================
            HD INVITATION BACKGROUND
        ======================================================= */}
        <div className="absolute inset-0 z-0">
          <NextImage
            src="/6.png"
            alt="Wedding Invitation"
            fill
            priority
            sizes="100vw"
            className="
              object-cover
              object-center
            "
          />

          {/* Very subtle warm overlay */}
          <div
            className="
              absolute
              inset-0
              bg-[#f4e7d2]/[0.03]
            "
          />
        </div>

        {/* =======================================================
            INVITATION CONTENT
        ======================================================= */}
        <div
          className="
            relative
            z-10
            w-full
            max-w-2xl
            flex
            flex-col
            items-center
            text-center
          "
        >
          {/* =====================================================
              TOP DECORATIVE ACCENT
          ===================================================== */}
          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              mb-3
              sm:mb-4
            "
          >
            <div
              className="
                h-px
                w-8
                sm:w-14
                bg-[#9a703f]/50
              "
            />

            <span
              className="
                text-[9px]
                sm:text-[11px]
                tracking-[0.28em]
                uppercase
                font-sans
                font-medium
                text-[#76532f]
              "
            >
              Together with their families
            </span>

            <div
              className="
                h-px
                w-8
                sm:w-14
                bg-[#9a703f]/50
              "
            />
          </div>

          {/* =====================================================
              COUPLE NAMES
          ===================================================== */}
          <h1
            className="
              font-script
              text-[3.2rem]
              sm:text-6xl
              md:text-7xl
              lg:text-8xl
              font-normal
              leading-none
              tracking-normal
              text-[#754b29]
            "
            style={{
              textShadow: `
                0 1px 1px rgba(255,255,255,0.85),
                0 2px 5px rgba(120,80,40,0.12)
              `,
            }}
          >
            <span className="inline-block">Vijin</span>

            <span
              className="
                inline-block
                mx-2
                sm:mx-4
                text-xl
                sm:text-3xl
                md:text-4xl
                text-[#a8783f]
                font-serif
                italic
                align-middle
              "
            >
              weds
            </span>

            <span className="inline-block">Unnati</span>
          </h1>

          {/* =====================================================
              INVITATION MESSAGE
          ===================================================== */}
          <p
            className="
              max-w-md
              px-3
              font-serif
              text-sm
              sm:text-base
              md:text-lg
              leading-relaxed
              text-[#76552f]
            "
            style={{
              textShadow: "0 1px 2px rgba(255,255,255,0.7)",
            }}
          >
            With joy in our hearts and blessings from our families, we invite
            you to celebrate our beautiful journey together.
          </p>

          {/* =====================================================
              SAVE THE DATE
          ===================================================== */}
          <div className="mt-5 sm:mt-6">
            <span
              className="
                text-[9px]
                sm:text-xs
                tracking-[0.32em]
                uppercase
                text-[#8b6237]
                font-sans
                font-semibold
              "
            >
              Save The Date
            </span>
          </div>

          {/* =====================================================
              SCRATCH CARD
          ===================================================== */}
          <div className="mt-4">
            <ScratchCard />
          </div>

          {/* =====================================================
              CELEBRATION ITINERARY
          ===================================================== */}
          <a
            href="#events"
            onClick={(e) => e.stopPropagation()}
            className="
              mt-4
              inline-flex
              items-center
              gap-2
              px-4
              py-1.5
              rounded-full
              border
              border-[#9b7142]/50
              bg-[#f7ead7]/50
              backdrop-blur-sm
              text-[9px]
              sm:text-xs
              font-mono
              tracking-[0.18em]
              uppercase
              text-[#76532f]
              hover:bg-[#f7ead7]/80
              hover:text-[#5f3d20]
              transition-all
              pointer-events-auto
              cursor-pointer
              shadow-sm
            "
          >
            <span>Celebration Itinerary</span>

            <span className="animate-bounce">↓</span>
          </a>
        </div>
      </div>
    </div>
  );
}
