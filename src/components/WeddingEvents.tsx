"use client";

import React, { useState } from "react";
import Image from "next/image";

interface EventDetail {
  id: string;
  tag: string;
  scriptAccent: string;
  title: string;
  date: string;
  day: string;
  time?: string;
  theme?: string;
  venue?: string;
  dressCode?: string;
  image: string;
}

const EVENTS: EventDetail[] = [
  {
    id: "mehendi",
    tag: "Celebration 01",
    scriptAccent: "Celebration of Henna & Joy",
    title: "Mehendi Ceremony",
    date: "20th November",
    day: "Friday",
    time: "6:00pm",
    theme: "Green Hues of Henna",
    image: "/1.PNG",
  },
  {
    id: "haldi",
    tag: "Celebration 02",
    scriptAccent: "Sun-kissed Petals & Blessings",
    title: "Phoolo vali Haldi",
    date: "21st November",
    day: "Saturday",
    time: "4:00pm",
    theme: "Marigold / Sunflower",
    image: "/2.PNG",
  },
  {
    id: "ceremonies",
    tag: "The Sacred Auspicious Day",
    scriptAccent: "Two Cultures, One Sacred Bond",
    title: "The Wedding Ceremonies",
    date: "22nd November",
    day: "Sunday",
    image: "/3.PNG",
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
    image: "/4.PNG",
  },
];

