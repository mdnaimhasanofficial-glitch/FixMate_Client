import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Server guard: not logged in -> /sign-in, wrong role -> own dashboard
export async function requireRole(role: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  const userRole = (session.user as { role?: string }).role || "customer";
  if (userRole !== role) redirect(`/dashboard/${userRole}`);
  return session;
}
