"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validators";
import { rateLimits } from "@/lib/redis";
import { stripe } from "@/lib/stripe";
import { getBaseUrl } from "@/lib/utils";

export async function createCheckoutAction(_prevState: { error?: string }, formData: FormData) {
  const limit = await rateLimits.orders.limit("server-action");
  if (!limit.success) {
    return { error: "Too many checkout attempts. Please try again soon." };
  }

  const parsed = checkoutSchema.safeParse({
    storeId: formData.get("storeId"),
    buyerName: formData.get("buyerName"),
    buyerEmail: formData.get("buyerEmail"),
    buyerPhone: formData.get("buyerPhone"),
    paymentMethod: formData.get("paymentMethod"),
    items: JSON.parse(String(formData.get("items") || "[]")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid checkout details" };
  }

  const products = await prisma.product.findMany({
    where: {
      id: { in: parsed.data.items.map((item) => item.productId) },
      storeId: parsed.data.storeId,
      isPublished: true,
    },
    include: { variants: true, store: true },
  });

  if (products.length !== new Set(parsed.data.items.map((item) => item.productId)).size) {
    return { error: "Some cart items are no longer available" };
  }

  let total = 0;
  let currency: "BDT" | "USD" = "BDT";
  const orderItems = parsed.data.items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product) throw new Error("Product not found");
    const variant = item.variantId
      ? product.variants.find((entry) => entry.id === item.variantId)
      : null;
    const unitPrice = Number(product.price) + Number(variant?.additionalPrice || 0);
    total += unitPrice * item.quantity;
    currency = product.currency;
    return {
      productId: product.id,
      variantId: variant?.id,
      quantity: item.quantity,
      unitPrice,
    };
  });

  const order = await prisma.order.create({
    data: {
      storeId: parsed.data.storeId,
      buyerEmail: parsed.data.buyerEmail,
      buyerName: parsed.data.buyerName,
      buyerPhone: parsed.data.buyerPhone,
      totalAmount: total,
      currency,
      paymentMethod: parsed.data.paymentMethod,
      status: parsed.data.paymentMethod === "DEV_MOBILE" ? "PAID" : "PENDING",
      paymentRef: parsed.data.paymentMethod === "DEV_MOBILE" ? `DEV-${Date.now()}` : null,
      items: { create: orderItems },
    },
    include: { store: true },
  });

  if (parsed.data.paymentMethod === "DEV_MOBILE") {
    redirect(`/store/${order.store.slug}/success?order=${order.id}`);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: parsed.data.buyerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: Math.round(total * 100),
          product_data: { name: `Order from ${order.store.name}` },
        },
      },
    ],
    metadata: { orderId: order.id },
    success_url: `${getBaseUrl()}/store/${order.store.slug}/success?order=${order.id}`,
    cancel_url: `${getBaseUrl()}/store/${order.store.slug}?checkout=cancelled`,
  });

  redirect(session.url || `/store/${order.store.slug}`);
}
