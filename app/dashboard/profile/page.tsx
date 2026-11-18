"use client";

import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import ProfileForm from "@/components/dashboard/ProfileForm";

type SessionUser = {
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  area?: string;
  bio?: string;
  image?: string | null;
};

// Profile page for every role, the form saves and refreshes the session
export default function ProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const user = session?.user as SessionUser | undefined;

  // Still checking the session
  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-96 w-full max-w-2xl" />
      </div>
    );
  }

  // Not signed in (the dashboard guard normally catches this first)
  if (!user) {
    return (
      <EmptyState
        title="Not signed in"
        description="Please sign in again to open your profile."
        actionLabel="Sign In"
        actionHref="/sign-in"
      />
    );
  }

  // key makes a fresh form with the latest session values
  return <ProfileForm key={user.email} user={user} refetch={refetch} />;
}
