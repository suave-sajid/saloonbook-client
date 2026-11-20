"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/server-api";

export default function CustomerOverview() {
  const [appointments, setAppointments] = useState([]);
  useEffect(() => { apiRequest("/api/appointments/my").then((r) => setAppointments(r.data || [])).catch(() => setAppointments([])); }, []);
  const counts = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#342c24] dark:text-stone-100">Customer overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(counts).map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-[#1f493c] dark:text-emerald-300">{value}</p>
          </div>
        ))}
      </div>
      <Link href="/dashboard/customer/appointments" className="mt-6 inline-flex rounded-full bg-[#1f493c] px-5 py-3 text-sm font-semibold text-white">View my appointments</Link>
    </div>
  );
}
