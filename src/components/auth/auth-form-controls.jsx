"use client";

import Image from "next/image";
import { Link2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getImageSource, shouldOptimizeImage } from "@/lib/image-optimization";

export function AuthField({
  autoComplete,
  icon: Icon,
  label,
  name,
  placeholder,
  required = false,
  type = "text",
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-stone-700 dark:text-stone-300" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <Icon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-stone-400"
        />
        <input
          autoComplete={autoComplete}
          className="h-11 w-full rounded-lg border border-stone-300 bg-white pr-4 pl-11 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 hover:border-stone-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-stone-700 dark:bg-stone-950 dark:text-white dark:placeholder:text-stone-500 dark:hover:border-stone-600 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          type={type}
        />
      </div>
    </div>
  );
}

export function ProfileImageField({ onUploadChange }) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadState, setUploadState] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const previewRef = useRef("");
  const requestRef = useRef(0);
  const controllerRef = useRef(null);

  useEffect(() => {
    return () => {
      requestRef.current += 1;
      controllerRef.current?.abort();
      if (previewRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  const updatePreview = (url) => {
    if (previewRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(previewRef.current);
    }
    previewRef.current = url;
    setPreviewUrl(url);
  };

  const handleFileChange = async (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    controllerRef.current?.abort();
    const requestId = ++requestRef.current;
    const controller = new AbortController();
    controllerRef.current = controller;
    onUploadChange("idle", "");
    setErrorMessage("");
    updatePreview(URL.createObjectURL(file));

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      const message = "Use a PNG, JPG or WEBP image.";
      setUploadState("error");
      setErrorMessage(message);
      onUploadChange("error", "");
      event.currentTarget.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      const message = "Choose an image smaller than 5 MB.";
      setUploadState("error");
      setErrorMessage(message);
      onUploadChange("error", "");
      event.currentTarget.value = "";
      return;
    }

    setUploadState("uploading");
    onUploadChange("uploading", "");

    try {
      const formData = new FormData();
      formData.set("image", file);

      const response = await fetch("/api/profile-image", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "We couldn't upload your photo.");
      }
      if (requestId !== requestRef.current) return;

      updatePreview(result.url);
      setUploadState("uploaded");
      onUploadChange("uploaded", result.url);
    } catch (error) {
      if (controller.signal.aborted || requestId !== requestRef.current) return;

      const message =
        error instanceof Error
          ? error.message
          : "We couldn't upload your photo. Please try again.";
      setUploadState("error");
      setErrorMessage(message);
      onUploadChange("error", "");
    }
  };

  const clearImage = () => {
    requestRef.current += 1;
    controllerRef.current?.abort();
    controllerRef.current = null;
    updatePreview("");
    setUploadState("idle");
    setErrorMessage("");
    onUploadChange("idle", "");
    const input = document.getElementById("profile-image");
    if (input instanceof HTMLInputElement) input.value = "";
  };

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-stone-700 dark:text-stone-300">
        Profile image <span className="font-normal text-stone-500">(optional)</span>
      </span>
      <div className="flex items-center gap-3">
        <label
          className="group flex min-h-14 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-stone-300 bg-stone-50 px-3 py-2 transition hover:border-emerald-500 hover:bg-emerald-50 dark:border-stone-700 dark:bg-stone-950 dark:hover:border-emerald-500 dark:hover:bg-emerald-950/20"
          htmlFor="profile-image"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:group-hover:bg-emerald-400/20">
            <Upload aria-hidden="true" className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-stone-800 dark:text-stone-200">
              {uploadState === "uploaded"
                ? "Photo hosted on Imgbb"
                : uploadState === "uploading"
                  ? "Uploading photo..."
                  : "Choose a profile photo"}
            </span>
            <span className="block text-xs text-stone-500">
              PNG, JPG or WEBP · Up to 5 MB
            </span>
          </span>
          <input
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            id="profile-image"
            name="profile-image"
            onChange={handleFileChange}
            type="file"
          />
        </label>
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800">
          <Image
            alt="Profile image preview"
            className="object-cover"
            fill
            sizes="56px"
            src={getImageSource(previewUrl)}
            unoptimized={!shouldOptimizeImage(previewUrl || "/avatar-default.svg")}
          />
          {uploadState === "uploading" && (
            <span
              aria-label="Uploading image"
              className="absolute inset-0 animate-pulse bg-black/20"
            />
          )}
        </div>
        {previewUrl && (
          <button
            aria-label="Remove profile photo"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-white"
            onClick={clearImage}
            type="button"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>
      {errorMessage && (
        <p className="text-xs text-red-600 dark:text-red-400" role="alert">
          {errorMessage}
        </p>
      )}
      <div className="relative">
        <Link2
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400"
        />
        <input
          aria-label="Profile image URL"
          className="h-10 w-full rounded-lg border border-stone-300 bg-white pr-3 pl-9 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-stone-700 dark:bg-stone-950 dark:text-white dark:placeholder:text-stone-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
          name="profile-image-url"
          placeholder="Or use an image URL"
          type="url"
        />
      </div>
    </div>
  );
}
