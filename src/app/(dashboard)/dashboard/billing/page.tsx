import Link from "next/link";
import { AlertCircle, Check, CreditCard, ExternalLink, ShieldCheck } from "lucide-react";
import { openBillingPortalAction } from "@/actions/billing";
import { ensureUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BillingSubmitButton } from "@/components/dashboard/BillingSubmitButton";

const billingMessages: Record<string, { tone: "success" | "warning" | "error"; title: string; text: string }> = {
  cancelled: {
    tone: "warning",
    title: "Checkout cancelled",
    text: "No payment was taken. You can choose a plan again whenever you are ready.",
  },
  "no-customer": {
    tone: "error",
    title: "No Stripe customer found",
    text: "Start a subscription first, then the customer portal will become available.",
  },
  "portal-unavailable": {
    tone: "error",
    title: "Stripe portal is not ready",
    text: "Enable the Stripe customer portal in Stripe, or use checkout to start a new subscription.",
  },
  "price-unavailable": {
    tone: "error",
    title: "Subscription price unavailable",
    text: "Stripe could not prepare this plan price. Check the Stripe account currency settings and try again.",
  },
  "checkout-unavailable": {
    tone: "error",
    title: "Checkout unavailable",
    text: "Stripe could not start checkout for this plan. Check that card payments are enabled in Stripe and try again.",
  },
  "invalid-plan": {
    tone: "error",
    title: "Invalid plan",
    text: "Choose Pro or Max to start a paid subscription.",
  },
  "stripe-not-configured": {
    tone: "error",
    title: "Stripe is not configured",
    text: "Add STRIPE_SECRET_KEY in the deployment environment before accepting subscription payments.",
  },
};

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; cancelled?: string; success?: string }>;
}) {
  const params = await searchParams;
  const user = await ensureUserRecord();
  const store = await prisma.store.findFirst({ where: { userId: user.id }, include: { products: true } });
  const plans = await prisma.plan.findMany({ orderBy: { price: "asc" } });
  const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });
  const used = store?.products.length || 0;
  const messageKey = params.cancelled ? "cancelled" : params.error || "";
  const message = messageKey ? billingMessages[messageKey] : null;
  const productUsage = Math.min(100, (used / user.plan.productLimit) * 100);
  const hasStripeCustomer = Boolean(subscription?.stripeCustomerId);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6b3a]">Billing</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Plan and usage</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Manage your Bhandar subscription, product limits, invoices, and payment method from one place.
        </p>
      </section>

      {message && (
        <div
          className={`flex gap-3 rounded-xl border p-4 text-sm ${
            message.tone === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : message.tone === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          {message.tone === "success" ? <Check className="mt-0.5 h-4 w-4" /> : <AlertCircle className="mt-0.5 h-4 w-4" />}
          <div>
            <p className="font-semibold">{message.title}</p>
            <p className="mt-1">{message.text}</p>
          </div>
        </div>
      )}

      <Card>
        <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#0f6b3a]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Current plan
            </div>
            <h2 className="mt-3 text-2xl font-semibold">{user.plan.name}</h2>
            <p className="mt-2 text-sm text-slate-500">Products used: {used} / {user.plan.productLimit}</p>
            <div className="mt-4 h-3 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-[#0f6b3a]" style={{ width: `${productUsage}%` }} />
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Next billing date: {subscription?.currentPeriodEnd ? subscription.currentPeriodEnd.toLocaleDateString("en-BD") : "No paid subscription"}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
              Subscription status: {subscription?.status || "NONE"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Invoices and payment method</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Stripe securely manages cards, invoices, plan changes, and cancellations for paid subscriptions.
            </p>
            {hasStripeCustomer ? (
              <form action={openBillingPortalAction} className="mt-4">
                <BillingSubmitButton className="w-full bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-100">
                  Open customer portal
                </BillingSubmitButton>
              </form>
            ) : (
              <Button disabled variant="outline" className="mt-4 w-full">
                Portal available after first payment
              </Button>
            )}
          </div>
        </div>
      </Card>
      <section className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={`flex flex-col ${plan.id === user.planId ? "border-[#0f6b3a] ring-1 ring-[#0f6b3a]" : ""}`}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              {plan.id === user.planId && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#0f6b3a]">Active</span>}
            </div>
            <p className="mt-2 text-3xl font-semibold">
              {plan.price === 0 ? "Free" : formatMoney(plan.price, "BDT")}
              {plan.price > 0 && <span className="text-sm font-normal text-slate-500">/mo</span>}
            </p>
            <p className="mt-3 text-sm text-slate-500">{plan.productLimit}+ products</p>
            <ul className="mt-5 space-y-3 text-sm text-slate-600">
              <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-[#0f6b3a]" />Storefront management</li>
              <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-[#0f6b3a]" />Inventory and order tracking</li>
              <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-[#0f6b3a]" />Server-side product limit enforcement</li>
            </ul>
            <div className="mt-auto pt-6">
              {plan.id === user.planId ? (
                <Button disabled className="w-full">Current plan</Button>
              ) : plan.name === "FREE" ? (
                hasStripeCustomer ? (
                  <form action={openBillingPortalAction}>
                    <BillingSubmitButton className="w-full bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-100">
                      Manage downgrade
                    </BillingSubmitButton>
                  </form>
                ) : (
                  <Button disabled variant="outline" className="w-full">Included</Button>
                )
              ) : (
                <Button asChild className="w-full bg-[#0f6b3a] hover:bg-[#0b542d]">
                  <Link href={`/dashboard/billing/subscribe?plan=${plan.name}`}>
                    <CreditCard className="h-4 w-4" />
                    Upgrade to {plan.name}
                  </Link>
                </Button>
              )}
            </div>
          </Card>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Payment history</h2>
            <p className="mt-1 text-sm text-slate-500">Open Stripe to view invoices, receipts, and payment methods.</p>
          </div>
          {hasStripeCustomer ? (
            <form action={openBillingPortalAction}>
              <BillingSubmitButton className="bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-100">
                View invoices
              </BillingSubmitButton>
            </form>
          ) : (
            <Button asChild variant="outline">
              <Link href="/pricing">
                Compare plans
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
