"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import RequestRepairForm from "@/components/shared/RequestRepairForm";

// Decide who can request a repair, then show the right button
export default function RequestRepair({ serviceId }: { serviceId: string }) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as
    | { name?: string; email?: string; role?: string }
    | undefined;
  const role = user?.role || "customer";
  const [open, setOpen] = useState(false);

  // Still checking the session
  if (isPending) {
    return (
      <Button className="w-full" disabled>
        Loading...
      </Button>
    );
  }

  // Logged out: send to the sign-in page and come back here after login
  if (!user) {
    return (
      <Button
        className="w-full"
        nativeButton={false}
        render={
          <Link href={`/sign-in?redirect=/services/${serviceId}`} />
        }
      >
        Sign in to Request Repair
      </Button>
    );
  }

  // Technicians and admins cannot request a repair
  if (role !== "customer") {
    return (
      <div className="space-y-2">
        <Button className="w-full" disabled>
          Request Repair
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Only customers can request a repair
        </p>
      </div>
    );
  }

  // Customer: open the request form in a dialog
  // (the form remounts on every open, so old errors are cleared)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="w-full" />}>
        <CalendarCheck className="h-4 w-4" /> Request Repair
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {open && (
          <RequestRepairForm
            serviceId={serviceId}
            name={user.name || ""}
            email={user.email || ""}
            onClose={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
