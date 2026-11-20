"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

export default function PasswordField({
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
          className="h-11 w-full rounded-lg border border-stone-300 bg-white pr-12 pl-11 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 hover:border-stone-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-stone-700 dark:bg-stone-950 dark:text-white dark:placeholder:text-stone-500 dark:hover:border-stone-600 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20"
          id={name}
          name={name}
          placeholder={placeholder}
          type={visible ? "text" : "password"}
        />
        <button
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:hover:bg-stone-800 dark:hover:text-stone-200"
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
    </div>
  );
}
