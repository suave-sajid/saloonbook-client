import { Button } from "@/components/ui/button";
import { Mail, User } from "lucide-react";

export function AuthField({ autoComplete, icon: Icon, label, name, placeholder, type = "text" }) {
  return (
    <div className="space-y-2">
      <label
        className="text-sm font-medium text-stone-700 dark:text-stone-300"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-stone-400"
        />
        <input
          autoComplete={autoComplete}
          className="h-11 w-full rounded-xl border border-stone-200 bg-white pr-4 pl-11 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 hover:border-stone-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:hover:border-stone-600 dark:focus:border-rose-400 dark:focus:ring-rose-950"
          id={name}
          name={name}
          placeholder={placeholder}
          type={type}
        />
      </div>
    </div>
  );
}

export function GoogleButton() {
  return (
    <Button
      className="h-12 w-full rounded-xl border-stone-200 bg-white text-sm font-medium text-stone-700 shadow-none transition hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-stone-600 dark:hover:bg-stone-800"
      type="button"
      variant="outline"
    >
      <GoogleMark />
      Continue with Google
    </Button>
  );
}

export function GoogleMark() {
  return (
    <svg aria-hidden="true" className="size-[18px]" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
        transform="translate(0 5)"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.62 5.91c4.45-4.11 7.15-10.16 7.15-17.56Z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z"
        transform="translate(0 5)"
      />
      <path
        fill="#34A853"
        d="M24 48c6.47 0 11.9-2.13 15.87-5.8l-7.62-5.91c-2.12 1.42-4.84 2.26-8.25 2.26-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
      />
    </svg>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-4" aria-label="Or continue with">
      <span className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
      <span className="text-[10px] font-semibold tracking-[0.18em] text-stone-400">
        OR CONTINUE WITH
      </span>
      <span className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
    </div>
  );
}

export function ProfileImageField() {
  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-stone-700 dark:text-stone-300">
        Profile Image <span className="font-normal text-stone-400">(optional)</span>
      </span>
      <div className="grid grid-cols-[1.15fr_0.85fr] items-stretch gap-2">
        <label
          className="group flex min-h-14 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-stone-300 bg-stone-50/70 px-3 py-2 transition hover:border-rose-300 hover:bg-rose-50/40 dark:border-stone-700 dark:bg-stone-900/70 dark:hover:border-rose-800 dark:hover:bg-rose-950/30"
          htmlFor="profile-image"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-rose-700 shadow-sm ring-1 ring-stone-200 transition group-hover:ring-rose-200 dark:bg-stone-800 dark:text-rose-300 dark:ring-stone-700 dark:group-hover:ring-rose-800">
            <UploadIcon />
          </span>
          <span className="min-w-0">
            <span className="block text-xs leading-4 font-medium text-stone-700 dark:text-stone-300">
              Upload your profile photo
            </span>
            <span className="mt-0.5 block text-[10px] leading-3 text-stone-400">
              PNG, JPG or WEBP
            </span>
          </span>
          <input
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            id="profile-image"
            name="profile-image"
            type="file"
          />
        </label>
        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400"
          />
          <input
            aria-label="Profile image URL"
            className="h-full min-h-14 w-full rounded-xl border border-stone-200 bg-white pr-2 pl-9 text-xs text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:ring-rose-950"
            name="profile-image-url"
            placeholder="Use image URL"
            type="url"
          />
        </div>
      </div>
    </div>
  );
}

export function UserIcon() {
  return <User aria-hidden="true" />;
}

function UploadIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="M12 16V4m0 0L7 9m5-5 5 5" />
      <path d="M20 16.5v2A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-2" />
    </svg>
  );
}
