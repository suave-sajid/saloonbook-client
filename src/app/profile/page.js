import Navbar from "@/components/home/navbar";
import Footer from "@/components/home/footer";
import ProfileForm from "@/components/profile/profile-form";

export const metadata = {
  title: "Profile management | SalonBook",
  description: "Manage your SalonBook profile information and photo.",
};

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <ProfileForm />
      <Footer />
    </>
  );
}
