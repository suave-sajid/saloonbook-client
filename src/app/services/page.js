import Navbar from "@/components/home/navbar";
import Footer from "@/components/home/footer";
import ServicesBrowse from "@/components/services/services-browse";

export const metadata = {
  title: "Explore Salon Services | SalonBook",
  description: "Browse SalonBook salon services by treatment and category.",
};

export default async function ServicesPage({ searchParams }) {
  const params = await searchParams;
  const category = typeof params?.category === "string" ? params.category : "";

  return (
    <>
      <Navbar />
      <ServicesBrowse initialCategory={category} key={category} />
      <Footer />
    </>
  );
}
