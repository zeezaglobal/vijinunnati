"use client";

import React from "react";
import Image from "next/image";

interface EventDetail {
  id: string;
  tag: string;
  title: string;
  scriptAccent: string;
  date: string;
  day: string;
  time?: string;
  theme?: string;
  venue?: string;
  dressCode?: string;
  image: string;
  badgeColor: string;
  accentColor: string;
}

const EVENTS: EventDetail[] = [
  {
    id: "mehendi",
    tag: "Celebration 01",
    scriptAccent: "Celebration of Henna & Joy",
    title: "Mehendi Ceremony",
    date: "20th November",
    day: "Friday",
    theme: "Green Hues of Henna",
    image: "/1.jpeg",
    badgeColor: "bg-emerald-950/60 border-emerald-500/40 text-emerald-300",
    accentColor: "text-emerald-300",
  },
  {
    id: "haldi",
    tag: "Celebration 02",
    scriptAccent: "Sun-kissed Petals & Blessings",
    title: "Phoolo vali Haldi",
    date: "21st November",
    day: "Saturday",
    theme: "Marigold / Sunflower",
    image: "/2.jpeg",
    badgeColor: "bg-amber-950/60 border-amber-500/40 text-amber-300",
    accentColor: "text-amber-300",
  },
  {
    id: "ceremonies",
    tag: "The Sacred Auspicious Day",
    scriptAccent: "Two Cultures, One Sacred Bond",
    title: "Vidhi & Vivaham",
    date: "22nd November",
    day: "Sunday",
    image: "/3.jpeg",
    badgeColor: "bg-rose-950/60 border-rose-500/40 text-rose-300",
    accentColor: "text-rose-300",
  },
  {
    id: "reception",
    tag: "The Grand Finale",
    scriptAccent: "An Evening of Elegance & Toasts",
    title: "Wedding Reception",
    date: "22nd November",
    day: "Sunday",
    time: "5:00 PM onwards",
    dressCode: "Glow in chic western glam",
    image: "/4.jpeg",
    badgeColor: "bg-indigo-950/60 border-indigo-500/40 text-indigo-300",
    accentColor: "text-amber-300",
  },
];

