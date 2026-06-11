import { openBillingPortalAction, upgradePlanAction } from "@/actions/billing";
import { ensureUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default async function BillingPage() {
  const user = await ensureUserRecord();
  const store = await prisma.store.findFirst({ where: { userId: user.id }, include: { products: true } });
  const plans = await prisma.plan.findMany({ orderBy: { price: "asc" } });
  const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });
  const used = store?.products.length || 0;

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6b3a]">Billing</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Plan and usage</h1>
      </section>
      <Card>
        <h2 className="text-xl font-semibold">Current plan: {user.plan.name}</h2>
        <p className="mt-2 text-sm text-slate-500">Products used: {used} / {user.plan.productLimit}</p>
        <div className="mt-4 h-3 rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-[#0f6b3a]" style={{ width: `${Math.min(100, (used / user.plan.productLimit) * 100)}%` }} />
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Next billing date: {subscription?.currentPeriodEnd ? subscription.currentPeriodEnd.toLocaleDateString() : "No paid subscription"}
        </p>
        {subscription?.stripeCustomerId && (
          <form action={openBillingPortalAction} className="mt-5">
            <Button variant="outline">Open Stripe customer portal</Button>
          </form>
        )}
      </Card>
      <section className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={plan.id === user.planId ? "border-[#0f6b3a]" : ""}>
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="mt-2 text-3xl font-semibold">{formatMoney(plan.price, "BDT")}<span className="text-sm font-normal text-slate-500">/mo</span></p>
            <p className="mt-3 text-sm text-slate-500">{plan.productLimit}+ products</p>
            {plan.name === "FREE" || plan.id === user.planId ? (
              <Button disabled className="mt-6 w-full">Current</Button>
            ) : (
              <form action={upgradePlanAction} className="mt-6">
                <input type="hidden" name="plan" value={plan.name} />
                <Button className="w-full bg-[#0f6b3a] hover:bg-[#0b542d]">Upgrade</Button>
              </form>
            )}
          </Card>
        ))}
      </section>
    </div>
  );
}
