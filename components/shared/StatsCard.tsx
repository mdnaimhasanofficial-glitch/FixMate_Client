import type { LucideIcon } from "lucide-react";

// One number with a label and icon, used in dashboard stat grids
export default function StatsCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  return (
    <div className="w-full rounded-xl bg-white p-5 shadow-sm ring-1 ring-border">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-navy">{value}</p>
        </div>
      </div>
    </div>
  );
}
