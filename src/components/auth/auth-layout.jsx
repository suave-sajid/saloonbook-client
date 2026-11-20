import AuthBranding from "./auth-branding";
import ThemeToggle from "@/components/theme-toggle";

export default function AuthLayout({
  children,
  description,
  image,
  title,
}) {
  return (
    <main className="h-dvh overflow-hidden bg-[#faf8f6] text-stone-900 transition-colors dark:bg-stone-950 dark:text-stone-100">
      <div className="mx-auto grid h-full min-h-0 max-w-[1600px] overflow-hidden bg-white shadow-[0_24px_80px_-40px_rgba(47,32,28,0.28)] dark:bg-stone-950 md:grid-cols-[0.9fr_1.1fr] lg:grid-cols-2">
        <AuthBranding
          description={description}
          image={image}
          title={title}
        />
        <section className="auth-section flex h-full min-h-0 min-w-0 flex-col overflow-hidden px-5 py-5 sm:px-10 sm:py-7 md:px-8 lg:px-12 lg:py-8 xl:px-16">
          <div className="auth-toolbar mb-6 flex shrink-0 items-center justify-between md:mb-4 md:justify-end">
            <div className="md:hidden">
              <AuthBranding compact />
            </div>
            <ThemeToggle />
          </div>
          <div className="auth-content-scroll flex min-h-0 flex-1 items-center overflow-hidden">
            <div className="mx-auto w-full max-w-[440px] py-1">
              {children}
            </div>
          </div>
          <p className="auth-footer mt-4 shrink-0 text-center text-xs text-stone-400 dark:text-stone-500">
            © {new Date().getFullYear()} SalonBook. All rights reserved.
          </p>
        </section>
      </div>
    </main>
  );
}
