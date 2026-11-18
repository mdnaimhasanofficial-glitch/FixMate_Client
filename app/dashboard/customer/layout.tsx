import { requireRole } from "@/lib/guards";

// Only customers can open this part of the dashboard
export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("customer");
  return <>{children}</>;
}
