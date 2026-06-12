"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CreditCard,
  Check,
  Clock,
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
import { markAllNotificationsReadAction, markNotificationReadAction } from "@/actions/notifications";
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
  notifications,
}: {
  name?: string | null;
  storeSlug?: string;
  currentPath?: string;
  isAdmin: boolean;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    href: string | null;
    read: boolean;
    createdAt: string;
  }>;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const unreadCount = notifications.filter((notification) => !notification.read).length;
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
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={unreadCount ? `${unreadCount} unread notifications` : "Notifications"}
              aria-expanded={notificationsOpen}
              onClick={() => setNotificationsOpen((current) => !current)}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>

            {notificationsOpen && (
              <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
                  <div>
                    <h2 className="font-semibold text-slate-950">Notifications</h2>
                    <p className="mt-0.5 text-xs text-slate-500">{unreadCount} unread</p>
                  </div>
                  {unreadCount > 0 && (
                    <form action={markAllNotificationsReadAction}>
                      <Button size="sm" variant="ghost" onClick={() => setNotificationsOpen(false)}>
                        Mark all read
                      </Button>
                    </form>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center">
                      <Bell className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-3 font-medium text-slate-950">No notifications yet</p>
                      <p className="mt-1 text-sm text-slate-500">New orders will appear here.</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "border-b border-slate-100 p-4 last:border-b-0",
                          notification.read ? "bg-white" : "bg-emerald-50/70",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={cn(
                              "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                              notification.read ? "bg-slate-100 text-slate-500" : "bg-[#0f6b3a] text-white",
                            )}
                          >
                            {notification.read ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                {notification.href ? (
                                  <Link
                                    href={notification.href}
                                    onClick={() => setNotificationsOpen(false)}
                                    className="block font-medium text-slate-950 transition hover:text-[#0f6b3a]"
                                  >
                                    {notification.title}
                                  </Link>
                                ) : (
                                  <p className="font-medium text-slate-950">{notification.title}</p>
                                )}
                                <p className="mt-1 text-sm leading-5 text-slate-600">{notification.message}</p>
                              </div>
                              {!notification.read && (
                                <form action={markNotificationReadAction}>
                                  <input type="hidden" name="id" value={notification.id} />
                                  <Button
                                    type="submit"
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Mark notification as read"
                                    className="h-8 w-8"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </form>
                              )}
                            </div>
                            <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                              <Clock className="h-3 w-3" />
                              {formatNotificationTime(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
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

function formatNotificationTime(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60_000));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString("en-BD", {
    month: "short",
    day: "numeric",
  });
}
