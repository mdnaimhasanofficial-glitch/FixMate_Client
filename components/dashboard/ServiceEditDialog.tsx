"use client";

import { useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import {
  ServiceValues,
  validateService,
} from "@/lib/serviceForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ServiceFormFields from "@/components/dashboard/ServiceFormFields";
import ServiceFormDetails from "@/components/dashboard/ServiceFormDetails";
import type { MyService } from "@/components/dashboard/MyServicesTable";

// Pre-filled edit form, saving sends the service for approval again
export default function ServiceEditDialog({
  service,
  onClose,
  onSaved,
}: {
  service: MyService | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  return (
    <Dialog
      open={service !== null}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>
            Note: editing sends the service for approval again. It stays
            pending until the admin approves it.
          </DialogDescription>
        </DialogHeader>
        {/* key makes a fresh form for every service */}
        {service && (
          <ServiceEditForm
            key={service._id}
            service={service}
            onClose={onClose}
            onSaved={onSaved}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// The form itself, its values start from the chosen service
function ServiceEditForm({
  service,
  onClose,
  onSaved,
}: {
  service: MyService;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<ServiceValues>(() => ({
    title: service.title,
    category: service.category,
    description: service.description,
    basePrice: String(service.basePrice),
    estimatedDuration: service.estimatedDuration,
    serviceMode: service.serviceMode,
    serviceArea: service.serviceArea,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Update one field and clear its old error
  function handleChange(key: keyof ServiceValues, value: string) {
    setValues({ ...values, [key]: value });
    setErrors({ ...errors, [key]: "" });
  }

  // Save the edited service (the image is not changed here)
  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    const found = validateService(values, null, false);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setIsSaving(true);
    try {
      await apiFetch(`/api/services/${service._id}`, {
        method: "PATCH",
        body: {
          title: values.title.trim(),
          category: values.category,
          description: values.description.trim(),
          basePrice: Number(values.basePrice),
          estimatedDuration: values.estimatedDuration.trim(),
          serviceMode: values.serviceMode,
          serviceArea: values.serviceArea.trim(),
        },
      });
      toast.success("Service updated. Waiting for admin approval");
      onSaved();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <ServiceFormFields values={values} errors={errors} onChange={handleChange} />
      <ServiceFormDetails
        values={values}
        errors={errors}
        onChange={handleChange}
        showFile={false}
      />
      <DialogFooter className="gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}
