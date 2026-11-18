import {
  LayoutDashboard,
  CalendarClock,
  CreditCard,
  ClipboardList,
  Wrench,
  PlusCircle,
  Users,
  Wallet,
  User,
  type LucideIcon,
} from "lucide-react";

// One item in a dashboard menu
export type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

// Menu items for every role, the sidebar reads MENU[role]
export const MENU: Record<string, MenuItem[]> = {
  customer: [
    { label: "Dashboard", href: "/dashboard/customer", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: CalendarClock },
    { label: "Payments", href: "/dashboard/customer/payments", icon: CreditCard },
  ],
  technician: [
    { label: "Dashboard", href: "/dashboard/technician", icon: LayoutDashboard },
    { label: "Requests", href: "/dashboard/technician/requests", icon: ClipboardList },
    { label: "My Services", href: "/dashboard/technician/my-services", icon: Wrench },
    { label: "Add Service", href: "/dashboard/technician/add-service", icon: PlusCircle },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Services", href: "/dashboard/admin/services", icon: Wrench },
    { label: "Bookings", href: "/dashboard/admin/bookings", icon: CalendarClock },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: Wallet },
  ],
};

// Every role gets this item under its own menu
export const PROFILE_ITEM: MenuItem = {
  label: "Update Profile",
  href: "/dashboard/profile",
  icon: User,
};
