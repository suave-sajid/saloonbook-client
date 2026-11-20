import HeroSection from "@/components/home/hero-section";
import Navbar from "@/components/home/navbar";
import FeaturedServices from "@/components/home/featured-services";
import ServiceCategories from "@/components/home/service-categories";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf8f4] text-stone-900">
      <Navbar />
      <HeroSection />
      <FeaturedServices />
      <ServiceCategories />
    </main>
  );
}
