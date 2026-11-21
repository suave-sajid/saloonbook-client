"use client";

import { useEffect } from "react";
import AppError from "@/components/app-error";

export default function Error({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <AppError retry={retry} />;
}
