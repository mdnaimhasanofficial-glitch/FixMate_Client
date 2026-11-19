const API_URL = process.env.NEXT_PUBLIC_API_URL;

let cachedToken: string | null = null;
let cachedAt: number = 0;

interface ApiFetchOptions extends Omit<RequestInit, "body" | "headers"> {
  body?: unknown;
  headers?: HeadersInit;
}

// Get token and cache for 1 hour
async function getToken(): Promise<string | null> {
  if (cachedToken && Date.now() - cachedAt < 60 * 60 * 1000) {
    return cachedToken;
  }

  const res = await fetch("/api/token");

  if (!res.ok) return null;

  const data: { token?: string } = await res.json();

  cachedToken = data.token ?? null;
  cachedAt = Date.now();

  return cachedToken;
}

// Clear token during sign out
export function clearToken(): void {
  cachedToken = null;
  cachedAt = 0;
}

// Reusable API fetch function
export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("API_URL is not configured");
  }

  const token = await getToken();

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as T;
}
