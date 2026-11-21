"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CircleAlert, CircleDollarSign, LoaderCircle, Scissors, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest("/api/admin/dashboard");
      setData(result.data);
    } catch (requestError) {
      setError(requestError.message || "Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    apiRequest("/api/admin/dashboard")
      .then((result) => setData(result.data))
      .catch((requestError) => setError(requestError.message || "Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">A quick look at your salon activity.</p>
      </div>
      {loading ? (
        <div className="mt-6 flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
          <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
          Loading dashboard data...
        </div>
      ) : error ? (
        <div className="mt-6 rounded-xl border border-destructive/30 bg-card p-8 text-center" role="alert">
          <CircleAlert aria-hidden="true" className="mx-auto size-6 text-destructive" />
          <p className="mt-3 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-4" onClick={loadDashboard} variant="outline">Try again</Button>
        </div>
      ) : (
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map(({ key, label, icon: Icon }) => (
          <article key={key} className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon aria-hidden="true" className="size-4" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight">{data?.[key] ?? 0}</p>
          </article>
        ))}
      </div>
      )}
    </div>
  );
}
