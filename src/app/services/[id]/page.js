import { notFound } from "next/navigation";
import Footer from "@/components/home/footer";
import Navbar from "@/components/home/navbar";
import ServiceDetail from "@/components/services/service-detail";
import { getServiceEndpoint } from "@/lib/actions/services";

export const metadata = {
  title: "Salon Service Details | SalonBook",
  description: "View salon service details, pricing, and estimated duration.",
};

export default async function ServiceDetailPage({ params }) {
  const { id } = await params;
  let response;

  try {
    response = await fetch(getServiceEndpoint(id), { cache: "no-store" });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to load salon service details:", error);
    }

    return (
      <>
        <Navbar />
        <main className="flex min-h-[55vh] items-center justify-center bg-[#faf8f4] px-5 py-16 text-center">
          <div>
            <h1 className="font-serif text-3xl text-[#342c24]">
              Service details are temporarily unavailable.
            </h1>
            <p className="mt-3 text-sm text-[#81766a]">
              Please return to the service list and try again later.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (response.status === 404 || response.status === 400) notFound();

  if (!response.ok) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[55vh] items-center justify-center bg-[#faf8f4] px-5 py-16 text-center">
          <div>
            <h1 className="font-serif text-3xl text-[#342c24]">
              Service details are temporarily unavailable.
            </h1>
            <p className="mt-3 text-sm text-[#81766a]">
              Please return to the service list and try again later.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const result = await response.json();
  if (result?.success !== true || !result.data) notFound();

  return (
    <>
      <Navbar />
      <ServiceDetail service={result.data} />
      <Footer />
    </>
  );
}
