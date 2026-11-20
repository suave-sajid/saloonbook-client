"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/server-api";
import { toast } from "sonner";

export default function CustomerAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => apiRequest("/api/appointments/my").then((r) => setAppointments(r.data || [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const cancel = async (id) => {
    try { await apiRequest(`/api/appointments/${id}/cancel`, { method: "PATCH" }); toast.success("Appointment cancelled"); load(); }
    catch (error) { toast.error(error.message); }
  };
  const pay = async (id) => {
    try {
      const result = await apiRequest("/api/payments/checkout", { method: "POST", body: JSON.stringify({ appointmentId: id }) });
      if (result.url) window.location.assign(result.url);
    } catch (error) { toast.error(error.message); }
  };
  if (loading) return <p className="text-stone-500">Loading appointments...</p>;
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#342c24] dark:text-stone-100">My appointments</h1>
      <div className="mt-6 grid gap-4">
        {appointments.map((item) => (
          <article key={item._id} className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-xl text-[#342c24] dark:text-stone-100">{item.service?.serviceName || "Salon service"}</h2>
                <p className="mt-1 text-sm text-stone-500">{item.appointmentDate} at {item.timeSlot}</p>
                <p className="mt-2 text-sm">Status: <strong>{item.status}</strong> · Payment: <strong>{item.paymentStatus}</strong></p>
              </div>
              <div className="flex gap-2">
                {item.status === "pending" && <button onClick={() => cancel(item._id)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700">Cancel</button>}
                {item.status === "confirmed" && item.paymentStatus !== "paid" && <button onClick={() => pay(item._id)} className="rounded-full bg-[#1f493c] px-4 py-2 text-sm font-semibold text-white">Pay now</button>}
              </div>
            </div>
          </article>
        ))}
        {!appointments.length && <p className="rounded-2xl border border-dashed p-10 text-center text-stone-500">You have no appointment requests.</p>}
      </div>
    </div>
  );
}
