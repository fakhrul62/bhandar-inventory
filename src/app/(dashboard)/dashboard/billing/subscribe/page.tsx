import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Check, CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import { openBillingPortalAction, startSubscriptionCheckoutAction } from "@/actions/billing";
import { ensureUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BillingSubmitButton } from "@/components/dashboard/BillingSubmitButton";

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const params = await searchParams;
  const selectedPlanName = params.plan === "MAX" ? "MAX" : params.plan === "PRO" ? "PRO" : null;

  if (!selectedPlanName) {
    redirect("/dashboard/billing?error=invalid-plan");
  }

  const user = await ensureUserRecord();
  const [plan, subscription] = await Promise.all([
    prisma.plan.findUnique({ where: { name: selectedPlanName } }),
    prisma.subscription.findUnique({ where: { userId: user.id } }),
  ]);

  if (!plan || plan.price <= 0) {
    redirect("/dashboard/billing?error=invalid-plan");
  }

  if (plan.id === user.planId) {
    redirect("/dashboard/billing");
  }

  const hasPaidSubscription = Boolean(subscription?.stripeCustomerId && subscription?.stripeSubscriptionId && subscription.status !== "CANCELED");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button asChild variant="ghost" className="px-0 text-slate-600 hover:bg-transparent hover:text-[#0f6b3a]">
        <Link href="/dashboard/billing">
          <ArrowLeft className="h-4 w-4" />
          Back to billing
        </Link>
      </Button>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#0f6b3a]">
            <CreditCard className="h-3.5 w-3.5" />
            Subscription checkout
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Upgrade to {plan.name}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Confirm your plan, then continue to Stripe&apos;s secure checkout to complete the subscription payment.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Selected plan</p>
                <h2 className="mt-1 text-2xl font-semibold">{plan.name}</h2>
              </div>
              <p className="text-3xl font-semibold">
                {formatMoney(plan.price, "BDT")}
                <span className="text-sm font-normal text-slate-500">/month</span>
              </p>
            </div>
            <div className="mt-5 h-px bg-slate-200" />
            <ul className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-[#0f6b3a]" />Up to {plan.productLimit}+ products</li>
              <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-[#0f6b3a]" />Public storefront</li>
              <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-[#0f6b3a]" />Sales and order dashboard</li>
              <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-[#0f6b3a]" />Stripe invoice history</li>
            </ul>
          </div>

          {hasPaidSubscription ? (
            <form action={openBillingPortalAction} className="mt-8">
              <BillingSubmitButton className="w-full bg-[#0f6b3a] hover:bg-[#0b542d]">
                Manage subscription in Stripe
              </BillingSubmitButton>
            </form>
          ) : (
            <form action={startSubscriptionCheckoutAction} className="mt-8">
              <input type="hidden" name="plan" value={plan.name} />
              <BillingSubmitButton className="w-full bg-[#0f6b3a] hover:bg-[#0b542d]">
                Continue to secure payment
              </BillingSubmitButton>
            </form>
          )}
        </Card>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <ShieldCheck className="h-6 w-6 text-[#0f6b3a]" />
            <h2 className="mt-4 font-semibold">What happens after payment?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Bhandar updates your plan automatically, unlocks the new product limit, and stores your Stripe customer record for invoices.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <LockKeyhole className="h-6 w-6 text-[#0f6b3a]" />
            <h2 className="mt-4 font-semibold">Secure billing</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Card details never touch Bhandar servers. Stripe handles payment collection, receipts, and future card updates.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
