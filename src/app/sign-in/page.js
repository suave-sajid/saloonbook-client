import AuthLayout from "@/components/auth/auth-layout";
import SignInForm from "@/components/auth/sign-in-form";

export const metadata = {
  title: "Sign in | SalonBook",
  description: "Sign in to continue your SalonBook beauty journey.",
};

export default function SignInPage() {
  return (
    <AuthLayout activeTab="sign-in">
      <SignInForm />
    </AuthLayout>
  );
}
