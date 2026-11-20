"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Shown when the customer closes the Stripe checkout page.
// Reads ?source=subscription, so it must sit inside <Suspense>.
function CancelContent() {
  const searchParams = useSearchParams();
  const isSubscription = searchParams.get("source") === "subscription";
  // যে page থেকে checkout শুরু হয়েছিল সেটায় ফিরে যাবে
  const returnTo = searchParams.get("returnTo") || "/pricing";
  const backButton = returnTo === "/pricing" ? "Back to Pricing" : "Go back";

  // Pro upgrade cancelled: point back to the page the user came from
  if (isSubscription) {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <div className="rounded-xl bg-card p-8 text-center shadow-sm ring-1 ring-border">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-500/15">
            <XCircle className="h-8 w-8 text-orange-500 dark:text-orange-400" />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-foreground">
            Upgrade cancelled
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            No money was taken. Your plan has not changed — you can upgrade to
            Pro whenever you are ready.
          </p>
          <Button
            className="mt-6 w-full"
            nativeButton={false}
            render={<Link href={returnTo} />}
          >
            {backButton}
          </Button>
        </div>
      </div>
    );
  }

  // Booking payment cancelled: the original message
  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <div className="rounded-xl bg-card p-8 text-center shadow-sm ring-1 ring-border">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-500/15">
          <XCircle className="h-8 w-8 text-orange-500 dark:text-orange-400" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Payment cancelled</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No money was taken. Your booking is still waiting for payment — try
          again whenever you are ready.
        </p>
        <Button
          className="mt-6 w-full"
          nativeButton={false}
          render={<Link href="/dashboard/customer/bookings" />}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={null}>
      <CancelContent />
    </Suspense>
  );
}
