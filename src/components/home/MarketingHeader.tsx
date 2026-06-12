"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Stores", href: "/stores" },
];

export function MarketingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[#E2E8F0] transition-all duration-300 ${
        scrolled ? "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "bg-[#F9FAFB]/95"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 lg:px-20">
        <Link href="/" className="flex items-center gap-3" aria-label="Bhandar home">
          <span className="grid h-9 w-9 grid-cols-2 gap-1 rounded-lg border border-[#1A56DB]/20 bg-white p-2">
            <span className="rounded-full bg-[#1A56DB]" />
            <span className="rounded-full bg-[#1A56DB]" />
            <span className="rounded-full bg-[#1A56DB]" />
            <span className="rounded-full bg-[#1A56DB]" />
          </span>
          <span className="text-lg font-bold tracking-tight text-[#0F172A]">Bhandar</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm font-medium text-[#64748B] transition-colors duration-200 hover:text-[#1A56DB]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="inline-flex h-10 items-center rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#0F172A] transition-colors duration-200 hover:border-[#1A56DB] hover:text-[#1A56DB]">
            Log in
          </Link>
          <Link href="/register" className="inline-flex h-10 items-center rounded-lg bg-[#1A56DB] px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#1038A8]">
            Start free
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[#E2E8F0] bg-white px-6 py-4 md:hidden">
          <nav className="grid gap-2" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="rounded-lg px-3 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#EEF3FD] hover:text-[#1A56DB]" onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-3">
              <Link href="/login" className="inline-flex h-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-sm font-semibold text-[#0F172A]">
                Log in
              </Link>
              <Link href="/register" className="inline-flex h-10 items-center justify-center rounded-lg bg-[#1A56DB] text-sm font-semibold text-white">
                Start free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
