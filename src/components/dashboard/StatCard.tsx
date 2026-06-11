import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0f6b3a]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-[#0f6b3a]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-sm text-slate-500">{helper}</p>
    </Card>
  );
}
