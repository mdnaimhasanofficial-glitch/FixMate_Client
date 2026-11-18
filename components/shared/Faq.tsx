import { ChevronDown } from "lucide-react";

// Common questions from customers
const FAQS = [
  {
    question: "How do I book a repair?",
    answer:
      "Sign in as a customer, open a service you like, press Request Repair, fill the form and send it. Your technician will confirm the request shortly.",
  },
  {
    question: "How much does a repair cost?",
    answer:
      "Each service shows a starting price and estimated duration on its details page. The technician confirms the final cost before starting the work.",
  },
  {
    question: "Do you offer on-site service?",
    answer:
      "Yes. Every service shows its mode — On-site means the technician comes to you, In-store means you bring the device to the workshop.",
  },
  {
    question: "How do I track my request?",
    answer:
      "Open My Bookings in your dashboard to see the live status of every request, from Pending to Completed.",
  },
  {
    question: "How do I become a technician?",
    answer:
      "Create a technician account and our admin team reviews your profile. Once approved, your services go live for customers.",
  },
  {
    question: "Is payment safe?",
    answer:
      "Yes. Payments are processed securely with Stripe, and you only pay after the repair is completed and approved.",
  },
];

// Click a question to open or close its answer
export default function Faq() {
  return (
    <section className="bg-white ring-1 ring-border">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-navy">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-muted-foreground">
            Quick answers to the things people ask most
          </p>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl bg-background ring-1 ring-border"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-navy">
                {faq.question}
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-4 text-sm text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
