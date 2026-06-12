import { headers } from "next/headers";
import { ensureUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await ensureUserRecord();
  const store = await prisma.store.findFirst({ where: { userId: user.id } });
  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
  const pathname = (await headers()).get("x-pathname") || undefined;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-950">
      <Sidebar currentPath={pathname} isAdmin={user.role === "ADMIN"} />
      <div className="min-w-0 flex-1 overflow-x-hidden">
        <Header
          name={user.name}
          storeSlug={store?.slug}
          currentPath={pathname}
          isAdmin={user.role === "ADMIN"}
          notifications={notifications.map((notification) => ({
            id: notification.id,
            title: notification.title,
            message: notification.message,
            href: notification.href,
            read: Boolean(notification.readAt),
            createdAt: notification.createdAt.toISOString(),
          }))}
        />
        <main className="mx-auto w-full max-w-7xl min-w-0 p-3 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
