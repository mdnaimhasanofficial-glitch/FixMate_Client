"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/constants";
import type { ServiceValues } from "@/lib/serviceForm";

// Title, category, price and description of the service
export default function ServiceFormFields({
  values,
  errors,
  onChange,
}: {
  values: ServiceValues;
  errors: Record<string, string>;
  onChange: (key: keyof ServiceValues, value: string) => void;
}) {
  return (
    <>
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={values.title}
          placeholder="e.g. Screen replacement for iPhone 13"
          onChange={(event) => onChange("title", event.target.value)}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      {/* Category + base price */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select
            value={values.category}
            onValueChange={(value) => onChange("category", value || "")}
          >
            <SelectTrigger className="w-full" aria-label="Category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-destructive">{errors.category}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="basePrice">Base Price ($)</Label>
          <Input
            id="basePrice"
            type="number"
            min="1"
            step="1"
            value={values.basePrice}
            placeholder="25"
            onChange={(event) => onChange("basePrice", event.target.value)}
          />
          {errors.basePrice && (
            <p className="text-sm text-destructive">{errors.basePrice}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          value={values.description}
          placeholder="What do you repair and what is included?"
          onChange={(event) => onChange("description", event.target.value)}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>
    </>
  );
}
