"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export default function AppToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      closeButton
      position="top-center"
      richColors
      theme={resolvedTheme === "light" ? "light" : "dark"}
    />
  );
}
