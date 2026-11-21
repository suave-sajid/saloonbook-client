"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarCheck2, CalendarClock, CalendarDays, CircleAlert, CircleX, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/server-api";

const metricConfig = [
  { key: "total", label: "Total requests", icon: CalendarDays },
  { key: "pending", label: "Pending", icon: CalendarClock },
  { key: "confirmed", label: "Confirmed", icon: CalendarCheck2 },
  { key: "cancelled", label: "Cancelled", icon: CircleX },
];

export default function CustomerOverview() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest("/api/appointments/my");
      setAppointments(Array.isArray(result.data) ? result.data : []);
    } catch (requestError) {
      setError(requestError.message || "Could not load your appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    apiRequest("/api/appointments/my")
      .then((result) => setAppointments(Array.isArray(result.data) ? result.data : []))
      .catch((requestError) => setError(requestError.message || "Could not load your appointments."))
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };
  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">Keep track of your salon appointments.</p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricConfig.map(({ key, label, icon: Icon }) => (
          <article key={key} className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon aria-hidden="true" className="size-4" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight">
              {loading || error ? <span className="text-muted-foreground">—</span> : counts[key]}
            </p>
          </article>
        ))}
      </div>
      <section className="mt-6 rounded-xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
        {loading ? (
          <p aria-live="polite" className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            Loading your appointment summary...
          </p>
        ) : error ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" role="alert">
            <p className="flex items-center gap-2 text-sm text-destructive">
              <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
              {error}
            </p>
            <Button onClick={loadAppointments} variant="outline">Try again</Button>
          </div>
        ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Your appointments</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Review request status or continue to payment for confirmed visits.
            </p>
          </div>
          <Button render={<Link href="/dashboard/customer/appointments" />}>
            View appointments
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
        )}
      </section>
    </div>
  );
}
