import { ensureUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { OrdersTable } from "@/components/dashboard/OrdersTable";

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
        <p className="mt-2 text-sm text-slate-500">Review customer delivery details, payments, and order status.</p>
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
        <OrdersTable
          orders={orders.map((order) => ({
            id: order.id,
            buyerName: order.buyerName,
            buyerPhone: order.buyerPhone,
            buyerEmail: order.buyerEmail,
            buyerAddress: order.buyerAddress,
            deliveryNote: order.deliveryNote,
            locationLat: order.locationLat,
            locationLng: order.locationLng,
            totalAmount: Number(order.totalAmount),
            currency: order.currency,
            status: order.status,
            paymentMethod: order.paymentMethod,
            paymentRef: order.paymentRef,
            createdAt: order.createdAt.toISOString(),
            items: order.items.map((item) => ({
              id: item.id,
              quantity: item.quantity,
              unitPrice: Number(item.unitPrice),
              productName: item.product.name,
              variantLabel: item.variant?.label || null,
              variantValue: item.variant?.value || null,
            })),
          }))}
        />
      </Card>
    </div>
  );
}
