"use server";

import { redirect } from "next/navigation";
import { rateLimits } from "@/lib/redis";
import { signInSchema, signUpSchema } from "@/lib/validators";
import { createClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/utils";

type AuthState = {
  error?: string;
};

function getIp() {
  return "server-action";
}

export async function signInAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const limit = await rateLimits.auth.limit(getIp());
  if (!limit.success) {
    return { error: "Too many attempts. Please try again in a minute." };
  }

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid login details" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signUpAction(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const limit = await rateLimits.auth.limit(getIp());
  if (!limit.success) {
    return { error: "Too many attempts. Please try again in a minute." };
  }

  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid registration details" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { name: parsed.data.name },
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/verify-email");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
