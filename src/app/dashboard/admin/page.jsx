"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/server-api";

export default function AdminOverview() {
  const [data, setData] = useState(null);
  useEffect(() => { apiRequest("/api/admin/dashboard").then((r) => setData(r.data)).catch(() => setData(null)); }, []);
  if (!data) return <p className="text-stone-500">Loading dashboard...</p>;
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#342c24] dark:text-stone-100">Admin overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Object.entries(data).map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{label.replace(/([A-Z])/g, " $1")}</p>
            <p className="mt-2 text-3xl font-semibold text-[#1f493c] dark:text-emerald-300">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
