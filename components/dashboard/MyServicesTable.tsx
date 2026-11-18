import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import StatusBadge from "@/components/shared/StatusBadge";

// One of my services as it comes from the API
export type MyService = {
  _id: string;
  title: string;
  category: string;
  image: string;
  basePrice: number;
  approvalStatus: string;
  isAvailable: boolean;
  description: string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
};

// Table of my services with availability, edit and delete
export default function MyServicesTable({
  services,
  onToggleAvailability,
  onEdit,
  onDelete,
}: {
  services: MyService[];
  onToggleAvailability: (service: MyService, isAvailable: boolean) => void;
  onEdit: (service: MyService) => void;
  onDelete: (service: MyService) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Approval</th>
              <th className="px-4 py-3">Available</th>
              <th className="px-4 py-3 text-right">Actions</th>
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
                  {service.category}
                </td>
                <td className="px-4 py-3 font-medium text-navy">
                  ${service.basePrice}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={service.approvalStatus} />
                </td>
                <td className="px-4 py-3">
                  <Switch
                    checked={service.isAvailable}
                    onCheckedChange={(checked) =>
                      onToggleAvailability(service, checked)
                    }
                    aria-label={`Availability of ${service.title}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(service)}
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(service)}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
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
