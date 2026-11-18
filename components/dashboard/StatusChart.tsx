"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Bar chart that shows how many bookings are in each status
export default function StatusChart({
  data,
}: {
  data: { status: string; count: number }[];
}) {
  return (
    <div className="h-80 w-full rounded-xl bg-white p-5 shadow-sm ring-1 ring-border">
      <h3 className="font-semibold text-navy">Bookings by Status</h3>
      <p className="text-sm text-muted-foreground">Live numbers from the API</p>
      <div className="mt-4 h-[calc(100%-3.5rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="status"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip cursor={{ fill: "rgba(15, 23, 42, 0.05)" }} />
            <Bar
              dataKey="count"
              fill="#F97316"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
