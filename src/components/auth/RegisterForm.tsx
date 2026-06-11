"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { signUpAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const initialState: { error?: string } = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(signUpAction, initialState);

  return (
    <div className="w-full max-w-md animate-fade-up space-y-7">
      <div>
        <p className="text-sm font-medium text-[#0f6b3a]">ভান্ডার</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Create your Bhandar
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Start with the Free plan and publish up to 50 products.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {state.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {state.error}
          </div>
        )}
        <Input label="Name" name="name" type="text" placeholder="Md. Rahim Uddin" required />
        <Input label="Email" name="email" type="email" placeholder="you@example.com" required />
        <Input label="Password" name="password" type="password" placeholder="Minimum 8 characters" required />
        <Button type="submit" disabled={pending} className="w-full bg-[#0f6b3a] hover:bg-[#0b542d]">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[#0f6b3a] underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
