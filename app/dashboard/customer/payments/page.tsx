"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import EmptyState from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

type Payment = {
  _id: string;
  serviceTitle: string;
  technicianName: string;
  amount: number;
  transactionId: string | null;
  paidAt: string;
};

// Load my payment history from the API
export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch once when the page opens
  useEffect(() => {
    async function loadPayments() {
      try {
        const data = await apiFetch("/api/payments/my");
        setPayments(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
        setPayments([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadPayments();
  }, []);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-52" />
        <div className="space-y-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <EmptyState
        title="No payments yet"
        description="Payments appear here after a repair is completed and paid."
        actionLabel="Browse Services"
        actionHref="/services"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payment History</h1>
        <p className="text-sm text-muted-foreground">
          {payments.length} payments
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl bg-card shadow-sm ring-1 ring-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Technician</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-muted/40">
                <td className="px-4 py-3 font-medium text-foreground">
                  {payment.serviceTitle}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {payment.technicianName}
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  ${payment.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span
                    title={payment.transactionId || undefined}
                    className="block max-w-[160px] truncate text-xs text-muted-foreground"
                  >
                    {payment.transactionId || "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(payment.paidAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
