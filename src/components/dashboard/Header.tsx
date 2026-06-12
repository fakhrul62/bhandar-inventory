"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CreditCard,
  Home,
  Menu,
  Package,
  Plus,
  Settings,
  Shield,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const mobileItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Storefront", href: "/dashboard/storefront", icon: Store },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
] as const;

export function Header({
  name,
  storeSlug,
  currentPath,
  isAdmin,
}: {
  name?: string | null;
  storeSlug?: string;
  currentPath?: string;
  isAdmin: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = isAdmin
    ? [...mobileItems, { label: "Admin", href: "/dashboard/admin", icon: Shield }]
    : mobileItems;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-slate-50/95 backdrop-blur-xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6b3a]">
            Bhandar workspace
          </p>
          <h1 className="mt-1 truncate text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
            {name ? `Welcome, ${name}` : "Welcome"}
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href={`/store/${storeSlug || ""}`} target="_blank">
              <Store className="h-4 w-4" />
              View store
            </Link>
          </Button>
          <Button asChild className="bg-[#0f6b3a] hover:bg-[#0b542d]">
            <Link href="/dashboard/products/new">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add product</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </Button>
          <Button variant="outline" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto border-t border-slate-200 px-4 py-2 lg:hidden" aria-label="Quick dashboard navigation">
        {items.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition",
              currentPath === item.href ||
                (item.href !== "/dashboard" && currentPath?.startsWith(item.href))
                ? "bg-[#0f6b3a] text-white"
                : "bg-white text-slate-600",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 top-[121px] z-50 bg-slate-950/40 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div
            className="ml-auto h-[calc(100vh-121px)] w-full max-w-sm border-l border-slate-200 bg-white p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <nav className="grid gap-1" aria-label="Mobile dashboard menu">
              {items.map((item) => {
                const active =
                  currentPath === item.href ||
                  (item.href !== "/dashboard" && currentPath?.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                      active ? "bg-[#0f6b3a] text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                    )}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <form action={signOutAction} className="mt-4 border-t border-slate-200 pt-4">
              <Button variant="outline" className="w-full">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
