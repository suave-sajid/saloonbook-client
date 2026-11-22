"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  CircleDollarSign,
  Scissors,
  ShieldCheck,
  UsersRound,
  UserRound,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const adminLinks = [
  { label: "Overview", href: "/dashboard/admin", icon: ChartNoAxesColumnIncreasing },
  { label: "Services", href: "/dashboard/admin/services", icon: Scissors },
  { label: "Manage services", href: "/dashboard/admin/services/manage", icon: Scissors },
  { label: "Appointments", href: "/dashboard/admin/appointments", icon: CalendarDays },
  { label: "Customers", href: "/dashboard/admin/users", icon: UsersRound },
  { label: "Transactions", href: "/dashboard/admin/transactions", icon: CircleDollarSign },
  { label: "My profile", href: "/dashboard/profile", icon: UserRound },
];

const customerLinks = [
  { label: "Overview", href: "/dashboard/customer", icon: ChartNoAxesColumnIncreasing },
  { label: "My appointments", href: "/dashboard/customer/appointments", icon: CalendarDays },
  { label: "My profile", href: "/dashboard/profile", icon: UserRound },
];

function isActiveLink(pathname, href) {
  if (href === "/dashboard/admin" || href === "/dashboard/customer") {
    return pathname === href;
  }
  if (href === "/dashboard/admin/services") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

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
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      router.replace("/dashboard/customer");
    }
    if (pathname.startsWith("/dashboard/customer") && role === "admin") {
      router.replace("/dashboard/admin");
    }
  }, [isPending, session, role, pathname, router]);

  if (isPending) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted">
        <div
          aria-label="Loading dashboard"
          className="size-8 animate-spin rounded-full border-[3px] border-primary border-t-transparent"
          role="status"
        />
      </div>
    );
  }
  if (!session?.user) return null;

  const isAdmin = role === "admin";
  const links = isAdmin ? adminLinks : customerLinks;
  const currentPage = links.find((item) => isActiveLink(pathname, item.href));
  const userName = session.user.name || session.user.email || "SalonBook user";
  const initials = userName.slice(0, 1).toUpperCase();

  return (
    <div className="min-h-screen bg-muted/40 text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex h-16 items-center gap-3 border-b px-5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Scissors aria-hidden="true" className="size-4" />
          </span>
          <div className="leading-tight">
            <Link href="/" className="font-serif text-lg font-semibold tracking-tight">
              SalonBook
            </Link>
            <p className="mt-0.5 text-[11px] text-sidebar-foreground/60">Salon workspace</p>
          </div>
        </div>

        <div className="px-3 pt-6">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/50">
            Workspace
          </p>
          <nav aria-label="Dashboard navigation" className="grid gap-1">
            {links.map(({ label, href, icon: Icon }) => {
              const active = isActiveLink(pathname, href);
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
                  }`}
                  href={href}
                  key={href}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/60 p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{userName}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs capitalize text-sidebar-foreground/60">
                {isAdmin && <ShieldCheck aria-hidden="true" className="size-3" />}
                {isAdmin ? "Administrator" : "Customer"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground lg:hidden">
                <Scissors aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  <span className="lg:hidden">SalonBook</span>
                  <span className="hidden lg:inline">{currentPage?.label || "Dashboard"}</span>
                </p>
                <p className="hidden text-xs text-muted-foreground lg:block">
                  {isAdmin ? "Administrator workspace" : "Your personal workspace"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden max-w-48 truncate text-sm text-muted-foreground sm:inline">
                {userName}
              </span>
              <Button
                className="gap-2"
                render={<Link href="/" />}
                size="sm"
                variant="outline"
              >
                <span className="hidden sm:inline">Visit site</span>
                <ArrowUpRight aria-hidden="true" />
              </Button>
            </div>
          </div>
          <nav
            aria-label="Mobile dashboard navigation"
            className="flex gap-1 overflow-x-auto border-t px-3 py-2 lg:hidden"
          >
            {links.map(({ label, href, icon: Icon }) => {
              const active = isActiveLink(pathname, href);
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-medium ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                  href={href}
                  key={href}
                >
                  <Icon aria-hidden="true" className="size-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
