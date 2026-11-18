"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ProfileUser = {
  email?: string;
  role?: string;
};

type Values = {
  name: string;
  phone: string;
  area: string;
  bio: string;
};

// All the profile inputs, email and role stay read-only
export default function ProfileFields({
  values,
  errors,
  user,
  onChange,
}: {
  values: Values;
  errors: Record<string, string>;
  user: ProfileUser;
  onChange: (key: keyof Values, value: string) => void;
}) {
  return (
    <>
      {/* Name + email (read-only) */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={values.name}
            onChange={(event) => onChange("name", event.target.value)}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={user.email || ""}
            readOnly
            className="bg-muted"
          />
        </div>
      </div>

      {/* Phone + area */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={values.phone}
            placeholder="01XXXXXXXXX"
            onChange={(event) => onChange("phone", event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="area">Area</Label>
          <Input
            id="area"
            value={values.area}
            placeholder="e.g. Dhanmondi, Dhaka"
            onChange={(event) => onChange("area", event.target.value)}
          />
        </div>
      </div>

      {/* Role (read-only) */}
      <div className="space-y-1.5">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          value={user.role || "customer"}
          readOnly
          className="bg-muted capitalize"
        />
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          rows={3}
          value={values.bio}
          placeholder="A short introduction about you"
          onChange={(event) => onChange("bio", event.target.value)}
        />
      </div>
    </>
  );
}
