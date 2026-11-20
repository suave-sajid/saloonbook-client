import Link from "next/link";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/home/footer";
import Navbar from "@/components/home/navbar";

export const metadata = {
  title: "About SalonBook",
  description: "Learn about SalonBook and our approach to salon service discovery.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#faf8f4] dark:bg-stone-950">
        <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-5 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#927758] dark:text-amber-200">
              <Sparkles aria-hidden="true" className="size-4" />
              ABOUT SALONBOOK
            </p>
            <h1 className="font-serif text-4xl leading-tight font-medium tracking-tight text-[#342c24] dark:text-stone-100 sm:text-5xl lg:text-6xl">
              A little more room for self-care.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#81766a] dark:text-stone-400">
              SalonBook brings salon service information together so you can
              explore treatments, review listed prices and details, and find
              the care that feels right for you.
            </p>
            <div className="mx-auto mt-10 flex size-16 items-center justify-center rounded-3xl bg-[#e9ede5] text-[#45624e] dark:bg-emerald-950 dark:text-emerald-200">
              <Heart aria-hidden="true" className="size-7" strokeWidth={1.6} />
            </div>
            <Button
              className="mt-10 h-12 rounded-full bg-[#1f493c] px-7 text-white hover:bg-[#17392f]"
              render={<Link href="/services" />}
            >
              Explore Services
              <ArrowRight aria-hidden="true" className="ml-1 size-4" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
