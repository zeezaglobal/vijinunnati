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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://vijinunnati.vercel.app"
  ),
  title: "Vijin weds Unnati",
  description:
    "Wedding celebration of Vijin and Unnati • November 20–22, 2026. Join us for Mehendi, Haldi, Vivaham, and Reception.",
  openGraph: {
    title: "Vijin weds Unnati",
    description:
      "Wedding celebration of Vijin and Unnati • November 20–22, 2026. Join us for Mehendi, Haldi, Vivaham, and Reception.",
    siteName: "Vijin weds Unnati",
    images: [
      {
        url: "/og-image-v2.png",
        width: 1200,
        height: 630,
        alt: "Vijin weds Unnati",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vijin weds Unnati",
    description:
      "Wedding celebration of Vijin and Unnati • November 20–22, 2026. Join us for Mehendi, Haldi, Vivaham, and Reception.",
    images: ["/og-image-v2.png"],
  },
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
