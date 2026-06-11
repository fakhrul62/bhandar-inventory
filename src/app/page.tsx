import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BarChart3, Boxes, CheckCircle2, CreditCard, Package, Search, ShoppingBag, Store, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SafeImage } from "@/components/ui/SafeImage";
import { HomeNav } from "@/components/home/HomeNav";

export default async function Home() {
  const stores = await prisma.store.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
    take: 12,
    include: {
      _count: { select: { products: true, orders: true } },
      products: {
        where: { isPublished: true },
        take: 3,
        orderBy: { createdAt: "desc" },
        select: { imageUrls: true },
      },
    },
  });

  const totals = await prisma.store.aggregate({ _count: true });
  const publishedProducts = await prisma.product.count({ where: { isPublished: true } });
  const firstStore = stores[0];

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <HomeNav />

      <section className="overflow-hidden border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="mx-auto grid min-h-[calc(100vh-65px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-emerald-50 px-3 py-1 text-sm font-medium text-[#0f6b3a]">
              <span className="h-2 w-2 rounded-full bg-[#f5a623]" />
              Inventory, sales, and storefronts for Bangladesh
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Run your shop from one clean dashboard.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Bhandar helps small business owners publish products, track orders, manage stock, and share a storefront customers can buy from instantly.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-[#0f6b3a] hover:bg-[#0b542d]">
                <Link href="/register">
                  Create your store
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={firstStore ? `/store/${firstStore.slug}` : "/login"}>View a live store</Link>
              </Button>
            </div>
            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              <Metric value={`${totals._count}+`} label="registered stores" />
              <Metric value={`${publishedProducts}+`} label="live products" />
              <Metric value="BDT" label="default currency" />
            </div>
          </div>

          <div className="relative animate-fade-up lg:pl-6">
            <div className="absolute -left-8 top-12 hidden h-24 w-24 rounded-full border border-[#f5a623] lg:block" />
            <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_30px_100px_rgba(15,23,42,0.12)]">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Today</p>
                    <h2 className="mt-1 text-2xl font-semibold">Store control room</h2>
                  </div>
                  <span className="rounded-full bg-[#0f6b3a] px-3 py-1 text-sm font-medium text-white">Live</span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <HeroTile icon={Package} label="Products" value="142" />
                  <HeroTile icon={ShoppingBag} label="Orders" value="38" />
                  <HeroTile icon={BarChart3} label="Revenue" value="৳84k" />
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Search className="h-4 w-4" />
                      Fast inventory scan
                    </div>
                    <div className="mt-4 space-y-3">
                      {["Low stock saree pack", "Digital Eid catalog", "Handmade gift box"].map((item, index) => (
                        <div key={item} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                          <span className="text-sm font-medium">{item}</span>
                          <span className={index === 0 ? "text-sm font-semibold text-red-600" : "text-sm text-slate-500"}>
                            {index === 0 ? "4 left" : "Ready"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-[#0f6b3a] p-4 text-white">
                    <Store className="h-6 w-6" />
                    <p className="mt-6 text-sm text-white/75">Public storefront</p>
                    <p className="mt-2 text-2xl font-semibold">Share once. Sell anywhere.</p>
                    <div className="mt-5 rounded-xl bg-white/10 p-3 text-sm">bhandar.app/store/your-shop</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="stores" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6b3a]">Live storefronts</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Browse registered stores</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Only public stores are shown here, so every card opens a working storefront.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/register">Register your store</Link>
          </Button>
        </div>

        {stores.length === 0 ? (
          <Card className="mt-8 text-center">
            <Store className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-lg font-semibold">No public stores yet</h3>
            <p className="mt-1 text-sm text-slate-500">Create and publish the first Bhandar storefront.</p>
            <Button asChild className="mt-5 bg-[#0f6b3a] hover:bg-[#0b542d]">
              <Link href="/register">Start free</Link>
            </Button>
          </Card>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <Link key={store.id} href={`/store/${store.slug}`} className="group rounded-lg border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#0f6b3a] hover:shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-[#0f6b3a] text-xl font-semibold text-white">
                    <SafeImage src={store.logoUrl} alt={store.name} className="h-full w-full object-cover" fallback={store.name.slice(0, 2).toUpperCase()} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-slate-950 group-hover:text-[#0f6b3a]">{store.name}</h3>
                    <p className="mt-1 truncate text-sm text-slate-500">/store/{store.slug}</p>
                  </div>
                </div>
                <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-slate-600">{store.description || "A Bhandar storefront ready for online orders."}</p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
                  <span>{store._count.products} products</span>
                  <span>{store._count.orders} orders</span>
                  <span className="inline-flex items-center gap-1 font-medium text-[#0f6b3a]">
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section id="features" className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6b3a]">Built for selling</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Everything a small shop needs to start clean.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Feature icon={Boxes} title="Inventory limits" text="Track physical and digital products with plan-based limits enforced server-side." />
            <Feature icon={Store} title="Public storefront" text="Every published store gets a shareable customer-facing page with cart and checkout." />
            <Feature icon={Truck} title="Delivery details" text="Checkout captures address, phone, delivery note, and optional current location." />
            <Feature icon={CreditCard} title="Payments ready" text="Use card payments or dev mobile payment now, with local gateway integration ready next." />
          </div>
        </div>
      </section>

      <section id="plans" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6b3a]">Pricing</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Start free. Upgrade when your catalog grows.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Bhandar keeps the first step simple for new sellers while supporting larger shops with higher product limits.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Plan name="Free" price="৳0" limit="50 products" />
            <Plan name="Pro" price="৳499" limit="500 products" highlighted />
            <Plan name="Max" price="৳999" limit="1000+ products" />
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[#0f6b3a]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 text-white sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-[var(--font-hind-siliguri)] text-sm text-white/70">ভান্ডার দিয়ে শুরু করুন</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Make your store link ready today.</h2>
          </div>
          <Button asChild size="lg" className="bg-white text-[#0f6b3a] hover:bg-slate-100">
            <Link href="/register">Create Bhandar account</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-2xl font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

function HeroTile({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <Icon className="h-5 w-5 text-[#0f6b3a]" />
      <p className="mt-4 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

function Feature({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <Icon className="h-6 w-6 text-[#0f6b3a]" />
      <h3 className="mt-5 font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function Plan({ name, price, limit, highlighted = false }: { name: string; price: string; limit: string; highlighted?: boolean }) {
  return (
    <div className={`rounded-lg border p-5 ${highlighted ? "border-[#0f6b3a] bg-emerald-50" : "border-slate-200 bg-white"}`}>
      <p className="font-semibold text-slate-950">{name}</p>
      <p className="mt-3 text-3xl font-semibold">{price}<span className="text-sm font-medium text-slate-500">/mo</span></p>
      <p className="mt-2 text-sm text-slate-500">{limit}</p>
      <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#0f6b3a]">
        <CheckCircle2 className="h-4 w-4" />
        No trial required
      </div>
    </div>
  );
}
