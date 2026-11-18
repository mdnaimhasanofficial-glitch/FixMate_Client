import { Skeleton } from "@/components/ui/skeleton";

// Shown while a public page is loading
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="mt-4 h-5 w-96 max-w-full" />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border"
          >
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
