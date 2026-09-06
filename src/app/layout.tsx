import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Alex_Brush } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const alexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Vijin weds Unnati | Wedding Celebration",
  description: "Wedding celebration of Vijin and Unnati. Join us for Mehendi, Haldi, Vidhi, Vivaham, and Reception.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${alexBrush.variable} antialiased`}
    >
      <body className="min-h-screen font-sans bg-white text-zinc-900">{children}</body>
    </html>
  );
}
