import { ensureUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const user = await ensureUserRecord();
  const store = await prisma.store.findFirst({ where: { userId: user.id } });
  const orders = store
    ? await prisma.order.findMany({
        where: {
          storeId: store.id,
          status: params.status === "PAID" || params.status === "PENDING" || params.status === "FAILED" || params.status === "REFUNDED" ? params.status : undefined,
        },
        include: { items: { include: { product: true, variant: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6b3a]">Sales</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Orders</h1>
      </section>
      <Card className="p-0">
        <form className="border-b border-slate-200 p-5">
          <select name="status" defaultValue={params.status || ""} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm">
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-5 py-4 font-medium">Buyer</th>
                <th className="px-5 py-4 font-medium">Items</th>
                <th className="px-5 py-4 font-medium">Total</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Payment</th>
                <th className="px-5 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium">{order.buyerName}</p>
                    <p className="text-slate-500">{order.buyerEmail} · {order.buyerPhone}</p>
                  </td>
                  <td className="px-5 py-4">{order.items.map((item) => item.product.name).join(", ")}</td>
                  <td className="px-5 py-4 font-medium">{formatMoney(Number(order.totalAmount), order.currency)}</td>
                  <td className="px-5 py-4">{order.status}</td>
                  <td className="px-5 py-4">{order.paymentMethod}</td>
                  <td className="px-5 py-4 text-slate-500">{order.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="p-10 text-center text-sm text-slate-500">No orders match this filter. Share your storefront link to start selling.</div>}
        </div>
      </Card>
    </div>
  );
}
