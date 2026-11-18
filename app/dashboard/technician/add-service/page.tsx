"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import {
  EMPTY_SERVICE_VALUES,
  ServiceValues,
  validateService,
} from "@/lib/serviceForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import ServiceFormFields from "@/components/dashboard/ServiceFormFields";
import ServiceFormDetails from "@/components/dashboard/ServiceFormDetails";

// Technician submits a new service, the admin approves it later
export default function AddServicePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as
    | { name?: string; email?: string }
    | undefined;

  const [values, setValues] = useState<ServiceValues>(EMPTY_SERVICE_VALUES);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update one field and clear its old error
  function handleChange(key: keyof ServiceValues, value: string) {
    setValues({ ...values, [key]: value });
    setErrors({ ...errors, [key]: "" });
  }

  // Upload the image, then save the service
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validateService(values, file);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setIsSubmitting(true);
    try {
      const image = await uploadImage(file as File);
      await apiFetch("/api/services", {
        method: "POST",
        body: {
          title: values.title.trim(),
          category: values.category,
          description: values.description.trim(),
          image,
          basePrice: Number(values.basePrice),
          estimatedDuration: values.estimatedDuration.trim(),
          serviceMode: values.serviceMode,
          serviceArea: values.serviceArea.trim(),
        },
      });
      toast.success("Service submitted. Waiting for admin approval");
      setValues(EMPTY_SERVICE_VALUES);
      setFile(null);
      setFileInputKey((key) => key + 1); // clears the file input
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Still checking the session
  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-96 w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Add a Service</h1>
        <p className="text-sm text-muted-foreground">
          Submit a new service and wait for admin approval
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-border"
      >
        {/* Technician info comes from the session, read-only */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="tech-name">Technician Name</Label>
            <Input
              id="tech-name"
              value={user?.name || ""}
              readOnly
              className="bg-muted"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tech-email">Technician Email</Label>
            <Input
              id="tech-email"
              value={user?.email || ""}
              readOnly
              className="bg-muted"
            />
          </div>
        </div>

        <ServiceFormFields
          values={values}
          errors={errors}
          onChange={handleChange}
        />
        <ServiceFormDetails
          values={values}
          errors={errors}
          file={file}
          fileInputKey={fileInputKey}
          onChange={handleChange}
          onFileChange={(nextFile) => {
            setFile(nextFile);
            setErrors({ ...errors, image: "" });
          }}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit for Approval"}
        </Button>
      </form>
    </div>
  );
}
