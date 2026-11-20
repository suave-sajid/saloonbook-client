import HeroSection from "@/components/home/hero-section";
import Navbar from "@/components/home/navbar";
import FeaturedServices from "@/components/home/featured-services";
import ServiceCategories from "@/components/home/service-categories";
import WhyChooseUs from "@/components/home/why-choose-us";
import CtaSection from "@/components/home/cta-section";
import Footer from "@/components/home/footer";

export const metadata = {
  title: "SalonBook | Beauty begins with you",
  description:
    "Discover salon services, explore trusted treatments, and find your next moment of self-care with SalonBook.",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#faf8f4] text-stone-900">
        <HeroSection />
        <FeaturedServices />
        <ServiceCategories />
        <WhyChooseUs />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
