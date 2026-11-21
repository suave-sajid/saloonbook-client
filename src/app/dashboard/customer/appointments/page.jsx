"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  CreditCard,
  CircleAlert,
  ImageOff,
  Info,
  LoaderCircle,
  Scissors,
  X,
} from "lucide-react";
import { apiRequest } from "@/lib/server-api";
import { toast } from "sonner";

function formatDate(value) {
  if (!value) return "Not specified";
  const date = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return "Not specified";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Not specified";
  return `৳${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

function StatusBadge({ value, type }) {
  const normalized = String(value || "").toLowerCase();
  const styles =
    type === "payment"
      ? normalized === "paid"
        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
        : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
      : normalized === "confirmed"
        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
        : normalized === "cancelled"
          ? "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300"
          : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles}`}>
      {normalized || "Unknown"}
    </span>
  );
}

export default function CustomerAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancellingId, setCancellingId] = useState("");
  const [payingId, setPayingId] = useState("");

  const load = async () => {
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

  const cancel = async (id) => {
    if (!id) return;
    setCancellingId(id);
    try {
      await apiRequest(`/api/appointments/${id}/cancel`, { method: "PATCH" });
      toast.success("Appointment cancelled.");
      setCancelTarget(null);
      await load();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCancellingId("");
    }
  };

  const pay = async (id) => {
    if (!id) return;
    setPayingId(id);
    try {
      const result = await apiRequest("/api/payments/checkout", { method: "POST", body: JSON.stringify({ appointmentId: id }) });
      if (result.url) window.location.assign(result.url);
    } catch (error) {
      toast.error(error.message);
      setPayingId("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center" role="status" aria-label="Loading appointments">
        <LoaderCircle className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My appointments</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review your requests, appointment details, and payment status.</p>
      </div>

      {error ? (
        <div className="mt-6 rounded-xl border border-destructive/30 bg-card p-8 text-center" role="alert">
          <CircleAlert aria-hidden="true" className="mx-auto size-6 text-destructive" />
          <p className="mt-3 text-sm text-muted-foreground">{error}</p>
          <button className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent" onClick={load} type="button">Try again</button>
        </div>
      ) : appointments.length ? (
        <div className="mt-6 grid gap-4">
          {appointments.map((item) => {
            const service = item.service;
            const image = service?.image || service?.imageUrl || service?.serviceImage;
            const price = item.servicePrice ?? service?.price;
            return (
              <article key={item._id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-44 shrink-0 bg-muted sm:h-auto sm:w-52">
                    {typeof image === "string" && image ? (
                      <Image
                        alt={service?.serviceName || "Salon service"}
                        className="object-cover"
                        fill
                        sizes="(max-width: 640px) 100vw, 208px"
                        src={image}
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground" role="img" aria-label="Service image unavailable">
                        <ImageOff className="size-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          {service?.category || "Salon service"}
                        </p>
                        <h2 className="mt-1 truncate text-lg font-semibold">{service?.serviceName || "Salon service"}</h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge value={item.status} />
                        <StatusBadge value={item.paymentStatus} type="payment" />
                      </div>
                    </div>

                    <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <dt className="text-xs text-muted-foreground">Appointment date</dt>
                        <dd className="mt-1 flex items-center gap-1.5 font-medium">
                          <CalendarDays className="size-4 text-muted-foreground" />
                          {formatDate(item.appointmentDate)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Appointment time</dt>
                        <dd className="mt-1 flex items-center gap-1.5 font-medium">
                          <Clock3 className="size-4 text-muted-foreground" />
                          {item.timeSlot || "Not specified"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Service price</dt>
                        <dd className="mt-1 font-semibold">{formatPrice(price)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Requested</dt>
                        <dd className="mt-1 font-medium">{formatDate(item.createdAt)}</dd>
                      </div>
                    </dl>

                    <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
                      <button
                        className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium hover:bg-accent"
                        onClick={() => setSelected(item)}
                        type="button"
                      >
                        <Info className="size-4" />
                        View details
                      </button>
                      {item.status === "pending" && (
                        <button
                          className="inline-flex h-9 items-center rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                          onClick={() => setCancelTarget(item)}
                          type="button"
                        >
                          Cancel request
                        </button>
                      )}
                      {item.status === "confirmed" && item.paymentStatus !== "paid" && (
                        <button
                          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                          disabled={payingId === item._id}
                          onClick={() => pay(item._id)}
                          type="button"
                        >
                          {payingId === item._id ? <LoaderCircle className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
                          {payingId === item._id ? "Processing..." : "Pay now"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed p-10 text-center">
          <Scissors className="mx-auto size-8 text-muted-foreground" />
          <h2 className="mt-4 font-semibold">No appointment requests</h2>
          <p className="mt-1 text-sm text-muted-foreground">When you book a service, it will appear here.</p>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelected(null);
        }}>
          <section aria-labelledby="appointment-details-title" aria-modal="true" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border bg-card p-6 shadow-xl" role="dialog">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Appointment details</p>
                <h2 className="mt-1 text-xl font-semibold" id="appointment-details-title">{selected.service?.serviceName || "Salon service"}</h2>
              </div>
              <button aria-label="Close details" className="flex size-9 items-center justify-center rounded-lg border hover:bg-accent" onClick={() => setSelected(null)} type="button">
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <StatusBadge value={selected.status} />
              <StatusBadge value={selected.paymentStatus} type="payment" />
            </div>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <div><dt className="text-muted-foreground">Category</dt><dd className="mt-1 font-medium">{selected.service?.category || "Not specified"}</dd></div>
              <div><dt className="text-muted-foreground">Price</dt><dd className="mt-1 font-medium">{formatPrice(selected.servicePrice ?? selected.service?.price)}</dd></div>
              <div><dt className="text-muted-foreground">Date</dt><dd className="mt-1 font-medium">{formatDate(selected.appointmentDate)}</dd></div>
              <div><dt className="text-muted-foreground">Time</dt><dd className="mt-1 font-medium">{selected.timeSlot || "Not specified"}</dd></div>
              <div><dt className="text-muted-foreground">Request date</dt><dd className="mt-1 font-medium">{formatDate(selected.createdAt)}</dd></div>
              <div><dt className="text-muted-foreground">Payment</dt><dd className="mt-1 font-medium capitalize">{selected.paymentStatus || "unpaid"}</dd></div>
              <div className="sm:col-span-2"><dt className="text-muted-foreground">Additional message</dt><dd className="mt-1 whitespace-pre-wrap rounded-lg bg-muted p-3">{selected.message || "No message provided."}</dd></div>
            </dl>
          </section>
        </div>
      )}

      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget && cancellingId === "") setCancelTarget(null);
        }}>
          <section aria-labelledby="cancel-request-title" aria-modal="true" className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl" role="dialog">
            <h2 className="text-lg font-semibold" id="cancel-request-title">Cancel appointment request?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This will cancel your pending request for {cancelTarget.service?.serviceName || "this service"}.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button className="h-10 rounded-lg border px-4 text-sm font-medium hover:bg-accent" disabled={cancellingId !== ""} onClick={() => setCancelTarget(null)} type="button">Keep request</button>
              <button
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white disabled:opacity-60"
                disabled={cancellingId !== ""}
                onClick={() => cancel(cancelTarget._id)}
                type="button"
              >
                {cancellingId !== "" && <LoaderCircle className="size-4 animate-spin" />}
                Cancel request
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
