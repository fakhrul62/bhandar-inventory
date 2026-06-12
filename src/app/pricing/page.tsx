import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { MarketingHeader } from "@/components/home/MarketingHeader";

export default async function PricingPage() {
  const plans = await prisma.plan.findMany({ orderBy: { price: "asc" } });
  const proPlan = plans.find((plan) => plan.name === "PRO");

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#0F172A] [font-feature-settings:'ss01','cv11']">
      <MarketingHeader />
      <section className="mx-auto max-w-[1440px] px-6 py-[72px] text-center lg:px-20 lg:py-[120px]">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#1A56DB]">Pricing</p>
        <h1 className="mx-auto mt-5 max-w-4xl text-[clamp(2.8rem,6vw,5.5rem)] font-extrabold leading-[0.98] tracking-[-0.03em]">
          Simple plans from the live product.
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#64748B]">
          Product limits come directly from the Bhandar plan table and are enforced server-side.
        </p>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pb-[72px] lg:px-20 lg:pb-[120px]">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.id} className={`rounded-xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] ${plan.id === proPlan?.id ? "border-2 border-[#1A56DB]" : "border border-[#E2E8F0]"}`}>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                {plan.id === proPlan?.id && <span className="rounded px-3 py-1 text-xs font-bold text-[#B8912A] ring-1 ring-[#B8912A]/30">Most Popular</span>}
              </div>
              <p className="mt-6 text-4xl font-extrabold tracking-tight">{plan.price === 0 ? "Free" : formatMoney(plan.price, "BDT")}</p>
              <p className="mt-2 text-sm text-[#64748B]">{plan.price === 0 ? "Forever" : "per month"}</p>
              <div className="mt-8 space-y-3">
                <PlanLine text={`${plan.productLimit}+ products`} />
                <PlanLine text="Storefront management" />
                <PlanLine text="Order tracking dashboard" />
              </div>
              <Link href="/register" className={`mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-bold ${plan.id === proPlan?.id ? "bg-[#1A56DB] text-white hover:bg-[#1038A8]" : "border border-[#E2E8F0] bg-white text-[#0F172A] hover:border-[#1A56DB] hover:text-[#1A56DB]"}`}>
                Choose {plan.name.toLowerCase()} <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function PlanLine({ text }: { text: string }) {
  return (
    <p className="flex items-center gap-3 text-sm text-[#64748B]">
      <Check className="h-4 w-4 text-[#16A34A]" strokeWidth={1.5} />
      {text}
    </p>
  );
}
