import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export default async function OrderSuccessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Icon name="check" className="mx-auto h-14 w-14 text-[#0f6b3a]" />
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">Order received</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your order was recorded successfully. The store owner will contact you with the next steps.
        </p>
        <Button asChild className="mt-6 bg-[#0f6b3a] hover:bg-[#0b542d]">
          <Link href={`/store/${slug}`}>Back to store</Link>
        </Button>
      </div>
    </main>
  );
}
