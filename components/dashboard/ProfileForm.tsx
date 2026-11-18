"use client";

import { useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProfileFields from "@/components/dashboard/ProfileFields";

type ProfileUser = {
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  area?: string;
  bio?: string;
  image?: string | null;
};

// Editable profile fields, email and role stay read-only
export default function ProfileForm({
  user,
  refetch,
}: {
  user: ProfileUser;
  refetch: () => Promise<unknown>;
}) {
  const [values, setValues] = useState(() => ({
    name: user.name || "",
    phone: user.phone || "",
    area: user.area || "",
    bio: user.bio || "",
  }));
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Update one field and clear its old error
  function handleChange(key: keyof typeof values, value: string) {
    setValues({ ...values, [key]: value });
    setErrors({ ...errors, [key]: "" });
  }

  // Upload a new photo if picked, save, then refresh the session
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!values.name.trim()) {
      setErrors({ name: "Name is required" });
      return;
    }
    setIsSaving(true);
    try {
      let image: string | undefined;
      if (file) image = await uploadImage(file);
      await apiFetch("/api/users/profile", {
        method: "PATCH",
        body: {
          name: values.name.trim(),
          phone: values.phone,
          area: values.area,
          bio: values.bio,
          ...(image && { image }),
        },
      });
      await refetch(); // navbar and topbar update without logging out
      toast.success("Profile updated");
      setFile(null);
      setFileInputKey((key) => key + 1); // clears the file input
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Update your personal information
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-border"
      >
        {/* Current photo + new photo file input */}
        <div className="flex items-center gap-4">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="h-20 w-20 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-navy text-2xl font-bold text-white">
              {(user.name || "?").charAt(0).toUpperCase()}
            </span>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="photo">Profile Photo</Label>
            <Input
              id="photo"
              key={fileInputKey}
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
            <p className="text-xs text-muted-foreground">
              {file ? file.name : "PNG or JPG"}
            </p>
          </div>
        </div>

        {/* All the inputs, email and role are read-only */}
        <ProfileFields
          values={values}
          errors={errors}
          user={user}
          onChange={handleChange}
        />

        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
