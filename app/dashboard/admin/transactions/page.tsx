"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Wallet } from "lucide-react";
import { apiFetch } from "@/lib/api";
import StatsCard from "@/components/shared/StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";

// One payment as the admin sees it
type AdminPayment = {
  _id: string;
  customerName: string;
  technicianName: string;
  serviceTitle: string;
  amount: number;
  transactionId: string | null;
  paidAt: string;
};

type PaymentData = {
  payments: AdminPayment[];
  totalRevenue: number;
};

// Show the server message as a toast
function showError(error: unknown) {
  toast.error(error instanceof Error ? error.message : "Something went wrong");
}

// Total revenue card plus a list of every payment
export default function AdminTransactionsPage() {
  const [data, setData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all payments from the API
  useEffect(() => {
    async function loadPayments() {
      try {
        const result = await apiFetch("/api/admin/payments");
        setData({
          payments: Array.isArray(result.payments) ? result.payments : [],
          totalRevenue: result.totalRevenue || 0,
        });
      } catch (error) {
        showError(error);
        setData(null);
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
        <Skeleton className="h-24 w-full" />
        <div className="space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.payments.length === 0) {
    return (
      <EmptyState
        title="No transactions yet"
        description="Payments made by customers will show up here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          {data.payments.length} payments
        </p>
      </div>

      {/* Total revenue card */}
      <div className="max-w-sm">
        <StatsCard
          icon={Wallet}
          label="Total Revenue"
          value={`$${data.totalRevenue.toFixed(2)}`}
        />
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Technician</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Paid On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium text-navy">
                    {payment.serviceTitle}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {payment.customerName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {payment.technicianName}
                  </td>
                  <td className="px-4 py-3 font-medium text-navy">
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
    </div>
  );
}
