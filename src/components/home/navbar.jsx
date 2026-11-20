"use client";

import { Button } from "@/components/ui/button";
import LinkComponent from "next/link";
import { useState } from "react";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#faf8f4]/95 backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12"
      >
        <LinkComponent
          aria-label="SalonBook home"
          className="flex shrink-0 items-center gap-2.5"
          href="/"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-[#1f493c] text-[#f4efe5]">
            <svg
              aria-hidden="true"
              className="size-[21px]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M7.5 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm9 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM5.7 5.7l12.6 12.6M18.3 5.7 5.7 18.3M7.5 15.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm9-12a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </span>
          <span className="font-serif text-[21px] font-semibold tracking-tight text-[#233d32]">
            SalonBook
          </span>
        </LinkComponent>

        <div className="hidden items-center gap-8 lg:flex">
          {navigationLinks.map((item) => (
            <LinkComponent
              className="text-sm font-medium text-stone-600 transition-colors hover:text-[#1f493c]"
              href={item.href}
              key={item.label}
            >
              {item.label}
            </LinkComponent>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            className="h-10 rounded-full px-5 text-sm font-semibold text-[#29483c] hover:bg-[#e9eee8]"
            render={<LinkComponent href="/sign-in" />}
            variant="ghost"
          >
            Sign In
          </Button>
          <Button
            className="h-10 rounded-full bg-[#1f493c] px-5 text-sm font-semibold text-white hover:bg-[#17392f]"
            render={<LinkComponent href="/sign-up" />}
          >
            Get Started
          </Button>
        </div>

        <Button
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="size-10 rounded-full text-[#29483c] hover:bg-[#e9eee8] lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          variant="ghost"
        >
          {menuOpen ? (
            <span className="text-xl leading-none" aria-hidden="true">×</span>
          ) : (
            <span className="flex flex-col gap-1.5" aria-hidden="true">
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
            </span>
          )}
        </Button>
      </nav>

      {menuOpen && (
        <div
          className="border-t border-stone-200 bg-[#faf8f4] px-5 py-5 lg:hidden"
          id="mobile-navigation"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigationLinks.map((item) => (
              <LinkComponent
                className="rounded-lg px-3 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-[#eeece5] hover:text-[#1f493c]"
                href={item.href}
                key={item.label}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </LinkComponent>
            ))}
            <div className="mt-3 flex gap-3 border-t border-stone-200 pt-4">
              <Button
                className="h-11 flex-1 rounded-full text-[#29483c]"
                onClick={() => setMenuOpen(false)}
                render={<LinkComponent href="/sign-in" />}
                variant="outline"
              >
                Sign In
              </Button>
              <Button
                className="h-11 flex-1 rounded-full bg-[#1f493c] text-white hover:bg-[#17392f]"
                onClick={() => setMenuOpen(false)}
                render={<LinkComponent href="/sign-up" />}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
