import { Skeleton } from "@/components/ui/skeleton";

// Shown while a dashboard page is loading
export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Skeleton className="h-8 w-56" />

      {/* Stats cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="space-y-2 rounded-xl bg-card p-5 shadow-sm ring-1 ring-border"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-16" />
          </div>
        ))}
      </div>

      {/* Table rows */}
      <div className="mt-6 space-y-3 rounded-xl bg-card p-5 shadow-sm ring-1 ring-border">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
