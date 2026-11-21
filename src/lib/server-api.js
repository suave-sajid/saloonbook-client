import { authClient } from "@/lib/auth-client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiRequest(path, options = {}) {
  const tokenResult = await authClient.token();
  const token = tokenResult?.data?.token || tokenResult?.token;
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const result = await response.json().catch(() => ({ success: false, message: "The server returned an invalid response" }));
  if (!response.ok) throw new Error(result.message || "Request failed");
  return result;
}
