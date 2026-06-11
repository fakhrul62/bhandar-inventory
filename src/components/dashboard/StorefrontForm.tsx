"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { updateStoreAction } from "@/actions/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const initialState: { error?: string; success?: string } = {};

export function StorefrontForm({
  store,
}: {
  store: {
    name: string;
    slug: string;
    description: string | null;
    logoUrl: string | null;
    isPublic: boolean;
  };
}) {
  const [state, formAction, pending] = useActionState(updateStoreAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>}
      {state.success && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{state.success}</div>}
      <Input label="Store name" name="name" defaultValue={store.name} required />
      <Input label="Store slug" name="slug" defaultValue={store.slug} required />
      <Input label="Logo URL" name="logoUrl" defaultValue={store.logoUrl || ""} />
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-slate-800">Description</span>
        <textarea name="description" defaultValue={store.description || ""} rows={4} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm" />
      </label>
      <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 text-sm font-medium">
        <input name="isPublic" type="checkbox" defaultChecked={store.isPublic} className="h-4 w-4 accent-[#0f6b3a]" />
        Make storefront public
      </label>
      <Button disabled={pending} className="bg-[#0f6b3a] hover:bg-[#0b542d]">
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Save storefront
      </Button>
    </form>
  );
}
