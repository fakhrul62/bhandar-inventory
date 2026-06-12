import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { hasStripeSecretKey, stripe } from "@/lib/stripe";
import { downgradeUserToFree, syncStripeSubscription } from "@/lib/subscriptions";

export async function POST(request: Request) {
  if (!hasStripeSecretKey()) {
    return NextResponse.json({ error: "Stripe secret key is not configured" }, { status: 500 });
  }

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
      await syncStripeSubscription({
        userId: session.metadata.userId,
        customerId: session.customer?.toString(),
        subscription,
        fallbackPlanName: session.metadata.planName,
      });
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const existing = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    });
    const userId = subscription.metadata?.userId || existing?.userId;

    if (userId) {
      await syncStripeSubscription({
        userId,
        customerId: subscription.customer?.toString(),
        subscription,
        fallbackPlanName: subscription.metadata?.planName,
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const existing = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (existing) {
      await downgradeUserToFree(existing.userId, subscription.id);
    }
  }

  return NextResponse.json({ received: true });
}
