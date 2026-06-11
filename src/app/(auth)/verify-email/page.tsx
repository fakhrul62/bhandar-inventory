import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-md animate-fade-up space-y-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-[#0f6b3a] text-white">
        <MailCheck className="h-7 w-7" />
      </div>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          Verify your email
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Supabase sent a verification link to your inbox. Confirm your email before opening the dashboard.
        </p>
      </div>
      <Button asChild className="bg-[#0f6b3a] hover:bg-[#0b542d]">
        <Link href="/login">Back to login</Link>
      </Button>
    </div>
  );
}
