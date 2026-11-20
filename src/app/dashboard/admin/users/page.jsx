"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/server-api";
import { toast } from "sonner";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const load = () => apiRequest("/api/admin/users").then((r) => setUsers(r.data || []));
  useEffect(() => { load(); }, []);
  const toggle = async (user) => {
    try { await apiRequest(`/api/admin/users/${user._id}/block`, { method: "PATCH", body: JSON.stringify({ isBlocked: !user.isBlocked }) }); toast.success(user.isBlocked ? "User unblocked" : "User blocked"); load(); }
    catch (error) { toast.error(error.message); }
  };
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#342c24] dark:text-stone-100">Manage users</h1>
      <div className="mt-6 grid gap-3">
        {users.map((user) => (
          <article key={user._id} className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
            <div><h2 className="font-semibold">{user.name || "Unnamed user"}</h2><p className="text-sm text-stone-500">{user.email} · {user.isBlocked ? "Blocked" : "Active"}</p></div>
            <button onClick={() => toggle(user)} className={`rounded-lg border px-3 py-2 text-sm ${user.isBlocked ? "text-emerald-700" : "text-red-700"}`}>{user.isBlocked ? "Unblock" : "Block"}</button>
          </article>
        ))}
      </div>
    </div>
  );
}
