import { Search, Send, Wrench, CreditCard } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Find a Service",
    description: "Browse verified services and pick the right technician.",
  },
  {
    icon: Send,
    title: "Send a Request",
    description: "Tell us the problem and choose your preferred date.",
  },
  {
    icon: Wrench,
    title: "Technician Fixes It",
    description: "A verified technician repairs it at your doorstep.",
  },
  {
    icon: CreditCard,
    title: "Pay After Completion",
    description: "Pay only after the job is done and approved.",
  },
];

// 4 simple steps with icons and a connecting line
export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-foreground">How FixMate Works</h2>
        <p className="text-muted-foreground">Four easy steps from problem to solution</p>
      </div>

      <div className="relative grid gap-8 md:grid-cols-4">
        {/* Connecting line behind the icons (desktop only) */}
        <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden border-t-2 border-dashed border-brand/40 md:block" />

        {STEPS.map((step, index) => (
          <div key={step.title} className="relative flex flex-col items-center text-center">
            <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-background">
              <step.icon className="h-7 w-7" />
            </div>
            <span className="mt-3 text-xs font-semibold uppercase tracking-wide text-brand">
              Step {index + 1}
            </span>
            <h3 className="mt-1 font-semibold text-foreground">{step.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
