"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmModal from "@/components/shared/ConfirmModal";
import RequestsTable, {
  RequestAction,
  RequestItem,
} from "@/components/dashboard/RequestsTable";
import FinalAmountDialog from "@/components/dashboard/FinalAmountDialog";
import StatusFilter from "@/components/dashboard/StatusFilter";

// Show the server message as a toast
function showError(error: unknown) {
  toast.error(error instanceof Error ? error.message : "Something went wrong");
}

// Incoming requests: accept, reject, start, complete
export default function TechnicianRequestsPage() {
  const [items, setItems] = useState<RequestItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [rejectTarget, setRejectTarget] = useState<RequestItem | null>(null);
  const [completeTarget, setCompleteTarget] = useState<RequestItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch my requests from the API (runs again on filter change)
  useEffect(() => {
    async function loadRequests() {
      try {
        const query = filter === "all" ? "" : `?status=${filter}`;
        const data = await apiFetch(`/api/bookings/technician${query}`);
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        showError(error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadRequests();
  }, [refreshKey, filter]);

  // Reload the list after a change
  const reload = () => setRefreshKey((key) => key + 1);

  // Send the new status to the API and reload
  async function changeStatus(
    item: RequestItem,
    status: string,
    finalAmount?: number
  ) {
    setUpdatingId(item._id);
    try {
      await apiFetch(`/api/bookings/${item._id}/status`, {
        method: "PATCH",
        body: { status, ...(finalAmount !== undefined && { finalAmount }) },
      });
      const messages: Record<string, string> = {
        accepted: "Request accepted",
        rejected: "Request rejected",
        "in-progress": "Work started",
        completed: "Job marked as completed",
      };
      toast.success(messages[status] || "Status updated");
      setRejectTarget(null);
      setCompleteTarget(null);
      reload();
    } catch (error) {
      showError(error);
    } finally {
      setUpdatingId(null);
    }
  }

  // Accept and start work go straight through, the others open a dialog
  function handleAction(item: RequestItem, action: RequestAction) {
    if (action.nextStatus === "rejected") {
      setRejectTarget(item);
      return;
    }
    if (action.nextStatus === "completed") {
      setCompleteTarget(item);
      return;
    }
    changeStatus(item, action.nextStatus);
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-52" />
        <div className="space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        title="No requests"
        description="New repair requests from customers will show up here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">Requests</h1>
        <p className="text-sm text-muted-foreground">
          {items.length} requests
        </p>
      </div>

      {/* Status filter */}
      <StatusFilter value={filter} onChange={setFilter} />

      <RequestsTable items={items} updatingId={updatingId} onAction={handleAction} />

      <ConfirmModal
        open={rejectTarget !== null}
        title="Reject this request?"
        message={`${rejectTarget?.customerName} will be informed that the request was rejected.`}
        onCancel={() => setRejectTarget(null)}
        onConfirm={() => rejectTarget && changeStatus(rejectTarget, "rejected")}
        isLoading={updatingId !== null}
      />

      <FinalAmountDialog
        item={completeTarget}
        onClose={() => setCompleteTarget(null)}
        onConfirm={(amount) =>
          completeTarget && changeStatus(completeTarget, "completed", amount)
        }
        isLoading={updatingId !== null}
      />
    </div>
  );
}
