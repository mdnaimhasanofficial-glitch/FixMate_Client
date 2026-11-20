const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Token cache
let cachedToken: string | null = null;
let cachedAt: number = 0;

// API options type
interface ApiOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

// Get token
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

// Clear token
export function clearToken(): void {
  cachedToken = null;
  cachedAt = 0;
}

// API fetch
export async function apiFetch<T = unknown>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("API URL is missing");
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
    // Keep the API error code (e.g. FREE_LIMIT_REACHED) on the thrown error
    const error = new Error(data.message || "Something went wrong") as Error & {
      code?: string;
    };
    error.code = data.code;
    throw error;
  }

  return data as T;
}
