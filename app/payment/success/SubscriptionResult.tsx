"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import EmptyState from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import ProSuccessCard, { type PlanDetails } from "./ProSuccessCard";

// Result of a Pro upgrade: first verifies the Stripe session (activates the
// plan immediately, no webhook needed), falls back to polling the plan
// status, then shows the receipt card and sends the user back.
export default function SubscriptionResult() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // The page the checkout started from
  const returnTo = searchParams.get("returnTo") || "/dashboard/customer";
  const sessionId = searchParams.get("session_id");
  const backButton =
    returnTo === "/dashboard/customer" ? "Go to Dashboard" : "Go back";

  const [details, setDetails] = useState<PlanDetails | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Read the plan once when the page opens
  useEffect(() => {
    async function loadPlan() {
      let failure = "";

      // 1) Verify the Stripe session — activates Pro right away
      if (sessionId) {
        try {
          const data = await apiFetch<PlanDetails>(
            `/api/subscription/verify?session_id=${encodeURIComponent(sessionId)}`,
          );
          if (data.plan === "pro") {
            setDetails(data);
            toast.success("You are on the Pro plan now!");
            setIsLoading(false);
            return;
          }
        } catch {
          // Ignore: the status polling below takes over
        }
      }

      // 2) The webhook may still be on its way: re-read up to 3 times
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const data = await apiFetch<PlanDetails>("/api/subscription/status");
          setDetails(data);
          if (data.plan === "pro") {
            toast.success("You are on the Pro plan now!");
            setIsLoading(false);
            return;
          }
        } catch (err) {
          failure =
            err instanceof Error ? err.message : "Something went wrong";
          toast.error(failure);
          break;
        }
        // Still free: wait and try again while the webhook lands
        if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      setError(
        failure ||
          "Your Pro plan is activating — it will be ready in a moment.",
      );
      setIsLoading(false);
    }
    loadPlan();
  }, [sessionId]);

  // Pro হয়ে গেলে ৫ সেকেন্ড পর যে page থেকে এসেছিল সেটায় ফিরে যাও
  useEffect(() => {
    if (details?.plan !== "pro") return;
    const timer = setTimeout(() => router.push(returnTo), 5000);
    return () => clearTimeout(timer);
  }, [details?.plan, returnTo, router]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <div className="space-y-3 rounded-xl bg-card p-8 shadow-sm ring-1 ring-border">
          <Skeleton className="mx-auto h-20 w-20 rounded-full" />
          <Skeleton className="mx-auto h-7 w-56" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    );
  }

  // Payment done: detailed receipt + auto back to the previous page
  if (details?.plan === "pro") {
    return (
      <ProSuccessCard details={details} returnTo={returnTo} backButton={backButton} />
    );
  }

  // Not active yet (webhook still running) — show a friendly empty state
  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <EmptyState
        title="Payment received"
        description={
          error || "Your Pro plan is activating — it will be ready in a moment."
        }
        actionLabel="Check again"
        actionHref={`/payment/success?source=subscription&returnTo=${encodeURIComponent(returnTo)}${sessionId ? `&session_id=${encodeURIComponent(sessionId)}` : ""}`}
      />
    </div>
  );
}
