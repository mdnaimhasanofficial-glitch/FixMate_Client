import Link from "next/link";
import {
  Smartphone,
  Laptop,
  AirVent,
  Refrigerator,
  Tv,
  WashingMachine,
  Zap,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone: Smartphone,
  "Laptop & PC": Laptop,
  AC: AirVent,
  Refrigerator: Refrigerator,
  TV: Tv,
  "Washing Machine": WashingMachine,
  Electrical: Zap,
};

// Every category card links to the services page with that category
export default function PopularCategories() {
  return (
    <section className="bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-foreground">Popular Categories</h2>
          <p className="text-muted-foreground">What do you need fixed today?</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category] || Zap;
            return (
              <Link
                key={category}
                href={`/services?category=${encodeURIComponent(category)}`}
                className="flex flex-col items-center gap-3 rounded-xl bg-card p-4 text-center shadow-sm ring-1 ring-border transition-all hover:-translate-y-1 hover:ring-brand"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-medium text-foreground">{category}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
