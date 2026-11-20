"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/server-api";

export default function AdminTransactions() {
  const [items, setItems] = useState([]);
  useEffect(() => { apiRequest("/api/admin/transactions").then((r) => setItems(r.data || [])).catch(() => setItems([])); }, []);
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#342c24] dark:text-stone-100">Transactions</h1>
      <div className="mt-6 grid gap-3">
        {items.map((item) => (
          <article key={item._id} className="rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
            <p className="font-semibold">{item.customer?.name || item.customer?.email || "Customer"} · {item.currency?.toUpperCase()} {item.amount}</p>
            <p className="mt-1 text-sm text-stone-500">{item.status} · Session: {item.stripeSessionId?.slice(0, 18)}...</p>
          </article>
        ))}
        {!items.length && <p className="rounded-xl border border-dashed p-10 text-center text-stone-500">No transactions.</p>}
      </div>
    </div>
  );
}
