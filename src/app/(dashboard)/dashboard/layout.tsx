import { headers } from "next/headers";
import { ensureUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await ensureUserRecord();
  const store = await prisma.store.findFirst({ where: { userId: user.id } });
  const pathname = (await headers()).get("x-pathname") || undefined;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-950">
      <Sidebar currentPath={pathname} isAdmin={user.role === "ADMIN"} />
      <div className="min-w-0 flex-1">
        <Header name={user.name} storeSlug={store?.slug} currentPath={pathname} isAdmin={user.role === "ADMIN"} />
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
