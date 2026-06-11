import Link from "next/link";
import { AlertTriangle, Package, ShoppingBag, Store, Wallet } from "lucide-react";
import { ensureUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";

export default async function DashboardPage() {
  const user = await ensureUserRecord();
  const store = await prisma.store.findFirst({
    where: { userId: user.id },
    include: {
      products: true,
      orders: {
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { items: { include: { product: true } } },
      },
    },
  });

  const totalProducts = store?.products.length || 0;
  const lowStock = store?.products.filter((product) => product.type === "PHYSICAL" && (product.stock || 0) <= 5).length || 0;
  const orders = store?.orders || [];
  const revenueBdt = orders
    .filter((order) => order.status === "PAID" && order.currency === "BDT")
    .reduce((sum, order) => sum + Number(order.totalAmount), 0);
  const revenueUsd = orders
    .filter((order) => order.status === "PAID" && order.currency === "USD")
    .reduce((sum, order) => sum + Number(order.totalAmount), 0);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-emerald-900/10 bg-[#0f6b3a] p-6 text-white shadow-[0_24px_80px_rgba(15,107,58,0.16)] sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="font-[var(--font-hind-siliguri)] text-sm text-emerald-100">ভান্ডার ড্যাশবোর্ড</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Run your inventory, sales, and storefront from one place.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-emerald-50">
              Track stock, publish products, collect orders, and share your store link with customers.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-[#f5a623] text-slate-950 hover:bg-[#e1961e]">
              <Link href="/dashboard/products/new">Add product</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/15">
              <Link href={`/store/${store?.slug || ""}`} target="_blank">View store</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Products" value={`${totalProducts}/${user.plan.productLimit}`} helper={`${user.plan.name} plan usage`} icon={Package} />
        <StatCard label="Orders" value={String(orders.length)} helper="Recent customer orders" icon={ShoppingBag} />
        <StatCard label="Revenue" value={`${formatMoney(revenueBdt, "BDT")} / ${formatMoney(revenueUsd, "USD")}`} helper="Paid orders only" icon={Wallet} />
        <StatCard label="Low stock" value={String(lowStock)} helper="Physical products at 5 or less" icon={AlertTriangle} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <Card className="p-0">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <p className="mt-1 text-sm text-slate-500">Latest storefront checkout activity.</p>
          </div>
          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingBag className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 font-semibold">No orders yet</h3>
              <p className="mt-1 text-sm text-slate-500">Publish your store and share the link to start collecting orders.</p>
              <Button asChild className="mt-5 bg-[#0f6b3a] hover:bg-[#0b542d]">
                <Link href="/dashboard/storefront">Set up storefront</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">Buyer</th>
                    <th className="px-5 py-4 font-medium">Items</th>
                    <th className="px-5 py-4 font-medium">Total</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-950">{order.buyerName}</p>
                        <p className="text-slate-500">{order.buyerEmail}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{order.items.length}</td>
                      <td className="px-5 py-4 font-medium">{formatMoney(Number(order.totalAmount), order.currency)}</td>
                      <td className="px-5 py-4">{order.status}</td>
                      <td className="px-5 py-4 text-slate-500">{order.createdAt.toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-[#f5a623]">
              <Store className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold">Quick actions</h2>
              <p className="text-sm text-slate-500">Common daily tasks</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <Button asChild className="w-full bg-[#0f6b3a] hover:bg-[#0b542d]">
              <Link href="/dashboard/products/new">Add a product</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/products">Manage inventory</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/storefront">Edit storefront</Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
