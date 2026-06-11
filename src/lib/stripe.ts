import Stripe from "stripe";
import { env } from "@/lib/env";
import { getBaseUrl } from "@/lib/utils";

export const stripe = new Stripe(env.stripeSecretKey, {
  apiVersion: "2026-05-27.dahlia",
});

export function getPlanPriceId(plan: "PRO" | "MAX") {
  return plan === "PRO" ? env.stripeProPriceId : env.stripeMaxPriceId;
}

export function billingReturnUrl() {
  return `${getBaseUrl()}/dashboard/billing`;
}
