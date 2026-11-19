import { Suspense } from "react";
import Link from "next/link";
import ServiceCard, { ServiceCardData } from "@/components/shared/ServiceCard";
import HowItWorks from "@/components/shared/HowItWorks";
import PopularCategories from "@/components/shared/PopularCategories";
import WhyChooseUs from "@/components/shared/WhyChooseUs";
import Image from "next/image";

// Fetch the 6 newest approved services from the Express API
async function getFeaturedServices(): Promise<ServiceCardData[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/services?sort=newest&limit=6`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

// The featured grid: streams in after the page shell (keeps navigation instant)
async function FeaturedServices() {
  const services = await getFeaturedServices();

  if (services.length === 0) {
    return <p className="text-muted-foreground">No services available yet.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
}

// Placeholder shown while the featured services stream in
function FeaturedServicesFallback() {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden="true"
    >
      {[0, 1, 2].map((index) => (
        <div key={index} className="h-64 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
              Broken Device? Get It Fixed by Verified Technicians
            </h1>
            <p className="mt-4 max-w-lg text-white/70">
              Book trusted repair professionals for your smartphone, laptop, AC
              and home appliances — at your doorstep.
            </p>
            <Link
              href="/services"
              className="mt-6 inline-flex rounded-lg bg-brand px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
            >
              Browse Services
            </Link>
          </div>
          <Image
            width={300}
            height={300}
            src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1600&q=80"
            alt="Technician repairing a device"
            className="aspect-4/3 w-full rounded-xl object-cover shadow-lg"
          />
        </div>
      </section>

      {/* Featured Services */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Featured Services
            </h2>
            <p className="text-muted-foreground">
              The latest approved services from our technicians
            </p>
          </div>
          <Link
            href="/services"
            className="text-sm font-medium text-brand underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        <Suspense fallback={<FeaturedServicesFallback />}>
          <FeaturedServices />
        </Suspense>
      </section>

      {/* How FixMate Works */}
      <HowItWorks />

      {/* Popular Categories */}
      <PopularCategories />

      {/* Why Choose Us + testimonials */}
      <WhyChooseUs />
    </>
  );
}
