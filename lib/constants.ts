// Every booking/service/payment status -> label + Tailwind color classes
// Used by <StatusBadge /> everywhere
// Light mode uses soft pastels, dark mode uses transparent tints of the same hue
export const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  // booking statuses
  requested: {
    label: "Requested",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  },
  accepted: {
    label: "Accepted",
    className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300",
  },
  // service approval statuses
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
  approved: {
    label: "Approved",
    className: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  },
  // payment statuses
  paid: {
    label: "Paid",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  unpaid: {
    label: "Unpaid",
    className: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  },
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
