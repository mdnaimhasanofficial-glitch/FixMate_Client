"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users, UserCheck, Clock, Wallet } from "lucide-react";
import { apiFetch } from "@/lib/api";
import StatsCard from "@/components/shared/StatsCard";
import StatusChart from "@/components/dashboard/StatusChart";
import EmptyState from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

type Stats = {
  totalUsers: number;
  totalTechnicians: number;
  pendingServices: number;
  totalRevenue: number;
  chart: { status: string; count: number }[];
};

// Load the admin numbers and the status chart from the API
export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch once when the page opens
  useEffect(() => {
    async function loadStats() {
      try {
        const data = await apiFetch("/api/stats");
        setStats(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-52" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl bg-card p-5 shadow-sm ring-1 ring-border"
            >
              <Skeleton className="h-11 w-11 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-14" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  // Fetch failed, show a friendly empty state
  if (!stats) {
    return (
      <EmptyState
        title="Could not load your stats"
        description="Something went wrong while loading the numbers. Open the page again to retry."
        actionLabel="Reload"
        actionHref="/dashboard/admin"
      />
    );
  }

  const cards = [
    { icon: Users, label: "Total Users", value: stats.totalUsers },
    {
      icon: UserCheck,
      label: "Total Technicians",
      value: stats.totalTechnicians,
    },
    {
      icon: Clock,
      label: "Pending Services",
      value: stats.pendingServices,
    },
    {
      icon: Wallet,
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Everything happening on FixMate
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatsCard
            key={card.label}
            icon={card.icon}
            label={card.label}
            value={card.value}
          />
        ))}
      </div>

      <StatusChart data={stats.chart || []} />
    </div>
  );
}
