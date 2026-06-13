import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { SafeImage } from "@/components/ui/SafeImage";
import { MarketingHeaderServer } from "@/components/home/MarketingHeaderServer";
import { Icon, type IconName } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [stores, plans, storeCount, productCount, orderCount, recentProducts] = await Promise.all([
    prisma.store.findMany({
      where: { isPublic: true },
      take: 6,
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
    }),
    prisma.plan.findMany({ orderBy: { price: "asc" } }),
    prisma.store.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.product.findMany({
      where: { isPublished: true, store: { isPublic: true } },
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: { name: true, stock: true, type: true, store: { select: { name: true } } },
    }),
  ]);

  const freePlan = plans.find((plan) => plan.name === "FREE");
  const proPlan = plans.find((plan) => plan.name === "PRO") || plans[1];
  const firstStore = stores[0];
  const activeSince = (date: Date) => new Intl.DateTimeFormat("en-BD", { month: "long", year: "numeric" }).format(date);

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#0F172A] [font-feature-settings:'ss01','cv11']">
      <HomeStyles />
      <MarketingHeaderServer />

      <section className="mx-auto grid min-h-[calc(100svh-73px)] max-w-[1440px] items-center gap-10 px-6 py-12 sm:py-14 lg:grid-cols-[1.04fr_0.96fr] lg:px-16 lg:py-14 xl:px-20 xl:py-16">
        <div className="reveal">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#1A56DB]">Inventory + Storefront Platform</p>
          <h1 className="mt-6 max-w-5xl text-[clamp(2.6rem,5vw,4.9rem)] font-extrabold leading-[1] tracking-[-0.03em] text-[#0F172A]">
            Every product tracked. Every <span className="relative inline-block text-[#1A56DB]">sale<span className="hero-underline absolute -bottom-2 left-0 h-1 w-full rounded-full bg-[#1A56DB]" /></span> counted.
          </h1>
          <p className="mt-7 max-w-2xl text-[1.075rem] leading-8 text-[#64748B]">
            Bhandar gives growing businesses a unified command center for inventory, orders, and public storefronts.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-lg bg-[#1A56DB] px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#1038A8]">
              Start for free
            </Link>
            <Link href="/features" className="inline-flex h-12 items-center gap-2 text-sm font-bold text-[#1A56DB] transition-colors duration-200 hover:text-[#1038A8]">
              See how it works <Icon name="arrowRight" className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.85rem] text-[#64748B]">
            <TrustSignal text={`${freePlan?.productLimit || 50} products on Free`} />
            <TrustSignal text="Public storefront link" />
            <TrustSignal text="BDT-ready pricing" />
          </div>
        </div>

        <div className="reveal relative mx-auto w-full max-w-[680px] xl:max-w-[740px]" style={{ transitionDelay: "80ms" }}>
          <DashboardMockup products={recentProducts} orderCount={orderCount} />
          <StatCard className="-right-2 top-8 sm:-right-7" value={String(storeCount)} label="stores" />
          <StatCard className="-left-2 bottom-8 sm:-left-7" value={String(productCount)} label="products" />
        </div>
      </section>

      <section className="border-y border-[#E2E8F0] bg-[#F9FAFB] py-6">
        <div className="mx-auto grid max-w-[1440px] gap-4 px-6 sm:grid-cols-3 lg:px-20">
          <Snapshot label="Public stores" value={stores.length} />
          <Snapshot label="Products tracked" value={productCount} />
          <Snapshot label="Orders counted" value={orderCount} />
        </div>
      </section>

      <SectionIntro eyebrow="Live on Bhandar" title="Stores growing with us right now" text="These are real public stores from the Bhandar database." />
      <section className="mx-auto max-w-[1440px] px-6 pb-[72px] lg:px-20 lg:pb-[120px]">
        {stores.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {stores.map((store, index) => (
              <Link key={store.id} href={`/store/${store.slug}`} className="reveal group rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all duration-200 hover:border-[#1A56DB] hover:shadow-[0_8px_24px_rgba(15,23,42,0.12)]" style={{ transitionDelay: `${index * 80}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#EEF3FD] text-sm font-bold text-[#1A56DB]">
                    <SafeImage src={store.logoUrl} alt={store.name} className="h-full w-full object-cover" fallback={store.name.slice(0, 2).toUpperCase()} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-bold text-[#0F172A] group-hover:text-[#1A56DB]">{store.name}</h3>
                    <span className="mt-2 inline-flex rounded-full bg-[#EEF3FD] px-3 py-1 text-xs font-bold text-[#1A56DB]">
                      {store.products[0]?.type ? `${store.products[0].type.toLowerCase()} products` : "storefront"}
                    </span>
                  </div>
                </div>
                <p className="mt-5 text-sm text-[#64748B]">Products tracked: {store._count.products}</p>
                <p className="mt-2 text-sm text-[#64748B]">Orders counted: {store._count.orders}</p>
                <p className="mt-2 text-sm text-[#64748B]">Active since: {activeSince(store.createdAt)}</p>
                <div className="mt-6 h-0.5 w-full bg-[#1A56DB]/40" />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="No public stores yet" text="When a store is marked public, it will appear here automatically." />
        )}
        <Link href="/stores" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#1A56DB] hover:text-[#1038A8]">
          View all stores <Icon name="arrowRight" className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </section>

      <section className="border-y border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-[72px] lg:px-20 lg:py-[120px]">
          <div className="reveal mb-12 max-w-3xl">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#1A56DB]">What Bhandar does</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] lg:text-[2rem]">Everything your business needs. Nothing it does not.</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <FeatureCard icon="briefcase" title="Inventory Tracking" text={`Track products across your catalog. This workspace currently contains ${productCount} product${productCount === 1 ? "" : "s"}.`} />
            <FeatureCard icon="store" title="Storefront Manager" text={`Publish storefronts customers can open directly. ${stores.length} public store${stores.length === 1 ? " is" : "s are"} live now.`} />
            <FeatureCard icon="chart" title="Sales Analytics" text={`Keep order activity visible. Bhandar has counted ${orderCount} order${orderCount === 1 ? "" : "s"} so far.`} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-[72px] lg:px-20 lg:py-[120px]">
        <div className="reveal max-w-2xl">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#1A56DB]">Getting started</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] lg:text-[2rem]">Up and running in minutes.</h2>
        </div>
        <div className="relative mt-12 grid gap-6 md:grid-cols-3">
          <div className="absolute left-[16.7%] right-[16.7%] top-12 hidden border-t border-dashed border-[#E2E8F0] md:block" />
          <Step number="01" icon="grid" title="Create account" text="Open your dashboard and set the basics for your business." />
          <Step number="02" icon="briefcase" title="Add inventory" text="Add products, stock counts, images, and variants." />
          <Step number="03" icon="spark" title="Go live" text="Publish your storefront and start taking orders." />
        </div>
      </section>

      <section className="border-y border-[#E2E8F0] bg-[#F9FAFB]">
        <div className="mx-auto max-w-[1440px] px-6 py-[72px] lg:px-20 lg:py-[120px]">
          <div className="reveal text-center">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#1A56DB]">Pricing</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] lg:text-[2rem]">Simple pricing from the live plan table.</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.id} name={plan.name} price={plan.price === 0 ? "Free forever" : `${formatMoney(plan.price, "BDT")}/month`} limit={`${plan.productLimit}+ products`} popular={plan.id === proPlan?.id} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-bold text-[#1A56DB] hover:text-[#1038A8]">
              View full pricing <Icon name="arrowRight" className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#1A56DB]">
        <div className="mx-auto max-w-[1440px] px-6 py-[72px] text-center lg:px-20 lg:py-[120px]">
          <h2 className="text-4xl font-extrabold tracking-tight text-white lg:text-[2.5rem]">Start managing smarter today.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/80">Bring inventory, orders, and storefront operations into one system your team can trust.</p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-6 text-sm font-bold text-[#1A56DB] transition-colors duration-200 hover:bg-[#EEF3FD]">
              Get started free
            </Link>
            <Link href={firstStore ? `/store/${firstStore.slug}` : "/stores"} className="inline-flex h-12 items-center justify-center rounded-lg border border-white bg-transparent px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-white hover:text-[#1A56DB]">
              Browse stores
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function HomeStyles() {
  return (
    <style>{`
      @media (prefers-reduced-motion: no-preference) {
        @keyframes bhandarUnderline {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .hero-underline {
          transform-origin: left;
          animation: bhandarUnderline 0.8s ease-out 0.15s both;
        }
        .reveal {
          animation: revealUp 0.4s ease-out both;
        }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      }
    `}</style>
  );
}

function DashboardMockup({
  products,
  orderCount,
}: {
  products: Array<{ name: string; stock: number | null; type: "PHYSICAL" | "DIGITAL"; store: { name: string } }>;
  orderCount: number;
}) {
  const rows = products.length ? products : [];

  return (
    <div className="rounded-xl border-2 border-[#0F172A] bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-2 pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" />
        <span className="ml-3 text-xs font-semibold text-[#64748B]">dashboard.bhandar.app</span>
      </div>
      <div className="grid min-h-[340px] grid-cols-[64px_1fr] overflow-hidden rounded-lg sm:min-h-[370px] sm:grid-cols-[78px_1fr] xl:min-h-[410px] xl:grid-cols-[82px_1fr]">
        <aside className="border-r border-[#E2E8F0] bg-[#F9FAFB] p-3">
          {(["briefcase", "store", "chart", "bell"] satisfies IconName[]).map((icon, index) => (
            <div key={index} className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${index === 0 ? "bg-[#EEF3FD] text-[#1A56DB]" : "text-[#64748B]"}`}>
              <Icon name={icon} className="h-5 w-5" strokeWidth={1.5} />
            </div>
          ))}
        </aside>
        <div className="min-w-0 p-4 xl:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1A56DB]">Inventory</p>
              <h2 className="mt-1 text-xl font-bold">Live stock overview</h2>
            </div>
            <div className="w-fit rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs font-semibold text-[#64748B]">{orderCount} orders</div>
          </div>
          <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_150px]">
            <div className="rounded-xl border border-[#E2E8F0] bg-white">
              {rows.length ? (
                rows.map((product) => (
                  <div key={`${product.store.name}-${product.name}`} className="grid grid-cols-[1fr_64px] items-center gap-3 border-b border-[#E2E8F0] px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[1fr_58px_64px]">
                    <span className="min-w-0 truncate font-semibold text-[#0F172A]">{product.name}</span>
                    <span className="text-[#64748B]">{product.type === "DIGITAL" ? "Digital" : product.stock ?? "N/A"}</span>
                    <span className={product.type === "PHYSICAL" && (product.stock ?? 0) <= 5 ? "font-semibold text-[#B8912A]" : "text-[#16A34A]"}>
                      {product.type === "PHYSICAL" && (product.stock ?? 0) <= 5 ? "Low" : "OK"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-5 text-sm leading-6 text-[#64748B]">No published products yet. Published products will appear here automatically.</div>
              )}
            </div>
            <div className="rounded-xl border border-[#E2E8F0] bg-[#EEF3FD] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1A56DB]">Product mix</p>
              <div className="mt-6 flex h-24 items-end gap-2 xl:h-32">
                {[
                  rows.filter((item) => item.type === "PHYSICAL").length,
                  rows.filter((item) => item.type === "DIGITAL").length,
                  rows.length,
                ].map((value, index) => (
                  <span key={index} className="w-full rounded-t bg-[#1A56DB]" style={{ height: `${Math.max(12, value * 24)}%`, opacity: 0.55 + index * 0.12 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Snapshot({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <p className="text-3xl font-extrabold tracking-tight text-[#0F172A]">{value}</p>
      <p className="mt-1 text-sm font-semibold text-[#64748B]">{label}</p>
    </div>
  );
}

function TrustSignal({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon name="check" className="h-4 w-4 text-[#16A34A]" strokeWidth={1.5} />
      {text}
    </span>
  );
}

function StatCard({ value, label, className }: { value: string; label: string; className: string }) {
  return (
    <div className={`absolute rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.12)] ${className}`}>
      <p className="text-lg font-bold text-[#0F172A]">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">{label}</p>
    </div>
  );
}

function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="mx-auto max-w-[1440px] px-6 pt-[72px] lg:px-20 lg:pt-[120px]">
      <div className="reveal max-w-2xl">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#1A56DB]">{eyebrow}</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] lg:text-[2rem]">{title}</h2>
        <p className="mt-3 text-base leading-7 text-[#64748B]">{text}</p>
      </div>
    </section>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <Icon name="store" className="mx-auto h-8 w-8 text-[#1A56DB]" strokeWidth={1.5} />
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#64748B]">{text}</p>
    </div>
  );
}

function FeatureCard({ icon, title, text }: { icon: IconName; title: string; text: string }) {
  return (
    <article className="reveal rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <Icon name={icon} className="h-6 w-6 text-[#1A56DB]" strokeWidth={1.5} />
      <h3 className="mt-5 text-xl font-semibold text-[#0F172A]">{title}</h3>
      <p className="mt-4 text-base leading-7 text-[#64748B]">{text}</p>
      <Link href="/features" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1A56DB] hover:text-[#1038A8]">
        Learn more <Icon name="arrowRight" className="h-4 w-4" strokeWidth={1.5} />
      </Link>
    </article>
  );
}

function Step({ number, icon, title, text }: { number: string; icon: IconName; title: string; text: string }) {
  return (
    <article className="reveal relative rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <span aria-hidden="true" className="absolute right-5 top-3 text-6xl font-extrabold leading-none text-[#EEF3FD]">{number}</span>
      <Icon name={icon} className="relative h-7 w-7 text-[#1A56DB]" strokeWidth={1.5} />
      <h3 className="relative mt-8 text-[1.1rem] font-semibold text-[#0F172A]">{title}</h3>
      <p className="relative mt-2 text-sm leading-6 text-[#64748B]">{text}</p>
    </article>
  );
}

function PlanCard({ name, price, limit, popular = false }: { name: string; price: string; limit: string; popular?: boolean }) {
  return (
    <article className={`reveal rounded-xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] ${popular ? "border-2 border-[#1A56DB]" : "border border-[#E2E8F0]"}`}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-semibold">{name}</h3>
        {popular && <span className="rounded px-3 py-1 text-xs font-bold text-[#B8912A] ring-1 ring-[#B8912A]/30">Most Popular</span>}
      </div>
      <p className="mt-5 text-3xl font-extrabold tracking-tight">{price}</p>
      <p className="mt-3 flex items-center gap-3 text-sm text-[#64748B]">
        <Icon name="check" className="h-4 w-4 text-[#16A34A]" strokeWidth={1.5} />
        {limit}
      </p>
    </article>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-20">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 grid-cols-2 gap-1 rounded-lg border border-[#1A56DB]/20 bg-white p-2">
              <span className="rounded-full bg-[#1A56DB]" />
              <span className="rounded-full bg-[#1A56DB]" />
              <span className="rounded-full bg-[#1A56DB]" />
              <span className="rounded-full bg-[#1A56DB]" />
            </span>
            <span className="text-lg font-bold tracking-tight">Bhandar</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-[#64748B]">Every product tracked. Every sale counted.</p>
          <Link href="https://github.com/fakhrul62/bhandar-inventory" aria-label="Bhandar GitHub repository" className="mt-5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] transition-colors duration-200 hover:border-[#1A56DB] hover:text-[#1A56DB]">
            <Icon name="layers" className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
        <FooterColumn title="Product" links={[["Features", "/features"], ["Pricing", "/pricing"], ["Stores", "/stores"]]} />
        <FooterColumn title="Account" links={[["Log in", "/login"], ["Start free", "/register"], ["Dashboard", "/dashboard"]]} />
        <FooterColumn title="Storefront" links={[["Browse stores", "/stores"], ["Create store", "/register"]]} />
      </div>
      <div className="border-t border-[#E2E8F0]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-5 text-sm text-[#64748B] sm:flex-row sm:items-center sm:justify-between lg:px-20">
          <p>© 2026 Bhandar. All rights reserved.</p>
          <p>Made in Bangladesh 🇧🇩</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div>
      <h3 className="font-semibold text-[#0F172A]">{title}</h3>
      <div className="mt-4 grid gap-3">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="text-sm text-[#64748B] transition-colors duration-200 hover:text-[#1A56DB]">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
