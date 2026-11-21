"use client";

import { useCallback, useEffect, useState } from "react";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { apiRequest } from "@/lib/server-api";
import { toast } from "sonner";

export default function AdminAppointments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest("/api/appointments");
      setItems(Array.isArray(result.data) ? result.data : []);
    } catch (requestError) {
      setError(requestError.message || "Could not load appointment requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    apiRequest("/api/appointments")
      .then((result) => setItems(Array.isArray(result.data) ? result.data : []))
      .catch((requestError) => setError(requestError.message || "Could not load appointment requests."))
      .finally(() => setLoading(false));
  }, []);
  const update = async (id, status) => {
    try { await apiRequest(`/api/appointments/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); toast.success(`Appointment ${status}`); load(); }
    catch (error) { toast.error(error.message); }
  };
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#342c24] dark:text-stone-100">Manage appointments</h1>
      <div className="mt-6 grid gap-3">
        {loading && <p aria-live="polite" className="flex items-center justify-center gap-2 rounded-xl border p-8 text-sm text-muted-foreground" role="status"><LoaderCircle aria-hidden="true" className="size-4 animate-spin" />Loading appointment requests...</p>}
        {!loading && error && <div className="rounded-xl border border-destructive/30 p-8 text-center" role="alert"><CircleAlert aria-hidden="true" className="mx-auto size-5 text-destructive" /><p className="mt-2 text-sm text-muted-foreground">{error}</p><button className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent" onClick={load} type="button">Try again</button></div>}
        {!loading && !error && items.map((item) => (
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
        {!loading && !error && !items.length && <p className="rounded-xl border border-dashed p-10 text-center text-stone-500">No appointment requests.</p>}
      </div>
    </div>
  );
}
