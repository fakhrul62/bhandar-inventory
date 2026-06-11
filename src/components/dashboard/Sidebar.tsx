import Link from "next/link";
import {
  BarChart3,
  CreditCard,
  Home,
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
  const items = isAdmin
    ? [...navItems, { label: "Admin", href: "/dashboard/admin", icon: Shield }]
    : navItems;

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:flex-col">
      <div className="border-b border-slate-200 p-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f6b3a] text-white">
            <BarChart3 className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-semibold text-slate-950">Bhandar</span>
            <span className="block font-[var(--font-hind-siliguri)] text-xs text-slate-500">
              ভান্ডার
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active =
            currentPath === item.href ||
            (item.href !== "/dashboard" && currentPath?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition",
                active
                  ? "bg-[#0f6b3a] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={signOutAction} className="border-t border-slate-200 p-3">
        <Button variant="outline" className="w-full">
          Sign out
        </Button>
      </form>
    </aside>
  );
}
