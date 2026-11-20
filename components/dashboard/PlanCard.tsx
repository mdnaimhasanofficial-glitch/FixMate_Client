"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Crown, Zap } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type PlanStatus = {
  plan: "free" | "pro";
  usedCount: number;
  remaining: number | null; // null = unlimited
  limit: number;
};

// Shows the plan of the customer: "Free plan: X/5 used" with a
// progress bar for free users, a Pro badge for Pro users
export default function PlanCard() {
  const [status, setStatus] = useState<PlanStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the plan status once when the dashboard opens
  useEffect(() => {
    async function loadPlan() {
      try {
        const data = await apiFetch<PlanStatus>("/api/subscription/status");
        setStatus(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }
    loadPlan();
  }, []);

  // Loading skeleton
  if (isLoading) {
    return <Skeleton className="h-28 w-full rounded-xl" />;
  }

  // Load failed (toast already shown), hide the card
  if (!status) return null;

  const percent = Math.min(
    Math.round((status.usedCount / status.limit) * 100),
    100,
  );

  // Pro plan: crown badge and the unlimited message
  if (status.plan === "pro") {
    return (
      <div className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Crown className="h-5 w-5" />
            </span>
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                Pro plan
                <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                  PRO
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Unlimited service bookings
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/pricing" />}
          >
            View plans
          </Button>
        </div>
      </div>
    );
  }

  // Free plan: how many of the 5 bookings are used + upgrade button
  return (
    <div className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-border">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Zap className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">
              Free plan: {status.usedCount}/{status.limit} services used
            </p>
            <p className="text-sm text-muted-foreground">
              {status.remaining} booking{status.remaining === 1 ? "" : "s"} left
            </p>
          </div>
        </div>
        <Button
          size="sm"
          nativeButton={false}
          render={<Link href="/pricing" />}
        >
          Upgrade to Pro
        </Button>
      </div>

      {/* Progress bar: orange, turns red at the limit */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${
            percent >= 100 ? "bg-red-500" : "bg-brand"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
