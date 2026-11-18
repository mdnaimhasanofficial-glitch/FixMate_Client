"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// One user as it comes from the API
export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  createdAt: string;
};

// Roles the admin can pick from
const ROLES = [
  { value: "customer", label: "Customer" },
  { value: "technician", label: "Technician" },
  { value: "admin", label: "Admin" },
];

// Table of users, the role select is disabled on the admin's own row
export default function UsersTable({
  users,
  ownEmail,
  updatingId,
  onRoleChange,
}: {
  users: AdminUser[];
  ownEmail: string | undefined;
  updatingId: string | null;
  onRoleChange: (user: AdminUser, role: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => {
              const isOwnRow = user.email === ownEmail;
              return (
                <tr key={user._id} className="hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span className="font-medium text-navy">
                        {user.name}
                        {isOwnRow && (
                          <span className="ml-1 text-xs text-muted-foreground">
                            (you)
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={user.role}
                      onValueChange={(value) => {
                        if (value) onRoleChange(user, value);
                      }}
                      disabled={isOwnRow || updatingId !== null}
                    >
                      <SelectTrigger
                        className="w-36"
                        aria-label={`Role of ${user.name}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
