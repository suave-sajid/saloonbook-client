import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock3, Scissors, Sparkles } from "lucide-react";

function getImage(service) {
  const image = service.imageUrl || service.serviceImage || service.image;
  return typeof image === "string" && image.trim() ? image : null;
}

function getDuration(service) {
  const duration =
    service.duration ?? service.estimatedDuration ?? service.durationMinutes;
  if (typeof duration === "number") return `${duration} min`;
  if (typeof duration === "string" && duration.trim()) return duration;
  return "Duration not specified";
}

function getPrice(price) {
  const amount = Number(price);
  if (!Number.isFinite(amount)) return "Price not specified";
  return `৳${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

export default function ServiceDetail({ service }) {
  const image = getImage(service);

  return (
    <main className="min-h-screen bg-[#faf8f4] px-5 py-12 dark:bg-stone-950 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Link
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#617565] transition-colors hover:text-[#203d30] dark:text-emerald-300 dark:hover:text-emerald-200"
          href="/services"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          All services
        </Link>

        <article className="grid overflow-hidden rounded-3xl border border-[#e9e2d7] bg-[#fffefa] shadow-[0_24px_70px_-48px_rgba(57,43,29,0.5)] dark:border-stone-800 dark:bg-stone-900 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-64 bg-[#eee8de] sm:min-h-96 lg:min-h-[560px]">
            {image ? (
              <Image
                alt={service.serviceName || "Salon service"}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 52vw"
                src={image}
                unoptimized
              />
            ) : (
              <div className="flex h-full min-h-64 items-center justify-center bg-[radial-gradient(circle_at_25%_30%,#f8f2e8_0,#e9e0d2_60%,#d8caba_100%)] text-[#9a8063]">
                <Scissors aria-hidden="true" className="size-14 opacity-70" strokeWidth={1.2} />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#927758] dark:text-amber-200">
              <Sparkles aria-hidden="true" className="size-4" />
              SALONBOOK SERVICE
            </p>
            {service.category && (
              <p className="mt-5 text-sm font-medium text-[#8b7458] dark:text-amber-200">{service.category}</p>
            )}
            <h1             className="mt-2 font-serif text-3xl leading-tight font-medium tracking-tight text-[#342c24] dark:text-stone-100 sm:text-4xl">
              {service.serviceName || "Salon service"}
            </h1>
            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#81766a] dark:text-stone-400 sm:text-base">
              {service.description || "Service details have not been provided yet."}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#f3f0e9] p-4 dark:bg-stone-800">
                <p className="text-xs font-medium text-[#81766a] dark:text-stone-400">Price</p>
                <p className="mt-1 font-serif text-xl font-semibold text-[#342c24] dark:text-stone-100">
                  {getPrice(service.price)}
                </p>
              </div>
              <div className="rounded-2xl bg-[#f3f0e9] p-4 dark:bg-stone-800">
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-[#81766a] dark:text-stone-400">
                  <Clock3 aria-hidden="true" className="size-3.5" />
                  Estimated duration
                </p>
                <p className="mt-1 font-serif text-xl font-semibold text-[#342c24] dark:text-stone-100">
                  {getDuration(service)}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
