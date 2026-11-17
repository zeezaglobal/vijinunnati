"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface ScheduleItem {
  dayLabel: string;
  title: string;
  time: string;
  venue: string;
  detail: string;
}

interface VenueQR {
  id: string;
  title: string;
  subtitle: string;
  url: string;
}

const ITINERARY_ITEMS: ScheduleItem[] = [
  {
    dayLabel: "FRI • NOV 20",
    title: "Mehendi Ceremony",
    time: "6:00 PM",
    venue: "Bride's Stay",
    detail: "Theme: Green Hues of Henna",
  },
  {
    dayLabel: "SAT • NOV 21",
    title: "Phoolo vali Haldi",
    time: "4:00 PM",
    venue: "Bride's Stay",
    detail: "Theme: Marigold / Sunflower",
  },
  {
    dayLabel: "SUN • NOV 22",
    title: "Vidhi (Marathi Tradition)",
    time: "7:00 AM",
    venue: "Gardenia Convention Center",
    detail: "Dress Code: Maharashtrian Traditional",
  },
  {
    dayLabel: "SUN • NOV 22",
    title: "Vivaham (Kerala Tradition)",
    time: "11:50 AM – 12:20 PM",
    venue: "Gardenia Convention Center",
    detail: "Dress Code: Kerala Traditional",
  },
  {
    dayLabel: "SUN • NOV 22",
    title: "Wedding Reception",
    time: "5:00 PM onwards",
    venue: "Vibes Beach House",
    detail: "Dress Code: Chic Western Glam",
  },
];

const VENUE_QRS: VenueQR[] = [
  {
    id: "bride-residence",
    title: "Bride's Stay",
    subtitle: "Mehendi & Haldi",
    url: "https://maps.app.goo.gl/vcDeJ4tbPdd6YPsU7?g_st=ic",
  },
  {
    id: "gardenia",
    title: "Gardenia Center",
    subtitle: "Vidhi & Vivaham",
    url: "https://maps.google.com/?q=Gardenia+Convention+Center+Njekkadu",
  },
  {
    id: "vibes-beach",
    title: "Vibes Beach House",
    subtitle: "Reception",
    url: "https://maps.app.goo.gl/a9bRgHdQkRk19GPr8?g_st=ic",
  },
];

