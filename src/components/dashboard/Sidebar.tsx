"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Home,
  LogOut,
  Package,
  Settings,
  Shield,
  ShoppingBag,
  Store,
} from "lucide-react";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Storefront", href: "/dashboard/storefront", icon: Store },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
] as const;

export function Sidebar({
  currentPath,
  isAdmin,
}: {
  currentPath?: string;
  isAdmin: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const items = isAdmin
    ? [...navItems, { label: "Admin", href: "/dashboard/admin", icon: Shield }]
    : navItems;

  useEffect(() => {
    setCollapsed(window.localStorage.getItem("bhandar-sidebar-collapsed") === "true");
  }, []);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("bhandar-sidebar-collapsed", String(next));
      return next;
    });
  }

  return (
    <aside
      className={cn(
        "hidden h-screen shrink-0 border-r border-slate-200 bg-white transition-[width] duration-300 ease-out lg:sticky lg:top-0 lg:flex lg:flex-col",
        collapsed ? "w-20" : "w-72",
      )}
    >
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/dashboard"
            className={cn("flex min-w-0 items-center gap-3", collapsed && "justify-center")}
            title={collapsed ? "Bhandar" : undefined}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0f6b3a] text-white">
              <BarChart3 className="h-5 w-5" />
            </span>
            <span
              className={cn(
                "min-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out",
                collapsed ? "w-0 opacity-0" : "w-36 opacity-100",
              )}
            >
              <span className="block font-semibold text-slate-950">Bhandar</span>
              <span className="block font-[var(--font-hind-siliguri)] text-xs text-slate-500">
                ভান্ডার
              </span>
            </span>
          </Link>
          {!collapsed && (
            <Button type="button" variant="ghost" size="icon" aria-label="Collapse sidebar" onClick={toggleCollapsed}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
        {collapsed && (
          <Button type="button" variant="ghost" size="icon" className="mx-auto mt-3" aria-label="Expand sidebar" onClick={toggleCollapsed}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Dashboard navigation">
        {items.map((item) => {
          const active =
            currentPath === item.href ||
            (item.href !== "/dashboard" && currentPath?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-lg py-3 text-sm font-medium transition-colors duration-200",
                collapsed ? "justify-center px-0" : "gap-3 px-3",
                active
                  ? "bg-[#0f6b3a] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              )}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                <Icon className="h-4 w-4" />
              </span>
              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap transition-all duration-300 ease-out",
                  collapsed ? "w-0 opacity-0" : "w-36 opacity-100",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <form action={signOutAction} className="border-t border-slate-200 p-3">
        <Button variant="outline" className={cn("w-full", collapsed && "px-0")} title={collapsed ? "Sign out" : undefined}>
          <LogOut className="h-4 w-4" />
          <span
            className={cn(
              "overflow-hidden whitespace-nowrap transition-all duration-300 ease-out",
              collapsed ? "w-0 opacity-0" : "w-16 opacity-100",
            )}
          >
            Sign out
          </span>
        </Button>
      </form>
    </aside>
  );
}
