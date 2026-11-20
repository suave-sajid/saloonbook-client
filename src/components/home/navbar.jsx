"use client";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  CircleUserRound,
  LogOut,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!profileMenuOpen) return;

    const handlePointerDown = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setProfileMenuOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileMenuOpen]);

  const handleSignOut = async () => {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(error.message || "We couldn't sign you out.");
        return;
      }
      setProfileMenuOpen(false);
      setMenuOpen(false);
      toast.success("You have signed out.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "We couldn't sign you out.",
      );
    }
  };

  const profileLink = (
    <div className="space-y-1">
    <Link
      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800"
      href="/dashboard"
      onClick={() => {
        setProfileMenuOpen(false);
        setMenuOpen(false);
      }}
    >
      <UserRound aria-hidden="true" className="size-4" />
      Dashboard
    </Link>
    <Link
      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800"
      href="/profile"
      onClick={() => {
        setProfileMenuOpen(false);
        setMenuOpen(false);
      }}
    >
      <UserRound aria-hidden="true" className="size-4" />
      Profile management
    </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#faf8f4]/95 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/95">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12"
      >
        <Link
          aria-label="SalonBook home"
          className="flex shrink-0 items-center gap-2.5"
          href="/"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-[#1f493c] text-[#f4efe5] dark:bg-emerald-900">
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
          <span className="font-serif text-[21px] font-semibold tracking-tight text-[#233d32] dark:text-emerald-100">
            SalonBook
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navigationLinks.map((item) => (
            <Link
              className="text-sm font-medium text-stone-600 transition-colors hover:text-[#1f493c] dark:text-stone-300 dark:hover:text-emerald-300"
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {user ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                aria-label={`Open profile menu for ${user.name || user.email}`}
                className="flex h-11 items-center gap-2 rounded-full border border-stone-200 bg-white/70 py-1 pl-1 pr-3 transition hover:bg-white dark:border-stone-700 dark:bg-stone-900 dark:hover:bg-stone-800"
                onClick={() => setProfileMenuOpen((open) => !open)}
                type="button"
              >
                {user.image ? (
                  <Image
                    alt=""
                    className="size-9 rounded-full object-cover"
                    height={36}
                    src={user.image}
                    unoptimized
                    width={36}
                  />
                ) : (
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#e9ede5] text-sm font-semibold text-[#365a48] dark:bg-emerald-950 dark:text-emerald-200">
                    {(user.name || user.email || "U").slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span className="max-w-28 truncate text-sm font-semibold text-[#29483c] dark:text-stone-100">
                  {user.name || "My account"}
                </span>
                <ChevronDown aria-hidden="true" className="size-4 text-stone-500" />
              </button>
              {profileMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-stone-200 bg-white p-2 shadow-xl dark:border-stone-700 dark:bg-stone-900"
                  role="menu"
                >
                  <div className="border-b border-stone-100 px-3 py-2.5 dark:border-stone-800">
                    <p className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-stone-500 dark:text-stone-400">
                      {user.email}
                    </p>
                  </div>
                  <div className="pt-1" role="none">{profileLink}</div>
                  <button
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40"
                    onClick={handleSignOut}
                    role="menuitem"
                    type="button"
                  >
                    <LogOut aria-hidden="true" className="size-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : !isPending ? (
            <>
              <Button
                className="h-10 rounded-full px-5 text-sm font-semibold text-[#29483c] hover:bg-[#e9eee8] dark:text-emerald-100 dark:hover:bg-stone-800"
                render={<Link href="/sign-in" />}
                variant="ghost"
              >
                Sign In
              </Button>
              <Button
                className="h-10 rounded-full bg-[#1f493c] px-5 text-sm font-semibold text-white hover:bg-[#17392f]"
                render={<Link href="/sign-up" />}
              >
                Get Started
              </Button>
            </>
          ) : (
            <span aria-hidden="true" className="h-10 w-32 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800" />
          )}
        </div>

        <Button
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="size-10 rounded-full text-[#29483c] hover:bg-[#e9eee8] dark:text-emerald-100 dark:hover:bg-stone-800 lg:hidden"
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
          className="border-t border-stone-200 bg-[#faf8f4] px-5 py-5 dark:border-stone-800 dark:bg-stone-950 lg:hidden"
          id="mobile-navigation"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigationLinks.map((item) => (
              <Link
                className="rounded-lg px-3 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-[#eeece5] hover:text-[#1f493c] dark:text-stone-200 dark:hover:bg-stone-800 dark:hover:text-emerald-200"
                href={item.href}
                key={item.label}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center gap-3 border-t border-stone-200 pt-4 dark:border-stone-800">
              <ThemeToggle />
              {user ? (
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    {user.image ? (
                      <Image
                        alt=""
                        className="size-9 rounded-full object-cover"
                        height={36}
                        src={user.image}
                        unoptimized
                        width={36}
                      />
                    ) : (
                      <CircleUserRound aria-hidden="true" className="size-8 text-[#365a48] dark:text-emerald-200" />
                    )}
                    <span className="truncate text-sm font-semibold text-stone-800 dark:text-stone-100">
                      {user.name || user.email}
                    </span>
                  </div>
                  {profileLink}
                  <Button
                    className="mt-2 h-10 w-full rounded-full text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40"
                    onClick={handleSignOut}
                    variant="ghost"
                  >
                    <LogOut aria-hidden="true" className="size-4" />
                    Sign out
                  </Button>
                </div>
              ) : !isPending ? (
                <>
              <Button
                className="h-11 flex-1 rounded-full text-[#29483c]"
                onClick={() => setMenuOpen(false)}
                render={<Link href="/sign-in" />}
                variant="outline"
              >
                Sign In
              </Button>
              <Button
                className="h-11 flex-1 rounded-full bg-[#1f493c] text-white hover:bg-[#17392f]"
                onClick={() => setMenuOpen(false)}
                render={<Link href="/sign-up" />}
              >
                Get Started
              </Button>
                </>
              ) : (
                <span aria-hidden="true" className="h-10 flex-1 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800" />
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
