"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  CircleAlert,
  Clock3,
  ImageOff,
  Info,
  LoaderCircle,
  Mail,
  Phone,
  UserRound,
  X,
} from "lucide-react";
import { apiRequest } from "@/lib/server-api";
import { getImageSource, shouldOptimizeImage } from "@/lib/image-optimization";
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
  return `৳${new Intl.NumberFormat("en-BD", { maximumFractionDigits: 2 }).format(amount)}`;
}

function StatusBadge({ value, type }) {
  const normalized = String(value || "").toLowerCase();
  const styles = type === "payment"
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

function Detail({ label, children, className = "" }) {
  return (
    <div className={className}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium">{children || "Not specified"}</dd>
    </div>
  );
}

export default function AdminAppointments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState("");

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

  useEffect(() => {
    if (!selected) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  const update = async (item, status) => {
    setUpdatingId(item._id);
    try {
      await apiRequest(`/api/appointments/${item._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`Appointment ${status}.`);
      if (selected?._id === item._id) setSelected(null);
      await load();
    } catch (requestError) {
      toast.error(requestError.message || "Could not update this appointment.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Manage appointments</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review appointment requests and manage their status.</p>
      </div>

      <div className="mt-6 grid gap-4">
        {loading ? (
          <div aria-label="Loading appointments" className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
            <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
            Loading appointment requests...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/30 bg-card p-8 text-center" role="alert">
            <CircleAlert aria-hidden="true" className="mx-auto size-6 text-destructive" />
            <p className="mt-3 text-sm text-muted-foreground">{error}</p>
            <button className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent" onClick={load} type="button">
              Try again
            </button>
          </div>
        ) : items.length ? (
          items.map((item) => {
            const service = item.service;
            const image = service?.image || service?.imageUrl || service?.serviceImage;
            const price = item.servicePrice ?? service?.price;

            return (
              <article className="overflow-hidden rounded-xl border bg-card shadow-sm" key={item._id}>
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-48 shrink-0 bg-muted sm:h-auto sm:w-52">
                    {typeof image === "string" && image ? (
                      <Image
                        alt={service?.serviceName || "Salon service"}
                        className="object-cover"
                        fill
                        sizes="(max-width: 640px) 100vw, 208px"
                        src={getImageSource(image)}
                        unoptimized={!shouldOptimizeImage(image)}
                      />
                    ) : (
                      <div aria-label="Service image unavailable" className="flex h-full min-h-32 items-center justify-center text-muted-foreground" role="img">
                        <ImageOff aria-hidden="true" className="size-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          {service?.category || "Salon service"}
                        </p>
                        <h2 className="mt-1 truncate text-lg font-semibold">
                          {service?.serviceName || "Salon service"}
                        </h2>
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {item.customer?.name || item.customer?.email || "Customer"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge value={item.status} />
                        <StatusBadge value={item.paymentStatus} type="payment" />
                      </div>
                    </div>

                    <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <dt className="text-xs text-muted-foreground">Appointment date</dt>
                        <dd className="mt-1 flex items-center gap-1.5 font-medium">
                          <CalendarDays aria-hidden="true" className="size-4 text-muted-foreground" />
                          {formatDate(item.appointmentDate)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Appointment time</dt>
                        <dd className="mt-1 flex items-center gap-1.5 font-medium">
                          <Clock3 aria-hidden="true" className="size-4 text-muted-foreground" />
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
                        <Info aria-hidden="true" className="size-4" />
                        View details
                      </button>
                      {item.status === "pending" && (
                        <button
                          className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-700 px-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
                          disabled={updatingId === item._id}
                          onClick={() => update(item, "confirmed")}
                          type="button"
                        >
                          {updatingId === item._id && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
                          Confirm
                        </button>
                      )}
                      {["pending", "confirmed"].includes(item.status) && (
                        <button
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                          disabled={updatingId === item._id}
                          onClick={() => update(item, "cancelled")}
                          type="button"
                        >
                          {updatingId === item._id && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            No appointment requests.
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
          role="presentation"
        >
          <section
            aria-labelledby="admin-appointment-details-title"
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-card p-5 shadow-xl sm:p-7"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Appointment details</p>
                <h2 className="mt-1 text-xl font-semibold" id="admin-appointment-details-title">
                  {selected.service?.serviceName || "Salon service"}
                </h2>
              </div>
              <button
                aria-label="Close appointment details"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg border hover:bg-accent"
                onClick={() => setSelected(null)}
                type="button"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge value={selected.status} />
              <StatusBadge value={selected.paymentStatus} type="payment" />
            </div>

            <section className="mt-5 rounded-xl bg-muted/50 p-4">
              <h3 className="text-sm font-semibold">Customer information</h3>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium">
                <UserRound aria-hidden="true" className="size-4 text-muted-foreground" />
                {selected.customer?.name || "Customer"}
              </p>
              {selected.customer?.email && (
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail aria-hidden="true" className="size-4" />
                  {selected.customer.email}
                </p>
              )}
              {selected.customer?.phoneNumber && (
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone aria-hidden="true" className="size-4" />
                  {selected.customer.phoneNumber}
                </p>
              )}
            </section>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <Detail label="Service category">{selected.service?.category}</Detail>
              <Detail label="Service price">{formatPrice(selected.servicePrice ?? selected.service?.price)}</Detail>
              <Detail label="Appointment date">{formatDate(selected.appointmentDate)}</Detail>
              <Detail label="Appointment time">{selected.timeSlot}</Detail>
              <Detail label="Request date">{formatDate(selected.createdAt)}</Detail>
              <Detail label="Payment status">{selected.paymentStatus || "Unpaid"}</Detail>
              <Detail className="sm:col-span-2" label="Customer message">
                <span className="whitespace-pre-wrap">{selected.message || "No message provided."}</span>
              </Detail>
            </dl>

            {(selected.status === "pending" || selected.status === "confirmed") && (
              <div className="mt-6 flex flex-col-reverse justify-end gap-2 border-t pt-4 sm:flex-row">
                {selected.status === "pending" && (
                  <button
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
                    disabled={updatingId === selected._id}
                    onClick={() => update(selected, "confirmed")}
                    type="button"
                  >
                    {updatingId === selected._id && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
                    Confirm appointment
                  </button>
                )}
                <button
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                  disabled={updatingId === selected._id}
                  onClick={() => update(selected, "cancelled")}
                  type="button"
                >
                  {updatingId === selected._id && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
                  Cancel appointment
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