export default function ItineraryWallpaperCard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const drawWallpaper = async (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;

    // 1. Background (Warm Ivory / Cream gradient)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, "#fdfaf3");
    bgGrad.addColorStop(0.5, "#faf5e8");
    bgGrad.addColorStop(1, "#f3ead6");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Gold Double Frame
    ctx.strokeStyle = "rgba(184, 138, 69, 0.45)";
    ctx.lineWidth = 3;
    ctx.strokeRect(56, 56, width - 112, height - 112);

    ctx.strokeStyle = "rgba(184, 138, 69, 0.22)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(72, 72, width - 144, height - 144);

    // Corner Flourishes
    const drawCornerStar = (x: number, y: number) => {
      ctx.save();
      ctx.fillStyle = "#b88a45";
      ctx.font = "26px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✦", x, y);
      ctx.restore();
    };
    drawCornerStar(56, 56);
    drawCornerStar(width - 56, 56);
    drawCornerStar(56, height - 56);
    drawCornerStar(width - 56, height - 56);

    // 3. Header Section (Clears phone lock-screen clock)
    const headerStartY = 235;

    ctx.save();
    ctx.fillStyle = "#a66a1f";
    ctx.font = "600 20px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    if ("letterSpacing" in ctx) {
      ctx.letterSpacing = "7px";
      ctx.fillText("WEDDING ITINERARY", width / 2 + 3.5, headerStartY);
    } else {
      ctx.fillText("W E D D I N G  I T I N E R A R Y", width / 2, headerStartY);
    }
    ctx.restore();

    // Couple Names
    ctx.save();
    ctx.fillStyle = "#4a2b12";
    ctx.font = "italic 400 78px Georgia, 'Times New Roman', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("Vijin & Unnati", width / 2, headerStartY + 80);
    ctx.restore();

    // Date Range Subtitle
    ctx.save();
    ctx.fillStyle = "#7a4a16";
    ctx.font = "500 22px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    if ("letterSpacing" in ctx) {
      ctx.letterSpacing = "3px";
      ctx.fillText(
        "20 • 21 • 22 NOVEMBER 2026",
        width / 2 + 1.5,
        headerStartY + 128
      );
    } else {
      ctx.fillText("20 • 21 • 22 NOVEMBER 2026", width / 2, headerStartY + 128);
    }
    ctx.restore();

    // 4. Centered Divider with Star
    const divY = headerStartY + 166;
    ctx.save();
    ctx.strokeStyle = "rgba(184, 138, 69, 0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 170, divY);
    ctx.lineTo(width / 2 - 28, divY);
    ctx.moveTo(width / 2 + 28, divY);
    ctx.lineTo(width / 2 + 170, divY);
    ctx.stroke();

    ctx.fillStyle = "#b88a45";
    ctx.font = "24px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦", width / 2, divY + 1);
    ctx.restore();

    // 5. Event Cards (Compact height so QR strip fits cleanly below)
    ctx.textBaseline = "alphabetic";
    let currentY = divY + 38;
    const cardX = 104;
    const cardW = width - 208;
    const cardH = 172;
    const cardGap = 16;

    ITINERARY_ITEMS.forEach((item) => {
      // Card background
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.beginPath();
      ctx.roundRect(cardX, currentY, cardW, cardH, 20);
      ctx.fill();

      // Card border
      ctx.strokeStyle = "rgba(214, 181, 106, 0.55)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Row 1: Day Badge (Left) + Time (Right)
      ctx.textAlign = "left";
      ctx.fillStyle = "#a66a1f";
      ctx.font = "700 18px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText(item.dayLabel, cardX + 32, currentY + 36);

      ctx.textAlign = "right";
      ctx.fillStyle = "#4a2b12";
      ctx.font = "600 21px Georgia, serif";
      ctx.fillText(item.time, cardX + cardW - 32, currentY + 36);

      // Row 2: Event Title
      ctx.textAlign = "left";
      ctx.fillStyle = "#27180b";
      ctx.font = "600 31px Georgia, 'Times New Roman', serif";
      ctx.fillText(item.title, cardX + 32, currentY + 80);

      // Row 3: Venue Location
      ctx.fillStyle = "#7a4a16";
      ctx.font = "600 20px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(`📍 ${item.venue}`, cardX + 32, currentY + 118);

      // Row 4: Theme / Dress Code
      ctx.fillStyle = "#6e563a";
      ctx.font = "400 19px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(item.detail, cardX + 32, currentY + 150);

      currentY += cardH + cardGap;
    });

    // 6. Venue QR Codes Strip (3 Scannable Location QRs)
    const qrSectionY = currentY + 12;
    const qrBoxH = 260;

    // Section container
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.beginPath();
    ctx.roundRect(cardX, qrSectionY, cardW, qrBoxH, 22);
    ctx.fill();

    ctx.strokeStyle = "rgba(184, 138, 69, 0.65)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Section header
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "#a66a1f";
    ctx.font = "700 18px ui-monospace, SFMono-Regular, Menlo, monospace";
    if ("letterSpacing" in ctx) {
      ctx.letterSpacing = "4px";
      ctx.fillText("SCAN FOR GOOGLE MAPS DIRECTIONS", width / 2 + 2, qrSectionY + 34);
    } else {
      ctx.fillText("SCAN FOR GOOGLE MAPS DIRECTIONS", width / 2, qrSectionY + 34);
    }
    ctx.restore();

    // Render all 3 QR canvases in parallel
    const qrSize = 136;
    const colWidth = cardW / 3;

    await Promise.all(
      VENUE_QRS.map(async (venue, index) => {
        const qrCanvas = document.createElement("canvas");
        await QRCode.toCanvas(qrCanvas, venue.url, {
          width: qrSize,
          margin: 1,
          color: {
            dark: "#27180b",
            light: "#ffffff",
          },
          errorCorrectionLevel: "M",
        });

        const centerX = cardX + colWidth * index + colWidth / 2;
        const qrX = centerX - qrSize / 2;
        const qrY = qrSectionY + 50;

        // Subtle frame around each QR code
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12);
        ctx.strokeStyle = "rgba(214, 181, 106, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12);

        ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

        // Venue Title below QR
        ctx.textAlign = "center";
        ctx.fillStyle = "#27180b";
        ctx.font = "700 18px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillText(venue.title, centerX, qrY + qrSize + 28);

        // Event Subtitle below Venue Title
        ctx.fillStyle = "#806b52";
        ctx.font = "500 16px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillText(venue.subtitle, centerX, qrY + qrSize + 50);
      })
    );

    // 7. Footer Note (Clears bottom lock-screen icons)
    ctx.textAlign = "center";
    ctx.fillStyle = "#806b52";
    ctx.font = "italic 23px Georgia, serif";
    ctx.fillText(
      "Two Traditions, One Sacred Bond",
      width / 2,
      height - 102
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawWallpaper(canvas).then(() => {
      setPreviewUrl(canvas.toDataURL("image/png"));
    });
  }, []);

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDownloading(true);
    await drawWallpaper(canvas);

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "Vijin-Unnati-Wedding-Schedule.png";
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setIsDownloading(false), 600);
  };

  return (
    <div
      id="itinerary-wallpaper"
      className="w-full max-w-xl mx-auto mt-6 mb-4 p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-amber-400/20 bg-stone-900/40 backdrop-blur-md text-center shadow-2xl"
    >
      <span className="text-xs font-mono tracking-[0.35em] uppercase text-amber-300/80 block mb-2">
        Pocket Guide &amp; Venues
      </span>
      <h3 className="font-script text-4xl sm:text-6xl text-amber-200 mb-3">
        Save The Schedule
      </h3>
      <p className="text-xs sm:text-sm text-zinc-300 font-light mb-6 max-w-md mx-auto leading-relaxed">
        Download our 3-day itinerary with built-in Google Maps QR codes so
        timings, dress codes, and venue directions are always on your lock
        screen.
      </p>

      {/* Hidden Full-Res Canvas (1080x1920) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Live Phone Wallpaper Preview */}
      {previewUrl && (
        <div className="mx-auto mb-7 w-52 sm:w-60 aspect-[9/16] rounded-[28px] p-1.5 bg-stone-800 border-2 border-amber-400/40 shadow-[0_12px_40px_rgba(0,0,0,0.55)] overflow-hidden">
          <img
            src={previewUrl}
            alt="Vijin and Unnati Wedding Itinerary Phone Wallpaper with Venue QR Codes"
            className="w-full h-full object-cover rounded-[22px]"
          />
        </div>
      )}

      {/* Download Button */}
      <button
        type="button"
        onClick={handleDownload}
        className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-amber-400/80 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm font-sans tracking-widest uppercase transition-all shadow-lg hover:shadow-amber-500/25 active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2.5"
      >
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span>
          {isDownloading ? "Saving Wallpaper..." : "Download Phone Wallpaper"}
        </span>
      </button>

      {/* Quick Venue Google Maps Links (for direct tapping on web) */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-amber-300/80 block mb-3">
          Quick Venue Directions
        </span>
        <div className="flex flex-col gap-2">
          {VENUE_QRS.map((venue) => (
            <a
              key={venue.id}
              href={venue.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-amber-500/15 hover:border-amber-400/40 text-xs font-sans tracking-wide text-zinc-200 hover:text-amber-200 transition-all flex items-center justify-between"
            >
              <span>
                📍 {venue.title}{" "}
                <span className="text-zinc-400">({venue.subtitle})</span>
              </span>
              <span className="text-amber-300 font-mono text-[11px]">
                Map ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}