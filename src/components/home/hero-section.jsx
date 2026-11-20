import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="overflow-hidden bg-[#faf8f4]">
      <div className="mx-auto grid min-h-[calc(100svh-76px)] max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-12 lg:py-20">
        <div className="hero-enter relative z-10 max-w-xl lg:py-8">
          <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-[#66806e] sm:text-xs">
            <span className="h-px w-8 bg-[#a5b1a3]" />
            YOUR BEAUTY, YOUR MOMENT
          </p>
          <h1 className="max-w-[620px] font-serif text-[clamp(3.35rem,7vw,5.75rem)] leading-[0.98] font-medium tracking-[-0.055em] text-[#263d32]">
            Beauty begins
            <br />
            <span className="text-[#9b7459]">with you.</span>
          </h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
            Discover exceptional salon services, explore trusted treatments,
            and book your next moment of self-care.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              className="h-12 rounded-full bg-[#1f493c] px-7 text-sm font-semibold text-white shadow-[0_12px_30px_-16px_rgba(31,73,60,0.65)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#17392f]"
              render={<Link href="/services" />}
            >
              Explore Salon Services
              <span aria-hidden="true" className="ml-1 text-lg">→</span>
            </Button>
            <Button
              className="h-12 rounded-full px-7 text-sm font-semibold text-[#344d40] transition duration-300 hover:-translate-y-0.5 hover:bg-[#eeece5]"
              render={<Link href="/about" />}
              variant="ghost"
            >
              Discover More
            </Button>
          </div>
          <div className="mt-12 flex items-center gap-3 text-xs font-medium text-stone-500 sm:mt-16">
            <span className="flex -space-x-2">
              {["A", "M", "S"].map((initial, index) => (
                <span
                  aria-hidden="true"
                  className={`flex size-8 items-center justify-center rounded-full border-2 border-[#faf8f4] text-[10px] font-semibold text-white ${
                    index === 0
                      ? "bg-[#9b7459]"
                      : index === 1
                        ? "bg-[#8b9b84]"
                        : "bg-[#596d5c]"
                  }`}
                  key={initial}
                >
                  {initial}
                </span>
              ))}
            </span>
            <span>Made for your moment of self-care</span>
          </div>
        </div>

        <div className="hero-enter hero-enter-delay relative mx-auto w-full max-w-[650px] lg:max-w-none">
          <div className="absolute -right-4 -top-5 z-0 h-28 w-28 rounded-full border border-[#d9cdbd] sm:-right-7 sm:-top-8 sm:h-40 sm:w-40" />
          <div className="absolute -bottom-5 -left-4 z-0 h-24 w-24 rounded-full bg-[#e6e9df] sm:-bottom-8 sm:-left-7 sm:h-36 sm:w-36" />
          <div className="relative z-10 aspect-[1.08/1] overflow-hidden rounded-[48%_48%_8px_8px] bg-[#e5ddd1] shadow-[0_28px_70px_-35px_rgba(56,47,37,0.45)] sm:aspect-[1.18/1] lg:aspect-[0.96/1]">
            <Image
              alt="A calm, sunlit salon with a stylist preparing a client for a treatment"
              className="object-cover object-center transition duration-700 hover:scale-[1.035]"
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 52vw"
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a261f]/25 via-transparent to-white/5" />
          </div>
          <div className="absolute -bottom-5 left-4 z-20 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-[0_18px_40px_-24px_rgba(42,36,29,0.5)] backdrop-blur sm:bottom-7 sm:-left-10 sm:px-5 sm:py-4">
            <p className="font-serif text-lg leading-tight text-[#29483c] sm:text-xl">
              A little time,
              <br />
              just for you.
            </p>
            <p className="mt-1.5 text-[10px] font-medium tracking-[0.14em] text-stone-500 uppercase">
              Your self-care starts here
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
