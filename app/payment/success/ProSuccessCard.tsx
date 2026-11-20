import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  Crown,
  Receipt,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Plan info the success page got from the verify/status API
export type PlanDetails = {
  plan: "free" | "pro";
  usedCount: number;
  remaining: number | null;
  limit: number;
  amount?: number | null; // cents
  currency?: string;
  interval?: string;
  proExpiresAt?: string | null;
};

// Format cents (499) into money ($4.99)
function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

// The big "Payment Successful / Welcome to Pro" receipt card
export default function ProSuccessCard({
  details,
  returnTo,
  backButton,
}: {
  details: PlanDetails;
  returnTo: string;
  backButton: string;
}) {
  const renewsOn = details.proExpiresAt
    ? new Date(details.proExpiresAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  // Every detail row of the receipt (icon + label + value)
  const rows: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Crown, label: "Plan", value: "Pro · Unlimited" },
    ...(details.amount
      ? [
          {
            icon: Receipt,
            label: "Amount paid",
            value: formatAmount(details.amount, details.currency || "usd"),
          },
        ]
      : []),
    {
      icon: CalendarDays,
      label: "Billing",
      value: details.interval === "year" ? "Yearly" : "Monthly",
    },
    ...(renewsOn
      ? [{ icon: CalendarDays, label: "Renews on", value: renewsOn }]
      : []),
    { icon: Zap, label: "Services booked", value: String(details.usedCount) },
  ];

  const features = [
    "Unlimited service bookings",
    "Priority support",
    "Cancel anytime",
  ];

  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <div className="rounded-xl bg-card p-8 text-center shadow-sm ring-1 ring-border">
        {/* Crown badge with a small orange check */}
        <span className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/15">
          <Crown className="h-10 w-10 text-green-600 dark:text-green-400" />
          <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white ring-4 ring-card">
            <BadgeCheck className="h-4 w-4" />
          </span>
        </span>

        <h1 className="mt-5 text-2xl font-bold text-foreground">
          Payment Successful
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome to Pro — unlimited bookings are now unlocked.
        </p>

        {/* Receipt details */}
        <div className="mt-6 space-y-3 rounded-lg bg-background p-4 text-left ring-1 ring-border">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4"
            >
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <row.icon className="h-4 w-4 shrink-0" />
                {row.label}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* What the plan includes */}
        <ul className="mt-4 space-y-2 text-left">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <Check className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
              {feature}
            </li>
          ))}
        </ul>

        <Button
          className="mt-6 w-full"
          nativeButton={false}
          render={<Link href={returnTo} />}
        >
          {backButton}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Taking you back in a few seconds…
        </p>
      </div>
    </div>
  );
}
