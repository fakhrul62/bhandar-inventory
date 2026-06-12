import Link from "next/link";
import { ArrowRight, BarChart3, Package, Store } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { MarketingHeader } from "@/components/home/MarketingHeader";

export default async function FeaturesPage() {
  const [stores, products, orders] = await Promise.all([
    prisma.store.count({ where: { isPublic: true } }),
    prisma.product.count(),
    prisma.order.count(),
  ]);

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#0F172A] [font-feature-settings:'ss01','cv11']">
      <MarketingHeader />
      <section className="mx-auto max-w-[1440px] px-6 py-[72px] lg:px-20 lg:py-[120px]">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#1A56DB]">Features</p>
        <h1 className="mt-5 max-w-4xl text-[clamp(2.8rem,6vw,5.5rem)] font-extrabold leading-[0.98] tracking-[-0.03em]">
          The operating system for inventory and storefronts.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-[#64748B]">
          Bhandar combines product tracking, storefront publishing, and order visibility in one dashboard.
        </p>
      </section>

      <section className="border-y border-[#E2E8F0] bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-6 py-[72px] md:grid-cols-3 lg:px-20 lg:py-[120px]">
          <Feature icon={Package} title="Inventory Tracking" stat={`${products} products`} text="Track physical and digital products, stock counts, variants, images, and publish state from the dashboard." />
          <Feature icon={Store} title="Storefront Manager" stat={`${stores} public stores`} text="Each public store gets a working storefront URL with product discovery, cart, and checkout." />
          <Feature icon={BarChart3} title="Sales Analytics" stat={`${orders} orders`} text="Orders are counted with buyer details, payment method, items, totals, and delivery information." />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-[72px] lg:px-20 lg:py-[120px]">
        <div className="rounded-xl border border-[#E2E8F0] bg-[#1A56DB] p-8 text-white lg:p-12">
          <h2 className="text-3xl font-extrabold tracking-tight">Ready to see the dashboard?</h2>
          <p className="mt-3 max-w-2xl text-white/80">Create an account, add products, and publish a storefront when you are ready.</p>
          <Link href="/register" className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-white px-6 text-sm font-bold text-[#1A56DB]">
            Start free <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon: Icon, title, stat, text }: { icon: typeof Package; title: string; stat: string; text: string }) {
  return (
    <article className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <Icon className="h-7 w-7 text-[#1A56DB]" strokeWidth={1.5} />
      <p className="mt-6 text-sm font-bold uppercase tracking-[0.12em] text-[#1A56DB]">{stat}</p>
      <h2 className="mt-3 text-xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#64748B]">{text}</p>
    </article>
  );
}
