import { notFound } from "next/navigation";
import { ensureUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { Card } from "@/components/ui/Card";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await ensureUserRecord();
  const store = await prisma.store.findFirst({ where: { userId: user.id } });
  const product = store
    ? await prisma.product.findUnique({
        where: { id, storeId: store.id },
        include: { variants: true },
      })
    : null;

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6b3a]">Inventory</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Edit product</h1>
      </div>
      <Card>
        <ProductForm product={{ ...product, price: Number(product.price), variants: product.variants.map((variant) => ({ ...variant, additionalPrice: Number(variant.additionalPrice) })) }} />
      </Card>
    </div>
  );
}
