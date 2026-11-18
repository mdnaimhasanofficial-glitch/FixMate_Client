"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";

// Avatar, name, live role badge and a link back to the public site
export default function Topbar() {
  const { data: session } = authClient.useSession();
  const user = session?.user as
    | { name?: string; email?: string; image?: string; role?: string }
    | undefined;
  const role = user?.role || "customer";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-white px-4 pl-14 lg:pl-6">
      <span className="hidden text-sm font-medium text-muted-foreground sm:block">
        {user ? `Welcome, ${user.name}` : "Dashboard"}
      </span>

      <div className="flex items-center gap-3">
        {/* Back to the public pages */}
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium text-navy transition-colors hover:bg-muted"
        >
          <Home className="h-4 w-4" /> Home
        </Link>

        <div className="flex items-center gap-2">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
              {(user?.name || "?").charAt(0).toUpperCase()}
            </span>
          )}
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-medium text-navy">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Badge
            variant="outline"
            className="border-brand/30 bg-brand/10 uppercase text-brand"
          >
            {role}
          </Badge>
        </div>
      </div>
    </header>
  );
}
