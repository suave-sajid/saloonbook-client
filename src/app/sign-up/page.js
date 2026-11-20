import AuthLayout from "@/components/auth/auth-layout";
import SignUpForm from "@/components/auth/sign-up-form";

export const metadata = {
  title: "Create an account | SalonBook",
  description: "Join SalonBook and make every appointment effortless.",
};

export default function SignUpPage() {
  return (
    <AuthLayout activeTab="sign-up">
      <SignUpForm />
    </AuthLayout>
  );
}
