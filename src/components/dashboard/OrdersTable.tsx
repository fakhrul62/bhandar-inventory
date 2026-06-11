"use client";

import { useActionState, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Eye, Loader2, Pencil, Trash2, X } from "lucide-react";
import { deleteOrderAction, updateOrderAction } from "@/actions/orders";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatMoney } from "@/lib/utils";

const initialOrderState: { error?: string; success?: string } = {};

type OrderRow = {
  id: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerAddress: string;
  deliveryNote: string | null;
  locationLat: number | null;
  locationLng: number | null;
  totalAmount: number;
  currency: "BDT" | "USD";
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  paymentMethod: "STRIPE" | "BKASH" | "NAGAD" | "DEV_MOBILE";
  paymentRef: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    productName: string;
    variantLabel: string | null;
    variantValue: string | null;
  }>;
};

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [editingOrder, setEditingOrder] = useState<OrderRow | null>(null);
  const [state, formAction, pending] = useActionState(updateOrderAction, initialOrderState);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-5 py-4 font-medium">Customer name</th>
              <th className="px-5 py-4 font-medium">Phone number</th>
              <th className="px-5 py-4 font-medium">Email</th>
              <th className="px-5 py-4 font-medium">Order date</th>
              <th className="px-5 py-4 font-medium">Payment via</th>
              <th className="px-5 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-950">{order.buyerName}</p>
                  <p className="text-xs text-slate-500">{order.status} · {formatMoney(order.totalAmount, order.currency)}</p>
                </td>
                <td className="px-5 py-4">{order.buyerPhone}</td>
                <td className="px-5 py-4">{order.buyerEmail}</td>
                <td className="px-5 py-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString("en-BD")}</td>
                <td className="px-5 py-4">{order.paymentMethod.replace("_", " ")}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="icon" aria-label="View order" onClick={() => setSelectedOrder(order)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="icon" aria-label="Edit order" onClick={() => setEditingOrder(order)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <form
                      action={deleteOrderAction}
                      onSubmit={(event) => {
                        if (!window.confirm(`Delete order from ${order.buyerName}? This cannot be undone.`)) {
                          event.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={order.id} />
                      <Button type="submit" variant="destructive" size="icon" aria-label="Delete order">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-10 text-center">
            <p className="font-semibold text-slate-950">No orders match this filter.</p>
            <p className="mt-1 text-sm text-slate-500">Share your storefront link to start selling.</p>
          </div>
        )}
      </div>

      <Dialog.Root open={Boolean(selectedOrder)} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-2xl outline-none">
            {selectedOrder && (
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Dialog.Title className="text-2xl font-semibold text-slate-950">Order details</Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-slate-500">
                      {selectedOrder.buyerName} · {new Date(selectedOrder.createdAt).toLocaleString("en-BD")}
                    </Dialog.Description>
                  </div>
                  <Dialog.Close className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100">
                    <X className="h-5 w-5" />
                  </Dialog.Close>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Detail label="Phone" value={selectedOrder.buyerPhone} />
                  <Detail label="Email" value={selectedOrder.buyerEmail} />
                  <Detail label="Payment" value={`${selectedOrder.paymentMethod.replace("_", " ")} · ${selectedOrder.status}`} />
                  <Detail label="Total" value={formatMoney(selectedOrder.totalAmount, selectedOrder.currency)} />
                </div>

                <div className="mt-5 rounded-lg border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Delivery address</p>
                  <p className="mt-2 whitespace-pre-line text-sm text-slate-800">{selectedOrder.buyerAddress}</p>
                  {selectedOrder.deliveryNote && <p className="mt-2 text-sm text-slate-500">Note: {selectedOrder.deliveryNote}</p>}
                  {selectedOrder.locationLat != null && selectedOrder.locationLng != null && (
                    <a
                      className="mt-3 inline-flex text-sm font-medium text-[#0f6b3a] hover:underline"
                      href={`https://www.google.com/maps?q=${selectedOrder.locationLat},${selectedOrder.locationLng}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open customer location
                    </a>
                  )}
                </div>

                <div className="mt-5 rounded-lg border border-slate-200">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 last:border-b-0">
                      <div>
                        <p className="font-medium text-slate-950">{item.productName}</p>
                        {item.variantLabel && <p className="text-xs text-slate-500">{item.variantLabel}: {item.variantValue}</p>}
                      </div>
                      <p className="text-sm text-slate-600">{item.quantity} x {formatMoney(item.unitPrice, selectedOrder.currency)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={Boolean(editingOrder)} onOpenChange={(open) => !open && setEditingOrder(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-6 shadow-2xl outline-none">
            {editingOrder && (
              <form action={formAction} className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Dialog.Title className="text-xl font-semibold text-slate-950">Edit order</Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-slate-500">{editingOrder.buyerName}</Dialog.Description>
                  </div>
                  <Dialog.Close className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100">
                    <X className="h-5 w-5" />
                  </Dialog.Close>
                </div>
                {state.error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>}
                {state.success && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{state.success}</div>}
                <input type="hidden" name="id" value={editingOrder.id} />
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-800">Status</span>
                  <select name="status" defaultValue={editingOrder.status} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm">
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="FAILED">Failed</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </label>
                <Input label="Payment reference" name="paymentRef" defaultValue={editingOrder.paymentRef || ""} />
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-800">Delivery note</span>
                  <textarea name="deliveryNote" defaultValue={editingOrder.deliveryNote || ""} rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
                </label>
                <Button disabled={pending} className="w-full bg-[#0f6b3a] hover:bg-[#0b542d]">
                  {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save order
                </Button>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 font-medium text-slate-950">{value}</p>
    </div>
  );
}
