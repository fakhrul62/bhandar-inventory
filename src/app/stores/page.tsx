import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SafeImage } from "@/components/ui/SafeImage";
import { MarketingHeader } from "@/components/home/MarketingHeader";

export default async function StoresPage() {
  const stores = await prisma.store.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { products: true, orders: true } },
      products: {
        where: { isPublished: true },
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { type: true },
      },
    },
  });

  const activeSince = (date: Date) => new Intl.DateTimeFormat("en-BD", { month: "long", year: "numeric" }).format(date);

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#0F172A] [font-feature-settings:'ss01','cv11']">
      <MarketingHeader />
      <section className="mx-auto max-w-[1200px] px-6 py-[72px] lg:px-20 lg:py-[120px]">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#1A56DB]">Live on Bhandar</p>
        <h1 className="mt-5 max-w-4xl text-[clamp(2.8rem,6vw,5.5rem)] font-extrabold leading-[0.98] tracking-[-0.03em]">
          Public stores using Bhandar.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-[#64748B]">
          This page lists only stores marked public in the database. Every card opens the actual storefront.
        </p>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 pb-[72px] lg:px-20 lg:pb-[120px]">
        {stores.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <Link key={store.id} href={`/store/${store.slug}`} className="group rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all duration-200 hover:border-[#1A56DB] hover:shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#EEF3FD] text-sm font-bold text-[#1A56DB]">
                    <SafeImage src={store.logoUrl} alt={store.name} className="h-full w-full object-cover" fallback={store.name.slice(0, 2).toUpperCase()} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-bold text-[#0F172A] group-hover:text-[#1A56DB]">{store.name}</h2>
                    <p className="mt-1 truncate text-sm text-[#64748B]">/store/{store.slug}</p>
                  </div>
                </div>
                <span className="mt-5 inline-flex rounded-full bg-[#EEF3FD] px-3 py-1 text-xs font-bold text-[#1A56DB]">
                  {store.products[0]?.type ? `${store.products[0].type.toLowerCase()} products` : "storefront"}
                </span>
                <p className="mt-5 text-sm text-[#64748B]">Products tracked: {store._count.products}</p>
                <p className="mt-2 text-sm text-[#64748B]">Orders counted: {store._count.orders}</p>
                <p className="mt-2 text-sm text-[#64748B]">Active since: {activeSince(store.createdAt)}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1A56DB]">
                  Open storefront <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <Store className="mx-auto h-8 w-8 text-[#1A56DB]" strokeWidth={1.5} />
            <h2 className="mt-4 text-lg font-bold">No public stores yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#64748B]">When a store is marked public, it will appear here automatically.</p>
            <Link href="/register" className="mt-6 inline-flex h-11 items-center rounded-lg bg-[#1A56DB] px-5 text-sm font-bold text-white hover:bg-[#1038A8]">
              Create a store
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
