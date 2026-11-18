"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserMenu from "@/components/shared/UserMenu";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

// Sticky top bar: logo, links, auth area and a mobile sheet menu
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Links with the active route highlighted
  function navLinks() {
    return LINKS.map((link) => {
      const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
      return (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setOpen(false)}
          className={`text-sm font-medium transition-colors ${
            active ? "text-brand underline underline-offset-4" : "text-muted-foreground hover:text-navy"
          }`}
        >
          {link.label}
        </Link>
      );
    });
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo, same size on every page */}
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-navy">
          <Wrench className="h-5 w-5 text-brand" />
          FixMate
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-6 md:flex">{navLinks()}</nav>

        {/* Desktop auth area */}
        <div className="hidden items-center md:flex">
          <UserMenu />
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open menu" />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-navy">
                  <Wrench className="h-5 w-5 text-brand" /> FixMate
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 px-4">{navLinks()}</nav>
              <div className="px-4">
                <UserMenu onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
