"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/server-api";
import { toast } from "sonner";

export default function AdminAppointments() {
  const [items, setItems] = useState([]);
  const load = () => apiRequest("/api/appointments").then((r) => setItems(r.data || []));
  useEffect(() => { load(); }, []);
  const update = async (id, status) => {
    try { await apiRequest(`/api/appointments/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); toast.success(`Appointment ${status}`); load(); }
    catch (error) { toast.error(error.message); }
  };
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#342c24] dark:text-stone-100">Manage appointments</h1>
      <div className="mt-6 grid gap-3">
        {items.map((item) => (
          <article key={item._id} className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <div><h2 className="font-semibold">{item.service?.serviceName || "Salon service"} · {item.customer?.name || item.customer?.email || "Customer"}</h2><p className="mt-1 text-sm text-stone-500">{item.appointmentDate} at {item.timeSlot} · ৳{item.servicePrice}</p><p className="mt-2 text-sm">{item.status} · {item.paymentStatus}</p></div>
              <div className="flex gap-2">
                {item.status === "pending" && <button onClick={() => update(item._id, "confirmed")} className="rounded-lg bg-emerald-700 px-3 py-2 text-sm text-white">Confirm</button>}
                {["pending", "confirmed"].includes(item.status) && <button onClick={() => update(item._id, "cancelled")} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700">Cancel</button>}
              </div>
            </div>
          </article>
        ))}
        {!items.length && <p className="rounded-xl border border-dashed p-10 text-center text-stone-500">No appointment requests.</p>}
      </div>
    </div>
  );
}
