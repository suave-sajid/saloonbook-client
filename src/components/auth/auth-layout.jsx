import { Scissors } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

export default function AuthLayout({ children, activeTab }) {
  const isSignUp = activeTab === "sign-up";

  return (
    <main className="relative flex min-h-dvh items-center justify-center bg-stone-50 px-4 py-10 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <section className="auth-card w-full max-w-[420px] rounded-2xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-900/5 dark:border-stone-800 dark:bg-stone-900 dark:shadow-black/20 sm:p-8">
        <header className="mb-7 text-center">
          <Link
            aria-label="SalonBook home"
            className="mx-auto mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-400/15"
            href="/"
          >
            <Scissors aria-hidden="true" className="size-5" />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isSignUp ? "Create your account" : "Sign in to SalonBook"}
          </h1>
        </header>

        {children}

        <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            className="font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200"
            href={isSignUp ? "/sign-in" : "/sign-up"}
          >
            {isSignUp ? "Sign in" : "Create account"}
          </Link>
        </p>
      </section>
    </main>
  );
}
