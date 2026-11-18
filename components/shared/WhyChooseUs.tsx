import { BadgeCheck, Briefcase, Wallet, Star } from "lucide-react";

const TRUST_POINTS = [
  { icon: BadgeCheck, title: "500+ Verified Technicians", description: "Every technician is checked before joining." },
  { icon: Briefcase, title: "10,000+ Jobs Completed", description: "Repairs finished across the country." },
  { icon: Wallet, title: "Pay After Service", description: "Money moves only when the job is done." },
  { icon: Star, title: "4.8 Average Rating", description: "Rated by thousands of happy customers." },
];

const TESTIMONIALS = [
  {
    name: "Sabrina Rahman",
    role: "Customer, Dhanmondi",
    quote:
      "My iPhone screen was replaced in 40 minutes at home. The technician was polite and the price was fair.",
  },
  {
    name: "Tanvir Ahmed",
    role: "Customer, Uttara",
    quote:
      "Loved that I paid only after the laptop was fixed. Booking took less than a minute.",
  },
  {
    name: "Rahim Uddin",
    role: "Technician",
    quote:
      "FixMate brings me regular customers every week. The dashboard makes managing requests simple.",
  },
];

// Trust stats plus customer testimonials
export default function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-navy">Why Choose Us</h2>
        <p className="text-muted-foreground">Trusted by customers and technicians alike</p>
      </div>

      {/* Trust points / stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_POINTS.map((point) => (
          <div key={point.title} className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-border">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
              <point.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-3 font-semibold text-navy">{point.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{point.description}</p>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <h3 className="mt-14 text-center text-xl font-semibold text-navy">
        What Our Customers Say
      </h3>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((item) => (
          <figure key={item.name} className="flex h-full flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-border">
            <div className="flex gap-0.5 text-brand">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-3 flex-1 text-sm text-muted-foreground">
              “{item.quote}”
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                {item.name.charAt(0)}
              </span>
              <span>
                <span className="block text-sm font-semibold text-navy">{item.name}</span>
                <span className="block text-xs text-muted-foreground">{item.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
