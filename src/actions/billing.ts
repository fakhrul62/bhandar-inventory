"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ensureUserRecord } from "@/lib/auth";
import { billingReturnUrl, getPlanPriceId, stripe } from "@/lib/stripe";
import { getBaseUrl } from "@/lib/utils";

export async function openBillingPortalAction() {
  const user = await ensureUserRecord();
  const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });

  if (!subscription?.stripeCustomerId) {
    redirect("/dashboard/billing?error=no-customer");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: billingReturnUrl(),
  });

  redirect(session.url);
}

export async function upgradePlanAction(formData: FormData) {
  const planName = String(formData.get("plan"));
  if (planName !== "PRO" && planName !== "MAX") {
    redirect("/dashboard/billing?error=invalid-plan");
  }

  const priceId = getPlanPriceId(planName);
  if (!priceId) {
    redirect("/dashboard/billing?error=missing-price");
  }

  const user = await ensureUserRecord();
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name || undefined,
    metadata: { userId: user.id },
  });

  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: { stripeCustomerId: customer.id },
    create: {
      userId: user.id,
      stripeCustomerId: customer.id,
      planId: user.planId,
      status: "INCOMPLETE",
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customer.id,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${getBaseUrl()}/dashboard/billing?success=1`,
    cancel_url: `${getBaseUrl()}/dashboard/billing?cancelled=1`,
    metadata: { userId: user.id, planName },
  });

  redirect(session.url || "/dashboard/billing");
}
