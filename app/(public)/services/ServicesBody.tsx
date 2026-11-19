import Link from "next/link";
import { connection } from "next/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ServiceCard, { ServiceCardData } from "@/components/shared/ServiceCard";
import ServiceFilters from "@/components/shared/ServiceFilters";
import EmptyState from "@/components/shared/EmptyState";

type ServicesBodyProps = {
  query: string;
};

// Ask the Express API for this page of services (filtering happens there)
async function getServices(
  query: URLSearchParams
): Promise<{ items: ServiceCardData[]; total: number; totalPages: number }> {
  // Render at request time, so the fetch never runs during prerender
  await connection();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services?${query}`, {
      cache: "no-store",
    });
    if (!res.ok) return { items: [], total: 0, totalPages: 0 };
    const data = await res.json();
    return {
      items: data.items || [],
      total: data.total || 0,
      totalPages: data.totalPages || 0,
    };
  } catch {
    return { items: [], total: 0, totalPages: 0 };
  }
}

// Link for a page number that keeps the current filters
function pageHref(query: URLSearchParams, page: number) {
  const params = new URLSearchParams(query.toString());
  params.set("page", String(page));
  return `/services?${params.toString()}`;
}

// Everything that needs API data. The page wraps this in <Suspense> so the
// route stays instant and the results stream in when the API answers.
export default async function ServicesBody({ query: queryString }: ServicesBodyProps) {
  const query = new URLSearchParams(queryString);
  const data = await getServices(query);
  const page = Number(query.get("page")) || 1;
  const totalPages = data.totalPages || 0;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">All Services</h1>
        <p className="text-muted-foreground">{data.total} services available</p>
      </div>

      {/* Filters only change the URL, so they survive a reload */}
      <ServiceFilters />

      {data.items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No services found"
            description="Try a different search, or clear the filters to see everything."
            actionLabel="Clear filters"
            actionHref="/services"
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}

      {/* Previous / page numbers / Next */}
      {totalPages > 1 && (
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
          {page > 1 ? (
            <Link
              href={pageHref(query, page - 1)}
              className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Link>
          ) : (
            <span className="flex cursor-not-allowed items-center gap-1 rounded-lg border px-3 py-2 text-sm text-muted-foreground opacity-50">
              <ChevronLeft className="h-4 w-4" /> Previous
            </span>
          )}

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
            <Link
              key={number}
              href={pageHref(query, number)}
              aria-current={number === page ? "page" : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium ${
                number === page
                  ? "bg-primary text-primary-foreground"
                  : "border text-foreground hover:bg-muted"
              }`}
            >
              {number}
            </Link>
          ))}

          {page < totalPages ? (
            <Link
              href={pageHref(query, page + 1)}
              className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="flex cursor-not-allowed items-center gap-1 rounded-lg border px-3 py-2 text-sm text-muted-foreground opacity-50">
              Next <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </nav>
      )}
    </>
  );
}
