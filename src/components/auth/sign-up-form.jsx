"use client";

import { Button } from "@/components/ui/button";
import { AuthField, GoogleButton, OrDivider, ProfileImageField } from "./auth-form-controls";
import PasswordField from "./password-field";
import { ArrowRight, Mail, User } from "lucide-react";
import Link from "next/link";

export default function SignUpForm() {
  return (
    <div className="auth-content--signup">
      <div className="auth-heading mb-4">
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-rose-700 dark:text-rose-300">
          A BETTER WAY TO BOOK
        </p>
        <h2 className="font-serif text-3xl font-medium tracking-tight text-stone-950 dark:text-stone-100 sm:text-[2.1rem]">
          Create your account
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-500 dark:text-stone-400">
          Join SalonBook and make every appointment effortless.
        </p>
      </div>

      <form className="space-y-3" onSubmit={(event) => event.preventDefault()}>
        <AuthField
          autoComplete="name"
          icon={User}
          label="Full Name"
          name="full-name"
          placeholder="Enter your full name"
        />
        <AuthField
          autoComplete="email"
          icon={Mail}
          label="Email Address"
          name="email"
          placeholder="you@example.com"
          type="email"
        />
        <PasswordField
          helper
          label="Password"
          name="password"
          placeholder="Create a password"
        />
        <ProfileImageField />
        <Button
          className="h-12 w-full rounded-xl bg-rose-800 text-sm font-semibold text-white shadow-[0_8px_18px_-8px_rgba(136,54,65,0.55)] transition hover:bg-rose-900 dark:bg-rose-700 dark:hover:bg-rose-600"
          type="submit"
        >
          Create Account
          <ArrowRight aria-hidden="true" className="ml-1 size-4" />
        </Button>
      </form>

      <div className="auth-divider my-4">
        <OrDivider />
      </div>
      <GoogleButton />

      <p className="auth-account-link mt-4 text-center text-sm text-stone-500 dark:text-stone-400">
        Already have an account?{" "}
        <Link
          className="font-semibold text-rose-800 transition hover:text-rose-950 dark:text-rose-300 dark:hover:text-rose-200"
          href="/sign-in"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
