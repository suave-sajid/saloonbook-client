import HeroSection from "@/components/home/hero-section";
import Navbar from "@/components/home/navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf8f4] text-stone-900">
      <Navbar />
      <HeroSection />
    </main>
  );
}
