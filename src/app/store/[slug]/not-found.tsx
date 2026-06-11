import Link from "next/link";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function StoreNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-50 text-[#0f6b3a]">
          <Store className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
          Storefront unavailable
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This store may be private, unpublished, or the link may have changed.
        </p>
        <Button asChild className="mt-6 bg-[#0f6b3a] hover:bg-[#0b542d]">
          <Link href="/">Go to Bhandar</Link>
        </Button>
      </div>
    </main>
  );
}
