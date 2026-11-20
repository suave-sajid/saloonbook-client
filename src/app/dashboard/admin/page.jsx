"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CircleDollarSign, Scissors, UsersRound } from "lucide-react";
import { apiRequest } from "@/lib/server-api";

const metrics = [
  { key: "totalCustomers", label: "Registered customers", icon: UsersRound },
  { key: "activeServices", label: "Active services", icon: Scissors },
  { key: "totalAppointments", label: "Appointment requests", icon: CalendarDays },
  { key: "pendingAppointments", label: "Pending appointments", icon: CalendarDays },
  { key: "confirmedAppointments", label: "Confirmed appointments", icon: CalendarDays },
  { key: "successfulPayments", label: "Successful payments", icon: CircleDollarSign },
];

export default function AdminOverview() {
  const [data, setData] = useState(null);
  useEffect(() => { apiRequest("/api/admin/dashboard").then((r) => setData(r.data)).catch(() => setData(null)); }, []);
  if (!data) return <p aria-live="polite" className="text-sm text-muted-foreground">Loading dashboard...</p>;
  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">A quick look at your salon activity.</p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map(({ key, label, icon: Icon }) => (
          <article key={key} className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon aria-hidden="true" className="size-4" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight">{data[key] ?? 0}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
