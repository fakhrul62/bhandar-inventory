import Link from "next/link";
import { Bell, Menu, Plus, Store } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const mobileItems = [
  { label: "Home", href: "/dashboard" },
  { label: "Products", href: "/dashboard/products" },
  { label: "Orders", href: "/dashboard/orders" },
  { label: "Store", href: "/dashboard/storefront" },
  { label: "Billing", href: "/dashboard/billing" },
] as const;

export function Header({
  name,
  storeSlug,
  currentPath,
}: {
  name?: string | null;
  storeSlug?: string;
  currentPath?: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-slate-50/90 backdrop-blur-xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6b3a]">
            Bhandar workspace
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
            {name ? `Welcome, ${name}` : "Welcome"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href={`/store/${storeSlug || ""}`} target="_blank">
              <Store className="h-4 w-4" />
              View store
            </Link>
          </Button>
          <Button asChild className="bg-[#0f6b3a] hover:bg-[#0b542d]">
            <Link href="/dashboard/products/new">
              <Plus className="h-4 w-4" />
              Add product
            </Link>
          </Button>
          <Button variant="outline" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="lg:hidden" aria-label="Menu">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto border-t border-slate-200 px-4 py-2 lg:hidden">
        {mobileItems.map((item) => (
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
    </header>
  );
}
