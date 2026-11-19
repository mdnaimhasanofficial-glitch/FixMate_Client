"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RequestRepairFields from "@/components/shared/RequestRepairFields";

type Values = {
  phone: string;
  address: string;
  date: string;
  problem: string;
};

// Check the form and return the error messages
function validate(values: Values) {
  const errors: Record<string, string> = {};
  if (!values.phone.trim()) errors.phone = "Phone is required";
  if (!values.address.trim()) errors.address = "Address is required";
  if (!values.date) errors.date = "Preferred date is required";
  if (!values.problem.trim()) errors.problem = "Problem description is required";
  else if (values.problem.trim().length < 20)
    errors.problem = "Describe the problem in at least 20 characters";
  return errors;
}

// The dialog form that sends a repair request to the API
export default function RequestRepairForm({
  serviceId,
  name,
  email,
  onClose,
}: {
  serviceId: string;
  name: string;
  email: string;
  onClose: () => void;
}) {
  const [values, setValues] = useState<Values>({
    phone: "",
    address: "",
    date: "",
    problem: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Update one field and clear its old error
  function handleChange(key: keyof Values, value: string) {
    setValues({ ...values, [key]: value });
    setErrors({ ...errors, [key]: "" });
  }

  // Send the request to the API
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return; // invalid, do not submit
    setIsLoading(true);
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: {
          serviceId,
          customerPhone: values.phone,
          address: values.address,
          preferredDate: values.date,
          problemDescription: values.problem,
        },
      });
      setSent(true);
      toast.success("Repair request sent");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{sent ? "Request Sent" : "Request a Repair"}</DialogTitle>
        <DialogDescription>
          {sent
            ? "Your technician will confirm the request shortly."
            : "Tell us about the problem and pick a date."}
        </DialogDescription>
      </DialogHeader>

      {sent ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Track the status of your request in My Bookings.
          </p>
          <Button
            className="w-full"
            nativeButton={false}
            render={
              <Link
                href="/dashboard/customer/bookings"
                onClick={onClose}
              />
            }
          >
            View My Bookings
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name and email come from the session, read-only */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} readOnly className="bg-muted" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} readOnly className="bg-muted" />
          </div>

          <RequestRepairFields
            values={values}
            errors={errors}
            today={today}
            onChange={handleChange}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Request"}
          </Button>
        </form>
      )}
    </>
  );
}
