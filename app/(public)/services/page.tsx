import { Suspense } from "react";
import ServicesBody from "./ServicesBody";

type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export default function ServicesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="h-9 w-64 animate-pulse rounded-lg bg-muted" />

            <div className="h-28 animate-pulse rounded-xl bg-muted" />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          </div>
        }
      >
        <ServicesPageContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ServicesPageContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;

  const FILTER_KEYS = ["search", "category", "serviceMode", "sort", "page"];

  const query = new URLSearchParams();

  FILTER_KEYS.forEach((key) => {
    const value = raw[key];

    if (typeof value === "string" && value) {
      query.set(key, value);
    }
  });

  if (!query.has("sort")) {
    query.set("sort", "newest");
  }

  return <ServicesBody query={query.toString()} />;
}
