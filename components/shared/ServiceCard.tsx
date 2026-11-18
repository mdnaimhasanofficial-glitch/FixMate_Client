import Link from "next/link";

export type ServiceCardData = {
  _id: string;
  title: string;
  category: string;
  image: string;
  serviceMode: string;
  basePrice: number;
  technicianName: string;
};

// One service card: image, category, title, mode, price, technician and a details button
export default function ServiceCard({ service }: { service: ServiceCardData }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-border">
      <img
        src={service.image}
        alt={service.title}
        className="aspect-video w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand">
          {service.category}
        </span>
        <h3 className="font-semibold text-navy">{service.title}</h3>
        <p className="text-sm text-muted-foreground">{service.serviceMode}</p>
        <p className="text-sm text-muted-foreground">by {service.technicianName}</p>
        {/* Bottom row sticks to the bottom of equal height cards */}
        <div className="mt-auto flex items-center justify-between pt-3">
          <p className="font-semibold text-navy">Starting at ${service.basePrice}</p>
          <Link
            href={`/services/${service._id}`}
            className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy/90"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
