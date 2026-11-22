"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, CircleAlert, LoaderCircle, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/server-api";

const emptyForm = {
  serviceName: "",
  category: "",
  description: "",
  price: "",
  duration: "",
  image: "",
  status: "active",
};

const fields = [
  ["serviceName", "Service name", "text"],
  ["category", "Category", "text"],
  ["price", "Price (৳)", "number"],
  ["duration", "Duration (minutes)", "number"],
];

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState("");
  const imageInputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const result = await apiRequest("/api/admin/services");
      setServices(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      setLoadError(error.message || "Couldn’t load services.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    apiRequest("/api/admin/services")
      .then((result) => setServices(Array.isArray(result.data) ? result.data : []))
      .catch((error) => setLoadError(error.message || "Couldn’t load services."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!deleteTarget || deletingId) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setDeleteTarget(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [deleteTarget, deletingId]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(null);
  };

  const uploadImage = async (event) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Choose a PNG, JPG, or WEBP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Choose an image smaller than 5 MB.");
      return;
    }

    setIsUploading(true);
    try {
      const body = new FormData();
      body.set("image", file);
      const result = await apiRequest("/api/upload/image", {
        method: "POST",
        body,
      });
      if (!result.url) throw new Error("The image upload returned no URL.");
      setForm((current) => ({ ...current, image: result.url }));
      toast.success("Service image uploaded.");
    } catch (error) {
      toast.error(error.message || "Couldn’t upload the service image.");
    } finally {
      setIsUploading(false);
    }
  };

  const save = async (event) => {
    event.preventDefault();
    if (!form.image.trim()) {
      toast.error("Upload a service image before saving.");
      return;
    }
    setSaving(true);
    try {
      await apiRequest(
        editing ? `/api/admin/services/${editing}` : "/api/admin/services",
        {
          method: editing ? "PATCH" : "POST",
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            duration: Number(form.duration),
          }),
        },
      );
      toast.success(editing ? "Service updated" : "Service created");
      resetForm();
      await load();
    } catch (error) {
      toast.error(error.message || "Couldn’t save service.");
    } finally {
      setSaving(false);
    }
  };

  const edit = (service) => {
    setEditing(service._id);
    setForm({
      serviceName: service.serviceName || "",
      category: service.category || "",
      description: service.description || "",
      price: service.price ?? "",
      duration: service.duration ?? "",
      image: service.image || "",
      status: service.status || "active",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleStatus = async (service) => {
    const nextStatus = service.status === "active" ? "inactive" : "active";
    try {
      await apiRequest(`/api/admin/services/${service._id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      toast.success(`Service ${nextStatus === "active" ? "activated" : "deactivated"}`);
      await load();
    } catch (error) {
      toast.error(error.message || "Couldn’t update service status.");
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget._id);
    try {
      await apiRequest(`/api/admin/services/${deleteTarget._id}`, { method: "DELETE" });
      toast.success("Service deleted");
      if (editing === deleteTarget._id) resetForm();
      setDeleteTarget(null);
      await load();
    } catch (error) {
      toast.error(error.message || "Couldn’t delete service.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div>
      <Link
        className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        href="/dashboard/admin/services"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to services
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Manage services</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add, edit, activate, or remove services from the salon catalog.
        </p>
      </div>

      <form onSubmit={save} className="mt-6 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          {editing ? <Pencil aria-hidden="true" className="size-4 text-muted-foreground" /> : <Plus aria-hidden="true" className="size-4 text-muted-foreground" />}
          <h2 className="font-semibold">{editing ? "Edit service" : "Add a service"}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([key, label, type]) => (
            <label className="text-sm font-medium" key={key}>
              {label}
              <input
                className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                min={type === "number" ? "0.01" : undefined}
                onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                required={key !== "image"}
                step={type === "number" ? "any" : undefined}
                type={type}
                value={form[key]}
              />
            </label>
          ))}
          <div className="rounded-lg border border-dashed p-4 sm:col-span-2">
            <p className="text-sm font-medium">Service image</p>
            <p className="mt-1 text-xs text-muted-foreground">PNG, JPG or WEBP, up to 5 MB.</p>
            {form.image && (
              <img
                alt="Service image preview"
                className="mt-3 h-32 w-full rounded-md object-cover"
                src={form.image}
              />
            )}
            <Button
              className="mt-3"
              disabled={isUploading}
              onClick={() => imageInputRef.current?.click()}
              type="button"
              variant="outline"
            >
              {isUploading ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <Camera aria-hidden="true" />}
              {isUploading ? "Uploading..." : form.image ? "Replace image" : "Upload image"}
            </Button>
            <input
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={uploadImage}
              ref={imageInputRef}
              type="file"
            />
          </div>
          <label className="text-sm font-medium">
            Status
            <select
              className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onChange={(event) => setForm({ ...form, status: event.target.value })}
              value={form.status}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label className="text-sm font-medium sm:col-span-2">
            Description
            <textarea
              className="mt-2 min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              required
              value={form.description}
            />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button disabled={saving} type="submit">
            {saving ? "Saving..." : editing ? "Save changes" : "Create service"}
          </Button>
          {editing && (
            <Button onClick={resetForm} type="button" variant="outline">
              Cancel editing
            </Button>
          )}
        </div>
      </form>

      <section className="mt-6 overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold">Existing services</h2>
          <p className="mt-1 text-sm text-muted-foreground">{services.length} service{services.length === 1 ? "" : "s"}</p>
        </div>
        {loading ? (
          <p aria-live="polite" className="p-8 text-center text-sm text-muted-foreground">Loading services...</p>
        ) : loadError ? (
          <div className="p-8 text-center" role="alert">
            <p className="text-sm text-destructive">{loadError}</p>
            <Button className="mt-4" onClick={load} variant="outline">Try again</Button>
          </div>
        ) : services.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No services to manage yet.</p>
        ) : (
          <div className="divide-y">
            {services.map((service) => (
              <article className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between" key={service._id}>
                <div className="min-w-0">
                  <h3 className="truncate font-medium">{service.serviceName}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {service.category} · ৳{service.price} · {service.duration} min
                  </p>
                  <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${service.status === "active"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-muted text-muted-foreground"
                    }`}>
                    {service.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button onClick={() => toggleStatus(service)} size="sm" variant="outline">
                    {service.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                  <Button onClick={() => edit(service)} size="sm" variant="outline">
                    <Pencil aria-hidden="true" />
                    Edit
                  </Button>
                  <Button onClick={() => setDeleteTarget(service)} size="sm" variant="destructive">
                    <Trash2 aria-hidden="true" />
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deletingId) setDeleteTarget(null);
          }}
          role="presentation"
        >
          <section
            aria-describedby="delete-service-description"
            aria-labelledby="delete-service-title"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl"
            role="alertdialog"
          >
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <CircleAlert aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold" id="delete-service-title">Delete this service?</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground" id="delete-service-description">
                  “{deleteTarget.serviceName}” will be permanently removed. This action cannot be undone.
                </p>
              </div>
              <button
                aria-label="Close delete confirmation"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg border hover:bg-accent disabled:opacity-50"
                disabled={Boolean(deletingId)}
                onClick={() => setDeleteTarget(null)}
                type="button"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
            <div className="mt-6 flex flex-col-reverse justify-end gap-2 sm:flex-row">
              <Button
                disabled={Boolean(deletingId)}
                onClick={() => setDeleteTarget(null)}
                type="button"
                variant="outline"
              >
                Keep service
              </Button>
              <Button
                className="gap-2"
                disabled={Boolean(deletingId)}
                onClick={remove}
                type="button"
                variant="destructive"
              >
                {deletingId ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <Trash2 aria-hidden="true" />}
                {deletingId ? "Deleting..." : "Delete service"}
              </Button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
