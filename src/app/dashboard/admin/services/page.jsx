"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CircleAlert, Plus, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/server-api";

function formatPrice(price) {
  const amount = Number(price);
  if (!Number.isFinite(amount)) return "—";
  return `৳${new Intl.NumberFormat("en-BD", { maximumFractionDigits: 2 }).format(amount)}`;
}

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState("loading");

  const load = () => {
    setStatus("loading");
    apiRequest("/api/admin/services")
      .then((result) => {
        setServices(result.data || []);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    apiRequest("/api/admin/services")
      .then((result) => {
        setServices(result.data || []);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  const activeCount = services.filter((service) => service.status === "active").length;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and review your salon service catalog.
          </p>
        </div>
        <div className="flex gap-2">
          <Button render={<Link href="/dashboard/admin/services/manage" />} variant="outline">
            Manage services
            <ArrowRight aria-hidden="true" />
          </Button>
          <Button render={<Link href="/dashboard/admin/services/manage?new=1" />}>
            <Plus aria-hidden="true" />
            Add service
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Total services</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{services.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Active services</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{activeCount}</p>
        </div>
      </div>

      <section className="mt-6 overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold">Service catalog</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All services, including inactive services hidden from customers.
          </p>
        </div>

        {status === "loading" && (
          <p aria-live="polite" className="p-8 text-center text-sm text-muted-foreground">
            Loading services...
          </p>
        )}

        {status === "error" && (
          <div className="p-8 text-center" role="alert">
            <CircleAlert aria-hidden="true" className="mx-auto size-5 text-destructive" />
            <p className="mt-3 text-sm text-muted-foreground">Couldn’t load services.</p>
            <Button className="mt-4" onClick={load} variant="outline">Try again</Button>
          </div>
        )}

        {status === "success" && services.length === 0 && (
          <div className="p-10 text-center">
            <Scissors aria-hidden="true" className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-3 font-medium">No services yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Add a service to begin building your catalog.</p>
            <Button className="mt-4" render={<Link href="/dashboard/admin/services/manage?new=1" />}>
              <Plus aria-hidden="true" />
              Add your first service
            </Button>
          </div>
        )}

        {status === "success" && services.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Service</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Duration</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {services.map((service) => (
                  <tr className="hover:bg-muted/30" key={service._id}>
                    <td className="px-5 py-4 font-medium">{service.serviceName || "Unnamed service"}</td>
                    <td className="px-5 py-4 text-muted-foreground">{service.category || "—"}</td>
                    <td className="px-5 py-4">{formatPrice(service.price)}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {service.duration ? `${service.duration} min` : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        service.status === "active"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {service.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