export default function WeddingEvents() {
  const [attendance, setAttendance] = useState<"yes" | "no" | null>(null);
  const [showNoPopup, setShowNoPopup] = useState(false);
  const [runawayOffset, setRunawayOffset] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);

  // RSVP Form Details
  const [guestName, setGuestName] = useState("");
  const [memberCount, setMemberCount] = useState<"1" | "3" | "5">("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const moveNoButton = () => {
    const angle = Math.random() * 2 * Math.PI;
    const distance = 70 + Math.random() * 70;
    let newX = Math.cos(angle) * distance;
    let newY = Math.sin(angle) * distance;

    newX = Math.max(-120, Math.min(120, newX));
    newY = Math.max(-50, Math.min(50, newY));

    setRunawayOffset({ x: newX, y: newY });
    setDodgeCount((prev) => prev + 1);
  };

  const googleMapsUrl =
    "https://maps.google.com/?q=Gardenia+Convention+Center+Njekkadu";

  return (
    <div id="events" className="relative w-full bg-white text-white">
      {/* Introduction Transition Banner */}
      <section className="relative py-28 sm:py-36 px-6 bg-white text-zinc-900 text-center flex flex-col items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <p className="font-script text-4xl sm:text-6xl text-amber-800/90 mb-2">
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
            We cordially invite you to share our joy as two families and
            traditions unite. Please grace our special moments with your
            presence and warm blessings.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono tracking-widest uppercase text-zinc-600">
            <span>Nov 20 • Mehendi</span>
            <span>•</span>
            <span>Nov 21 • Haldi</span>
            <span>•</span>
            <span>Nov 22 • Wedding & Reception</span>
          </div>
        </div>
      </section>

      {/* 1. MEHENDI (Photo 1) - Clean background with dark text centered & nudged slightly up */}
      <section className="relative min-h-screen w-full flex items-center justify-center py-24 px-6 overflow-hidden">
        {/* Fullscreen Photo Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/2.PNG"
            alt="Vijin and Unnati - Mehendi"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter brightness-95"
          />
        </div>

        {/* Text centered with subtle upward nudge */}
        <div className="relative z-10 max-w-3xl w-full mx-auto text-center flex flex-col items-center -translate-y-8 sm:-translate-y-12">
          <span className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-emerald-950 font-bold drop-shadow-sm mb-2">
            {EVENTS[0].date} {EVENTS[0].day}
          </span>

          <p className="font-script text-4xl sm:text-6xl text-amber-950 drop-shadow-sm mb-1 font-medium">
            {EVENTS[0].scriptAccent}
          </p>

          <h3 className="text-5xl sm:text-7xl md:text-8xl font-serif font-normal text-zinc-950 tracking-tight drop-shadow-sm mb-4 leading-none">
            {EVENTS[0].title}
          </h3>

          <div className="flex flex-row flex-wrap items-center justify-center gap-x-3 gap-y-1.5 my-2">
            <span className="font-serif text-base sm:text-2xl text-zinc-900 tracking-wide font-medium">
              {EVENTS[0].time}
            </span>
            <span className="text-zinc-700/60">•</span>
            <span className="text-xs sm:text-base font-sans tracking-wider uppercase text-emerald-950 font-semibold">
              Theme: {EVENTS[0].theme}
            </span>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="flex items-center justify-center gap-4 bg-[#faf6ed] py-8">
        <div className="h-px w-16 bg-[#d6b56a]/50" />

        <span className="text-xl text-[#b88a45]">✦</span>

        <div className="h-px w-16 bg-[#d6b56a]/50" />
      </div>

      {/* 2. PHOOLO VALI HALDI - Clean background with dark text centered in middle */}
      <section className="relative min-h-screen w-full flex items-center justify-center py-24 px-6 overflow-hidden">
        {/* Fullscreen Photo Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/3.PNG"
            alt="Vijin and Unnati - Haldi"
            fill
            sizes="100vw"
            className="object-cover object-center filter brightness-95"
          />
        </div>

        {/* Text centered in middle with rich dark colors */}
        <div className="relative z-10 max-w-3xl w-full mx-auto text-center flex flex-col items-center">
          <span className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-amber-950 font-bold drop-shadow-sm mb-2">
            {EVENTS[1].date} {EVENTS[1].day}
          </span>

          <p className="font-script text-4xl sm:text-6xl text-amber-900 drop-shadow-sm mb-1 font-medium">
            {EVENTS[1].scriptAccent}
          </p>

          <h3 className="text-5xl sm:text-7xl md:text-8xl font-serif font-normal text-zinc-950 tracking-tight drop-shadow-sm mb-4 leading-none">
            {EVENTS[1].title}
          </h3>

          <div className="flex flex-row flex-wrap items-center justify-center gap-x-3 gap-y-1.5 my-2">
            <span className="font-serif text-base sm:text-2xl text-zinc-900 tracking-wide font-medium">
              {EVENTS[1].time}
            </span>
            <span className="text-zinc-700/60">•</span>
            <span className="text-xs sm:text-base font-sans tracking-wider uppercase text-amber-950 font-semibold">
              Theme: {EVENTS[1].theme}
            </span>
          </div>
        </div>
      </section>

      <section className="relative py-28 sm:py-36 px-6 bg-white text-zinc-900 text-center flex flex-col items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <p className="font-script text-4xl sm:text-6xl text-amber-800/90 mb-2">
            Two Traditions, One Sacred Knot
          </p>
          <div className="flex items-center gap-3 my-4">
            <div className="h-[1px] w-12 bg-amber-700/40" />
            <span className="text-xs sm:text-sm font-sans tracking-[0.4em] uppercase text-zinc-600 font-medium">
              Vidhi & Vivaham
            </span>
            <div className="h-[1px] w-12 bg-amber-700/40" />
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-zinc-900 font-normal tracking-tight mt-2 leading-tight">
            The Wedding Ceremonies
          </h2>
          <p className="mt-6 text-zinc-600 text-sm sm:text-base md:text-lg max-w-xl font-light leading-relaxed">
            Vidhi — A celebration of cherished Maharashtrian wedding traditions.
          </p>

          <p className="mt-6 text-zinc-600 text-sm sm:text-base md:text-lg max-w-xl font-light leading-relaxed">
            Vivaham — A celebration of sacred Kerala wedding traditions.
          </p>
        </div>
      </section>
      {/* 3. VIDHI DAY - Clean background with dark text centered in middle */}
      <section className="relative min-h-screen w-full flex items-center justify-center py-24 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/1.PNG"
            alt="Vijin and Unnati - Vidhi"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl w-full mx-auto text-center flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 w-full max-w-4xl mx-auto text-center">
            {/* Vidhi */}
            <div className="flex flex-col items-center">
              {/* Tradition */}
              <span
                className="
            text-xs
            font-mono
            uppercase
            tracking-[0.3em]
            text-[#7A4A16]
            font-semibold
            mb-2
          "
              >
                Marathi Tradition
              </span>

              {/* Title */}
              <h4
                className="
            text-4xl
            sm:text-5xl
            font-serif
            font-normal
            text-[#6B3F12]
            mb-2
            drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]
          "
              >
                Vidhi
              </h4>

              {/* Subtitle */}
              <p
                className="
            font-script
            text-2xl
            sm:text-3xl
            text-[#A66A1F]
            mb-6
            drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]
          "
              >
                Sacred rituals of love & devotion
              </p>

              {/* Time + Dress Code */}
              <div className="flex flex-row items-center justify-center gap-6 sm:gap-10 font-serif text-center">
                {/* Time */}
                <div>
                  <span
                    className="
                text-[11px]
                sm:text-xs
                font-mono
                uppercase
                tracking-wider
                text-[#806B52]
                block
                font-sans
                mb-1
              "
                  >
                    Time
                  </span>

                  <p
                    className="
                text-sm
                sm:text-lg
                text-[#4A2B12]
                font-semibold
              "
                  >
                    7:00 AM
                  </p>
                </div>

                {/* Divider */}
                <div className="h-8 w-[1px] bg-[#B88A45]/50" />

                {/* Dress Code */}
                <div>
                  <span
                    className="
                text-[11px]
                sm:text-xs
                font-mono
                uppercase
                tracking-wider
                text-[#806B52]
                block
                font-sans
                mb-1
              "
                  >
                    Dress Code
                  </span>

                  <p
                    className="
                text-sm
                sm:text-lg
                text-[#6B3F12]
                font-semibold
              "
                  >
                    Maharashtrian Traditional
                  </p>
                </div>
              </div>

              {/* Location */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
            mt-6
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            border
            border-[#A66A1F]/40
            bg-[#FFF8E8]/70
            hover:bg-[#F4E4C4]
            text-xs
            sm:text-sm
            font-sans
            tracking-wider
            uppercase
            text-[#6B3F12]
            hover:text-[#4A2B12]
            transition-all
            cursor-pointer
            pointer-events-auto
            shadow-sm
            backdrop-blur-[2px]
          "
              >
                <svg
                  className="w-4 h-4 text-[#A66A1F] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

                <span>Gardenia Convention Center ↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Vivah DAY- Clean background with dark text centered in middle */}
      <section className="relative min-h-screen w-full flex items-center justify-center py-24 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/4.PNG"
            alt="Vijin and Unnati - Vivaham"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl w-full mx-auto text-center flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 w-full max-w-4xl mx-auto text-center">
            {/* Vivaham */}
            <div className="flex flex-col items-center">
              {/* Tradition */}
              <span
                className="
            text-xs
            font-mono
            uppercase
            tracking-[0.3em]
            text-[#76552F]
            font-semibold
            mb-2
          "
              >
                Kerala Tradition
              </span>

              {/* Title */}
              <h4
                className="
            text-4xl
            sm:text-5xl
            font-serif
            font-normal
            text-[#5A321C]
            mb-2
            drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]
          "
              >
                Vivaham
              </h4>

              {/* Subtitle */}
              <p
                className="
            font-script
            text-2xl
            sm:text-3xl
            text-[#A65D4A]
            mb-6
            drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]
          "
              >
                The auspicious Muhurtham
              </p>

              {/* Time + Dress Code */}
              <div className="flex flex-row items-center justify-center gap-6 sm:gap-10 font-serif text-center">
                {/* Time */}
                <div>
                  <span
                    className="
                text-[11px]
                sm:text-xs
                font-mono
                uppercase
                tracking-wider
                text-[#806B52]
                block
                font-sans
                mb-1
              "
                  >
                    Muhurtham Time
                  </span>

                  <p
                    className="
                text-sm
                sm:text-lg
                text-[#4A2B18]
                font-semibold
              "
                  >
                    11:50 AM – 12:20 PM
                  </p>
                </div>

                {/* Divider */}
                <div className="h-8 w-[1px] bg-[#A67C45]/50" />

                {/* Dress Code */}
                <div>
                  <span
                    className="
                text-[11px]
                sm:text-xs
                font-mono
                uppercase
                tracking-wider
                text-[#806B52]
                block
                font-sans
                mb-1
              "
                  >
                    Dress Code
                  </span>

                  <p
                    className="
                text-sm
                sm:text-lg
                text-[#5A321C]
                font-semibold
              "
                  >
                    Kerala Traditional
                  </p>
                </div>
              </div>

              {/* Location */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
            mt-6
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            border
            border-[#A67C45]/50
            bg-[#FFF9ED]/75
            hover:bg-[#F5E5CD]
            text-xs
            sm:text-sm
            font-sans
            tracking-wider
            uppercase
            text-[#5A321C]
            hover:text-[#3E2415]
            transition-all
            cursor-pointer
            pointer-events-auto
            shadow-sm
            backdrop-blur-[2px]
          "
              >
                <svg
                  className="w-4 h-4 text-[#A65D4A] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

                <span>Gardenia Convention Center ↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="flex items-center justify-center gap-4 bg-[#faf6ed] py-8">
        <div className="h-px w-16 bg-[#d6b56a]/50" />

        <span className="text-xl text-[#b88a45]">✦</span>

        <div className="h-px w-16 bg-[#d6b56a]/50" />
      </div>

      {/* 4. RECEPTION (Photo 4) - Text centered vertically in section */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/5.PNG"
            alt="Vijin and Unnati - Reception"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Text positioned inside the dark blue area */}
        <div className="relative z-10 flex min-h-screen w-full items-start justify-center px-6 pt-[45%] sm:pt-[23%] md:pt-[22%]">
          <div className="w-full max-w-4xl text-center">
            {/* Date + Day */}
            <div className="mb-3 flex items-center justify-center gap-3">
              <span
                className="
            font-sans
            text-xs
            font-semibold
            uppercase
            tracking-[0.35em]
            text-[#F8EEDB]
            drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)]
            sm:text-sm
          "
              >
                {EVENTS[3].date}
              </span>

              <span className="text-[#D7A94B] text-xs">•</span>

              <span
                className="
            font-sans
            text-xs
            font-semibold
            uppercase
            tracking-[0.35em]
            text-[#F8EEDB]
            drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)]
            sm:text-sm
          "
              >
                {EVENTS[3].day}
              </span>
            </div>

            {/* Script Accent */}
            <p
              className="
          mb-2
          font-script
          text-4xl
          font-medium
          leading-none
          text-[#E6B95C]
          drop-shadow-[0_3px_5px_rgba(0,0,0,0.75)]
          sm:text-5xl
          md:text-6xl
        "
            >
              {EVENTS[3].scriptAccent}
            </p>

            {/* Main Title */}
            <h3
              className="
          mb-4
          font-serif
          text-4xl
          font-normal
          leading-tight
          tracking-tight
          text-[#FFF8E8]
          drop-shadow-[0_3px_6px_rgba(0,0,0,0.75)]
          sm:text-5xl
          md:text-6xl
          lg:text-7xl
        "
            >
              {EVENTS[3].title}
            </h3>

            {/* Time + Dress Code */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {/* Time */}
              <span
                className="
            font-serif
            text-lg
            font-medium
            tracking-wide
            text-[#F8EEDB]
            drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]
            sm:text-2xl
          "
              >
                {EVENTS[3].time}
              </span>

              {/* Separator */}
              <span className="text-[#D7A94B]">•</span>

              {/* Dress Code */}
              <span
                className="
            font-sans
            text-xs
            font-bold
            uppercase
            tracking-[0.15em]
            text-[#E6B95C]
            drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]
            sm:text-sm
            md:text-base
          "
              >
                Dress Code: {EVENTS[3].dressCode}
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* DIVIDER */}
      <div className="flex items-center justify-center gap-4 bg-[#faf6ed] py-8">
        <div className="h-px w-16 bg-[#d6b56a]/50" />

        <span className="text-xl text-[#b88a45]">✦</span>

        <div className="h-px w-16 bg-[#d6b56a]/50" />
      </div>

      <section
        id="memories"
        className="relative w-full overflow-hidden bg-[#faf6ed] pb-10 sm:pb-24"
      >
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-3xl px-6 text-center">
          <span
            className="
        font-sans
        text-[10px]
        font-semibold
        uppercase
        tracking-[0.35em]
        text-[#a66a1f]
        sm:text-xs
      "
          >
            A glimpse into our journey
          </span>

          <h2
            className="
        mt-2
        font-script
        text-5xl
        font-medium
        leading-none
        text-[#6b3f12]
        sm:text-6xl
        md:text-7xl
      "
          >
            Our Memories
          </h2>

          <p
            className="
        mx-auto
        mt-4
        max-w-xl
        font-serif
        text-sm
        leading-relaxed
        text-[#806b52]
        sm:text-base
      "
          >
            A collection of moments, laughter, and memories that brought us
            here.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative w-full">
          <div
            className="
        flex
        gap-5
        overflow-x-auto
        px-6
        pb-6
        snap-x
        snap-mandatory
        scroll-smooth
        scrollbar-hide
        sm:gap-6
        sm:px-[8%]
      "
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {[
              "/memories/1.jpg",
              "/memories/2.jpg",
              "/memories/3.jpg",
              "/memories/4.jpg",
              "/memories/5.jpg",
              "/memories/6.jpg",
            ].map((photo, index) => (
              <div
                key={photo}
                className="
            relative
            h-[420px]
            min-w-[280px]
            snap-center
            overflow-hidden
            rounded-[24px]
            border
            border-[#d6b56a]/40
            bg-white
            shadow-[0_10px_35px_rgba(92,60,20,0.12)]
            sm:h-[500px]
            sm:min-w-[350px]
            md:h-[560px]
            md:min-w-[420px]
          "
              >
                <Image
                  src={photo}
                  alt={`Vijin and Unnati memory ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 420px"
                  className="
              object-cover
              transition-transform
              duration-700
              hover:scale-105
            "
                />

                {/* Soft overlay */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Photo number */}
                <div
                  className="
              absolute
              bottom-4
              left-4
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-white/80
              text-[10px]
              font-semibold
              text-[#6b3f12]
              backdrop-blur-sm
            "
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#9a7b52]">
              Swipe to explore
            </span>

            <span className="text-[#b88a45]">→</span>
          </div>
        </div>
      </section>

      {/* 5. FOOTER PAGE - Detailed Ceremonies & Love Note */}
      <footer className="py-24 sm:py-32 px-6 bg-stone-950 border-t border-white/10 text-center flex flex-col items-center justify-center">
        {/* RSVP Attendance Section */}
        <div
          id="rsvp-card"
          className="w-full max-w-xl mx-auto my-10 p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-amber-400/20 bg-stone-900/40 backdrop-blur-md text-center shadow-2xl"
        >
          <span className="text-xs font-mono tracking-[0.35em] uppercase text-amber-300/80 block mb-2">
            R.S.V.P
          </span>
          <h3 className="font-script text-4xl sm:text-6xl text-amber-200 mb-3">
            Will You Grace Us With Your Presence?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 font-light mb-8 max-w-md mx-auto leading-relaxed">
            Your love and blessings mean the world to us as we unite two hearts
            and two families. Please let us know if you can join our
            celebration.
          </p>

          {attendance === null ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setAttendance("yes");
                  setIsSubmitted(false);
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-amber-400/60 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/35 hover:to-amber-600/35 text-amber-200 hover:text-white text-xs sm:text-sm font-sans tracking-widest uppercase font-medium transition-all shadow-lg hover:shadow-amber-500/10 cursor-pointer flex items-center justify-center gap-2.5 active:scale-95"
              >
                <span>✨</span>
                <span>Yes, Joyfully Accepts</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNoPopup(true);
                  setRunawayOffset({ x: 0, y: 0 });
                  setDodgeCount(0);
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 text-xs sm:text-sm font-sans tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-95"
              >
                <span>🕊️</span>
                <span>Regretfully Declines</span>
              </button>
            </div>
          ) : attendance === "yes" ? (
            !isSubmitted ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!guestName.trim() || isSubmitting) return;

                  setIsSubmitting(true);
                  try {
                    await fetch("/api/rsvp", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: guestName.trim(),
                        members: memberCount,
                        attendance: "Joyfully Attending",
                      }),
                    });
                  } catch (err) {
                    console.error("Failed to save RSVP:", err);
                  } finally {
                    setIsSubmitting(false);
                    setIsSubmitted(true);
                  }
                }}
                className="py-2 w-full max-w-sm mx-auto flex flex-col items-center animate-fade-in"
              >
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl mb-3 shadow-inner">
                  ✨
                </div>
                <h4 className="font-serif text-2xl text-amber-200 mb-1">
                  Joyfully Attending!
                </h4>
                <p className="text-xs text-zinc-300 font-light mb-6">
                  Please let us know your name and how many members will be
                  attending.
                </p>

                {/* Name Input */}
                <div className="w-full text-left mb-4">
                  <label
                    htmlFor="guestName"
                    className="block text-[11px] font-mono tracking-wider uppercase text-zinc-400 mb-1.5"
                  >
                    Your Name / Family Name
                  </label>
                  <input
                    id="guestName"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-stone-950 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-400/80 transition-colors"
                  />
                </div>

                {/* Number of Members Choose Box (1, 3, 5 options) */}
                <div className="w-full text-left mb-6">
                  <label
                    htmlFor="memberCount"
                    className="block text-[11px] font-mono tracking-wider uppercase text-zinc-400 mb-1.5"
                  >
                    How Many Members Appearing?
                  </label>
                  <div className="relative">
                    <select
                      id="memberCount"
                      value={memberCount}
                      onChange={(e) =>
                        setMemberCount(e.target.value as "1" | "3" | "5")
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-stone-950 text-white text-sm focus:outline-none focus:border-amber-400/80 transition-colors appearance-none cursor-pointer pr-10"
                    >
                      <option value="1" className="bg-stone-900 text-white">
                        1 Member
                      </option>
                      <option value="3" className="bg-stone-900 text-white">
                        3 Members
                      </option>
                      <option value="5" className="bg-stone-900 text-white">
                        5 Members
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>

                  {/* 1, 3, 5 Quick Selection Pills */}
                  <div className="grid grid-cols-3 gap-2 mt-2.5">
                    {(["1", "3", "5"] as const).map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setMemberCount(count)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                          memberCount === count
                            ? "border-amber-400/80 bg-amber-500/20 text-amber-200 font-semibold shadow-sm"
                            : "border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {count} {count === "1" ? "Member" : "Members"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-full border border-amber-400/80 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm font-sans tracking-widest uppercase transition-all shadow-lg hover:shadow-amber-500/25 active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      <span>Saving to RSVP...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Confirm Attendance</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAttendance(null);
                    setIsSubmitted(false);
                  }}
                  className="mt-4 text-[11px] font-mono tracking-wider uppercase text-zinc-500 hover:text-zinc-300 underline underline-offset-4 cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="py-3 flex flex-col items-center animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl mb-3 shadow-inner">
                  ✨
                </div>
                <h4 className="font-serif text-xl sm:text-2xl text-amber-200 mb-1">
                  Attendance Confirmed!
                </h4>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-sm mb-2 leading-relaxed">
                  Thank you,{" "}
                  <span className="text-white font-medium">
                    {guestName || "Dear Guest"}
                  </span>
                  ! We are overjoyed to welcome you and your party of{" "}
                  <span className="text-amber-300 font-semibold">
                    {memberCount} {memberCount === "1" ? "member" : "members"}
                  </span>{" "}
                  to celebrate our special day!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                  }}
                  className="mt-4 text-[11px] font-mono tracking-wider uppercase text-zinc-400 hover:text-amber-200 underline underline-offset-4 cursor-pointer"
                >
                  Edit Details / Change Response
                </button>
              </div>
            )
          ) : (
            <div className="py-3 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xl mb-3 shadow-inner">
                🕊️
              </div>
              <h4 className="font-serif text-xl sm:text-2xl text-zinc-200 mb-1">
                Celebrating From Afar
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mb-4 leading-relaxed">
                You will be dearly missed, but we will feel your warm wishes and
                blessings in our hearts.
              </p>
              <button
                type="button"
                onClick={() => setAttendance(null)}
                className="text-[11px] font-mono tracking-wider uppercase text-zinc-400 hover:text-amber-200 underline underline-offset-4 cursor-pointer"
              >
                Change Response
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-[1px] w-24 bg-white/20 my-10" />

        <p className="font-script text-4xl sm:text-6xl text-amber-300 mb-2">
          Vijin & Unnati
        </p>
        <p className="text-xs font-mono uppercase tracking-[0.4em] text-zinc-400 mt-2">
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

      {/* Crying Easter Egg Popup when clicking "No" */}
      {showNoPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-md w-full bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-center shadow-2xl overflow-hidden flex flex-col items-center">
            {/* Close 'X' button */}
            <button
              type="button"
              onClick={() => setShowNoPopup(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 text-lg leading-none transition-colors cursor-pointer"
              aria-label="Close popup"
            >
              ✕
            </button>

            {/* Crying Face Animation */}
            <div className="relative inline-flex items-center justify-center my-3 select-none">
              <div className="text-7xl sm:text-8xl animate-bounce">😭</div>
              {/* Flying Tears */}
              <span className="absolute -left-6 top-6 text-3xl animate-ping opacity-80">
                💧
              </span>
              <span
                className="absolute -right-6 top-6 text-3xl animate-ping opacity-80"
                style={{ animationDelay: "200ms" }}
              >
                💧
              </span>
              <span
                className="absolute -left-3 top-14 text-2xl animate-pulse opacity-90"
                style={{ animationDelay: "400ms" }}
              >
                💦
              </span>
              <span
                className="absolute -right-3 top-14 text-2xl animate-pulse opacity-90"
                style={{ animationDelay: "600ms" }}
              >
                💦
              </span>
            </div>

            {/* Header Text */}
            <h3 className="font-script text-4xl sm:text-5xl text-amber-200 mb-2">
              Please Come! 🥺💔
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 font-light mb-3 max-w-xs leading-relaxed">
              Vijin &amp; Unnati will be heartbroken without you! We really,
              really want you there with us to celebrate!
            </p>

            {/* Playful hint / dodge message */}
            {dodgeCount > 0 && (
              <p className="text-xs font-mono text-amber-300/90 mb-3 animate-pulse">
                {dodgeCount === 1 && "Oops, the button ran away! 🏃💨"}
                {dodgeCount === 2 && "Still running! You can't catch it! 🙈"}
                {dodgeCount >= 3 &&
                  dodgeCount < 6 &&
                  `Dodged you ${dodgeCount} times! Just say yes! 🥹`}
                {dodgeCount >= 6 && "The button strictly refuses to say no! ❤️"}
              </p>
            )}

            {/* Action Buttons: Yes is prominent, No runs away */}
            <div className="w-full flex flex-col items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setAttendance("yes");
                  setIsSubmitted(false);
                  setShowNoPopup(false);
                  const rsvpElem = document.getElementById("rsvp-card");
                  if (rsvpElem) {
                    rsvpElem.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full py-3.5 px-6 rounded-full border border-amber-400 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm sm:text-base font-sans tracking-wider uppercase transition-all shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>✨</span>
                <span>Okay, I&#39;ll Come!</span>
                <span>❤️</span>
              </button>

              {/* Running No Button Arena */}
              <div className="relative h-20 w-full flex items-center justify-center overflow-visible">
                <button
                  type="button"
                  onMouseEnter={moveNoButton}
                  onTouchStart={moveNoButton}
                  onClick={(e) => {
                    e.preventDefault();
                    moveNoButton();
                  }}
                  style={{
                    transform: `translate(${runawayOffset.x}px, ${runawayOffset.y}px)`,
                    transition:
                      "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                  className="px-6 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-sans tracking-wider uppercase cursor-pointer select-none whitespace-nowrap active:scale-90"
                >
                  No 😢
                </button>
              </div>
            </div>

            {/* Discreet escape hatch for guests who truly cannot make it */}
            <button
              type="button"
              onClick={() => {
                setAttendance("no");
                setShowNoPopup(false);
              }}
              className="text-[11px] font-mono tracking-wider uppercase text-zinc-500 hover:text-zinc-300 underline underline-offset-4 cursor-pointer mt-1"
            >
              I really, truly cannot make it (Decline)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
