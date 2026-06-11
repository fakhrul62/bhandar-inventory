import { ensureUserRecord } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { PasswordForm, ProfileForm } from "@/components/dashboard/ProfileForms";

export default async function SettingsPage() {
  const user = await ensureUserRecord();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6b3a]">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Profile</h1>
        <div className="mt-6">
          <ProfileForm name={user.name} avatarUrl={user.avatarUrl} />
        </div>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold">Security</h2>
        <p className="mt-2 text-sm text-slate-500">Change your password for email/password login.</p>
        <div className="mt-6">
          <PasswordForm />
        </div>
      </Card>
      <Card className="border-red-200 lg:col-span-2">
        <h2 className="text-xl font-semibold text-red-700">Delete account</h2>
        <p className="mt-2 text-sm text-slate-500">Account deletion requires a separate confirmed flow and service-role cleanup. This is intentionally not exposed until production legal text is finalized.</p>
      </Card>
    </div>
  );
}
