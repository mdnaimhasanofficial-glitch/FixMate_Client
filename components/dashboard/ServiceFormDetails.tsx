"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICE_MODES } from "@/lib/constants";
import type { ServiceValues } from "@/lib/serviceForm";

// Duration, mode, area and the image file of the service
// (the edit dialog passes showFile = false, it keeps the old image)
export default function ServiceFormDetails({
  values,
  errors,
  file,
  fileInputKey,
  onChange,
  onFileChange,
  showFile = true,
}: {
  values: ServiceValues;
  errors: Record<string, string>;
  file?: File | null;
  fileInputKey?: number;
  onChange: (key: keyof ServiceValues, value: string) => void;
  onFileChange?: (file: File | null) => void;
  showFile?: boolean;
}) {
  return (
    <>
      {/* Duration + service mode */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="estimatedDuration">Estimated Duration</Label>
          <Input
            id="estimatedDuration"
            value={values.estimatedDuration}
            placeholder="e.g. 30 minutes"
            onChange={(event) =>
              onChange("estimatedDuration", event.target.value)
            }
          />
          {errors.estimatedDuration && (
            <p className="text-sm text-destructive">
              {errors.estimatedDuration}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Service Mode</Label>
          <Select
            value={values.serviceMode}
            onValueChange={(value) => onChange("serviceMode", value || "")}
          >
            <SelectTrigger className="w-full" aria-label="Service mode">
              <SelectValue placeholder="Select a mode" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_MODES.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.serviceMode && (
            <p className="text-sm text-destructive">{errors.serviceMode}</p>
          )}
        </div>
      </div>

      {/* Service area + image file */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="serviceArea">Service Area</Label>
          <Input
            id="serviceArea"
            value={values.serviceArea}
            placeholder="e.g. Dhanmondi, Dhaka"
            onChange={(event) => onChange("serviceArea", event.target.value)}
          />
          {errors.serviceArea && (
            <p className="text-sm text-destructive">{errors.serviceArea}</p>
          )}
        </div>
        {showFile && (
          <div className="space-y-1.5">
            <Label htmlFor="image">Service Image</Label>
            <Input
              id="image"
              key={fileInputKey}
              type="file"
              accept="image/*"
              onChange={(event) =>
                onFileChange?.(event.target.files?.[0] || null)
              }
            />
            <p className="text-xs text-muted-foreground">
              {file ? file.name : "PNG or JPG"}
            </p>
            {errors.image && (
              <p className="text-sm text-destructive">{errors.image}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
