import { redirect } from "next/navigation";

export const metadata = {
  title: "My profile | SalonBook",
  description: "Manage your SalonBook profile information and photo.",
};

export default function ProfilePage() {
  redirect("/dashboard/profile");
}
