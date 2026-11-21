"use client";

import { useEffect } from "react";
import AppError from "@/components/app-error";
import "./globals.css";

export default function GlobalError({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <AppError retry={retry} title="SalonBook hit an unexpected error" />
      </body>
    </html>
  );
}
