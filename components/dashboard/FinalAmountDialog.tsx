"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RequestItem } from "@/components/dashboard/RequestsTable";

// Small dialog that asks for the final amount of a finished job
export default function FinalAmountDialog({
  item,
  onClose,
  onConfirm,
  isLoading,
}: {
  item: RequestItem | null;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  isLoading: boolean;
}) {
  return (
    <Dialog
      open={item !== null}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Mark as Completed</DialogTitle>
          <DialogDescription>
            Enter the final amount you charged the customer.
          </DialogDescription>
        </DialogHeader>
        {/* key makes a fresh form with the base price for every job */}
        {item && (
          <AmountForm
            key={item._id}
            item={item}
            onClose={onClose}
            onConfirm={onConfirm}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// The form itself, the amount starts from the base price
function AmountForm({
  item,
  onClose,
  onConfirm,
  isLoading,
}: {
  item: RequestItem;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  isLoading: boolean;
}) {
  const [amount, setAmount] = useState(() => String(item.basePrice));
  const [error, setError] = useState("");

  // Check the amount and send it up
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const value = Number(amount);
    if (!(value > 0)) {
      setError("Final amount must be a positive number");
      return;
    }
    onConfirm(value);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="final-amount">Final Amount ($)</Label>
        <Input
          id="final-amount"
          type="number"
          min="1"
          step="1"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            setError("");
          }}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <DialogFooter className="gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Mark Completed"}
        </Button>
      </DialogFooter>
    </form>
  );
}
