import { requireRole } from "@/lib/guards";

// Only admins can open this part of the dashboard
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin");
  return <>{children}</>;
}
