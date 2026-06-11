import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!env.stripeWebhookSecret) {
    return NextResponse.json({ error: "Stripe webhook secret is not configured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.stripeWebhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.metadata?.orderId) {
      await prisma.order.update({
        where: { id: session.metadata.orderId },
        data: { status: "PAID", paymentRef: session.payment_intent?.toString() || session.id },
      });
    }

    if (session.mode === "subscription" && session.metadata?.userId && session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription.toString());
      const subscriptionPeriodEnd =
        "current_period_end" in subscription && typeof subscription.current_period_end === "number"
          ? new Date(subscription.current_period_end * 1000)
          : null;
      const planName = session.metadata.planName === "MAX" ? "MAX" : "PRO";
      const plan = await prisma.plan.findUnique({ where: { name: planName } });

      if (plan) {
        await prisma.subscription.upsert({
          where: { userId: session.metadata.userId },
          update: {
            stripeCustomerId: session.customer?.toString(),
            stripeSubscriptionId: subscription.id,
            planId: plan.id,
            status: "ACTIVE",
            currentPeriodEnd: subscriptionPeriodEnd,
          },
          create: {
            userId: session.metadata.userId,
            stripeCustomerId: session.customer?.toString(),
            stripeSubscriptionId: subscription.id,
            planId: plan.id,
            status: "ACTIVE",
            currentPeriodEnd: subscriptionPeriodEnd,
          },
        });

        await prisma.user.update({
          where: { id: session.metadata.userId },
          data: { planId: plan.id },
        });
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const freePlan = await prisma.plan.findUnique({ where: { name: "FREE" } });
    const existing = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (existing && freePlan) {
      await prisma.subscription.update({
        where: { id: existing.id },
        data: { status: "CANCELED", planId: freePlan.id },
      });
      await prisma.user.update({
        where: { id: existing.userId },
        data: { planId: freePlan.id },
      });
    }
  }

  return NextResponse.json({ received: true });
}
