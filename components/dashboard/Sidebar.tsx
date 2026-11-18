"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { MENU, PROFILE_ITEM } from "@/components/dashboard/menu";

// Role based sidebar: fixed on desktop, slide-in drawer on mobile/tablet
export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const role =
    (session?.user as { role?: string } | undefined)?.role || "customer";
  const items = [...(MENU[role] || MENU.customer), PROFILE_ITEM];
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button for mobile and tablet */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="fixed left-4 top-3.5 z-50 flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm lg:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Dark backdrop closes the drawer on small screens */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel: always visible on lg, slides in below lg when open */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy text-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
            F
          </span>
          <span className="text-lg font-bold">FixMate</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-5 py-4 text-xs capitalize text-white/50">
          Signed in as {role}
        </div>
      </aside>
    </>
  );
}
