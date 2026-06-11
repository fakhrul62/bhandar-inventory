import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.email_confirmed_at) {
    redirect("/verify-email");
  }

  return user;
}

export async function ensureUserRecord() {
  const authUser = await requireUser();
  const email = authUser.email || "";
  const name =
    (authUser.user_metadata?.name as string | undefined) ||
    (authUser.user_metadata?.full_name as string | undefined) ||
    email.split("@")[0] ||
    "Bhandar Owner";

  const freePlan = await prisma.plan.upsert({
    where: { name: "FREE" },
    update: { price: 0, productLimit: 50 },
    create: { name: "FREE", price: 0, productLimit: 50 },
  });

  const appUser = await prisma.user.upsert({
    where: { id: authUser.id },
    update: {
      email,
      name,
      avatarUrl: (authUser.user_metadata?.avatar_url as string | undefined) || null,
    },
    create: {
      id: authUser.id,
      email,
      name,
      avatarUrl: (authUser.user_metadata?.avatar_url as string | undefined) || null,
      role: email === "ifakhrul23@gmail.com" ? "ADMIN" : "OWNER",
      planId: freePlan.id,
    },
    include: { plan: true },
  });

  const existingStore = await prisma.store.findFirst({
    where: { userId: appUser.id },
  });

  if (!existingStore) {
    const baseSlug = slugify(name || "bhandar-store") || "bhandar-store";
    let slug = baseSlug;
    let index = 1;

    while (await prisma.store.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${index}`;
      index += 1;
    }

    await prisma.store.create({
      data: {
        userId: appUser.id,
        name: `${name}'s Bhandar`,
        slug,
        description: "Inventory and storefront powered by Bhandar.",
      },
    });
  }

  return appUser;
}

export async function requireAdmin() {
  const user = await ensureUserRecord();
  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return user;
}
