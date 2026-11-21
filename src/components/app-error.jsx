"use client";

import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({ retry, title = "Something went wrong" }) {
  return (
    <main className="grid min-h-[60vh] place-items-center px-5 py-16 text-center">
      <div className="max-w-md">
        <CircleAlert aria-hidden="true" className="mx-auto size-9 text-destructive" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          We couldn’t load this page. Please try again, or return to the home page.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={retry}>Try again</Button>
          <Button render={<Link href="/" />} variant="outline">Home</Button>
        </div>
      </div>
    </main>
  );
}
