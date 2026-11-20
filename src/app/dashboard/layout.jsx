"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/home/navbar";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const role = session?.user?.role;

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/sign-in");
      return;
    }
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") router.replace("/dashboard/customer");
    if (pathname.startsWith("/dashboard/customer") && role === "admin") router.replace("/dashboard/admin");
  }, [isPending, session, role, pathname, router]);

  if (isPending) return <div className="grid min-h-screen place-items-center"><div className="size-10 animate-spin rounded-full border-4 border-emerald-800 border-t-transparent" /></div>;
  if (!session?.user) return null;

  const isAdmin = role === "admin";
  const links = isAdmin
    ? [
        ["Overview", "/dashboard/admin"],
        ["Services", "/dashboard/admin/services"],
        ["Appointments", "/dashboard/admin/appointments"],
        ["Users", "/dashboard/admin/users"],
        ["Transactions", "/dashboard/admin/transactions"],
        ["Profile", "/profile"],
      ]
    : [
        ["Overview", "/dashboard/customer"],
        ["My Appointments", "/dashboard/customer/appointments"],
        ["Profile", "/profile"],
      ];

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-76px)] bg-[#f7f5ef] dark:bg-stone-950">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[220px_1fr]">
          <aside className="border-b border-stone-200 bg-white px-4 py-5 dark:border-stone-800 dark:bg-stone-900 lg:min-h-[calc(100vh-76px)] lg:border-b-0 lg:border-r">
            <nav className="flex gap-2 overflow-x-auto lg:flex-col">
              {links.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className={`shrink-0 rounded-lg px-3 py-2.5 text-sm font-semibold ${pathname === href ? "bg-[#e8eee7] text-[#1f493c] dark:bg-emerald-950 dark:text-emerald-200" : "text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"}`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </aside>
          <section className="min-w-0 p-5 sm:p-8">{children}</section>
        </div>
      </main>
    </>
  );
}
