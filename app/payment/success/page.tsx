"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CircleCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

type Payment = {
  amount: number;
  transactionId: string | null;
  serviceTitle: string;
};

// The page reads session_id, so it must sit inside <Suspense>
export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-24">
          <div className="space-y-3 rounded-xl bg-card p-8 shadow-sm ring-1 ring-border">
            <Skeleton className="mx-auto h-16 w-16 rounded-full" />
            <Skeleton className="mx-auto h-7 w-48" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      }
    >
      <VerifyPayment />
    </Suspense>
  );
}

// Ask the API to verify the Stripe session and show the receipt
function VerifyPayment() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Verify the session once when the page opens
  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setError("Missing payment session");
        setIsLoading(false);
        return;
      }
      try {
        const data = await apiFetch<Payment>(
          `/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`,
        );
        setPayment(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    }
    verifyPayment();
  }, [sessionId]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <div className="space-y-3 rounded-xl bg-card p-8 shadow-sm ring-1 ring-border">
          <Skeleton className="mx-auto h-16 w-16 rounded-full" />
          <Skeleton className="mx-auto h-7 w-48" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    );
  }

  // Verification failed, show a friendly empty state
  if (error || !payment) {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <EmptyState
          title="Payment could not be verified"
          description={
            error || "Something went wrong while checking the payment."
          }
          actionLabel="Back to My Bookings"
          actionHref="/dashboard/customer/bookings"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <div className="rounded-xl bg-card p-8 text-center shadow-sm ring-1 ring-border">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/15">
          <CircleCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          Payment Successful
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {payment.serviceTitle}
        </p>

        <div className="mt-6 space-y-3 rounded-lg bg-background p-4 text-left ring-1 ring-border">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="font-semibold text-foreground">
              ${payment.amount.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="shrink-0 text-sm text-muted-foreground">
              Transaction ID
            </span>
            <span
              title={payment.transactionId || undefined}
              className="min-w-0 truncate text-right text-xs text-foreground"
            >
              {payment.transactionId || "—"}
            </span>
          </div>
        </div>

        <Button
          className="mt-6 w-full"
          nativeButton={false}
          render={<Link href="/dashboard/customer/bookings" />}
        >
          Back to My Bookings
        </Button>
      </div>
    </div>
  );
}
