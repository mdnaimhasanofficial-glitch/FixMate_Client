import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";

// One booking as it comes from the API
export type Booking = {
  _id: string;
  serviceTitle: string;
  serviceImage: string;
  technicianName: string;
  preferredDate: string;
  basePrice: number;
  finalAmount: number;
  status: string;
  paymentStatus: string;
};

// Desktop table of bookings, hidden below md
export default function BookingsTable({
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
    <div className="overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Technician</th>
            <th className="px-4 py-3">Preferred Date</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {bookings.map((booking) => (
            <tr key={booking._id} className="hover:bg-muted/40">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={booking.serviceImage}
                    alt={booking.serviceTitle}
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  />
                  <span className="font-medium text-foreground">
                    {booking.serviceTitle}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {booking.technicianName}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(booking.preferredDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <span className="font-medium text-foreground">
                  ${booking.finalAmount}
                </span>
                {booking.finalAmount !== booking.basePrice && (
                  <span className="block text-xs text-muted-foreground">
                    Base ${booking.basePrice}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={booking.status} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={booking.paymentStatus} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {/* Cancel only while the job is still requested */}
                  {booking.status === "requested" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCancel(booking)}
                    >
                      Cancel
                    </Button>
                  )}
                  {/* Pay only a completed, unpaid job */}
                  {booking.status === "completed" &&
                    booking.paymentStatus === "unpaid" && (
                      <Button
                        size="sm"
                        onClick={() => onPay(booking)}
                        disabled={payingId === booking._id}
                      >
                        <CreditCard className="h-4 w-4" />
                        {payingId === booking._id
                          ? "Redirecting..."
                          : "Pay Now"}
                      </Button>
                    )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
