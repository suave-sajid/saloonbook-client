import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="bg-[#faf8f4] px-5 pb-20 dark:bg-stone-950 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
      <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-[#203f33] px-6 py-14 text-center sm:px-12 sm:py-16 lg:px-20 lg:py-[76px]">
        <span
          aria-hidden="true"
          className="absolute -right-20 -top-32 -z-10 size-80 rounded-full border border-white/10 sm:-right-12 sm:-top-44 sm:size-[420px]"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-36 -left-20 -z-10 size-80 rounded-full border border-white/10 sm:-bottom-52 sm:-left-12 sm:size-[420px]"
        />
        <p className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-[#d3c09d] sm:text-xs">
          <Sparkles aria-hidden="true" className="size-4" />
          MAKE SPACE FOR YOURSELF
        </p>
        <h2 className="mx-auto mt-5 max-w-3xl font-serif text-3xl leading-tight font-medium tracking-tight text-[#fffdf8] sm:text-4xl lg:text-[48px]">
          Your Next Beauty Experience Starts Here.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
          Explore our salon services and discover the perfect treatment for
          your next self-care moment.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            className="h-12 w-full rounded-full bg-[#e6d4b8] px-7 text-sm font-semibold text-[#263d32] transition hover:-translate-y-0.5 hover:bg-[#f0e2cb] sm:w-auto"
            render={<Link href="/services" />}
          >
            Explore Services
            <ArrowUpRight aria-hidden="true" className="ml-1 size-4" />
          </Button>
          <Link
            className="inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
            href="/about"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
