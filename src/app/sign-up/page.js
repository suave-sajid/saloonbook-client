import AuthLayout from "@/components/auth/auth-layout";
import SignUpForm from "@/components/auth/sign-up-form";

export const metadata = {
  title: "Create an account | SalonBook",
  description: "Join SalonBook and make every appointment effortless.",
};

export default function SignUpPage() {
  return (
    <AuthLayout
      description="Discover exceptional salon services and book your next appointment with ease."
      image="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=85"
      title="Your beauty journey starts here."
    >
      <SignUpForm />
    </AuthLayout>
  );
}
