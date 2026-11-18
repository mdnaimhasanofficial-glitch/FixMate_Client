"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmModal from "@/components/shared/ConfirmModal";
import MyServicesTable, { MyService } from "@/components/dashboard/MyServicesTable";
import ServiceEditDialog from "@/components/dashboard/ServiceEditDialog";

// Show the server message as a toast
function showError(error: unknown) {
  toast.error(error instanceof Error ? error.message : "Something went wrong");
}

// My services: availability switch, edit dialog and delete
export default function MyServicesPage() {
  const [services, setServices] = useState<MyService[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editTarget, setEditTarget] = useState<MyService | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MyService | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch my services from the API (runs again when refreshKey changes)
  useEffect(() => {
    async function loadServices() {
      try {
        const data = await apiFetch("/api/services/my");
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        showError(error);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadServices();
  }, [refreshKey]);

  // Reload the list after a change
  const reload = () => setRefreshKey((key) => key + 1);

  // Turn availability on or off
  async function handleToggleAvailability(
    service: MyService,
    isAvailable: boolean
  ) {
    try {
      await apiFetch(`/api/services/${service._id}/availability`, {
        method: "PATCH",
        body: { isAvailable },
      });
      toast.success(
        isAvailable ? "Service is now available" : "Service is now unavailable"
      );
      reload();
    } catch (error) {
      showError(error);
    }
  }

  // Delete the service the user confirmed
  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiFetch(`/api/services/${deleteTarget._id}`, {
        method: "DELETE",
      });
      toast.success("Service deleted");
      setDeleteTarget(null);
      reload();
    } catch (error) {
      showError(error);
    } finally {
      setIsDeleting(false);
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

  // No services yet, offer the add service page
  if (!services || services.length === 0) {
    return (
      <EmptyState
        title="No services yet"
        description="Add your first service and it will go live after admin approval."
        actionLabel="Add Service"
        actionHref="/dashboard/technician/add-service"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Services</h1>
          <p className="text-sm text-muted-foreground">
            {services.length} services
          </p>
        </div>
        <Button render={<Link href="/dashboard/technician/add-service" />}>
          <PlusCircle className="h-4 w-4" /> Add Service
        </Button>
      </div>

      <MyServicesTable
        services={services}
        onToggleAvailability={handleToggleAvailability}
        onEdit={setEditTarget}
        onDelete={setDeleteTarget}
      />

      <ServiceEditDialog
        service={editTarget}
        onClose={() => setEditTarget(null)}
        onSaved={() => { setEditTarget(null); reload(); }}
      />

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete this service?"
        message={`"${deleteTarget?.title}" will be removed forever. This cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
