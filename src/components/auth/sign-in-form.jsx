"use client";

import { Button } from "@/components/ui/button";
import PasswordField from "./password-field";
import { AuthField, GoogleButton, OrDivider } from "./auth-form-controls";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

export default function SignInForm() {
  return (
    <>
      <div className="mb-5">
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-rose-700 dark:text-rose-300">
          YOUR NEXT MOMENT AWAITS
        </p>
        <h2 className="font-serif text-3xl font-medium tracking-tight text-stone-950 dark:text-stone-100 sm:text-[2.1rem]">
          Welcome back
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-stone-400">
          Sign in to continue your beauty journey.
        </p>
      </div>

      <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
        <AuthField
          autoComplete="email"
          icon={Mail}
          label="Email Address"
          name="email"
          placeholder="you@example.com"
          type="email"
        />
        <div className="space-y-3">
          <PasswordField
            label="Password"
            name="sign-in-password"
            placeholder="Enter your password"
          />
          <div className="flex items-center justify-between gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-stone-600 dark:text-stone-300">
              <input
                className="size-4 cursor-pointer rounded border-stone-300 accent-rose-800 focus:ring-rose-500 dark:border-stone-600"
                name="remember-me"
                type="checkbox"
              />
              Remember me
            </label>
            <a
              className="text-sm font-medium text-rose-800 transition hover:text-rose-950 dark:text-rose-300 dark:hover:text-rose-200"
              href="#forgot-password"
            >
              Forgot password?
            </a>
          </div>
        </div>
        <Button
          className="h-12 w-full rounded-xl bg-rose-800 text-sm font-semibold text-white shadow-[0_8px_18px_-8px_rgba(136,54,65,0.55)] transition hover:bg-rose-900 dark:bg-rose-700 dark:hover:bg-rose-600"
          type="submit"
        >
          Sign In
          <ArrowRight aria-hidden="true" className="ml-1 size-4" />
        </Button>
      </form>

      <div className="auth-divider my-5">
        <OrDivider />
      </div>
      <GoogleButton />

      <p className="mt-5 text-center text-sm text-stone-500 dark:text-stone-400">
        Don&apos;t have an account?{" "}
        <Link
          className="font-semibold text-rose-800 transition hover:text-rose-950 dark:text-rose-300 dark:hover:text-rose-200"
          href="/sign-up"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}
