import Link from "next/link";
import {
  Clock3,
  Camera,
  Mail,
  MapPin,
  Music2,
  Phone,
  UsersRound,
} from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/service-categories";
import { SITE_CONFIG } from "@/lib/site-config";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Sign In", href: "/sign-in" },
];

const contactIcons = {
  Email: Mail,
  Phone,
  Location: MapPin,
};

const socialIcons = {
  Instagram: Camera,
  Facebook: UsersRound,
  TikTok: Music2,
};

function BrandMark() {
  return (
    <span className="flex size-10 items-center justify-center rounded-full bg-[#e6d4b8] text-[#203f33]">
      <svg aria-hidden="true" className="size-[21px]" fill="none" viewBox="0 0 24 24">
        <path
          d="M7.5 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm9 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM5.7 5.7l12.6 12.6M18.3 5.7 5.7 18.3M7.5 15.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm9-12a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    </span>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1d3028] text-[#f7f3eb]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-16 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_1fr_1.1fr] lg:gap-12 lg:px-12">
        <div className="max-w-sm">
          <Link aria-label="SalonBook home" className="inline-flex items-center gap-3" href="/">
            <BrandMark />
            <span className="font-serif text-[22px] font-semibold tracking-tight">
              SalonBook
            </span>
          </Link>
          <p className="mt-5 text-sm leading-6 text-white/65">
            Discover salon services and make a little more room for your
            moments of self-care.
          </p>
          <div className="mt-6 flex items-center gap-2">
            {SITE_CONFIG.socialMedia.map(({ name, href }) => {
              const Icon = socialIcons[name];
              return href ? (
                <a
                  aria-label={name}
                  className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/65 transition-colors hover:border-white/35 hover:text-white"
                  href={href}
                  key={name}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Icon aria-hidden="true" className="size-4" />
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  className="flex size-9 cursor-not-allowed items-center justify-center rounded-full border border-white/15 text-white/40"
                  key={name}
                  title={`${name} link will be added when the official account is configured`}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  <span className="sr-only">{name} (not configured)</span>
                </span>
              );
            })}
          </div>
        </div>

        <nav aria-label="Footer quick links">
          <h2 className="mb-5 text-xs font-semibold tracking-[0.16em] text-[#d3c09d] uppercase">
            Quick Links
          </h2>
          <ul className="space-y-3">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link
                  className="text-sm text-white/65 transition-colors hover:text-white"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer service categories">
          <h2 className="mb-5 text-xs font-semibold tracking-[0.16em] text-[#d3c09d] uppercase">
            Services
          </h2>
          <ul className="space-y-3">
            {SERVICE_CATEGORIES.map(({ name }) => (
              <li key={name}>
                <Link
                  className="text-sm text-white/65 transition-colors hover:text-white"
                  href={`/services?category=${encodeURIComponent(name)}`}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-5 text-xs font-semibold tracking-[0.16em] text-[#d3c09d] uppercase">
            Get in Touch
          </h2>
          <ul className="space-y-4">
            {Object.values(SITE_CONFIG.contact).map((item) => {
              const Icon = contactIcons[item.label];
              return (
                <li className="flex gap-3 text-sm text-white/65" key={item.label}>
                  <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#d3c09d]" />
                  <span>
                    <span className="block text-xs text-white/40">{item.label}</span>
                    {item.href ? (
                      <a className="transition-colors hover:text-white" href={item.href}>
                        {item.value}
                      </a>
                    ) : (
                      <span>{item.value}</span>
                    )}
                  </span>
                </li>
              );
            })}
            <li className="flex gap-3 text-sm text-white/65">
              <Clock3 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#d3c09d]" />
              <span>
                <span className="block text-xs text-white/40">Opening Hours</span>
                {SITE_CONFIG.openingHours}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-white/45 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <p>© {currentYear} SalonBook. All rights reserved.</p>
          <p>Made for your moment of self-care.</p>
        </div>
      </div>
    </footer>
  );
}
