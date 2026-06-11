"use client";

import { useActionState } from "react";
import { changePasswordAction, updateProfileAction } from "@/actions/profile";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const initialState: { error?: string; success?: string } = {};

export function ProfileForm({ name, avatarUrl }: { name?: string | null; avatarUrl?: string | null }) {
  const [state, formAction] = useActionState(updateProfileAction, initialState);
  return (
    <form action={formAction} className="space-y-4">
      {state.error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>}
      {state.success && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{state.success}</div>}
      <Input label="Name" name="name" defaultValue={name || ""} required />
      <Input label="Avatar URL" name="avatarUrl" defaultValue={avatarUrl || ""} />
      <Button className="bg-[#0f6b3a] hover:bg-[#0b542d]">Save profile</Button>
    </form>
  );
}

export function PasswordForm() {
  const [state, formAction] = useActionState(changePasswordAction, initialState);
  return (
    <form action={formAction} className="space-y-4">
      {state.error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>}
      {state.success && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{state.success}</div>}
      <Input label="New password" name="password" type="password" required />
      <Button variant="outline">Change password</Button>
    </form>
  );
}
