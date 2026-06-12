"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ensureUserRecord } from "@/lib/auth";
import { billingReturnUrl, hasStripeSecretKey, resolvePlanPriceId, stripe } from "@/lib/stripe";
import { getBaseUrl } from "@/lib/utils";

function isStripeInvalidRequest(error: unknown) {
  return typeof error === "object" && error !== null && "type" in error && error.type === "StripeInvalidRequestError";
}

export async function openBillingPortalAction() {
  if (!hasStripeSecretKey()) {
    redirect("/dashboard/billing?error=stripe-not-configured");
  }

  const user = await ensureUserRecord();
  const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });

  if (!subscription?.stripeCustomerId) {
    redirect("/dashboard/billing?error=no-customer");
  }

  let session;
  try {
    session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: billingReturnUrl(),
    });
  } catch {
    redirect("/dashboard/billing?error=portal-unavailable");
  }

  redirect(session.url);
}

export async function startSubscriptionCheckoutAction(formData: FormData) {
  if (!hasStripeSecretKey()) {
    redirect("/dashboard/billing?error=stripe-not-configured");
  }

  const planName = String(formData.get("plan"));
  if (planName !== "PRO" && planName !== "MAX") {
    redirect("/dashboard/billing?error=invalid-plan");
  }

  const user = await ensureUserRecord();
  const plan = await prisma.plan.findUnique({ where: { name: planName } });
  if (!plan || plan.price <= 0) {
    redirect("/dashboard/billing?error=invalid-plan");
  }

  const existingSubscription = await prisma.subscription.findUnique({ where: { userId: user.id } });
  let stripeCustomerId = existingSubscription?.stripeCustomerId || "";

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: { userId: user.id },
    });
    stripeCustomerId = customer.id;
  }

  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: { stripeCustomerId, status: "INCOMPLETE" },
    create: {
      userId: user.id,
      stripeCustomerId,
      planId: user.planId,
      status: "INCOMPLETE",
    },
  });

  let priceId: string;
  try {
    priceId = await resolvePlanPriceId(planName, plan.price);
  } catch {
    try {
      priceId = await resolvePlanPriceId(planName, plan.price, "usd");
    } catch {
      redirect("/dashboard/billing?error=price-unavailable");
    }
  }

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${getBaseUrl()}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getBaseUrl()}/dashboard/billing?cancelled=1`,
      metadata: { userId: user.id, planName },
      subscription_data: {
        metadata: { userId: user.id, planName },
      },
    });
  } catch (error) {
    if (!isStripeInvalidRequest(error)) {
      redirect("/dashboard/billing?error=checkout-unavailable");
    }

    try {
      const fallbackPriceId = await resolvePlanPriceId(planName, plan.price, "usd");
      session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        line_items: [{ price: fallbackPriceId, quantity: 1 }],
        success_url: `${getBaseUrl()}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${getBaseUrl()}/dashboard/billing?cancelled=1`,
        metadata: { userId: user.id, planName, currencyFallback: "USD" },
        subscription_data: {
          metadata: { userId: user.id, planName, currencyFallback: "USD" },
        },
      });
    } catch {
      redirect("/dashboard/billing?error=checkout-unavailable");
    }
  }

  redirect(session.url || "/dashboard/billing");
}

export async function upgradePlanAction(formData: FormData) {
  return startSubscriptionCheckoutAction(formData);
}
