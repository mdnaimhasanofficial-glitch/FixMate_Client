"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import ConfirmModal from "@/components/shared/ConfirmModal";
import EmptyState from "@/components/shared/EmptyState";
import BookingsTable, { Booking } from "@/components/dashboard/BookingsTable";
import BookingCards from "@/components/dashboard/BookingCards";
import { Skeleton } from "@/components/ui/skeleton";

// My bookings: cancel a requested job or pay a completed one
export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch my bookings from the API (runs again when refreshKey changes)
  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await apiFetch("/api/bookings/my");
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadBookings();
  }, [refreshKey]);

  // Cancel the booking the user confirmed
  async function handleCancel() {
    if (!cancelTarget) return;
    setIsCancelling(true);
    try {
      await apiFetch(`/api/bookings/${cancelTarget._id}/cancel`, {
        method: "PATCH",
      });
      toast.success("Booking cancelled");
      setCancelTarget(null);
      setRefreshKey((key) => key + 1); // reload the list
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsCancelling(false);
    }
  }

  // Start Stripe checkout and go to the payment page
  async function handlePay(booking: Booking) {
    setPayingId(booking._id);
    try {
      const data = await apiFetch("/api/payments/create-checkout-session", {
        method: "POST",
        body: { bookingId: booking._id },
      });
      window.location.href = data.url;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
      setPayingId(null);
    }
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-52" />
        <div className="space-y-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <EmptyState
        title="No bookings yet"
        description="When you request a repair, it will show up here."
        actionLabel="Browse Services"
        actionHref="/services"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
        <p className="text-sm text-muted-foreground">
          {bookings.length} total requests
        </p>
      </div>

      {/* Table on desktop */}
      <div className="hidden md:block">
        <BookingsTable
          bookings={bookings}
          payingId={payingId}
          onCancel={setCancelTarget}
          onPay={handlePay}
        />
      </div>

      {/* Cards on mobile */}
      <div className="md:hidden">
        <BookingCards
          bookings={bookings}
          payingId={payingId}
          onCancel={setCancelTarget}
          onPay={handlePay}
        />
      </div>

      <ConfirmModal
        open={cancelTarget !== null}
        title="Cancel this booking?"
        message="The technician will be informed that you no longer need this repair. This cannot be undone."
        onCancel={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        isLoading={isCancelling}
      />
    </div>
  );
}
