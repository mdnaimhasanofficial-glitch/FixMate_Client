"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { BadgeCheck, Check, Crown, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

type PriceInfo = { amount: number | null; currency: string; interval: string };

// What each plan includes (the comparison list)
const FREE_FEATURES = [
  "5 service bookings",
  "Browse all repair services",
  "Track your bookings",
  "Standard support",
];

const PRO_FEATURES = [
  "Unlimited service bookings",
  "Priority support",
  "Track your bookings",
  "Cancel anytime",
];

// Public pricing page: Free vs Pro comparison + upgrade button
export default function PricingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState<PriceInfo | null>(null);
  const [plan, setPlan] = useState<"free" | "pro" | null>(null);

  // Read the live Pro price from the API (no hardcoded price)
  useEffect(() => {
    async function loadPrice() {
      try {
        const data = await apiFetch<PriceInfo>("/api/subscription/price");
        setPrice(data);
      } catch (error) {
        // Price is optional: the card falls back to "Price shown at checkout"
        toast.error(
          error instanceof Error ? error.message : "Could not load the Pro price",
        );
      }
    }
    loadPrice();
  }, []);

  // Logged-in user-এর plan পড়ি — Pro হলে বোতামের বদলে "You are on Pro" দেখাবে
  const userEmail = session?.user?.email;
  useEffect(() => {
    if (!userEmail) return;
    async function loadPlan() {
      try {
        const data = await apiFetch<{ plan: string }>("/api/subscription/status");
        setPlan(data.plan === "pro" ? "pro" : "free");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Something went wrong");
      }
    }
    loadPlan();
  }, [userEmail]);

  // Send the customer to Stripe Checkout for the Pro plan
  async function handleUpgrade() {
    if (!session) {
      toast.error("Sign in first to upgrade to Pro");
      router.push("/sign-in?redirect=/pricing");
      return;
    }
    setIsLoading(true);
    try {
      const data = await apiFetch<{ url: string }>(
        "/api/subscription/create-checkout-session",
        { method: "POST", body: { returnTo: pathname } },
      );
      window.location.href = data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
      setIsLoading(false);
    }
  }

  // Price text: "$4.99" or "Unlimited" when the price is not available
  const priceLabel = price?.amount ? `$${(price.amount / 100).toFixed(2)}` : "Unlimited";
  const priceSuffix = price?.amount
    ? `per ${price.interval === "year" ? "year" : "month"} · billed via Stripe`
    : "Price shown at checkout";

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Page heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Simple, honest pricing
          </h1>
          <p className="mt-3 text-muted-foreground">
            Start free with 5 service bookings. Upgrade to Pro when you need
            more — unlimited bookings, priority support.
          </p>
        </div>

        {/* The two plan cards (equal height in the grid) */}
        <div className="mx-auto mt-12 grid max-w-4xl items-stretch gap-6 lg:grid-cols-2">
          {/* Free plan */}
          <div className="flex flex-col rounded-xl bg-card p-8 shadow-sm ring-1 ring-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Free</h2>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                Forever free
              </span>
            </div>
            <p className="mt-4 text-4xl font-bold text-foreground">
              $0
              <span className="text-base font-normal text-muted-foreground">
                /forever
              </span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              For occasional repairs
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="mt-8 w-full"
              nativeButton={false}
              render={<Link href="/services" />}
            >
              Browse Services
            </Button>
          </div>

          {/* Pro plan (highlighted) */}
          <div className="relative flex flex-col rounded-xl bg-card p-8 shadow-md ring-2 ring-brand">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
              {plan === "pro" ? "YOUR PLAN" : "MOST POPULAR"}
            </span>
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Crown className="h-5 w-5 text-brand" /> Pro
              </h2>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                Unlimited
              </span>
            </div>
            <p className="mt-4 text-4xl font-bold text-foreground">
              {priceLabel}
              {price?.amount ? (
                <span className="text-base font-normal text-muted-foreground">
                  /{price.interval === "year" ? "year" : "month"}
                </span>
              ) : null}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{priceSuffix}</p>
            <ul className="mt-6 flex-1 space-y-3">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                  {feature}
                </li>
              ))}
            </ul>
            {/* Pro user: current plan দেখাও, নাহলে upgrade বোতাম */}
            {plan === "pro" ? (
              <>
                <div className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-green-100 px-4 py-3 text-sm font-semibold text-green-700 dark:bg-green-500/15 dark:text-green-300">
                  <BadgeCheck className="h-4 w-4 shrink-0" />
                  You are on Pro — unlimited bookings
                </div>
                <Button
                  variant="outline"
                  className="mt-3 w-full"
                  nativeButton={false}
                  render={<Link href="/dashboard/customer" />}
                >
                  Go to Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="mt-8 w-full"
                  onClick={handleUpgrade}
                  disabled={isLoading || isPending}
                >
                  <Sparkles className="h-4 w-4" />
                  {isLoading ? "Redirecting to Stripe..." : "Upgrade to Pro"}
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Secure payment by Stripe · cancel anytime
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
