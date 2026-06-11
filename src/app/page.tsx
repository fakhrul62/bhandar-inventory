"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  ExternalLink,
  GitBranch,
  LayoutDashboard,
  Mail,
  Menu,
  Package,
  Rocket,
  Search,
  Store,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const stores = [
  { name: "Dhaka Thread House", category: "Fashion retail", products: 142, activeSince: "March 2024" },
  { name: "Chattogram Craft Co.", category: "Handmade goods", products: 86, activeSince: "April 2024" },
  { name: "Sylhet Spice Mart", category: "Grocery", products: 231, activeSince: "June 2024" },
  { name: "Rajshahi Electronics", category: "Electronics", products: 118, activeSince: "August 2024" },
  { name: "Narayanganj Supply", category: "Wholesale", products: 309, activeSince: "October 2024" },
  { name: "Bashundhara Homeware", category: "Home goods", products: 74, activeSince: "January 2025" },
];

const companies = ["Northline", "ShopNest", "Urban Shelf", "TakaTrade", "MerchDock", "Ledger Lane"];

const navItems = [
  { label: "Features", href: "/?section=features" },
  { label: "Pricing", href: "/?section=pricing" },
  { label: "Stores", href: "/?section=stores" },
  { label: "Blog", href: "/?section=blog" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));

    if (prefersReduced) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#0F172A] [font-feature-settings:'ss01','cv11']">
      <style jsx global>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes bhandarUnderline {
            from {
              transform: scaleX(0);
            }
            to {
              transform: scaleX(1);
            }
          }

          .hero-underline {
            transform-origin: left;
            animation: bhandarUnderline 0.8s ease-out 0.15s both;
          }
        }

        .reveal {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
        }

        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal,
          .reveal.is-visible {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

      <header
        className={`sticky top-0 z-50 border-b border-[#E2E8F0] backdrop-blur transition-all duration-300 ${
          scrolled ? "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "bg-[#F9FAFB]/90"
        }`}
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 lg:px-20">
          <Link href="/" className="flex items-center gap-3" aria-label="Bhandar home">
            <span className="grid h-9 w-9 grid-cols-2 gap-1 rounded-lg border border-[#1A56DB]/20 bg-white p-2">
              <span className="rounded-full bg-[#1A56DB]" />
              <span className="rounded-full bg-[#1A56DB]" />
              <span className="rounded-full bg-[#1A56DB]" />
              <span className="rounded-full bg-[#1A56DB]" />
            </span>
            <span className="text-lg font-bold tracking-tight text-[#0F172A]">Bhandar</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="text-sm font-medium text-[#64748B] transition-colors duration-200 hover:text-[#1A56DB]">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="inline-flex h-10 items-center rounded-lg border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#0F172A] transition-colors duration-200 hover:border-[#1A56DB] hover:text-[#1A56DB]">
              Log in
            </Link>
            <Link href="/register" className="inline-flex h-10 items-center rounded-lg bg-[#1A56DB] px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#1038A8]">
              Start free
            </Link>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] md:hidden"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-[#E2E8F0] bg-white px-6 py-4 md:hidden">
            <nav className="grid gap-2" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link key={item.label} href={item.href} className="rounded-lg px-3 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#EEF3FD] hover:text-[#1A56DB]" onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Link href="/login" className="inline-flex h-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-sm font-semibold text-[#0F172A]">
                  Log in
                </Link>
                <Link href="/register" className="inline-flex h-10 items-center justify-center rounded-lg bg-[#1A56DB] text-sm font-semibold text-white">
                  Start free
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-[72px] lg:grid-cols-[1.1fr_0.9fr] lg:px-20 lg:py-[120px]">
        <div className="reveal">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#1A56DB]">Inventory + Storefront Platform</p>
          <h1 className="mt-6 max-w-4xl text-[clamp(2.8rem,6vw,5.5rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-[#0F172A]">
            Run your <span className="relative inline-block text-[#1A56DB]">store<span className="hero-underline absolute -bottom-2 left-0 h-1 w-full rounded-full bg-[#1A56DB]" /></span>. Own your inventory.
          </h1>
          <p className="mt-8 max-w-2xl text-[1.125rem] leading-8 text-[#64748B]">
            Bhandar gives growing businesses a unified command center from shelf to sale.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-lg bg-[#1A56DB] px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#1038A8]">
              Start for free
            </Link>
            <Link href="/?section=how-it-works" className="inline-flex h-12 items-center gap-2 text-sm font-bold text-[#1A56DB] transition-colors duration-200 hover:text-[#1038A8]">
              See how it works <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.85rem] text-[#64748B]">
            <TrustSignal text="No credit card" />
            <TrustSignal text="14-day free trial" />
            <TrustSignal text="Cancel anytime" />
          </div>
        </div>

        <div className="reveal relative" style={{ transitionDelay: "80ms" }}>
          <div className="rounded-xl border-2 border-[#0F172A] bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-2 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#E2E8F0]" />
              <span className="ml-3 text-xs font-semibold text-[#64748B]">dashboard.bhandar.app</span>
            </div>
            <div className="grid min-h-[420px] grid-cols-[82px_1fr] overflow-hidden rounded-lg">
              <aside className="border-r border-[#E2E8F0] bg-[#F9FAFB] p-3">
                {[Package, Store, BarChart3, Bell].map((Icon, index) => (
                  <div key={index} className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${index === 0 ? "bg-[#EEF3FD] text-[#1A56DB]" : "text-[#64748B]"}`}>
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                ))}
              </aside>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1A56DB]">Inventory</p>
                    <h2 className="mt-1 text-xl font-bold">Stock overview</h2>
                  </div>
                  <div className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs font-semibold text-[#64748B]">Live sync</div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_150px]">
                  <div className="rounded-xl border border-[#E2E8F0] bg-white">
                    {["Cotton Panjabi", "Ceramic dinner set", "Office notebook", "Mustard oil", "Wireless mouse"].map((product, index) => (
                      <div key={product} className="grid grid-cols-[1fr_54px_54px] items-center gap-3 border-b border-[#E2E8F0] px-4 py-3 text-sm last:border-b-0">
                        <span className="font-semibold text-[#0F172A]">{product}</span>
                        <span className="text-[#64748B]">{[42, 18, 73, 9, 26][index]}</span>
                        <span className={index === 3 ? "font-semibold text-[#B8912A]" : "text-[#16A34A]"}>{index === 3 ? "Low" : "OK"}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#EEF3FD] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1A56DB]">Sales</p>
                    <div className="mt-8 flex h-32 items-end gap-2">
                      {[34, 58, 44, 78, 62, 92].map((height, index) => (
                        <span key={index} className="w-full rounded-t bg-[#1A56DB]" style={{ height: `${height}%`, opacity: 0.55 + index * 0.06 }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <StatCard className="-right-2 top-8 sm:-right-7" value="2,400+" label="stores" />
          <StatCard className="-left-2 bottom-8 sm:-left-7" value="98.4%" label="uptime" />
        </div>
      </section>

      <section className="border-y border-[#E2E8F0] bg-[#F9FAFB] py-6">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-6 lg:flex-row lg:items-center lg:px-20">
          <p className="shrink-0 text-sm font-semibold text-[#64748B]">Trusted by teams at</p>
          <ArrowRight className="hidden h-4 w-4 shrink-0 text-[#64748B] lg:block" strokeWidth={1.5} />
          <div className="flex gap-8 overflow-x-auto pb-1 text-base font-semibold text-[#94A3B8] lg:grid lg:flex-1 lg:grid-cols-6 lg:gap-4 lg:overflow-visible lg:pb-0">
            {companies.map((company) => (
              <span key={company} className="shrink-0 whitespace-nowrap">{company}</span>
            ))}
          </div>
        </div>
      </section>

      <SectionIntro id="stores" eyebrow="Live on Bhandar" title="Stores growing with us right now" text="Real businesses, real inventory, real results." />
      <section className="mx-auto max-w-[1200px] px-6 pb-[72px] lg:px-20 lg:pb-[120px]">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* TODO: replace with API call to /api/stores when that endpoint is available. */}
          {stores.map((store, index) => (
            <article key={store.name} className="reveal rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all duration-200 hover:border-[#1A56DB] hover:shadow-[0_8px_24px_rgba(15,23,42,0.12)]" style={{ transitionDelay: `${index * 80}ms` }}>
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-bold text-[#0F172A]">{store.name}</h3>
                <span className="rounded-full bg-[#EEF3FD] px-3 py-1 text-xs font-bold text-[#1A56DB]">{store.category}</span>
              </div>
              <p className="mt-5 text-sm text-[#64748B]">Products tracked: {store.products}</p>
              <p className="mt-2 text-sm text-[#64748B]">Active since: {store.activeSince}</p>
              <div className="mt-6 h-0.5 w-full bg-[#1A56DB]/40" />
            </article>
          ))}
        </div>
        <Link href="/?section=stores" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#1A56DB] hover:text-[#1038A8]">
          View all stores <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </section>

      <section id="features" className="scroll-mt-24">
        <FeatureBlock
          eyebrow="What Bhandar does"
          title="Everything your business needs. Nothing it doesn't."
          icon={Package}
          name="Inventory Tracking"
          description="See real-time stock levels, spot low inventory before it hurts sales, and keep every SKU accountable across your team."
          visual={<InventoryVisual />}
        />
        <FeatureBlock
          reverse
          tinted
          icon={Store}
          name="Storefront Manager"
          description="Manage products, pricing, and storefront readiness from one focused workspace built for operators, not agencies."
          visual={<StorefrontVisual />}
        />
        <FeatureBlock
          icon={BarChart3}
          name="Sales Analytics"
          description="Track daily, weekly, and monthly revenue with top products and trends that are easy to read at a glance."
          visual={<AnalyticsVisual />}
        />
      </section>

      <section id="how-it-works" className="mx-auto max-w-[1200px] scroll-mt-24 px-6 py-[72px] lg:px-20 lg:py-[120px]">
        <div className="reveal max-w-2xl">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#1A56DB]">Getting started</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] lg:text-[2rem]">Up and running in minutes.</h2>
        </div>
        <div className="relative mt-12 grid gap-6 md:grid-cols-3">
          <div className="absolute left-[16.7%] right-[16.7%] top-12 hidden border-t border-dashed border-[#E2E8F0] md:block" />
          <Step number="01" icon={LayoutDashboard} title="Create account" text="Open your dashboard and set the basics for your business." />
          <Step number="02" icon={Package} title="Add your inventory" text="Upload products, pricing, stock counts, and variants." />
          <Step number="03" icon={Rocket} title="Go live" text="Publish your storefront and start taking orders." />
        </div>
      </section>

      <section id="pricing" className="border-y border-[#E2E8F0] bg-[#F9FAFB]">
        <div className="mx-auto max-w-[1200px] px-6 py-[72px] lg:px-20 lg:py-[120px]">
          <div className="reveal text-center">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#1A56DB]">Pricing</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] lg:text-[2rem]">Simple pricing. No surprises.</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <PlanCard name="Starter" price="Free forever" features={["Up to 100 products", "1 storefront", "Basic order tracking"]} />
            <PlanCard popular name="Pro" price="৳999/month" features={["Unlimited products", "5 storefronts", "Analytics", "Priority support"]} />
          </div>
          <div className="mt-8 text-center">
            <Link href="/?section=pricing" className="inline-flex items-center gap-2 text-sm font-bold text-[#1A56DB] hover:text-[#1038A8]">
              View full pricing <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      <section id="blog" className="mx-auto max-w-[1200px] scroll-mt-24 px-6 py-[72px] lg:px-20 lg:py-[120px]">
        <div className="reveal max-w-2xl">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#1A56DB]">What users say</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] lg:text-[2rem]">Built for the way you work.</h2>
        </div>
        <div className="mt-10 flex gap-5 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          <Testimonial quote="Bhandar made our stock counts finally match what customers see online." name="Nusrat Jahan" role="Owner, Dhaka Thread House" />
          <Testimonial quote="The storefront is simple enough for our team and clear enough for buyers." name="Rafiq Ahmed" role="Manager, Sylhet Spice Mart" />
          <Testimonial quote="I can check sales, products, and low stock before opening the shop." name="Sadia Karim" role="Operator, Bashundhara Homeware" />
        </div>
      </section>

      <section className="bg-[#1A56DB]">
        <div className="mx-auto max-w-[1200px] px-6 py-[72px] text-center lg:px-20 lg:py-[120px]">
          <h2 className="text-4xl font-extrabold tracking-tight text-white lg:text-[2.5rem]">Start managing smarter today.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/80">Bring inventory, orders, and storefront operations into one calm system your team can trust.</p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-6 text-sm font-bold text-[#1A56DB] transition-colors duration-200 hover:bg-[#EEF3FD]">
              Get started free
            </Link>
            <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-lg border border-white bg-transparent px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-white hover:text-[#1A56DB]">
              Talk to sales
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E2E8F0] bg-white">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-20">
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
            <div className="mt-5 flex gap-3">
              <IconLink href="https://x.com" label="Bhandar on X" icon={ExternalLink} />
              <IconLink href="https://www.linkedin.com" label="Bhandar on LinkedIn" icon={Mail} />
              <IconLink href="https://github.com/fakhrul62/bhandar-inventory" label="Bhandar on GitHub" icon={GitBranch} />
            </div>
          </div>
          <FooterColumn title="Product" links={["Features", "Pricing", "Changelog", "Roadmap"]} />
          <FooterColumn title="Company" links={["About", "Blog", "Careers", "Contact"]} />
          <FooterColumn title="Legal" links={["Privacy Policy", "Terms of Service"]} />
        </div>
        <div className="border-t border-[#E2E8F0]">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-6 py-5 text-sm text-[#64748B] sm:flex-row sm:items-center sm:justify-between lg:px-20">
            <p>© 2025 Bhandar. All rights reserved.</p>
            <p>Made in Bangladesh 🇧🇩</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function TrustSignal({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Check className="h-4 w-4 text-[#16A34A]" strokeWidth={1.5} />
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

function SectionIntro({ id, eyebrow, title, text }: { id: string; eyebrow: string; title: string; text: string }) {
  return (
    <section id={id} className="mx-auto max-w-[1200px] scroll-mt-24 px-6 pt-[72px] lg:px-20 lg:pt-[120px]">
      <div className="reveal max-w-2xl">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#1A56DB]">{eyebrow}</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] lg:text-[2rem]">{title}</h2>
        <p className="mt-3 text-base leading-7 text-[#64748B]">{text}</p>
      </div>
    </section>
  );
}

function FeatureBlock({
  eyebrow,
  title,
  icon: Icon,
  name,
  description,
  visual,
  reverse = false,
  tinted = false,
}: {
  eyebrow?: string;
  title?: string;
  icon: LucideIcon;
  name: string;
  description: string;
  visual: React.ReactNode;
  reverse?: boolean;
  tinted?: boolean;
}) {
  return (
    <section className={`${tinted ? "bg-[#F9FAFB]" : "bg-white"} border-t border-[#E2E8F0]`}>
      <div className="mx-auto max-w-[1200px] px-6 py-[72px] lg:px-20 lg:py-[120px]">
        {eyebrow && title && (
          <div className="reveal mb-12 max-w-3xl">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#1A56DB]">{eyebrow}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0F172A] lg:text-[2rem]">{title}</h2>
          </div>
        )}
        <div className={`grid items-center gap-10 lg:grid-cols-2 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
          <div className="reveal">{visual}</div>
          <div className="reveal max-w-xl" style={{ transitionDelay: "80ms" }}>
            <Icon className="h-6 w-6 text-[#1A56DB]" strokeWidth={1.5} />
            <h3 className="mt-5 text-xl font-semibold text-[#0F172A]">{name}</h3>
            <p className="mt-4 text-base leading-7 text-[#64748B]">{description}</p>
            <Link href="/?section=features" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1A56DB] hover:text-[#1038A8]">
              Learn more <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function InventoryVisual() {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Low-stock alerts</p>
        <Bell className="h-5 w-5 text-[#1A56DB]" strokeWidth={1.5} />
      </div>
      <div className="mt-5 space-y-3">
        {["Packaging boxes", "Rice sacks", "Gift wrap"].map((item, index) => (
          <div key={item} className="rounded-lg border border-[#E2E8F0] p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{item}</span>
              <span className="text-[#64748B]">{[12, 7, 19][index]} left</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-[#EEF3FD]">
              <div className="h-2 rounded-full bg-[#1A56DB]" style={{ width: `${[42, 24, 62][index]}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StorefrontVisual() {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3">
        <Search className="h-5 w-5 text-[#1A56DB]" strokeWidth={1.5} />
        <div className="h-10 flex-1 rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm text-[#64748B]">Search storefront products</div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {["Classic Panjabi", "Spice Bundle", "Notebook Set", "Ceramic Bowl"].map((item) => (
          <div key={item} className="rounded-lg border border-[#E2E8F0] p-4">
            <div className="h-16 rounded bg-[#EEF3FD]" />
            <p className="mt-3 font-semibold">{item}</p>
            <p className="mt-1 text-sm text-[#64748B]">Ready to publish</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsVisual() {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Revenue trend</p>
        <Activity className="h-5 w-5 text-[#1A56DB]" strokeWidth={1.5} />
      </div>
      <div className="mt-8 flex h-48 items-end gap-3">
        {[40, 68, 50, 72, 88, 61, 96].map((height, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-3">
            <span className="w-full rounded-t-lg bg-[#1A56DB]" style={{ height: `${height}%`, opacity: 0.38 + index * 0.06 }} />
            <span className="text-xs text-[#64748B]">{["M", "T", "W", "T", "F", "S", "S"][index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step({ number, icon: Icon, title, text }: { number: string; icon: LucideIcon; title: string; text: string }) {
  return (
    <article className="reveal relative rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <span aria-hidden="true" className="absolute right-5 top-3 text-6xl font-extrabold leading-none text-[#EEF3FD]">{number}</span>
      <Icon className="relative h-7 w-7 text-[#1A56DB]" strokeWidth={1.5} />
      <h3 className="relative mt-8 text-[1.1rem] font-semibold text-[#0F172A]">{title}</h3>
      <p className="relative mt-2 text-sm leading-6 text-[#64748B]">{text}</p>
    </article>
  );
}

function PlanCard({ name, price, features, popular = false }: { name: string; price: string; features: string[]; popular?: boolean }) {
  return (
    <article className={`reveal rounded-xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] ${popular ? "border-2 border-[#1A56DB]" : "border border-[#E2E8F0]"}`}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-semibold">{name}</h3>
        {popular && <span className="rounded px-3 py-1 text-xs font-bold text-[#B8912A] ring-1 ring-[#B8912A]/30">Most Popular</span>}
      </div>
      <p className="mt-5 text-3xl font-extrabold tracking-tight">{price}</p>
      <div className="mt-6 space-y-3">
        {features.map((feature) => (
          <p key={feature} className="flex items-center gap-3 text-sm text-[#64748B]">
            <Check className="h-4 w-4 text-[#16A34A]" strokeWidth={1.5} />
            {feature}
          </p>
        ))}
      </div>
    </article>
  );
}

function Testimonial({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <article className="reveal min-w-[280px] rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <p className="text-[#B8912A]" aria-label="Five stars">★★★★★</p>
      <p className="mt-5 text-base italic leading-7 text-[#0F172A]">&ldquo;{quote}&rdquo;</p>
      <p className="mt-6 font-semibold text-[#0F172A]">{name}</p>
      <p className="mt-1 text-sm text-[#64748B]">{role}</p>
    </article>
  );
}

function IconLink({ href, label, icon: Icon }: { href: string; label: string; icon: LucideIcon }) {
  return (
    <Link href={href} aria-label={label} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] transition-colors duration-200 hover:border-[#1A56DB] hover:text-[#1A56DB]">
      <Icon className="h-4 w-4" strokeWidth={1.5} />
    </Link>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="font-semibold text-[#0F172A]">{title}</h3>
      <div className="mt-4 grid gap-3">
        {links.map((link) => (
          <Link key={link} href={`/?section=${link.toLowerCase().replaceAll(" ", "-")}`} className="text-sm text-[#64748B] transition-colors duration-200 hover:text-[#1A56DB]">
            {link}
          </Link>
        ))}
      </div>
    </div>
  );
}
