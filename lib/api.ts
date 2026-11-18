const API_URL = process.env.NEXT_PUBLIC_API_URL;
let cachedToken = null;
let cachedAt = 0;
async function getToken() {
  // ১ ঘণ্টার মেধ আবার token চাইেব না
  if (cachedToken && Date.now() - cachedAt < 60 * 60 * 1000) return cachedToken;
  const res = await fetch("/api/token");
  if (!res.ok) return null;
  const data = await res.json();
  cachedToken = data.token;
  cachedAt = Date.now();
  return cachedToken;
}
// Sign out করার সময় এটা call করেব
export function clearToken() {
  cachedToken = null;
}
export async function apiFetch(path, options = {}) {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}
