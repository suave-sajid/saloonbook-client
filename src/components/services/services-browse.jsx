"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CircleAlert, Scissors, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/home/service-card";
import { getServicesEndpoint } from "@/lib/actions/services";
import { SERVICE_CATEGORIES } from "@/lib/service-categories";

function SkeletonCard() {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-2xl border border-[#e9e2d7] bg-[#fffefa] dark:border-stone-800 dark:bg-stone-900">
      <div className="aspect-[1.55/1] animate-pulse bg-[#e9e2d7]" />
      <div className="space-y-4 p-6">
        <div className="h-6 w-2/3 animate-pulse rounded bg-[#eee8de]" />
        <div className="h-4 w-full animate-pulse rounded bg-[#f1ece4]" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-[#f1ece4]" />
      </div>
    </div>
  );
}

export default function ServicesBrowse({ initialCategory = "" }) {
  const [category, setCategory] = useState(initialCategory);
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState("loading");
  const [retryCount, setRetryCount] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const loadServices = async () => {
      try {
        const url = new URL(getServicesEndpoint());
        if (category) url.searchParams.set("category", category);
        if (search.trim()) url.searchParams.set("search", search.trim());
        if (sort) url.searchParams.set("sort", sort);

        const response = await fetch(url, {
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
          (service) =>
            service?.status === "active"
            && (service._id || service.id),
        );
        setServices(activeServices);
        setStatus(activeServices.length ? "success" : "empty");
      } catch (error) {
        if (controller.signal.aborted) return;
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to load salon services:", error);
        }
        setStatus("error");
      }
    };

    loadServices();
    return () => controller.abort();
  }, [category, retryCount, search, sort]);

  const updateCategory = (nextCategory) => {
    setCategory(nextCategory);

    const url = new URL(window.location.href);
    if (nextCategory) url.searchParams.set("category", nextCategory);
    else url.searchParams.delete("category");
    window.history.replaceState(null, "", url);
  };

  const handleCategoryChange = (event) => updateCategory(event.target.value);

  return (
    <main className="min-h-screen bg-[#faf8f4] dark:bg-stone-950">
      <section className="bg-[#f3f0e9] px-5 py-14 dark:bg-stone-900 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Link
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#617565] transition-colors hover:text-[#203d30] dark:text-emerald-300 dark:hover:text-emerald-200"
            href="/"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to home
          </Link>
          <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#927758] dark:text-amber-200 sm:text-xs">
            <Sparkles aria-hidden="true" className="size-4" />
            FIND YOUR NEXT SELF-CARE MOMENT
          </p>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-medium tracking-tight text-[#342c24] dark:text-stone-100 sm:text-5xl">
                Explore Salon Services
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#81766a] dark:text-stone-400 sm:text-base">
                Browse available treatments and find the care that feels right
                for you.
              </p>
            </div>
            <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-[560px]">
            <label className="flex w-full flex-col gap-2 text-xs font-semibold text-[#6f6559] dark:text-stone-300">
              Search by name
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search services..."
                className="h-11 rounded-xl border border-[#ded5c8] bg-[#fffefa] px-3 text-sm font-medium text-[#342c24] outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
              />
            </label>
            <label className="flex w-full flex-col gap-2 text-xs font-semibold text-[#6f6559] dark:text-stone-300">
              Filter by category
              <select
                className="h-11 rounded-xl border border-[#ded5c8] bg-[#fffefa] px-3 text-sm font-medium text-[#342c24] outline-none transition focus:border-[#8c9b8b] focus:ring-2 focus:ring-[#8c9b8b]/20 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                onChange={handleCategoryChange}
                value={category}
              >
                <option value="">All services</option>
                {SERVICE_CATEGORIES.map(({ name }) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </label>
            <label className="flex w-full flex-col gap-2 text-xs font-semibold text-[#6f6559] dark:text-stone-300 sm:col-span-2">
              Sort by price
              <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-11 rounded-xl border border-[#ded5c8] bg-[#fffefa] px-3 text-sm font-medium dark:border-stone-700 dark:bg-stone-950">
                <option value="">Newest first</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </label>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label={category ? `${category} services` : "Available services"}
        className="mx-auto min-h-[420px] max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12"
      >
        {status === "loading" && (
          <div aria-label="Loading services" aria-live="polite" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => <SkeletonCard key={item} />)}
          </div>
        )}

        {status === "success" && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id || service.id} service={service} />
            ))}
          </div>
        )}

        {status === "empty" && (
          <div className="rounded-2xl border border-dashed border-[#d9cdbd] bg-white/70 px-6 py-16 text-center dark:border-stone-700 dark:bg-stone-900">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#eee8de] text-[#8b7458]">
              <Scissors aria-hidden="true" className="size-5" />
            </span>
            <h2 className="mt-5 font-serif text-2xl font-medium text-[#342c24] dark:text-stone-100">
              {category ? "No services in this category yet." : "No services available just yet."}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#81766a] dark:text-stone-400">
              {category
                ? "Try another category or check back later for new services."
                : "New salon services will be available here soon. Please check back later."}
            </p>
            {category && (
              <Button
                className="mt-6 rounded-full bg-[#1f493c] px-6 text-white hover:bg-[#17392f]"
                onClick={() => updateCategory("")}
              >
                View all services
              </Button>
            )}
          </div>
        )}

        {status === "error" && (
          <div className="rounded-2xl border border-[#e5d7c8] bg-white/80 px-6 py-14 text-center dark:border-stone-700 dark:bg-stone-900" role="alert">
            <CircleAlert aria-hidden="true" className="mx-auto size-6 text-[#9b7459]" />
            <h2 className="mt-4 font-serif text-2xl font-medium text-[#342c24] dark:text-stone-100">We couldn&apos;t load services.</h2>
            <p className="mt-3 text-sm text-[#81766a] dark:text-stone-400">Please try again in a moment.</p>
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
      </section>
    </main>
  );
}
