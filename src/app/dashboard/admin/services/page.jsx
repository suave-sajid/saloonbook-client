"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/server-api";
import { toast } from "sonner";

const empty = { serviceName: "", category: "", description: "", price: "", duration: "", image: "", status: "active" };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const load = () => apiRequest("/api/admin/services").then((r) => setServices(r.data || []));
  useEffect(() => { load(); }, []);
  const save = async (event) => {
    event.preventEvent?.();
    event.preventDefault();
    setLoading(true);
    try {
      await apiRequest(editing ? `/api/admin/services/${editing}` : "/api/admin/services", {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify({ ...form, price: Number(form.price), duration: Number(form.duration) }),
      });
      toast.success(editing ? "Service updated" : "Service created");
      setForm(empty); setEditing(null); load();
    } catch (error) { toast.error(error.message); }
    finally { setLoading(false); }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try { await apiRequest(`/api/admin/services/${id}`, { method: "DELETE" }); toast.success("Service deleted"); load(); }
    catch (error) { toast.error(error.message); }
  };
  const fields = [["serviceName", "Service name"], ["category", "Category"], ["price", "Price"], ["duration", "Duration (minutes)"], ["image", "Image URL"]];
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#342c24] dark:text-stone-100">Manage services</h1>
      <form onSubmit={save} className="mt-6 grid gap-3 rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900 sm:grid-cols-2">
        {fields.map(([key, label]) => (
          <label key={key} className="text-sm font-semibold text-stone-600 dark:text-stone-300">{label}
            <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={key !== "image"} className="mt-2 h-11 w-full rounded-lg border border-stone-300 px-3 dark:border-stone-700 dark:bg-stone-950" />
          </label>
        ))}
        <label className="text-sm font-semibold text-stone-600 dark:text-stone-300 sm:col-span-2">Description
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="mt-2 min-h-24 w-full rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-700 dark:bg-stone-950" />
        </label>
        <label className="text-sm font-semibold text-stone-600 dark:text-stone-300">Status
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-2 h-11 w-full rounded-lg border border-stone-300 px-3 dark:border-stone-700 dark:bg-stone-950"><option value="active">Active</option><option value="inactive">Inactive</option></select>
        </label>
        <button disabled={loading} className="mt-auto h-11 rounded-lg bg-[#1f493c] text-sm font-semibold text-white">{loading ? "Saving..." : editing ? "Update service" : "Add service"}</button>
      </form>
      <div className="mt-6 grid gap-3">
        {services.map((item) => (
          <article key={item._id} className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="font-semibold">{item.serviceName}</h2><p className="text-sm text-stone-500">{item.category} · ৳{item.price} · {item.status}</p></div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(item._id); setForm({ serviceName: item.serviceName || "", category: item.category || "", description: item.description || "", price: item.price || "", duration: item.duration || "", image: item.image || "", status: item.status || "active" }); }} className="rounded-lg border px-3 py-2 text-sm">Edit</button>
              <button onClick={() => remove(item._id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700">Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
