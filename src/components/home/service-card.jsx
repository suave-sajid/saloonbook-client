"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getImageSource, shouldOptimizeImage } from "@/lib/image-optimization";
import { ArrowUpRight, Clock3, Scissors } from "lucide-react";

function getServiceImage(service) {
  const image = service.imageUrl || service.serviceImage || service.image;
  return typeof image === "string" && image.trim() ? image : null;
}

function getDuration(service) {
  const duration =
    service.duration ?? service.estimatedDuration ?? service.durationMinutes;

  if (typeof duration === "number") return `${duration} min`;
  if (typeof duration === "string" && duration.trim()) return duration;
  return null;
}

function formatPrice(price) {
  const amount = Number(price);
  if (!Number.isFinite(amount)) return null;

  return `৳${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

export default function ServiceCard({ service }) {
  const [imageFailed, setImageFailed] = useState(false);
  const id = service._id || service.id;
  const image = getServiceImage(service);
  const duration = getDuration(service);
  const price = formatPrice(service.price);

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#e9e2d7] bg-[#fffefa] shadow-[0_12px_35px_-28px_rgba(57,43,29,0.5)] transition duration-300 hover:-translate-y-1 hover:border-[#d7c6ae] hover:shadow-[0_22px_45px_-28px_rgba(57,43,29,0.32)] dark:border-stone-800 dark:bg-stone-950 dark:hover:border-stone-600">
      <div className="relative aspect-[1.55/1] overflow-hidden bg-[#eee8de]">
        {image && !imageFailed ? (
          <Image
            alt={service.serviceName || "Salon service"}
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            fill
            onError={() => setImageFailed(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            src={getImageSource(image)}
            unoptimized={!shouldOptimizeImage(image)}
          />
        ) : (
          <div
            aria-label="Service image unavailable"
            className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_25%_30%,#f8f2e8_0,#e9e0d2_60%,#d8caba_100%)] text-[#9a8063]"
            role="img"
          >
            <Scissors aria-hidden="true" className="size-10 opacity-70" strokeWidth={1.2} />
          </div>
        )}
        {service.category && (
          <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-[#fffefa]/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-[#725d47] shadow-sm backdrop-blur dark:border-stone-700 dark:bg-stone-900/90 dark:text-amber-100">
            {service.category}
          </span>
        )}
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex min-h-[3.5rem] items-start justify-between gap-3">
          <h3 className="font-serif text-xl leading-snug font-semibold text-[#342c24] dark:text-stone-100 sm:text-[22px]">
            {service.serviceName || "Salon service"}
          </h3>
          {price && (
            <p className="shrink-0 pt-1 text-sm font-semibold text-[#8b6d4e] dark:text-amber-200">
              {price}
            </p>
          )}
        </div>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#81766a] dark:text-stone-400">
          {service.description || "Professional care, tailored to you."}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-[#eee8de] pt-4 dark:border-stone-800">
          {duration ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#81766a] dark:text-stone-400">
              <Clock3 aria-hidden="true" className="size-4 text-[#a28a6c]" />
              {duration}
            </span>
          ) : (
            <span />
          )}
          <Link
            className="inline-flex items-center gap-1 rounded-full text-sm font-semibold text-[#365a48] transition-colors hover:text-[#203d30] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#66806e] dark:text-emerald-300 dark:hover:text-emerald-200"
            href={`/services/${encodeURIComponent(String(id ?? ""))}`}
          >
            View Details
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
