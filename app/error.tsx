"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Shown when a page throws an error, Try Again re-renders it
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </span>
      <h1 className="mt-5 text-3xl font-bold text-foreground">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        We could not load this page. It is usually a temporary problem — press
        Try Again and it will work.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try Again
      </Button>
      {error.message && (
        <p className="mt-4 max-w-md wrap-break-word text-xs text-muted-foreground">
          {error.message}
        </p>
      )}
    </div>
  );
}
