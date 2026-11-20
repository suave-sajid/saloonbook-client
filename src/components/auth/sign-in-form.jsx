"use client";

import { Button } from "@/components/ui/button";
import PasswordField from "./password-field";
import { AuthField } from "./auth-form-controls";
import { Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("sign-in-password") ?? "");
    const rememberMe = formData.get("remember-me") === "on";

    setIsSubmitting(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        toast.error(error.message || "We couldn't sign you in.");
        return;
      }

      toast.success("Signed in successfully");
      router.replace("/");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "We couldn't sign you in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form-fields space-y-4" onSubmit={handleSubmit}>
        <AuthField
          autoComplete="email"
          icon={Mail}
          label="Email Address"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
        <div className="space-y-3">
          <PasswordField
            label="Password"
            name="sign-in-password"
            placeholder="Enter your password"
            required
          />
          <div className="flex items-center justify-between gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-stone-600 dark:text-stone-300">
              <input
                className="size-4 cursor-pointer rounded border-stone-300 accent-emerald-600 focus:ring-emerald-500 dark:border-stone-600"
                name="remember-me"
                type="checkbox"
              />
              Remember me
            </label>
          </div>
        </div>
        <Button
          className="auth-primary-button h-11 w-full rounded-lg bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:bg-emerald-400 dark:text-stone-950 dark:hover:bg-emerald-300"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
    </form>
  );
}
