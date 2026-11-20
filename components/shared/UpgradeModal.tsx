"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Crown, Sparkles, Check } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PRO_POINTS = [
  "Unlimited service bookings",
  "Priority support",
  "Cancel anytime",
];

// Animated popup shown when a free customer hits the 5 booking limit
export default function UpgradeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Ask the API for a Stripe checkout url, then go there
  async function handleUpgrade() {
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

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {/* Bouncing crown icon makes the modal feel alive */}
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
            <Crown className="h-7 w-7 animate-bounce text-brand" />
          </span>
          <DialogTitle className="text-center">Free plan limit reached</DialogTitle>
          <DialogDescription className="text-center">
            You have used all 5 free service bookings. Upgrade to Pro and book
            unlimited services.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 rounded-lg bg-background p-4 ring-1 ring-border">
          {PRO_POINTS.map((point) => (
            <li key={point} className="flex items-center gap-2 text-sm text-foreground">
              <Check className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
              {point}
            </li>
          ))}
        </ul>

        <div className="space-y-2">
          <Button className="w-full" onClick={handleUpgrade} disabled={isLoading}>
            <Sparkles className="h-4 w-4" />
            {isLoading ? "Redirecting to Stripe..." : "Upgrade to Pro"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
            disabled={isLoading}
          >
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
