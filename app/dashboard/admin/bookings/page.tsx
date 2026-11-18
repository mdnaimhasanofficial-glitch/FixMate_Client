"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import StatusBadge from "@/components/shared/StatusBadge";
import StatusFilter from "@/components/dashboard/StatusFilter";

// One booking as the admin sees it
type AdminBooking = {
  _id: string;
  serviceTitle: string;
  customerName: string;
  technicianName: string;
  preferredDate: string;
  status: string;
  paymentStatus: string;
  finalAmount: number;
};

// Every booking status an admin may want to see
const BOOKING_FILTERS = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

// Show the server message as a toast
function showError(error: unknown) {
  toast.error(error instanceof Error ? error.message : "Something went wrong");
}

// Read-only list of every booking on the platform
export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Fetch bookings from the API (runs again on filter change)
  useEffect(() => {
    async function loadBookings() {
      try {
        const query = filter === "all" ? "" : `?status=${filter}`;
        const data = await apiFetch(`/api/admin/bookings${query}`);
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        showError(error);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadBookings();
  }, [filter]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-52" />
        <div className="space-y-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
        <StatusFilter value={filter} onChange={setFilter} options={BOOKING_FILTERS} />
        <EmptyState
          title="No bookings here"
          description="Bookings with this status will show up here."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          {bookings.length} bookings
        </p>
      </div>

      <StatusFilter value={filter} onChange={setFilter} options={BOOKING_FILTERS} />

      <div className="overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Technician</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {booking.serviceTitle}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {booking.customerName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {booking.technicianName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(booking.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.paymentStatus} />
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    ${booking.finalAmount}
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
