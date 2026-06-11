import { ProductForm } from "@/components/dashboard/ProductForm";
import { Card } from "@/components/ui/Card";

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6b3a]">Inventory</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Add product</h1>
      </div>
      <Card>
        <ProductForm />
      </Card>
    </div>
  );
}
