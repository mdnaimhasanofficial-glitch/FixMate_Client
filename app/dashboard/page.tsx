import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Send each role to its own dashboard
export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  const role = (session.user as { role?: string }).role || "customer";
  if (role === "technician") redirect("/dashboard/technician");
  if (role === "admin") redirect("/dashboard/admin");
  redirect("/dashboard/customer");
}
