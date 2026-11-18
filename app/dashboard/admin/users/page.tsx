"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import UsersTable, { AdminUser } from "@/components/dashboard/UsersTable";

// Show the server message as a toast
function showError(error: unknown) {
  toast.error(error instanceof Error ? error.message : "Something went wrong");
}

// All users with a role select for the admin
export default function AdminUsersPage() {
  const { data: session } = authClient.useSession();
  const ownEmail = (session?.user as { email?: string } | undefined)?.email;

  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch all users from the API (runs again when refreshKey changes)
  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await apiFetch("/api/admin/users");
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        showError(error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, [refreshKey]);

  // Change the role of a user
  async function handleRoleChange(user: AdminUser, role: string) {
    setUpdatingId(user._id);
    try {
      await apiFetch(`/api/admin/users/${user._id}/role`, {
        method: "PATCH",
        body: { role },
      });
      toast.success("Role updated");
      setRefreshKey((key) => key + 1);
    } catch (error) {
      showError(error);
    } finally {
      setUpdatingId(null);
    }
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-52" />
        <div className="space-y-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <EmptyState
        title="No users"
        description="Users who sign up will show up here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="text-sm text-muted-foreground">{users.length} users</p>
      </div>

      <UsersTable
        users={users}
        ownEmail={ownEmail}
        updatingId={updatingId}
        onRoleChange={handleRoleChange}
      />
    </div>
  );
}
