"use client";

import { Button } from "@/components/ui/button";
import { AuthField, ProfileImageField } from "./auth-form-controls";
import PasswordField from "./password-field";
import { Mail, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignUpForm() {
  const router = useRouter();
  const [submitState, setSubmitState] = useState("idle");
  const [profileImage, setProfileImage] = useState({
    status: "idle",
    url: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (profileImage.status === "uploading") {
      toast.error("Please wait for your profile photo to finish uploading.");
      return;
    }
    if (profileImage.status === "error") {
      toast.error("Remove the failed upload or choose another profile photo.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("full-name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      toast.error("Password must be at least 6 characters and include one uppercase and one lowercase letter.");
      return;
    }
    const profileImageUrl = String(
      formData.get("profile-image-url") ?? "",
    ).trim();

    try {
      setSubmitState("creating");
      const image = profileImage.url || profileImageUrl
        || "/avatar-default.svg";

      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image,
      });

      if (error) {
        toast.error(error.message || "We couldn't create your account.");
        return;
      }

      toast.success("Account created successfully", {
        description: "You can now sign in to SalonBook.",
      });
      router.push("/sign-in");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "We couldn't create your account. Please try again.",
      );
    } finally {
      setSubmitState("idle");
    }
  };

  return (
    <div className="auth-content--signup">
      <form className="auth-form-fields space-y-4" onSubmit={handleSubmit}>
        <AuthField
          autoComplete="name"
          icon={User}
          label="Full Name"
          name="full-name"
          placeholder="Enter your full name"
          required
        />
        <AuthField
          autoComplete="email"
          icon={Mail}
          label="Email Address"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
        <PasswordField
          label="Password"
          name="password"
          placeholder="Create a password"
          required
        />
        <ProfileImageField
          onUploadChange={(status, url) => setProfileImage({ status, url })}
        />
        <Button
          className="auth-primary-button h-11 w-full rounded-lg bg-emerald-400 text-sm font-semibold text-[#07120f] shadow-[0_8px_22px_-9px_rgba(16,212,138,0.7)] transition hover:bg-emerald-300"
          type="submit"
          disabled={submitState !== "idle"}
        >
          {submitState === "uploading"
            ? "Uploading profile photo..."
            : submitState === "creating"
              ? "Creating account..."
              : "Create Account"}
        </Button>
      </form>
    </div>
  );
}
