import { requireRole } from "@/lib/guards";

// Only technicians can open this part of the dashboard
export default async function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("technician");
  return <>{children}</>;
}
