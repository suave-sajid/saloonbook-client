"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Copy,
  CreditCard,
  LoaderCircle,
  ReceiptText,
  RefreshCw,
  Scissors,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/server-api";

function formatDate(value, includeTime = false) {
  if (!value) return "Not available";
  const date = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    ...(includeTime ? { timeStyle: "short" } : {}),
  }).format(date);
}

function formatAmount(amount, currency) {
  const numericAmount = Number(amount);
  const currencyCode = typeof currency === "string" ? currency.toUpperCase() : "";
  if (!Number.isFinite(numericAmount)) return currencyCode || "Amount unavailable";
  if (!/^[A-Z]{3}$/.test(currencyCode)) return `${numericAmount.toFixed(2)} ${currencyCode}`;

  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: currencyCode,
    }).format(numericAmount);
  } catch {
    return `${numericAmount.toFixed(2)} ${currencyCode}`;
  }
}

function PaymentStatus({ status }) {
  const normalized = String(status || "unknown").toLowerCase();
  const style = normalized === "paid"
    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
    : normalized === "failed"
      ? "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300"
      : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${style}`}>
      {normalized === "paid" && <CheckCircle2 aria-hidden="true" className="size-3.5" />}
      {normalized}
    </span>
  );
}

function Detail({ label, children, className = "" }) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium">{children || "Not available"}</dd>
    </div>
  );
}

export default function AdminTransactions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest("/api/admin/transactions");
      setItems(Array.isArray(result.data) ? result.data : []);
    } catch (requestError) {
      setError(requestError.message || "Could not load transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadInitialTransactions = async () => {
      try {
        const result = await apiRequest("/api/admin/transactions");
        if (!cancelled) {
          setItems(Array.isArray(result.data) ? result.data : []);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || "Could not load transactions.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadInitialTransactions();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selected) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  const copySessionId = async (sessionId) => {
    if (!sessionId) return;
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      toast.success("Checkout session ID copied.");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy the checkout session ID.");
    }
  };

  const closeDetails = () => {
    setSelected(null);
    setCopied(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Payments</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Transactions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View payment records confirmed by Stripe.
          </p>
        </div>
        <button
          className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg border px-3 text-sm font-medium hover:bg-accent disabled:opacity-60 sm:self-auto"
          disabled={loading}
          onClick={loadTransactions}
          type="button"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
        <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <p>
          Payment status is set by verified Stripe webhook events. Admins can view transaction records but cannot manually mark a payment as successful.
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-muted-foreground" role="status">
          <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
          Loading transactions...
        </div>
      ) : error ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/30" role="alert">
          <CircleAlert aria-hidden="true" className="mx-auto size-6 text-red-700 dark:text-red-300" />
          <h2 className="mt-3 font-semibold">Transactions could not be loaded</h2>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <button
            className="mt-4 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
            onClick={loadTransactions}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed p-10 text-center">
          <ReceiptText aria-hidden="true" className="mx-auto size-8 text-muted-foreground" />
          <h2 className="mt-4 font-semibold">No transactions yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Successful appointment payments will appear here after Stripe verifies them.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {items.map((item) => {
            const customer = item.customer;
            const appointment = item.appointment;
            const service = appointment?.service;
            const sessionId = item.stripeSessionId || "";

            return (
              <article className="overflow-hidden rounded-xl border bg-card shadow-sm" key={item._id}>
                <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">Customer</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                          <UserRound aria-hidden="true" className="size-4 text-muted-foreground" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{customer?.name || "Customer"}</p>
                          <p className="truncate text-xs text-muted-foreground">{customer?.email || "Email unavailable"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">Related service</p>
                      <p className="mt-1 truncate text-sm font-semibold">{service?.serviceName || "Service unavailable"}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {service?.category || "Category unavailable"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Appointment date</p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                        <CalendarDays aria-hidden="true" className="size-4 text-muted-foreground" />
                        {formatDate(appointment?.appointmentDate)}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock3 aria-hidden="true" className="size-3.5" />
                        {appointment?.timeSlot || "Time unavailable"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Payment amount</p>
                      <p className="mt-1 text-base font-semibold">{formatAmount(item.amount, item.currency)}</p>
                      <div className="mt-1"><PaymentStatus status={item.status} /></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t pt-4 lg:w-64 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">Stripe Checkout Session</p>
                      <p className="mt-1 truncate font-mono text-xs" title={sessionId || "Session ID unavailable"}>
                        {sessionId ? `${sessionId.slice(0, 20)}...` : "Unavailable"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Paid {formatDate(item.createdAt, true)}
                      </p>
                    </div>
                    <button
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium hover:bg-accent"
                      onClick={() => setSelected(item)}
                      type="button"
                    >
                      <ReceiptText aria-hidden="true" className="size-4" />
                      View details
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDetails();
          }}
          role="presentation"
        >
          <section
            aria-labelledby="transaction-details-title"
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-card p-6 shadow-xl"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Payment record</p>
                <h2 className="mt-1 text-xl font-semibold" id="transaction-details-title">Transaction details</h2>
              </div>
              <button
                aria-label="Close transaction details"
                className="flex size-9 items-center justify-center rounded-lg border hover:bg-accent"
                onClick={closeDetails}
                type="button"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-muted p-4">
              <div>
                <p className="text-xs text-muted-foreground">Verified payment</p>
                <p className="mt-1 flex items-center gap-2 text-lg font-semibold">
                  <CreditCard aria-hidden="true" className="size-5 text-muted-foreground" />
                  {formatAmount(selected.amount, selected.currency)}
                </p>
              </div>
              <PaymentStatus status={selected.status} />
            </div>

            <dl className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <Detail label="Customer name">{selected.customer?.name}</Detail>
              <Detail label="Customer email">{selected.customer?.email}</Detail>
              <Detail label="Service name">
                <span className="inline-flex items-center gap-1.5">
                  <Scissors aria-hidden="true" className="size-4 text-muted-foreground" />
                  {selected.appointment?.service?.serviceName || "Service unavailable"}
                </span>
              </Detail>
              <Detail label="Service category">{selected.appointment?.service?.category}</Detail>
              <Detail label="Appointment date">{formatDate(selected.appointment?.appointmentDate)}</Detail>
              <Detail label="Appointment time">{selected.appointment?.timeSlot}</Detail>
              <Detail label="Payment amount">{formatAmount(selected.amount, selected.currency)}</Detail>
              <Detail label="Currency">{selected.currency?.toUpperCase()}</Detail>
              <Detail label="Payment status">{selected.status}</Detail>
              <Detail label="Transaction date">{formatDate(selected.createdAt, true)}</Detail>
              <Detail className="sm:col-span-2" label="Stripe Checkout Session ID">
                <div className="flex items-start justify-between gap-3 rounded-lg bg-muted p-3">
                  <code className="break-all text-xs">{selected.stripeSessionId || "Not available"}</code>
                  {selected.stripeSessionId && (
                    <button
                      aria-label={copied ? "Session ID copied" : "Copy Stripe session ID"}
                      className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background hover:bg-accent"
                      onClick={() => copySessionId(selected.stripeSessionId)}
                      type="button"
                    >
                      {copied ? <CheckCircle2 aria-hidden="true" className="size-4 text-emerald-600" /> : <Copy aria-hidden="true" className="size-4" />}
                    </button>
                  )}
                </div>
              </Detail>
            </dl>
          </section>
        </div>
      )}
    </div>
  );
}
