import Link from "next/link";
import type Stripe from "stripe";
import { ensureUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasStripeSecretKey, stripe } from "@/lib/stripe";
import { syncStripeSubscription } from "@/lib/subscriptions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";

async function getSyncedSubscription(sessionId?: string) {
  if (!hasStripeSecretKey()) {
    return { error: "Stripe is not configured in this environment." };
  }

  if (!sessionId) {
    return { error: "Missing checkout session. Open billing to check your current plan." };
  }

  const user = await ensureUserRecord();

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (session.metadata?.userId !== user.id) {
      return { error: "This checkout session does not belong to the signed-in account." };
    }

    const subscription =
      typeof session.subscription === "string"
        ? await stripe.subscriptions.retrieve(session.subscription)
        : (session.subscription as Stripe.Subscription | null);

    if (!subscription) {
      return { error: "Stripe has not attached a subscription to this checkout yet." };
    }

    await syncStripeSubscription({
      userId: user.id,
      customerId: session.customer?.toString(),
      subscription,
      fallbackPlanName: session.metadata?.planName,
    });

    const appSubscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
      include: { plan: true },
    });

    return { subscription: appSubscription };
  } catch {
    return { error: "Could not verify the Stripe checkout session. Check billing again in a moment." };
  }
}

export default async function SubscriptionSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const result = await getSyncedSubscription(params.session_id);

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="text-center">
        {"subscription" in result && result.subscription ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-[#0f6b3a]">
              <Icon name="check" className="h-7 w-7" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6b3a]">Payment successful</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Your {result.subscription.plan.name} plan is active.</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Bhandar updated your product limit and saved the Stripe subscription for invoices, plan changes, and card management.
            </p>
            <div className="mx-auto mt-8 grid max-w-lg gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Plan</p>
                <p className="mt-1 font-semibold">{result.subscription.plan.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Status</p>
                <p className="mt-1 font-semibold">{result.subscription.status}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Product limit</p>
                <p className="mt-1 font-semibold">{result.subscription.plan.productLimit}+</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Next billing</p>
                <p className="mt-1 font-semibold">
                  {result.subscription.currentPeriodEnd ? result.subscription.currentPeriodEnd.toLocaleDateString("en-BD") : "Pending"}
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild className="bg-[#0f6b3a] hover:bg-[#0b542d]">
                <Link href="/dashboard">
                  Go to dashboard
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/billing">
                  <Icon name="message" className="h-4 w-4" />
                  View billing
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700">
              <Icon name="alertCircle" className="h-7 w-7" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Verification pending</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">We could not confirm the subscription yet.</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">{"error" in result ? result.error : "Open billing to check the latest subscription status."}</p>
            <Button asChild className="mt-8 bg-[#0f6b3a] hover:bg-[#0b542d]">
              <Link href="/dashboard/billing">Back to billing</Link>
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
