"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Camera, LoaderCircle, Save, UserRound } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function ProfileForm() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!isPending && !user) router.replace("/sign-in?next=/profile");
  }, [isPending, router, user]);

  if (isPending || !user) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#faf8f4] dark:bg-stone-950">
        <LoaderCircle
          aria-label="Loading profile"
          className="size-8 animate-spin text-emerald-800 dark:text-emerald-300"
        />
      </main>
    );
  }

  return <ProfileEditor key={user.id} user={user} />;
}

function ProfileEditor({ user }) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [image, setImage] = useState(user.image || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef(null);

  const handleImageChange = async (event) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Choose a PNG, JPG, or WEBP image.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Choose an image smaller than 5 MB.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.set("image", file);
      const response = await fetch("/api/profile-image", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok || !result?.url) {
        throw new Error(result?.error || "We couldn't upload your photo.");
      }
      setImage(result.url);
      toast.success("Profile photo uploaded.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "We couldn't upload your photo.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextName = name.trim();
    if (!nextName) {
      toast.error("Enter your name to continue.");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await authClient.updateUser({
        name: nextName,
        image: image.trim() || null,
      });
      if (error) {
        toast.error(error.message || "We couldn't update your profile.");
        return;
      }
      toast.success("Your profile has been updated.");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "We couldn't update your profile.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-[65vh] bg-[#faf8f4] px-5 py-14 dark:bg-stone-950 sm:px-8 sm:py-20">
      <section className="mx-auto max-w-2xl rounded-2xl border border-[#e9e2d7] bg-[#fffefa] p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-9">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-800 dark:text-emerald-300">
            ACCOUNT SETTINGS
          </p>
          <h1 className="mt-2 font-serif text-3xl font-medium text-[#342c24] dark:text-stone-100">
            Profile management
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
            Update your name and the photo shown with your account.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5 rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-950/60 sm:flex-row sm:items-center">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-full border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800">
              <Image
                alt="Profile photo preview"
                className="object-cover"
                fill
                sizes="80px"
                src={image || "/avatar-default.svg"}
                unoptimized
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-stone-900 dark:text-stone-100">
                Profile photo
              </p>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                PNG, JPG or WEBP, up to 5 MB.
              </p>
              <button
                className="mt-3 inline-flex h-9 items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
                disabled={isUploading}
                onClick={() => inputRef.current?.click()}
                type="button"
              >
                {isUploading ? (
                  <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                ) : (
                  <Camera aria-hidden="true" className="size-4" />
                )}
                {isUploading ? "Uploading..." : "Upload photo"}
              </button>
              <input
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={handleImageChange}
                ref={inputRef}
                type="file"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-stone-700 dark:text-stone-300"
              htmlFor="profile-name"
            >
              Full name
            </label>
            <div className="relative">
              <UserRound
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-stone-400"
              />
              <input
                autoComplete="name"
                className="h-11 w-full rounded-lg border border-stone-300 bg-white pr-4 pl-11 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-stone-700 dark:bg-stone-950 dark:text-white dark:focus:border-emerald-400"
                id="profile-name"
                maxLength={100}
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-stone-700 dark:text-stone-300"
              htmlFor="profile-email"
            >
              Email address
            </label>
            <input
              className="h-11 w-full cursor-not-allowed rounded-lg border border-stone-200 bg-stone-100 px-4 text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400"
              id="profile-email"
              readOnly
              value={user.email || ""}
            />
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Email address is managed by your sign-in provider.
            </p>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-stone-700 dark:text-stone-300"
              htmlFor="profile-image-url"
            >
              Or use an image URL
            </label>
            <input
              className="h-11 w-full rounded-lg border border-stone-300 bg-white px-4 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-stone-700 dark:bg-stone-950 dark:text-white dark:focus:border-emerald-400"
              id="profile-image-url"
              onChange={(event) => setImage(event.target.value)}
              placeholder="https://example.com/photo.jpg"
              type="url"
              value={image}
            />
            <button
              className="text-xs font-medium text-stone-500 underline-offset-2 hover:text-stone-800 hover:underline dark:text-stone-400 dark:hover:text-stone-200"
              onClick={() => setImage("")}
              type="button"
            >
              Use default avatar
            </button>
          </div>

          <div className="flex justify-end border-t border-stone-200 pt-5 dark:border-stone-800">
            <button
              className="inline-flex h-11 min-w-36 items-center justify-center gap-2 rounded-full bg-[#1f493c] px-6 text-sm font-semibold text-white transition hover:bg-[#17392f] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-700 dark:hover:bg-emerald-600"
              disabled={isSaving || isUploading}
              type="submit"
            >
              {isSaving ? (
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <Save aria-hidden="true" className="size-4" />
              )}
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
