"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { CircleAlert, Eye, LoaderCircle, Mail, MapPin, Phone, UserRound, X } from "lucide-react";
import { apiRequest } from "@/lib/server-api";
import { toast } from "sonner";

function formatDate(value) {
  if (!value) return "Not provided";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not provided"
    : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function userAddress(user) {
  return [user.city, user.country].filter(Boolean).join(", ");
}

function UserDetail({ label, value }) {
  return (
    <div className="min-w-0 border-b py-3 last:border-0">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium">{value || "Not provided"}</dd>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest("/api/admin/users");
      setUsers(Array.isArray(result.data) ? result.data : []);
    } catch (requestError) {
      setError(requestError.message || "Could not load customers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    apiRequest("/api/admin/users")
      .then((result) => setUsers(Array.isArray(result.data) ? result.data : []))
      .catch((requestError) => setError(requestError.message || "Could not load customers."))
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

  const toggle = async (user) => {
    try {
      await apiRequest(`/api/admin/users/${user._id}/block`, {
        method: "PATCH",
        body: JSON.stringify({ isBlocked: !user.isBlocked }),
      });
      toast.success(user.isBlocked ? "User unblocked" : "User blocked");
      await load();
    } catch (requestError) {
      toast.error(requestError.message || "Could not update this account.");
    }
  };

  return (
    <div>
      <div>
        <h1 className="font-serif text-3xl text-[#342c24] dark:text-stone-100">Manage users</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review customer profiles and manage account access.</p>
      </div>

      <div className="mt-6 grid gap-3">
        {loading && (
          <p aria-live="polite" className="flex items-center justify-center gap-2 rounded-xl border p-8 text-sm text-muted-foreground" role="status">
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            Loading customers...
          </p>
        )}
        {!loading && error && (
          <div className="rounded-xl border border-destructive/30 p-8 text-center" role="alert">
            <CircleAlert aria-hidden="true" className="mx-auto size-5 text-destructive" />
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <button className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent" onClick={load} type="button">
              Try again
            </button>
          </div>
        )}
        {!loading && !error && users.map((user) => {
          const address = userAddress(user);
          return (
            <article
              key={user._id}
              className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full border bg-muted">
                  <Image
                    alt={`${user.name || "Customer"} profile photo`}
                    className="object-cover"
                    fill
                    sizes="48px"
                    src={user.image || "/avatar-default.svg"}
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-semibold">{user.name || "Unnamed user"}</h2>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${user.isBlocked ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"}`}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </div>
                  <p className="mt-0.5 flex min-w-0 items-center gap-1.5 truncate text-sm text-muted-foreground">
                    <Mail aria-hidden="true" className="size-3.5 shrink-0" />
                    {user.email || "Email not provided"}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone aria-hidden="true" className="size-3.5 shrink-0" />
                    {user.phoneNumber || "Phone not provided"}
                  </p>
                  {address && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
                      <span className="truncate">{address}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2 border-t pt-3 sm:flex-row sm:border-0 sm:pt-0">
                <button
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium hover:bg-accent"
                  onClick={() => setSelected(user)}
                  type="button"
                >
                  <Eye aria-hidden="true" className="size-4" />
                  View details
                </button>
                <button
                  className={`h-9 rounded-lg border px-3 text-sm font-medium ${user.isBlocked ? "text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/30" : "text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/30"}`}
                  onClick={() => toggle(user)}
                  type="button"
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
              </div>
            </article>
          );
        })}
        {!loading && !error && users.length === 0 && (
          <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">No customers found.</p>
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
            aria-labelledby="user-details-title"
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border bg-card p-5 shadow-xl sm:p-7"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Customer account</p>
                <h2 className="mt-1 text-xl font-semibold" id="user-details-title">User details</h2>
              </div>
              <button
                aria-label="Close user details"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg border hover:bg-accent"
                onClick={() => setSelected(null)}
                type="button"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>

            <div className="mt-5 flex min-w-0 items-center gap-4 rounded-xl bg-muted/50 p-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-full border bg-background">
                <Image
                  alt={`${selected.name || "Customer"} profile photo`}
                  className="object-cover"
                  fill
                  sizes="64px"
                  src={selected.image || "/avatar-default.svg"}
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-semibold">{selected.name || "Unnamed user"}</h3>
                <p className="truncate text-sm text-muted-foreground">{selected.email || "Email not provided"}</p>
                <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${selected.isBlocked ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"}`}>
                  {selected.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
            </div>

            <dl className="mt-4 grid gap-x-6 sm:grid-cols-2">
              <UserDetail label="Full name" value={selected.name} />
              <UserDetail label="Email address" value={selected.email} />
              <UserDetail label="Phone number" value={selected.phoneNumber} />
              <UserDetail label="Gender" value={selected.gender} />
              <UserDetail label="Date of birth" value={formatDate(selected.dateOfBirth)} />
              <UserDetail label="City" value={selected.city} />
              <UserDetail label="Country" value={selected.country} />
              <UserDetail label="Account type" value={selected.role || "customer"} />
              <UserDetail label="Member since" value={formatDate(selected.createdAt)} />
              <div className="border-b py-3 last:border-0">
                <dt className="text-xs font-medium text-muted-foreground">Account status</dt>
                <dd className="mt-1 text-sm font-medium">{selected.isBlocked ? "Blocked" : "Active"}</dd>
              </div>
            </dl>
          </section>
        </div>
      )}
    </div>
  );
}
