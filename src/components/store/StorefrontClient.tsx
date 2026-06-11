"use client";

import { useActionState, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, Package, ShoppingCart, Trash2, X } from "lucide-react";
import { createCheckoutAction } from "@/actions/orders";
import { useCartStore } from "@/stores/cart";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SafeImage } from "@/components/ui/SafeImage";

type Product = {
  id: string;
  name: string;
  description: string | null;
  type: "PHYSICAL" | "DIGITAL";
  price: string | number;
  currency: "BDT" | "USD";
  stock: number | null;
  imageUrls: string[];
  variants: Array<{ id: string; label: string; value: string; additionalPrice: string | number; stock?: number | null }>;
};

function shortDescription(description: string | null) {
  if (!description) return "View product details, options, stock, and checkout information.";
  const sentence = description.split(/[.!?]/)[0]?.trim();
  const words = (sentence || description).split(/\s+/).filter(Boolean);
  return words.length > 16 ? `${words.slice(0, 16).join(" ")}...` : words.join(" ");
}

export function StorefrontClient({ storeId, products }: { storeId: string; products: Product[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [state, formAction, pending] = useActionState(createCheckoutAction, { error: undefined } as { error?: string });
  const { items, hydrated, addItem, removeItem, setQuantity } = useCartStore();
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

  function addProductToCart(product: Product, variantId?: string) {
    const variant = variantId
      ? product.variants.find((entry) => entry.id === variantId)
      : product.variants[0];
    const price = Number(product.price) + Number(variant?.additionalPrice || 0);

    addItem({
      productId: product.id,
      variantId: variant?.id,
      name: product.name,
      imageUrl: product.imageUrls[0],
      quantity: 1,
      unitPrice: price,
      currency: product.currency,
    });
  }

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
                  <button
                    type="button"
                    className="block w-full cursor-pointer text-left"
                    onClick={() => {
                      setSelectedProduct(product);
                      setSelectedVariantId(product.variants[0]?.id || "");
                    }}
                  >
                    <div className="relative aspect-[4/3] bg-slate-100">
                      <SafeImage
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        fallback={<div className="flex h-full items-center justify-center text-sm text-slate-400">No image</div>}
                      />
                    </div>
                  </button>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <button
                          type="button"
                          className="cursor-pointer text-left font-semibold text-slate-950 transition hover:text-[#0f6b3a]"
                          onClick={() => {
                            setSelectedProduct(product);
                            setSelectedVariantId(product.variants[0]?.id || "");
                          }}
                        >
                          {product.name}
                        </button>
                        <p className="mt-1 text-xs text-slate-500">{product.type}</p>
                      </div>
                      <p className="font-semibold text-[#0f6b3a]">{formatMoney(price, product.currency)}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{shortDescription(product.description)}</p>
                    <Button
                      type="button"
                      className="mt-4 w-full bg-[#0f6b3a] hover:bg-[#0b542d]"
                      onClick={() => addProductToCart(product, variant?.id)}
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
          {!hydrated ? (
            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">Restoring your cart...</p>
          ) : items.length === 0 ? (
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
          <Button disabled={pending || !hydrated || items.length === 0} className="w-full bg-[#0f6b3a] hover:bg-[#0b542d]">
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Checkout
          </Button>
        </form>
      </aside>

      <Dialog.Root open={Boolean(selectedProduct)} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm data-[state=open]:animate-fade-up" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100vw-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-0 shadow-2xl outline-none">
            {selectedProduct && (
              <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative min-h-72 bg-slate-100 lg:min-h-[520px]">
                  <SafeImage
                    src={selectedProduct.imageUrls[0]}
                    alt={selectedProduct.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    fallback={
                      <div className="flex h-full min-h-72 items-center justify-center text-slate-400">
                        <Package className="h-12 w-12" />
                      </div>
                    }
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Dialog.Title className="text-2xl font-semibold tracking-tight text-slate-950">
                        {selectedProduct.name}
                      </Dialog.Title>
                      <Dialog.Description className="mt-2 text-sm text-slate-500">
                        {selectedProduct.type} product
                      </Dialog.Description>
                    </div>
                    <Dialog.Close className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950">
                      <X className="h-5 w-5" />
                    </Dialog.Close>
                  </div>

                  <p className="mt-6 text-3xl font-semibold text-[#0f6b3a]">
                    {formatMoney(
                      Number(selectedProduct.price) +
                        Number(selectedProduct.variants.find((variant) => variant.id === selectedVariantId)?.additionalPrice || 0),
                      selectedProduct.currency,
                    )}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 p-4">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Stock</p>
                      <p className="mt-2 font-semibold text-slate-950">
                        {selectedProduct.type === "DIGITAL"
                          ? "Digital delivery"
                          : selectedProduct.stock ?? "Not tracked"}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-4">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Variants</p>
                      <p className="mt-2 font-semibold text-slate-950">{selectedProduct.variants.length || "None"}</p>
                    </div>
                  </div>

                  {selectedProduct.variants.length > 0 && (
                    <label className="mt-6 block space-y-1.5">
                      <span className="text-sm font-medium text-slate-800">Choose variant</span>
                      <select
                        value={selectedVariantId}
                        onChange={(event) => setSelectedVariantId(event.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-[#0f6b3a] focus:ring-2 focus:ring-[#f5a623]"
                      >
                        {selectedProduct.variants.map((variant) => (
                          <option key={variant.id} value={variant.id}>
                            {variant.label}: {variant.value}
                            {Number(variant.additionalPrice) > 0
                              ? ` (+${formatMoney(Number(variant.additionalPrice), selectedProduct.currency)})`
                              : ""}
                            {variant.stock != null ? ` - stock ${variant.stock}` : ""}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  <div className="mt-6">
                    <p className="text-sm font-medium text-slate-800">Description</p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                      {selectedProduct.description || "No description provided."}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="button"
                      className="flex-1 bg-[#0f6b3a] hover:bg-[#0b542d]"
                      onClick={() => addProductToCart(selectedProduct, selectedVariantId || undefined)}
                    >
                      Add to cart
                    </Button>
                    <Dialog.Close asChild>
                      <Button type="button" variant="outline" className="flex-1">
                        Continue shopping
                      </Button>
                    </Dialog.Close>
                  </div>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
