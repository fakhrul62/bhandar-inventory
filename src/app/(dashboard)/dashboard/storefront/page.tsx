import Link from "next/link";
import { Copy } from "lucide-react";
import { ensureUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StorefrontForm } from "@/components/dashboard/StorefrontForm";

export default async function StorefrontPage() {
  const user = await ensureUserRecord();
  const store = await prisma.store.findFirst({ where: { userId: user.id } });
  if (!store) return null;
  const url = `${getBaseUrl()}/store/${store.slug}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <Card>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6b3a]">Storefront</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Public store settings</h1>
        <div className="mt-6">
          <StorefrontForm store={store} />
        </div>
      </Card>
      <Card>
        <h2 className="font-semibold">Store preview</h2>
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#0f6b3a] text-xl font-semibold text-white">
            {store.name.slice(0, 2).toUpperCase()}
          </div>
          <h3 className="mt-5 text-2xl font-semibold">{store.name}</h3>
          <p className="mt-2 text-sm text-slate-500">{store.description}</p>
          <p className="mt-4 rounded-lg bg-white p-3 text-sm text-slate-600">{url}</p>
          <div className="mt-4 flex gap-3">
            <Button asChild className="bg-[#0f6b3a] hover:bg-[#0b542d]">
              <Link href={url} target="_blank">Open store</Link>
            </Button>
            <Button variant="outline">
              <Copy className="h-4 w-4" />
              Copy link
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
