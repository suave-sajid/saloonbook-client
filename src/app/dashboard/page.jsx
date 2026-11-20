"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  useEffect(() => {
    if (!isPending) router.replace(session?.user?.role === "admin" ? "/dashboard/admin" : "/dashboard/customer");
  }, [isPending, session, router]);
  return null;
}
