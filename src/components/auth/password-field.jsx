"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

export default function PasswordField({
  helper = false,
  label = "Password",
  name = "password",
  placeholder,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-stone-700 dark:text-stone-300" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <Lock
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-stone-400"
        />
        <input
          autoComplete={name === "password" ? "new-password" : "current-password"}
          className="h-11 w-full rounded-xl border border-stone-200 bg-white pr-12 pl-11 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 hover:border-stone-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:hover:border-stone-600 dark:focus:border-rose-400 dark:focus:ring-rose-950"
          id={name}
          name={name}
          placeholder={placeholder}
          type={visible ? "text" : "password"}
        />
        <button
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-[18px]" />
          ) : (
            <Eye aria-hidden="true" className="size-[18px]" />
          )}
        </button>
      </div>
      {helper && (
        <div className="pt-1 text-xs text-stone-500 dark:text-stone-400">
          <p className="mb-2 font-medium text-stone-600 dark:text-stone-300">Your password should have:</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
            <li className="flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-rose-400" />
              At least 6 characters
            </li>
            <li className="flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-rose-400" />
              One uppercase letter
            </li>
            <li className="flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-rose-400" />
              One lowercase letter
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
