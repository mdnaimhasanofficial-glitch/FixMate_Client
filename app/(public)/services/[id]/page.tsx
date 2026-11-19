import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Wallet, Clock, Wrench, MapPin } from "lucide-react";
import RequestRepair from "@/components/shared/RequestRepair";
import Image from "next/image";

type Params = Promise<{ id: string }>;

type ServiceDetails = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  technician: {
    name?: string;
    image?: string;
    area?: string;
    bio?: string;
  } | null;
};

// Fetch one service from the API
async function getService(id: string): Promise<ServiceDetails | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

// Async component: fetch service details
async function ServiceDetailsContent({ params }: { params: Params }) {
  const { id } = await params;

  const service = await getService(id);

  if (!service) notFound();

  const technician = service.technician;

  const details = [
    { icon: Wallet, label: "Starting Price", value: `$${service.basePrice}` },
    {
      icon: Clock,
      label: "Estimated Duration",
      value: service.estimatedDuration,
    },
    { icon: Wrench, label: "Service Mode", value: service.serviceMode },
    { icon: MapPin, label: "Service Area", value: service.serviceArea },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image + technician card */}
        <div>
          <Image
            src={service.image}
            alt={service.title}
            width={1200}
            height={675}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-video w-full rounded-xl object-cover"
          />
          <div className="mt-6 rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
            <h2 className="font-semibold text-foreground">
              About the Technician
            </h2>

            <div className="mt-4 flex items-start gap-4">
              {technician?.image ? (
                <Image
                  src={technician.image}
                  alt={technician.name || "Technician"}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                  {(technician?.name || service.technicianName)
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}

              <div>
                <p className="font-semibold text-foreground">
                  {technician?.name || service.technicianName}
                </p>

                <p className="text-sm text-muted-foreground">
                  {technician?.area}
                </p>

                {technician?.bio && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {technician.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info + request button */}
        <div>
          <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
            {service.category}
          </span>

          <h1 className="mt-3 text-3xl font-bold text-foreground">
            {service.title}
          </h1>

          <p className="mt-4 leading-relaxed text-muted-foreground">
            {service.description}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl bg-card p-6 shadow-sm ring-1 ring-border sm:grid-cols-2">
            {details.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <item.icon className="h-4 w-4" />
                </span>

                <span>
                  <span className="block text-xs text-muted-foreground">
                    {item.label}
                  </span>

                  <span className="block font-semibold text-foreground">
                    {item.value}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <RequestRepair serviceId={service._id} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page
export default function ServiceDetailsPage({ params }: { params: Params }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-video animate-pulse rounded-xl bg-muted" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-32 animate-pulse rounded-xl bg-muted" />
            </div>
          </div>
        </div>
      }
    >
      <ServiceDetailsContent params={params} />
    </Suspense>
  );
}
