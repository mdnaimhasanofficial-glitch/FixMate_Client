"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, SERVICE_MODES } from "@/lib/constants";

// Filters live in the URL only, so a reload keeps them. No filtering in JS.
export default function ServiceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const category = searchParams.get("category") || "";
  const serviceMode = searchParams.get("serviceMode") || "";
  const sort = searchParams.get("sort") || "newest";

  // Change the URL search params and go back to page 1
  function updateParams(changes: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.delete("page");
    router.push(`/services?${params.toString()}`);
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border">
      {/* Search box */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          updateParams({ search });
        }}
        className="flex gap-2"
      >
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search services..."
          className="h-9"
          aria-label="Search services"
        />
        <Button type="submit" size="sm" className="h-9 px-4">
          <Search className="h-4 w-4" /> Search
        </Button>
      </form>

      {/* Category, service mode and sort selects */}
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Select value={category} onValueChange={(value) => updateParams({ category: value || "" })}>
          <SelectTrigger className="w-full" aria-label="Category">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {CATEGORIES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={serviceMode} onValueChange={(value) => updateParams({ serviceMode: value || "" })}>
          <SelectTrigger className="w-full" aria-label="Service mode">
            <SelectValue placeholder="All Modes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Modes</SelectItem>
            {SERVICE_MODES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(value) => updateParams({ sort: value || "newest" })}>
          <SelectTrigger className="w-full" aria-label="Sort">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
