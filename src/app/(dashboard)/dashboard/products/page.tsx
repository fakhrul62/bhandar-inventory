import Link from "next/link";
import { Package, Plus, Search } from "lucide-react";
import { deleteProductAction } from "@/actions/products";
import { ensureUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SafeImage } from "@/components/ui/SafeImage";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; published?: string }>;
}) {
  const params = await searchParams;
  const user = await ensureUserRecord();
  const store = await prisma.store.findFirst({ where: { userId: user.id } });
  const products = store
    ? await prisma.product.findMany({
        where: {
          storeId: store.id,
          name: params.q ? { contains: params.q, mode: "insensitive" } : undefined,
          type: params.type === "PHYSICAL" || params.type === "DIGITAL" ? params.type : undefined,
          isPublished: params.published === "true" ? true : params.published === "false" ? false : undefined,
        },
        orderBy: { createdAt: "desc" },
        include: { variants: true },
      })
    : [];
  const used = products.length;
  const percent = Math.min(100, (used / user.plan.productLimit) * 100);
  const atLimit = used >= user.plan.productLimit;

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6b3a]">Inventory</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Products</h1>
          <p className="mt-2 text-sm text-slate-500">Manage physical and digital products in your store.</p>
        </div>
        <Button asChild disabled={atLimit} className="bg-[#0f6b3a] hover:bg-[#0b542d]">
          <Link href={atLimit ? "/dashboard/billing" : "/dashboard/products/new"}>
            <Plus className="h-4 w-4" />
            {atLimit ? "Upgrade to add more" : "Add product"}
          </Link>
        </Button>
      </section>

      <Card>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold">{used} of {user.plan.productLimit} products used</h2>
            <p className="mt-1 text-sm text-slate-500">{user.plan.name} plan limit is enforced server-side.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard/billing">Manage plan</Link>
          </Button>
        </div>
        <div className="mt-5 h-3 rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-[#0f6b3a]" style={{ width: `${percent}%` }} />
        </div>
      </Card>

      <Card className="p-0">
        <form className="grid gap-3 border-b border-slate-200 p-5 md:grid-cols-[1fr_180px_180px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <Input name="q" defaultValue={params.q} placeholder="Search products" className="pl-9" />
          </div>
          <select name="type" defaultValue={params.type || ""} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm">
            <option value="">All types</option>
            <option value="PHYSICAL">Physical</option>
            <option value="DIGITAL">Digital</option>
          </select>
          <select name="published" defaultValue={params.published || ""} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm">
            <option value="">All status</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
          <Button variant="outline">Filter</Button>
        </form>

        {products.length === 0 ? (
          <div className="p-10 text-center">
            <Package className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 font-semibold">Add your first product</h3>
            <p className="mt-1 text-sm text-slate-500">Create physical or digital products and publish them to your storefront.</p>
            <Button asChild className="mt-5 bg-[#0f6b3a] hover:bg-[#0b542d]">
              <Link href="/dashboard/products/new">Add product</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Product</th>
                  <th className="px-5 py-4 font-medium">Type</th>
                  <th className="px-5 py-4 font-medium">Price</th>
                  <th className="px-5 py-4 font-medium">Stock</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-xs text-slate-400">
                          <SafeImage
                            src={product.imageUrls[0]}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            fallback={<Package className="h-5 w-5" />}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-slate-950">{product.name}</p>
                          <p className="text-slate-500">{product.variants.length} variants</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">{product.type}</td>
                    <td className="px-5 py-4">{formatMoney(Number(product.price), product.currency)}</td>
                    <td className="px-5 py-4">{product.type === "DIGITAL" ? "Digital" : product.stock}</td>
                    <td className="px-5 py-4">{product.isPublished ? "Published" : "Draft"}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/products/${product.id}`}>Edit</Link>
                        </Button>
                        <form action={deleteProductAction}>
                          <input type="hidden" name="id" value={product.id} />
                          <Button variant="destructive" size="sm">Delete</Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
