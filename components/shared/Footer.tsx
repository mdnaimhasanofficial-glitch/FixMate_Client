"use client";

import Link from "next/link";
import { Wrench, Mail, Phone, MapPin } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/sign-in", label: "Sign in" },
];

// The new X logo (not the old Twitter bird)
function XLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YouTubeLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// Public footer: brand, links, categories, contact and socials
export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand + tagline + socials */}
        <div>
          <p className="flex items-center gap-2 text-lg font-bold">
            <Wrench className="h-5 w-5 text-brand" /> FixMate
          </p>
          <p className="mt-3 text-sm text-white/70">
            Trusted home repair services at your doorstep — smartphones, laptops, AC and more.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="https://x.com" aria-label="X" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
              <XLogo />
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
              <FacebookLogo />
            </a>
            <a href="https://youtube.com" aria-label="YouTube" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
              <YouTubeLogo />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Quick Links</p>
          <ul className="mt-4 space-y-2 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/80 hover:text-brand">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Popular categories */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Popular Categories</p>
          <ul className="mt-4 space-y-2 text-sm">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  href={`/services?category=${encodeURIComponent(category)}`}
                  className="text-white/80 hover:text-brand"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand" /> support@fixmate.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand" /> +880 1711-123456
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand" /> House 12, Road 5, Dhanmondi, Dhaka
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-4 text-center text-sm text-white/60">
        © {new Date().getFullYear()} FixMate. All rights reserved.
      </div>
    </footer>
  );
}
