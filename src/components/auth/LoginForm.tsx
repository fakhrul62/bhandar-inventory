"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { signInAction } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { getBaseUrl } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const initialState: { error?: string } = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signInAction, initialState);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function signInWithGoogle() {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${getBaseUrl()}/auth/callback`,
      },
    });
  }

  return (
    <div className="w-full max-w-md animate-fade-up space-y-7">
      <div>
        <p className="text-sm font-medium text-[#0f6b3a]">Bhandar</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Sign in to your store
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Manage inventory, sales, and your public storefront.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {state.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {state.error}
          </div>
        )}
        <Input label="Email" name="email" type="email" placeholder="you@example.com" required />
        <Input label="Password" name="password" type="password" placeholder="Enter your password" required />
        <Button type="submit" disabled={pending} className="w-full bg-[#0f6b3a] hover:bg-[#0b542d]">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          Sign in
        </Button>
      </form>

      <Button
        type="button"
        variant="outline"
        onClick={signInWithGoogle}
        disabled={googleLoading}
        className="w-full"
      >
        {googleLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        Continue with Google
      </Button>

      <p className="text-center text-sm text-slate-600">
        New to Bhandar?{" "}
        <Link href="/register" className="font-medium text-[#0f6b3a] underline-offset-4 hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
