import { ArrowUpRight, Scissors, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AuthBranding({
  compact = false,
  description,
  image,
  title,
}) {
  if (compact) {
    return (
      <Link
        className="inline-flex items-center gap-2.5 text-stone-950"
        href="/"
        aria-label="SalonBook home"
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
          <Scissors aria-hidden="true" className="size-5" />
        </span>
        <span className="font-serif text-xl font-semibold tracking-tight dark:text-stone-100">
          SalonBook
        </span>
      </Link>
    );
  }

  return (
    <aside
      aria-label="SalonBook"
      className="relative hidden h-full min-h-0 overflow-hidden rounded-none bg-stone-900 bg-cover bg-center text-white md:flex md:flex-col md:justify-between md:p-8 lg:rounded-none lg:p-12"
      style={{
        backgroundImage: `linear-gradient(180deg, rgb(31 24 24 / 25%) 0%, rgb(31 24 24 / 22%) 34%, rgb(31 24 24 / 82%) 100%), url("${image}")`,
      }}
    >
      <Link
        className="relative z-10 inline-flex w-fit items-center gap-3"
        href="/"
        aria-label="SalonBook home"
      >
        <span className="flex size-11 items-center justify-center rounded-2xl border border-white/30 bg-white/15 backdrop-blur-sm">
          <Scissors aria-hidden="true" className="size-5" />
        </span>
        <span className="font-serif text-2xl font-semibold tracking-tight">
          SalonBook
        </span>
      </Link>

      <div className="relative z-10 max-w-lg">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-medium tracking-wide text-white/90 backdrop-blur-sm">
          <Sparkles aria-hidden="true" className="size-3.5 text-rose-200" />
          YOUR TIME, BEAUTIFULLY SPENT
        </span>
        <h1 className="max-w-md font-serif text-4xl leading-[1.08] font-medium tracking-tight lg:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-md text-sm leading-7 text-white/80 lg:text-base">
          {description}
        </p>
        <div className="mt-9 flex items-center gap-2 text-sm text-white/75">
          <span className="size-1.5 rounded-full bg-rose-200" />
          A little more you, in every appointment.
          <ArrowUpRight aria-hidden="true" className="ml-1 size-4" />
        </div>
      </div>
    </aside>
  );
}
