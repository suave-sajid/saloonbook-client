export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";


export function getServicesEndpoint() {
  const baseUrl = API_URL.replace(/\/+$/, "");
  return `${baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`}/services`;
}
