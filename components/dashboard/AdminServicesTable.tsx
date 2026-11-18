import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";

// One service for the admin to approve or reject
export type AdminService = {
  _id: string;
  title: string;
  image: string;
  category: string;
  basePrice: number;
  technicianName: string;
  approvalStatus: string;
};

// Table of all services with approve / reject per approval status
export default function AdminServicesTable({
  services,
  updatingId,
  onApproval,
}: {
  services: AdminService[];
  updatingId: string | null;
  onApproval: (service: AdminService, approvalStatus: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Technician</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Approval</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map((service) => (
              <tr key={service._id} className="hover:bg-muted/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                    <span className="font-medium text-navy">
                      {service.title}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {service.technicianName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {service.category}
                </td>
                <td className="px-4 py-3 font-medium text-navy">
                  ${service.basePrice}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={service.approvalStatus} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {/* Pending: both, approved: reject, rejected: approve */}
                    {service.approvalStatus !== "approved" && (
                      <Button
                        size="sm"
                        disabled={updatingId !== null}
                        onClick={() => onApproval(service, "approved")}
                      >
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                    )}
                    {service.approvalStatus !== "rejected" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={updatingId !== null}
                        onClick={() => onApproval(service, "rejected")}
                      >
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
