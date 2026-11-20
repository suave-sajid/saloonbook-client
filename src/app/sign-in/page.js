import AuthLayout from "@/components/auth/auth-layout";
import SignInForm from "@/components/auth/sign-in-form";

export const metadata = {
  title: "Sign in | SalonBook",
  description: "Sign in to continue your SalonBook beauty journey.",
};

export default function SignInPage() {
  return (
    <AuthLayout
      description="Your next moment of self-care is just a few clicks away."
      image="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=85"
      title="Welcome back to SalonBook."
    >
      <SignInForm />
    </AuthLayout>
  );
}
