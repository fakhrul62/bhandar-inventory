"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ensureUserRecord } from "@/lib/auth";
import { storeSchema } from "@/lib/validators";

export async function updateStoreAction(_prevState: { error?: string; success?: string }, formData: FormData) {
  const user = await ensureUserRecord();
  const store = await prisma.store.findFirst({ where: { userId: user.id } });
  if (!store) return { error: "Store not found" };

  const parsed = storeSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    logoUrl: formData.get("logoUrl") || "",
    isPublic: formData.get("isPublic") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid store details" };
  }

  const slugOwner = await prisma.store.findUnique({ where: { slug: parsed.data.slug } });
  if (slugOwner && slugOwner.id !== store.id) {
    return { error: "That storefront slug is already taken" };
  }

  await prisma.store.update({
    where: { id: store.id },
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      logoUrl: parsed.data.logoUrl || null,
      isPublic: parsed.data.isPublic,
    },
  });

  revalidatePath("/dashboard/storefront");
  revalidatePath(`/store/${parsed.data.slug}`);
  return { success: "Storefront updated" };
}
