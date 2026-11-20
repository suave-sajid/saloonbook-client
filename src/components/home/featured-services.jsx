"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CircleAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/home/service-card";
import { getServicesEndpoint } from "@/lib/actions/services";


function ServiceCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border border-[#e9e2d7] bg-[#fffefa]"
    >
      <div className="aspect-[1.55/1] animate-pulse bg-[#e9e2d7]" />
      <div className="space-y-4 p-5 sm:p-6">
        <div className="h-6 w-2/3 animate-pulse rounded bg-[#eee8de]" />
        <div className="h-4 w-full animate-pulse rounded bg-[#f1ece4]" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-[#f1ece4]" />
        <div className="border-t border-[#eee8de] pt-4">
          <div className="ml-auto h-4 w-24 animate-pulse rounded bg-[#eee8de]" />
        </div>
      </div>
    </div>
  );
}


export default function FeaturedServices() {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState("loading");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const loadServices = async () => {
      try {
        const response = await fetch(getServicesEndpoint(), {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Services API responded with ${response.status}`);
        }

        const result = await response.json();
        if (result?.success !== true || !Array.isArray(result.data)) {
          throw new Error("Services API returned an unexpected response.");
        }

        const activeServices = result.data.filter(
          (service) => service?.status === "active",
        );
        setServices(activeServices.slice(0, 6));
        setStatus(activeServices.length ? "success" : "empty");
      } catch (error) {
        if (controller.signal.aborted) return;

        if (process.env.NODE_ENV === "development") {
          console.error("Failed to load featured salon services:", error);
        }
        setStatus("error");
      }
    };

    loadServices();
    return () => controller.abort();
  }, [retryCount]);

  return (
    <section
      aria-labelledby="featured-services-title"
      className="bg-[#f3f0e9] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#927758] sm:text-xs">
              <Sparkles aria-hidden="true" className="size-4" />
              A LITTLE SOMETHING FOR YOU
            </p>
            <h2
              className="font-serif text-3xl leading-tight font-medium tracking-tight text-[#342c24] sm:text-4xl lg:text-[42px]"
              id="featured-services-title"
            >
              Discover Our Featured Services
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#81766a] sm:text-base sm:leading-7">
              Explore exceptional treatments and professional care designed
              to make you feel your best.
            </p>
          </div>
          <Link
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#365a48] transition-colors hover:text-[#203d30]"
            href="/services"
          >
            View All Services
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {status === "loading" && (
          <div
            aria-label="Loading featured services"
            aria-live="polite"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          >
            {[0, 1, 2].map((item) => (
              <ServiceCardSkeleton key={item} />
            ))}
          </div>
        )}

        {status === "success" && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service._id || service.id}
                service={service}
              />
            ))}
          </div>
        )}

        {status === "empty" && (
          <div className="rounded-2xl border border-dashed border-[#d9cdbd] bg-[#fffefa]/75 px-6 py-14 text-center sm:py-16">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#eee8de] text-[#8b7458]">
              <Sparkles aria-hidden="true" className="size-5" />
            </span>
            <h3 className="mt-5 font-serif text-2xl font-medium text-[#342c24]">
              No services available just yet.
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#81766a]">
              New salon services will be available here soon. Please check back
              later.
            </p>
          </div>
        )}

        {status === "error" && (
          <div
            className="rounded-2xl border border-[#e5d7c8] bg-[#fffefa]/80 px-6 py-12 text-center"
            role="alert"
          >
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#f3e8dc] text-[#9b7459]">
              <CircleAlert aria-hidden="true" className="size-5" />
            </span>
            <h3 className="mt-5 font-serif text-2xl font-medium text-[#342c24]">
              We couldn&apos;t load our services.
            </h3>
            <p className="mt-3 text-sm text-[#81766a]">
              Please try again in a moment.
            </p>
            <Button
              className="mt-6 rounded-full bg-[#1f493c] px-6 text-white hover:bg-[#17392f]"
              onClick={() => {
                setStatus("loading");
                setRetryCount((count) => count + 1);
              }}
            >
              Retry
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
