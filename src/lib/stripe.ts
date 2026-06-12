import Stripe from "stripe";
import { env } from "@/lib/env";
import { getBaseUrl } from "@/lib/utils";

type PaidPlanName = "PRO" | "MAX";
const missingStripeSecretKey = "sk_test_missing_stripe_secret_key";

export function hasStripeSecretKey() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || missingStripeSecretKey, {
  apiVersion: "2026-05-27.dahlia",
});

export function getConfiguredPlanPriceId(plan: PaidPlanName) {
  return plan === "PRO" ? env.stripeProPriceId : env.stripeMaxPriceId;
}

function planLookupKey(plan: PaidPlanName, currency: "bdt" | "usd") {
  return `bhandar_${plan.toLowerCase()}_monthly_${currency}_v1`;
}

function stripeUnitAmount(amount: number, currency: "bdt" | "usd") {
  return currency === "usd" ? amount : amount * 100;
}

async function findOrCreatePlanProduct(plan: PaidPlanName) {
  const existing = await stripe.products.search({
    query: `metadata['bhandarPlan']:'${plan}' AND active:'true'`,
    limit: 1,
  });

  if (existing.data[0]) {
    return existing.data[0];
  }

  return stripe.products.create({
    name: `Bhandar ${plan}`,
    description: `${plan} monthly subscription for Bhandar inventory and storefront management.`,
    metadata: { app: "bhandar", bhandarPlan: plan },
  });
}

async function findPriceByLookupKey(lookupKey: string) {
  const prices = await stripe.prices.list({
    active: true,
    lookup_keys: [lookupKey],
    limit: 1,
  });

  return prices.data[0] || null;
}

async function createPlanPrice(plan: PaidPlanName, amount: number, currency: "bdt" | "usd") {
  const product = await findOrCreatePlanProduct(plan);

  return stripe.prices.create({
    product: product.id,
    currency,
    unit_amount: stripeUnitAmount(amount, currency),
    recurring: { interval: "month" },
    lookup_key: planLookupKey(plan, currency),
    nickname: `Bhandar ${plan} monthly`,
    metadata: { app: "bhandar", bhandarPlan: plan },
  });
}

export async function resolvePlanPriceId(plan: PaidPlanName, monthlyPriceBdt: number, currency: "bdt" | "usd" = "bdt") {
  const configuredPriceId = getConfiguredPlanPriceId(plan);
  if (configuredPriceId && currency === "bdt") {
    return configuredPriceId;
  }

  const lookupKey = planLookupKey(plan, currency);
  const existingPrice = await findPriceByLookupKey(lookupKey);
  if (existingPrice) {
    return existingPrice.id;
  }

  const amount = currency === "bdt" ? monthlyPriceBdt : plan === "PRO" ? 499 : 999;
  const price = await createPlanPrice(plan, amount, currency);
  return price.id;
}

export function billingReturnUrl() {
  return `${getBaseUrl()}/dashboard/billing`;
}
