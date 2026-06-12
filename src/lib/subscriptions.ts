import type Stripe from "stripe";
import type { PlanName, SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type PaidPlanName = Exclude<PlanName, "FREE">;

function toSubscriptionStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  const normalized = status.toUpperCase().replace("-", "_");

  if (
    normalized === "ACTIVE" ||
    normalized === "TRIALING" ||
    normalized === "PAST_DUE" ||
    normalized === "CANCELED" ||
    normalized === "INCOMPLETE" ||
    normalized === "INCOMPLETE_EXPIRED" ||
    normalized === "UNPAID" ||
    normalized === "PAUSED"
  ) {
    return normalized as SubscriptionStatus;
  }

  return "NONE";
}

function getSubscriptionPeriodEnd(subscription: Stripe.Subscription) {
  const directPeriodEnd = (subscription as Stripe.Subscription & { current_period_end?: number }).current_period_end;
  const itemPeriodEnd = subscription.items.data[0]?.current_period_end;
  const periodEnd = typeof directPeriodEnd === "number" ? directPeriodEnd : itemPeriodEnd;

  return typeof periodEnd === "number" ? new Date(periodEnd * 1000) : null;
}

function getPlanNameFromSubscription(subscription: Stripe.Subscription, fallbackPlanName?: string | null): PaidPlanName | null {
  const price = subscription.items.data[0]?.price;
  const metadataPlan = price?.metadata?.bhandarPlan || subscription.metadata?.planName || fallbackPlanName;
  const lookupKey = price?.lookup_key || "";

  if (metadataPlan === "PRO" || lookupKey.includes("_pro_")) {
    return "PRO";
  }

  if (metadataPlan === "MAX" || lookupKey.includes("_max_")) {
    return "MAX";
  }

  return null;
}

export async function syncStripeSubscription({
  userId,
  customerId,
  subscription,
  fallbackPlanName,
}: {
  userId: string;
  customerId?: string | null;
  subscription: Stripe.Subscription;
  fallbackPlanName?: string | null;
}) {
  const planName = getPlanNameFromSubscription(subscription, fallbackPlanName);
  if (!planName) {
    return null;
  }

  const plan = await prisma.plan.findUnique({ where: { name: planName } });
  if (!plan) {
    return null;
  }

  const syncedSubscription = await prisma.subscription.upsert({
    where: { userId },
    update: {
      stripeCustomerId: customerId || subscription.customer?.toString() || undefined,
      stripeSubscriptionId: subscription.id,
      planId: plan.id,
      status: toSubscriptionStatus(subscription.status),
      currentPeriodEnd: getSubscriptionPeriodEnd(subscription),
    },
    create: {
      userId,
      stripeCustomerId: customerId || subscription.customer?.toString() || undefined,
      stripeSubscriptionId: subscription.id,
      planId: plan.id,
      status: toSubscriptionStatus(subscription.status),
      currentPeriodEnd: getSubscriptionPeriodEnd(subscription),
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { planId: plan.id },
  });

  return syncedSubscription;
}

export async function downgradeUserToFree(userId: string, stripeSubscriptionId?: string | null) {
  const freePlan = await prisma.plan.findUnique({ where: { name: "FREE" } });
  if (!freePlan) {
    return null;
  }

  const existing = stripeSubscriptionId
    ? await prisma.subscription.findUnique({ where: { stripeSubscriptionId } })
    : await prisma.subscription.findUnique({ where: { userId } });

  if (existing) {
    await prisma.subscription.update({
      where: { id: existing.id },
      data: { status: "CANCELED", planId: freePlan.id, currentPeriodEnd: null },
    });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { planId: freePlan.id },
  });

  return freePlan;
}
