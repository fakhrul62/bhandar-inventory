import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { StorefrontClient } from "@/components/store/StorefrontClient";

export default async function PublicStorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await prisma.store.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isPublished: true },
        include: { variants: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!store || !store.isPublic) notFound();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-[#0f6b3a] text-2xl font-semibold text-white">
              {store.logoUrl ? <Image src={store.logoUrl} alt={store.name} fill className="object-cover" /> : store.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-[var(--font-hind-siliguri)] text-sm text-[#0f6b3a]">ভান্ডার স্টোর</p>
              <h1 className="mt-1 text-4xl font-semibold tracking-tight text-slate-950">{store.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{store.description}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StorefrontClient
          storeId={store.id}
          products={store.products.map((product) => ({
            ...product,
            price: Number(product.price),
            variants: product.variants.map((variant) => ({
              ...variant,
              additionalPrice: Number(variant.additionalPrice),
            })),
          }))}
        />
      </section>
    </main>
  );
}
