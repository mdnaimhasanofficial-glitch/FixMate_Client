import Link from "next/link";
import { Target, Compass, ShieldCheck } from "lucide-react";
import HowItWorks from "@/components/shared/HowItWorks";
import Faq from "@/components/shared/Faq";
import { Button } from "@/components/ui/button";

// What we stand for
const VALUES = [
  {
    icon: ShieldCheck,
    title: "Verified Technicians",
    description: "Every technician is reviewed before joining FixMate.",
  },
  {
    icon: Target,
    title: "Fair Prices",
    description: "See the starting price before you send a request.",
  },
  {
    icon: Compass,
    title: "Fast Response",
    description: "Technicians confirm requests quickly and keep you updated.",
  },
];

// About page: who we are, how it works and the FAQ
export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center lg:py-20">
          <span className="rounded-full bg-brand/15 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
            About Us
          </span>
          <h1 className="mt-4 text-3xl font-bold lg:text-4xl">
            Repairs made simple, honest and fast
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            FixMate connects you with verified technicians who fix your devices
            at your doorstep — with clear prices and no surprises.
          </p>
        </div>
      </section>

      {/* Mission + values */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-navy">Our Mission</h2>
          <p className="mx-auto mt-3 max-w-3xl text-muted-foreground">
            We want every home and office to get a reliable repair without
            haggling or waiting for days. FixMate makes finding a trusted
            technician as easy as sending a message.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-border"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                <value.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-semibold text-navy">{value.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Reused from the home page */}
      <HowItWorks />

      {/* FAQ */}
      <Faq />

      {/* Call to action */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-navy">Ready to fix something?</h2>
        <p className="mt-2 text-muted-foreground">
          Browse the services and send your first repair request.
        </p>
        <Button className="mt-6" render={<Link href="/services" />}>
          Browse Services
        </Button>
      </section>
    </>
  );
}
