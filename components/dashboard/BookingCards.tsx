import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import type { Booking } from "@/components/dashboard/BookingsTable";

// Cards view of the same bookings, hidden on desktop
export default function BookingCards({
  bookings,
  payingId,
  onCancel,
  onPay,
}: {
  bookings: Booking[];
  payingId: string | null;
  onCancel: (booking: Booking) => void;
  onPay: (booking: Booking) => void;
}) {
  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-border"
        >
          <div className="flex gap-3">
            <img
              src={booking.serviceImage}
              alt={booking.serviceTitle}
              className="h-16 w-16 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="truncate font-semibold text-navy">
                {booking.serviceTitle}
              </p>
              <p className="text-sm text-muted-foreground">
                {booking.technicianName}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(booking.preferredDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={booking.status} />
            <StatusBadge status={booking.paymentStatus} />
            <span className="ml-auto font-medium text-navy">
              ${booking.finalAmount}
            </span>
          </div>

          {/* Buttons only for the right status */}
          {(booking.status === "requested" ||
            (booking.status === "completed" &&
              booking.paymentStatus === "unpaid")) && (
            <div className="flex gap-2">
              {booking.status === "requested" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onCancel(booking)}
                >
                  Cancel
                </Button>
              )}
              {booking.status === "completed" &&
                booking.paymentStatus === "unpaid" && (
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => onPay(booking)}
                    disabled={payingId === booking._id}
                  >
                    <CreditCard className="h-4 w-4" />
                    {payingId === booking._id ? "Redirecting..." : "Pay Now"}
                  </Button>
                )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
