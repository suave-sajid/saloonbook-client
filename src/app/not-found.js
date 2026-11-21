import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Page not found | SalonBook",
};

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#faf8f4] px-5 py-16 text-center text-stone-900">
      <div className="max-w-md">
        <p className="font-semibold tracking-[0.2em] text-primary">404</p>
        <h1 className="mt-3 font-serif text-3xl">We couldn’t find that page</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          The link may be incorrect, or the page may have moved.
        </p>
        <Button className="mt-6" render={<Link href="/" />}>Back to home</Button>
      </div>
    </main>
  );
}
