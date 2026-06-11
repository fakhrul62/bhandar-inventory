"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ensureUserRecord } from "@/lib/auth";
import { productSchema } from "@/lib/validators";
import { rateLimits } from "@/lib/redis";

export type ActionState = {
  error?: string;
  success?: string;
};

function parseJsonArray(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

export async function saveProductAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const limit = await rateLimits.products.limit("server-action");
  if (!limit.success) {
    return { error: "Too many product changes. Please try again soon." };
  }

  const user = await ensureUserRecord();
  const store = await prisma.store.findFirst({ where: { userId: user.id }, include: { products: true } });
  if (!store) return { error: "Store not found" };

  const parsed = productSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    type: formData.get("type"),
    price: formData.get("price"),
    currency: formData.get("currency") || "BDT",
    stock: formData.get("type") === "DIGITAL" ? null : formData.get("stock"),
    imageUrls: parseJsonArray(formData.get("imageUrls")),
    fileUrl: formData.get("fileUrl") || "",
    isPublished: formData.get("isPublished") === "on",
    variants: parseJsonArray(formData.get("variants")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid product" };
  }

  const productCount = await prisma.product.count({ where: { storeId: store.id } });
  const isNewProduct = !parsed.data.id;
  if (isNewProduct && productCount >= user.plan.productLimit) {
    return { error: `Your ${user.plan.name} plan allows ${user.plan.productLimit} products. Upgrade to add more.` };
  }

  if (parsed.data.id) {
    await prisma.product.update({
      where: { id: parsed.data.id, storeId: store.id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        type: parsed.data.type,
        price: parsed.data.price,
        currency: parsed.data.currency,
        stock: parsed.data.type === "DIGITAL" ? null : parsed.data.stock,
        imageUrls: parsed.data.imageUrls,
        fileUrl: parsed.data.fileUrl || null,
        isPublished: parsed.data.isPublished,
        variants: {
          deleteMany: {},
          create: parsed.data.variants.map((variant) => ({
            label: variant.label,
            value: variant.value,
            additionalPrice: variant.additionalPrice,
            stock: parsed.data.type === "DIGITAL" ? null : variant.stock,
          })),
        },
      },
    });
  } else {
    await prisma.product.create({
      data: {
        storeId: store.id,
        name: parsed.data.name,
        description: parsed.data.description || null,
        type: parsed.data.type,
        price: parsed.data.price,
        currency: parsed.data.currency,
        stock: parsed.data.type === "DIGITAL" ? null : parsed.data.stock,
        imageUrls: parsed.data.imageUrls,
        fileUrl: parsed.data.fileUrl || null,
        isPublished: parsed.data.isPublished,
        variants: {
          create: parsed.data.variants.map((variant) => ({
            label: variant.label,
            value: variant.value,
            additionalPrice: variant.additionalPrice,
            stock: parsed.data.type === "DIGITAL" ? null : variant.stock,
          })),
        },
      },
    });
  }

  revalidatePath("/dashboard/products");
  revalidatePath(`/store/${store.slug}`);
  redirect("/dashboard/products");
}

export async function deleteProductAction(formData: FormData) {
  const user = await ensureUserRecord();
  const store = await prisma.store.findFirst({ where: { userId: user.id } });
  const id = String(formData.get("id") || "");
  if (!store || !id) return;

  await prisma.product.delete({ where: { id, storeId: store.id } });
  revalidatePath("/dashboard/products");
  revalidatePath(`/store/${store.slug}`);
}
