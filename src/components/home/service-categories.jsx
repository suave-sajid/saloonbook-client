import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/service-categories";

export default function ServiceCategories() {
  return (
    <section
      aria-labelledby="service-categories-title"
      className="bg-[#faf8f4] px-5 py-20 dark:bg-stone-950 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <p className="mb-4 text-[11px] font-semibold tracking-[0.2em] text-[#927758] dark:text-amber-200 sm:text-xs">
            FIND YOUR KIND OF CARE
          </p>
          <h2
            className="font-serif text-3xl leading-tight font-medium tracking-tight text-[#342c24] dark:text-stone-100 sm:text-4xl lg:text-[42px]"
            id="service-categories-title"
          >
            Explore Our Services
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#81766a] dark:text-stone-400 sm:text-base sm:leading-7">
            From everyday essentials to indulgent treatments, discover the
            right care for every moment.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {SERVICE_CATEGORIES.map((category) => (
            <Link
              aria-label={`Explore ${category.name} services`}
              className="group relative isolate aspect-[0.82/1] overflow-hidden rounded-2xl bg-[#e8dfd3] shadow-[0_12px_35px_-28px_rgba(57,43,29,0.5)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-28px_rgba(57,43,29,0.42)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#66806e] sm:aspect-[0.92/1] lg:aspect-[0.82/1]"
              href={`/services?category=${encodeURIComponent(category.name)}`}
              key={category.name}
            >
              <Image
                alt={category.alt}
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                src={category.image}
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#171c17]/75 via-[#171c17]/5 to-transparent transition-colors duration-300 group-hover:from-[#171c17]/85"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5 text-white sm:p-5">
                <span className="font-serif text-base leading-tight font-medium sm:text-xl">
                  {category.name}
                </span>
                <span
                  aria-hidden="true"
                  className="mb-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/10 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-white/20 sm:size-9"
                >
                  <ArrowUpRight className="size-4 sm:size-[18px]" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
