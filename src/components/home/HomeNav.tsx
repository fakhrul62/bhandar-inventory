"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HomeNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0f6b3a] font-[var(--font-hind-siliguri)] text-xl font-semibold text-white">
            ভ
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-tight text-slate-950">Bhandar</span>
            <span className="block font-[var(--font-hind-siliguri)] text-xs text-[#0f6b3a]">ভান্ডার</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <button type="button" onClick={() => scrollToSection("stores")} className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
            Stores
          </button>
          <button type="button" onClick={() => scrollToSection("features")} className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
            Features
          </button>
          <button type="button" onClick={() => scrollToSection("plans")} className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
            Plans
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm" className="hidden bg-[#0f6b3a] hover:bg-[#0b542d] sm:inline-flex">
            <Link href="/register">
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
