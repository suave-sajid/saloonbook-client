"use client";

import { useCallback, useEffect, useState } from "react";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { apiRequest } from "@/lib/server-api";
import { toast } from "sonner";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  const toggle = async (user) => {
    try { await apiRequest(`/api/admin/users/${user._id}/block`, { method: "PATCH", body: JSON.stringify({ isBlocked: !user.isBlocked }) }); toast.success(user.isBlocked ? "User unblocked" : "User blocked"); load(); }
    catch (error) { toast.error(error.message); }
  };
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#342c24] dark:text-stone-100">Manage users</h1>
      <div className="mt-6 grid gap-3">
        {loading && <p aria-live="polite" className="flex items-center justify-center gap-2 rounded-xl border p-8 text-sm text-muted-foreground" role="status"><LoaderCircle aria-hidden="true" className="size-4 animate-spin" />Loading customers...</p>}
        {!loading && error && <div className="rounded-xl border border-destructive/30 p-8 text-center" role="alert"><CircleAlert aria-hidden="true" className="mx-auto size-5 text-destructive" /><p className="mt-2 text-sm text-muted-foreground">{error}</p><button className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent" onClick={load} type="button">Try again</button></div>}
        {!loading && !error && users.map((user) => (
          <article key={user._id} className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
            <div><h2 className="font-semibold">{user.name || "Unnamed user"}</h2><p className="text-sm text-stone-500">{user.email} · {user.isBlocked ? "Blocked" : "Active"}</p></div>
            <button onClick={() => toggle(user)} className={`rounded-lg border px-3 py-2 text-sm ${user.isBlocked ? "text-emerald-700" : "text-red-700"}`}>{user.isBlocked ? "Unblock" : "Block"}</button>
          </article>
        ))}
        {!loading && !error && users.length === 0 && <p className="rounded-xl border border-dashed p-10 text-center text-stone-500">No customers found.</p>}
      </div>
    </div>
  );
}
