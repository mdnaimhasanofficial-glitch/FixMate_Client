import Link from "next/link";
import { SearchX } from "lucide-react";

// Friendly message when a list has no results
export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-card px-6 py-16 text-center shadow-sm ring-1 ring-border">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <SearchX className="h-7 w-7 text-muted-foreground" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
