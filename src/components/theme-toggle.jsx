"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  return (
    <button
      aria-label={mounted && resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex size-10 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white/70 text-stone-700 shadow-sm transition hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800 dark:focus-visible:outline-emerald-400"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      type="button"
    >
      {mounted && resolvedTheme === "dark" ? (
        <Sun aria-hidden="true" className="size-[18px]" />
      ) : (
        <Moon aria-hidden="true" className="size-[18px]" />
      )}
    </button>
  );
}
