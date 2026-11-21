import Link from "next/link";
import Navbar from "@/components/home/navbar";
import Footer from "@/components/home/footer";
import { Button } from "@/components/ui/button";

export default function ServiceNotFound() {
  return (
    <>
      <Navbar />
      <main className="grid min-h-[55vh] place-items-center bg-[#faf8f4] px-5 py-16 text-center text-[#342c24]">
        <div className="max-w-md">
          <p className="font-semibold tracking-[0.2em] text-primary">404</p>
          <h1 className="mt-3 font-serif text-3xl">Service not found</h1>
          <p className="mt-3 text-sm leading-6 text-[#81766a]">
            This service may have been removed or the link may be incorrect.
          </p>
          <Button className="mt-6" render={<Link href="/services" />}>Browse services</Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
