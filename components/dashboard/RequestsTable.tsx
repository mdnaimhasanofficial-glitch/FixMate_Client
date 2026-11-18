import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";

// One incoming request as it comes from the API
export type RequestItem = {
  _id: string;
  serviceTitle: string;
  customerName: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  basePrice: number;
  status: string;
  paymentStatus: string;
};

// Which buttons each status shows and where they move the booking
export type RequestAction = { label: string; nextStatus: string };

export const ACTIONS: Record<string, RequestAction[]> = {
  requested: [
    { label: "Accept", nextStatus: "accepted" },
    { label: "Reject", nextStatus: "rejected" },
  ],
  accepted: [{ label: "Start Work", nextStatus: "in-progress" }],
  "in-progress": [{ label: "Mark Completed", nextStatus: "completed" }],
  completed: [],
  rejected: [],
  cancelled: [],
};

// Table of incoming requests with the valid action buttons per status
export default function RequestsTable({
  items,
  updatingId,
  onAction,
}: {
  items: RequestItem[];
  updatingId: string | null;
  onAction: (item: RequestItem, action: RequestAction) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Preferred Date</th>
              <th className="px-4 py-3">Problem</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => {
              const actions = ACTIONS[item.status] || [];
              return (
                <tr key={item._id} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium text-navy">
                    {item.serviceTitle}
                  </td>
                  <td className="px-4 py-3">
                    <span className="block font-medium text-navy">
                      {item.customerName}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {item.customerPhone}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      title={item.address}
                      className="block max-w-[150px] truncate text-muted-foreground"
                    >
                      {item.address}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(item.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      title={item.problemDescription}
                      className="block max-w-[200px] truncate text-muted-foreground"
                    >
                      {item.problemDescription}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {actions.length > 0 ? (
                        actions.map((action) => (
                          <Button
                            key={action.label}
                            variant={
                              action.nextStatus === "rejected"
                                ? "destructive"
                                : "default"
                            }
                            size="sm"
                            disabled={updatingId !== null}
                            onClick={() => onAction(item, action)}
                          >
                            {action.label}
                          </Button>
                        ))
                      ) : item.status === "completed" ? (
                        <StatusBadge status={item.paymentStatus} />
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
