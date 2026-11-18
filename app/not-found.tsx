import Link from "next/link";
import { Button } from "@/components/ui/button";

// Shown when the address does not match any page
export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
      {/* Wrench and screwdriver illustration */}
      <svg
        width="200"
        height="150"
        viewBox="0 0 200 150"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="100"
          cy="75"
          r="62"
          fill="#F8FAFC"
          stroke="#E2E8F0"
          strokeWidth="2"
          strokeDasharray="6 8"
        />
        {/* Wrench */}
        <g transform="rotate(-35 100 75)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M100 24a17 17 0 1 0 0 34 17 17 0 0 0 0-34zm0 9a8 8 0 1 1 0 16 8 8 0 0 1 0-16z"
            fill="#0B1F3A"
          />
          <rect x="93" y="56" width="14" height="52" rx="7" fill="#0B1F3A" />
          <rect x="93" y="94" width="14" height="14" rx="7" fill="#F97316" />
        </g>
        {/* Screwdriver */}
        <g transform="rotate(35 100 75)">
          <rect x="92" y="24" width="16" height="36" rx="8" fill="#F97316" />
          <rect x="96" y="58" width="8" height="44" rx="2" fill="#94A3B8" />
          <path d="M96 100h8v8l-2 6h-4l-2-6z" fill="#64748B" />
        </g>
      </svg>

      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand">
        Error 404
      </p>
      <h1 className="mt-2 text-3xl font-bold text-foreground">
        This page needs a repair
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you are looking for was moved, deleted, or never existed.
        Let&apos;s get you back on track.
      </p>
      <Button className="mt-6" render={<Link href="/" />}>
        Back to Home
      </Button>
    </div>
  );
}
