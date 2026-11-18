// Every booking/service/payment status -> label + Tailwind color classes
// Used by <StatusBadge /> everywhere
export const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  // booking statuses
  requested: { label: "Requested", className: "bg-amber-100 text-amber-700" },
  accepted: { label: "Accepted", className: "bg-blue-100 text-blue-700" },
  "in-progress": { label: "In Progress", className: "bg-violet-100 text-violet-700" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  cancelled: { label: "Cancelled", className: "bg-slate-100 text-slate-600" },
  // service approval statuses
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", className: "bg-green-100 text-green-700" },
  // payment statuses
  paid: { label: "Paid", className: "bg-emerald-100 text-emerald-700" },
  unpaid: { label: "Unpaid", className: "bg-orange-100 text-orange-700" },
};

// All service categories (same list as the seed script)
export const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

// How a service is delivered
export const SERVICE_MODES = ["On-site", "In-store"];
