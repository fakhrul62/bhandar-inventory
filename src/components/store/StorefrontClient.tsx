"use client";

import { useActionState, useMemo, useState } from "react";
import Image from "next/image";
import { Loader2, ShoppingCart, Trash2 } from "lucide-react";
import { createCheckoutAction } from "@/actions/orders";
import { useCartStore } from "@/stores/cart";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Product = {
  id: string;
  name: string;
  description: string | null;
  type: "PHYSICAL" | "DIGITAL";
  price: string | number;
  currency: "BDT" | "USD";
  imageUrls: string[];
  variants: Array<{ id: string; label: string; value: string; additionalPrice: string | number }>;
};

export function StorefrontClient({ storeId, products }: { storeId: string; products: Product[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [state, formAction, pending] = useActionState(createCheckoutAction, { error: undefined } as { error?: string });
  const { items, addItem, removeItem, setQuantity } = useCartStore();
  const filtered = products.filter((product) => {
    const matchQuery = product.name.toLowerCase().includes(query.toLowerCase());
    const matchType = type ? product.type === type : true;
    return matchQuery && matchType;
  });
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const currency = items[0]?.currency || "BDT";

  const cartPayload = useMemo(
    () => JSON.stringify(items.map((item) => ({ productId: item.productId, variantId: item.variantId, quantity: item.quantity }))),
    [items],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />
          <select value={type} onChange={(event) => setType(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm">
            <option value="">All products</option>
            <option value="PHYSICAL">Physical</option>
            <option value="DIGITAL">Digital</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <ShoppingCart className="mx-auto h-10 w-10 text-slate-300" />
            <h2 className="mt-3 font-semibold">No products found</h2>
            <p className="mt-1 text-sm text-slate-500">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => {
              const variant = product.variants[0];
              const price = Number(product.price) + Number(variant?.additionalPrice || 0);
              return (
                <article key={product.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#0f6b3a]">
                  <div className="relative aspect-[4/3] bg-slate-100">
                    {product.imageUrls[0] ? (
                      <Image src={product.imageUrls[0]} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">No image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-950">{product.name}</h3>
                        <p className="mt-1 text-xs text-slate-500">{product.type}</p>
                      </div>
                      <p className="font-semibold text-[#0f6b3a]">{formatMoney(price, product.currency)}</p>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-slate-500">{product.description}</p>
                    <Button
                      className="mt-4 w-full bg-[#0f6b3a] hover:bg-[#0b542d]"
                      onClick={() =>
                        addItem({
                          productId: product.id,
                          variantId: variant?.id,
                          name: product.name,
                          imageUrl: product.imageUrls[0],
                          quantity: 1,
                          unitPrice: price,
                          currency: product.currency,
                        })
                      }
                    >
                      Add to cart
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Cart</h2>
          <span className="text-sm text-slate-500">{items.length} items</span>
        </div>

        <div className="mt-5 space-y-3">
          {items.length === 0 ? (
            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">Your cart is empty. Add a product to checkout.</p>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.variantId || ""}`} className="flex gap-3 rounded-lg border border-slate-200 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.name}</p>
                  <p className="text-sm text-slate-500">{formatMoney(item.unitPrice, item.currency)}</p>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => setQuantity(item.productId, Number(event.target.value), item.variantId)}
                    className="mt-2 w-20 rounded border border-slate-300 px-2 py-1 text-sm"
                  />
                </div>
                <button className="text-slate-400 hover:text-red-600" onClick={() => removeItem(item.productId, item.variantId)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <form action={formAction} className="mt-6 space-y-3">
          {state.error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>}
          <input type="hidden" name="storeId" value={storeId} />
          <input type="hidden" name="items" value={cartPayload} />
          <Input name="buyerName" placeholder="Your name" required />
          <Input name="buyerEmail" type="email" placeholder="Email" required />
          <Input name="buyerPhone" placeholder="Phone" required />
          <select name="paymentMethod" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm">
            <option value="STRIPE">Card payment</option>
            <option value="DEV_MOBILE">Dev mobile payment</option>
          </select>
          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <span className="font-medium">Total</span>
            <span className="text-xl font-semibold text-[#0f6b3a]">{formatMoney(total, currency)}</span>
          </div>
          <Button disabled={pending || items.length === 0} className="w-full bg-[#0f6b3a] hover:bg-[#0b542d]">
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Checkout
          </Button>
        </form>
      </aside>
    </div>
  );
}
