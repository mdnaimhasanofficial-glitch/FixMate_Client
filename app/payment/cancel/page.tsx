import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Shown when the customer closes the Stripe checkout page
export default function PaymentCancelPage() {
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
