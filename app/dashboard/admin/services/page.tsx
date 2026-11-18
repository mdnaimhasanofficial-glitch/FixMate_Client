"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import StatusFilter from "@/components/dashboard/StatusFilter";
import AdminServicesTable, {
  AdminService,
} from "@/components/dashboard/AdminServicesTable";

// Show the server message as a toast
function showError(error: unknown) {
  toast.error(error instanceof Error ? error.message : "Something went wrong");
}

// Approval filter options (pending is selected by default)
const APPROVAL_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

// All services, the admin approves or rejects them
export default function AdminServicesPage() {
  const [services, setServices] = useState<AdminService[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [refreshKey, setRefreshKey] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch services from the API (runs again on filter change)
  useEffect(() => {
    async function loadServices() {
      try {
        const query = filter === "all" ? "" : `?status=${filter}`;
        const data = await apiFetch(`/api/admin/services${query}`);
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        showError(error);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadServices();
  }, [refreshKey, filter]);

  // Approve or reject a service
  async function handleApproval(service: AdminService, approvalStatus: string) {
    setUpdatingId(service._id);
    try {
      await apiFetch(`/api/admin/services/${service._id}/approval`, {
        method: "PATCH",
        body: { approvalStatus },
      });
      toast.success(
        approvalStatus === "approved"
          ? "Service approved"
          : "Service rejected"
      );
      setRefreshKey((key) => key + 1);
    } catch (error) {
      showError(error);
    } finally {
      setUpdatingId(null);
    }
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-52" />
        <div className="space-y-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Services</h1>
        <StatusFilter value={filter} onChange={setFilter} options={APPROVAL_FILTERS} />
        <EmptyState
          title="No services here"
          description="Services with this approval status will show up here."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Services</h1>
        <p className="text-sm text-muted-foreground">
          {services.length} services
        </p>
      </div>

      <StatusFilter value={filter} onChange={setFilter} options={APPROVAL_FILTERS} />

      <AdminServicesTable
        services={services}
        updatingId={updatingId}
        onApproval={handleApproval}
      />
    </div>
  );
}
