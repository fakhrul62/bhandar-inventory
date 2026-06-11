"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ensureUserRecord } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validators";

export async function updateProfileAction(_prevState: { error?: string; success?: string }, formData: FormData) {
  const user = await ensureUserRecord();
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    avatarUrl: formData.get("avatarUrl") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid profile details" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      avatarUrl: parsed.data.avatarUrl || null,
    },
  });

  const supabase = await createClient();
  await supabase.auth.updateUser({
    data: { name: parsed.data.name, avatar_url: parsed.data.avatarUrl || null },
  });

  revalidatePath("/dashboard/settings");
  return { success: "Profile updated" };
}

export async function changePasswordAction(_prevState: { error?: string; success?: string }, formData: FormData) {
  const password = String(formData.get("password") || "");
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { success: "Password changed" };
}
