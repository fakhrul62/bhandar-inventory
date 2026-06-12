"use server";

import { revalidatePath } from "next/cache";
import { ensureUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function markNotificationReadAction(formData: FormData) {
  const user = await ensureUserRecord();
  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.notification.updateMany({
    where: { id, userId: user.id, readAt: null },
    data: { readAt: new Date() },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
}

export async function markAllNotificationsReadAction() {
  const user = await ensureUserRecord();

  await prisma.notification.updateMany({
    where: { userId: user.id, readAt: null },
    data: { readAt: new Date() },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
}
