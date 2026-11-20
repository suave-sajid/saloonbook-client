import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Footer from "@/components/home/footer";
import Navbar from "@/components/home/navbar";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata = {
  title: "Contact SalonBook",
  description: "Find SalonBook contact and opening-hours information.",
};

const icons = {
  Email: Mail,
  Phone,
  Location: MapPin,
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[55vh] bg-[#faf8f4] px-5 py-16 dark:bg-stone-950 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#927758] dark:text-amber-200">
            WE&apos;RE HERE TO HELP
          </p>
          <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-[#342c24] dark:text-stone-100 sm:text-5xl">
            Contact SalonBook
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#81766a] dark:text-stone-400">
            Our official contact details are being prepared. Please check back
            soon for ways to reach the SalonBook team.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {Object.values(SITE_CONFIG.contact).map((item) => {
              const Icon = icons[item.label];
              return (
                <div
                  className="rounded-2xl border border-[#e9e2d7] bg-[#fffefa] p-5 dark:border-stone-800 dark:bg-stone-900"
                  key={item.label}
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[#e9ede5] text-[#45624e] dark:bg-emerald-950 dark:text-emerald-200">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <h2 className="mt-4 text-sm font-semibold text-[#342c24] dark:text-stone-100">
                    {item.label}
                  </h2>
                  <p className="mt-1 text-sm text-[#81766a] dark:text-stone-400">{item.value}</p>
                </div>
              );
            })}
            <div className="rounded-2xl border border-[#e9e2d7] bg-[#fffefa] p-5 dark:border-stone-800 dark:bg-stone-900 sm:col-span-2">
              <h2 className="text-sm font-semibold text-[#342c24] dark:text-stone-100">Opening Hours</h2>
              <p className="mt-1 text-sm text-[#81766a] dark:text-stone-400">{SITE_CONFIG.openingHours}</p>
            </div>
          </div>

          <p className="mt-8 text-sm text-[#81766a] dark:text-stone-400">
            In the meantime,{" "}
            <Link className="font-semibold text-[#365a48] hover:underline dark:text-emerald-300" href="/services">
              explore our available services
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
