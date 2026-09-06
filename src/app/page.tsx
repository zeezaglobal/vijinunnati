import SmoothVideoScroll from "@/components/SmoothVideoScroll";
import WeddingEvents from "@/components/WeddingEvents";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Full-screen butter-smooth video scroll ending on white with "Vijin weds Unnati" */}
      <SmoothVideoScroll />

      {/* 2. Wedding events with 4 couple photo backgrounds & luxury overlays */}
      <WeddingEvents />
    </main>
  );
}
