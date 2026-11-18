"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Values = {
  phone: string;
  address: string;
  date: string;
  problem: string;
};

// The four fields the customer has to fill in
export default function RequestRepairFields({
  values,
  errors,
  today,
  onChange,
}: {
  values: Values;
  errors: Record<string, string>;
  today: string;
  onChange: (key: keyof Values, value: string) => void;
}) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={values.phone}
          placeholder="01XXXXXXXXX"
          onChange={(event) => onChange("phone", event.target.value)}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={values.address}
          placeholder="House, road, area, city"
          onChange={(event) => onChange("address", event.target.value)}
        />
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="date">Preferred Date</Label>
        <Input
          id="date"
          type="date"
          value={values.date}
          min={today}
          onChange={(event) => onChange("date", event.target.value)}
        />
        {errors.date && (
          <p className="text-sm text-destructive">{errors.date}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="problem">Problem Description</Label>
        <Textarea
          id="problem"
          value={values.problem}
          rows={3}
          placeholder="What is broken? (min 20 characters)"
          onChange={(event) => onChange("problem", event.target.value)}
        />
        {errors.problem && (
          <p className="text-sm text-destructive">{errors.problem}</p>
        )}
      </div>
    </>
  );
}