export default function WeddingEvents() {
  const googleMapsUrl =
    "https://www.google.com/maps/search/?api=1&query=Gardenia+Convention+Center+Njekkadu";

  return (
    <div id="events" className="relative w-full bg-zinc-950 text-white">
      {/* Introduction Transition Banner */}
      <section className="relative py-28 sm:py-36 px-6 bg-gradient-to-b from-white via-stone-100 to-stone-900 text-zinc-900 text-center flex flex-col items-center justify-center overflow-hidden">
        {/* Subtle Decorative Mandala Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <svg className="w-[600px] h-[600px]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M50,5 L50,95 M5,50 L95,50 M18,18 L82,82 M18,82 L82,18" stroke="currentColor" strokeWidth="0.25" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <p className="font-script text-3xl sm:text-5xl text-amber-800/90 mb-2">
            With the blessings of our elders
          </p>
          <div className="flex items-center gap-3 my-4">
            <div className="h-[1px] w-12 bg-amber-700/40" />
            <span className="text-xs sm:text-sm font-sans tracking-[0.4em] uppercase text-zinc-600 font-medium">
              Wedding Itinerary
            </span>
            <div className="h-[1px] w-12 bg-amber-700/40" />
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-zinc-900 font-normal tracking-tight mt-2 leading-tight">
            Celebration of Love & Traditions
          </h2>
          <p className="mt-6 text-zinc-600 text-sm sm:text-base md:text-lg max-w-xl font-light leading-relaxed">
            We cordially invite you to share our joy as two families and traditions unite.
            Please grace our special moments with your presence and warm blessings.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs font-mono tracking-widest uppercase text-zinc-500">
            <span className="px-4 py-2 rounded-full border border-zinc-300 bg-white/80 shadow-sm">
              Nov 20 • Mehendi
            </span>
            <span className="px-4 py-2 rounded-full border border-zinc-300 bg-white/80 shadow-sm">
              Nov 21 • Haldi
            </span>
            <span className="px-4 py-2 rounded-full border border-zinc-300 bg-white/80 shadow-sm">
              Nov 22 • Wedding & Reception
            </span>
          </div>
        </div>
      </section>

      {/* 1. MEHENDI (Photo 1) */}
      <section className="relative min-h-screen w-full flex items-center justify-center py-20 px-6 overflow-hidden">
        {/* Fullscreen Photo Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/1.jpeg"
            alt="Vijin and Unnati - Mehendi"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105 filter brightness-90"
          />
          {/* Film Grain & Cinematic Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-stone-950/70" />
        </div>

        {/* Floating Glass Card */}
        <div className="relative z-10 max-w-2xl w-full mx-auto p-8 sm:p-12 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between gap-4 mb-6">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest bg-white/10 border border-white/20 text-emerald-300">
              {EVENTS[0].tag}
            </span>
            <span className="text-xs sm:text-sm font-serif tracking-widest text-zinc-300 uppercase">
              {EVENTS[0].day}
            </span>
          </div>

          <p className="font-script text-3xl sm:text-4xl text-amber-200 font-normal mb-1">
            {EVENTS[0].scriptAccent}
          </p>

          <h3 className="text-4xl sm:text-6xl font-serif font-medium text-white tracking-tight mt-2 mb-6">
            {EVENTS[0].title}
          </h3>

          <div className="h-[1px] w-full bg-white/15 my-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Date */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-emerald-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-mono text-zinc-400">Date</p>
                <p className="text-base sm:text-lg font-serif font-medium text-white">{EVENTS[0].date}</p>
                <p className="text-xs text-zinc-400">{EVENTS[0].day}</p>
              </div>
            </div>

            {/* Theme */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-emerald-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4 5 5 0 015-5 4 4 0 014 4 4 4 0 01-5 5zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-mono text-zinc-400">Theme</p>
                <p className="text-base sm:text-lg font-serif font-medium text-emerald-300">{EVENTS[0].theme}</p>
                <p className="text-xs text-zinc-400">Embrace the vibrant greens</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PHOOLO VALI HALDI (Photo 2) */}
      <section className="relative min-h-screen w-full flex items-center justify-center py-20 px-6 overflow-hidden">
        {/* Fullscreen Photo Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/2.jpeg"
            alt="Vijin and Unnati - Haldi"
            fill
            sizes="100vw"
            className="object-cover object-center filter brightness-95"
          />
          {/* Warm Amber Haldi Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/60 to-stone-950/75" />
          <div className="absolute inset-0 bg-amber-950/30 mix-blend-overlay" />
        </div>

        {/* Floating Glass Card */}
        <div className="relative z-10 max-w-2xl w-full mx-auto p-8 sm:p-12 rounded-3xl bg-black/45 backdrop-blur-xl border border-amber-500/30 shadow-2xl">
          <div className="flex items-center justify-between gap-4 mb-6">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest bg-white/10 border border-amber-500/40 text-amber-300">
              {EVENTS[1].tag}
            </span>
            <span className="text-xs sm:text-sm font-serif tracking-widest text-zinc-300 uppercase">
              {EVENTS[1].day}
            </span>
          </div>

          <p className="font-script text-3xl sm:text-4xl text-amber-300 font-normal mb-1">
            {EVENTS[1].scriptAccent}
          </p>

          <h3 className="text-4xl sm:text-6xl font-serif font-medium text-white tracking-tight mt-2 mb-6">
            {EVENTS[1].title}
          </h3>

          <div className="h-[1px] w-full bg-white/15 my-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Date */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-amber-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-mono text-zinc-400">Date</p>
                <p className="text-base sm:text-lg font-serif font-medium text-white">{EVENTS[1].date}</p>
                <p className="text-xs text-zinc-400">{EVENTS[1].day}</p>
              </div>
            </div>

            {/* Theme */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-amber-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-mono text-zinc-400">Theme</p>
                <p className="text-base sm:text-lg font-serif font-medium text-amber-300">{EVENTS[1].theme}</p>
                <p className="text-xs text-zinc-400">A shower of golden blooms</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WEDDING DAY - VIDHI & VIVAHAM (Photo 3) */}
      <section className="relative min-h-screen w-full flex items-center justify-center py-24 px-6 overflow-hidden">
        {/* Fullscreen Photo Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/3.jpeg"
            alt="Vijin and Unnati - Wedding Day"
            fill
            sizes="100vw"
            className="object-cover object-center filter brightness-90"
          />
          {/* Regal Red / Gold Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/65 to-stone-950/75" />
          <div className="absolute inset-0 bg-rose-950/30 mix-blend-overlay" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl w-full mx-auto">
          {/* Header Banner */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest bg-amber-950/70 border border-amber-500/40 text-amber-300 mb-3">
              November 22 • Sunday
            </span>
            <p className="font-script text-3xl sm:text-5xl text-amber-300 font-normal">
              Two Traditions, One Sacred Knot
            </p>
            <h3 className="text-4xl sm:text-6xl font-serif font-medium text-white tracking-tight mt-1">
              The Wedding Ceremonies
            </h3>
          </div>

          {/* Two Traditional Ceremony Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Vidhi (Marathi Tradition) */}
            <div className="p-8 rounded-3xl bg-black/55 backdrop-blur-xl border border-amber-500/30 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 text-amber-300 mb-4">
                  Marathi Tradition
                </div>
                <h4 className="text-3xl sm:text-4xl font-serif font-medium text-white">
                  Vidhi
                </h4>
                <p className="font-script text-2xl text-amber-200/90 mt-1 mb-6">
                  Sacred rituals of love & devotion
                </p>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-xs font-mono uppercase text-zinc-400">Time</p>
                      <p className="font-serif font-medium text-white text-base">7:00 AM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-xs font-mono uppercase text-zinc-400">Dress Code</p>
                      <p className="font-serif font-medium text-amber-200 text-base">Maharashtrian Traditional</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/15">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Gardenia Convention Center, Njekkadu ↗
                </a>
              </div>
            </div>

            {/* Vivaham (Kerala Tradition) */}
            <div className="p-8 rounded-3xl bg-black/55 backdrop-blur-xl border border-rose-500/30 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-widest bg-rose-500/10 border border-rose-500/30 text-rose-300 mb-4">
                  Kerala Tradition
                </div>
                <h4 className="text-3xl sm:text-4xl font-serif font-medium text-white">
                  Vivaham
                </h4>
                <p className="font-script text-2xl text-rose-200/90 mt-1 mb-6">
                  The auspicious Muhurtham
                </p>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-rose-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-xs font-mono uppercase text-zinc-400">Muhurtham Time</p>
                      <p className="font-serif font-medium text-white text-base">11:50 AM – 12:20 PM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-rose-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-xs font-mono uppercase text-zinc-400">Dress Code</p>
                      <p className="font-serif font-medium text-rose-200 text-base">Kerala Traditional</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/15">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Gardenia Convention Center, Njekkadu ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RECEPTION (Photo 4) */}
      <section className="relative min-h-screen w-full flex items-center justify-center py-20 px-6 overflow-hidden">
        {/* Fullscreen Photo Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/4.jpeg"
            alt="Vijin and Unnati - Reception"
            fill
            sizes="100vw"
            className="object-cover object-center filter brightness-95"
          />
          {/* Midnight Glam Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/60 to-stone-950/75" />
          <div className="absolute inset-0 bg-indigo-950/30 mix-blend-overlay" />
        </div>

        {/* Floating Glass Card */}
        <div className="relative z-10 max-w-2xl w-full mx-auto p-8 sm:p-12 rounded-3xl bg-black/50 backdrop-blur-xl border border-indigo-400/30 shadow-2xl">
          <div className="flex items-center justify-between gap-4 mb-6">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest bg-white/10 border border-indigo-400/40 text-indigo-300">
              {EVENTS[3].tag}
            </span>
            <span className="text-xs sm:text-sm font-serif tracking-widest text-zinc-300 uppercase">
              {EVENTS[3].day}
            </span>
          </div>

          <p className="font-script text-3xl sm:text-4xl text-amber-300 font-normal mb-1">
            {EVENTS[3].scriptAccent}
          </p>

          <h3 className="text-4xl sm:text-6xl font-serif font-medium text-white tracking-tight mt-2 mb-6">
            {EVENTS[3].title}
          </h3>

          <div className="h-[1px] w-full bg-white/15 my-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Date & Time */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-amber-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-mono text-zinc-400">Date & Time</p>
                <p className="text-base sm:text-lg font-serif font-medium text-white">{EVENTS[3].date}</p>
                <p className="text-xs text-amber-300 font-medium">{EVENTS[3].time}</p>
              </div>
            </div>

            {/* Dress Code */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-amber-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-mono text-zinc-400">Dress Code</p>
                <p className="text-base sm:text-lg font-serif font-medium text-amber-200">
                  {EVENTS[3].dressCode}
                </p>
                <p className="text-xs text-zinc-400">Evening of glamorous celebration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Ending with Love */}
      <footer className="py-20 px-6 bg-stone-950 border-t border-white/10 text-center flex flex-col items-center justify-center">
        <p className="font-script text-4xl sm:text-5xl text-amber-300 mb-2">
          Vijin & Unnati
        </p>
        <p className="text-xs font-mono uppercase tracking-[0.4em] text-zinc-500 mt-2">
          November 2026 • We Can’t Wait To Celebrate With You
        </p>
        <div className="mt-8">
          <a
            href="#top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs font-mono tracking-widest uppercase px-6 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all inline-block"
          >
            Back to Top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
