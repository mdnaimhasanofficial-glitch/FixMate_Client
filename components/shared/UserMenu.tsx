"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LayoutDashboard, UserRound, LogOut, LogIn, UserPlus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROLE_BADGE: Record<string, string> = {
  customer: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  technician:
    "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  admin: "bg-primary text-primary-foreground",
};

// Skeleton while loading, buttons when logged out, avatar menu when logged in
export default function UserMenu({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as { name?: string; role?: string } | undefined;

  // Go somewhere and close the mobile sheet
  function go(path: string) {
    onNavigate?.();
    router.push(path);
  }

  // Log out of BetterAuth, drop the cached token and go home
  async function handleSignOut() {
    await authClient.signOut();
    clearToken();
    toast.success("Signed out");
    onNavigate?.();
    router.push("/");
    router.refresh();
  }

  // Loading skeleton
  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  // Logged out: Sign In + Sign Up
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => go("/sign-in")}>
          <LogIn className="h-4 w-4" /> Sign In
        </Button>
        <Button size="sm" onClick={() => go("/sign-up")}>
          <UserPlus className="h-4 w-4" /> Sign Up
        </Button>
      </div>
    );
  }

  // Logged in: avatar dropdown with name, role badge and actions
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            aria-label="Open account menu"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
          />
        }
      >
        {(user.name || "U").charAt(0).toUpperCase()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="truncate font-semibold">{user.name}</p>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              ROLE_BADGE[user.role || "customer"]
            }`}
          >
            {user.role || "customer"}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => go("/dashboard")}>
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => go("/dashboard/profile")}>
          <UserRound className="h-4 w-4" /> Update Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
