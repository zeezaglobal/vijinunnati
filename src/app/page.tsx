import SmoothVideoScroll from "@/components/SmoothVideoScroll";
import WeddingEvents from "@/components/WeddingEvents";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-white selection:bg-amber-500/30">
      <main className="w-full max-w-[520px] min-h-screen mx-auto bg-white relative shadow-[0_0_50px_rgba(0,0,0,0.08)] border-x border-zinc-200/80">
        {/* 1. Full-screen butter-smooth video scroll ending on white with "Vijin weds Unnati" */}
        <SmoothVideoScroll />

        {/* 2. Wedding events with 4 couple photo backgrounds & luxury overlays */}
        <WeddingEvents />
      </main>
    </div>
  );
}
