import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

export default async function AdminPage() {
  await requireAdmin();
  const users = await prisma.user.findMany({ include: { plan: true, stores: true }, orderBy: { createdAt: "desc" } });
  const revenue = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: { status: "PAID", currency: "BDT" },
  });

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6b3a]">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Platform overview</h1>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-slate-500">Users</p><p className="mt-2 text-3xl font-semibold">{users.length}</p></Card>
        <Card><p className="text-sm text-slate-500">Stores</p><p className="mt-2 text-3xl font-semibold">{users.reduce((sum, user) => sum + user.stores.length, 0)}</p></Card>
        <Card><p className="text-sm text-slate-500">BDT revenue</p><p className="mt-2 text-3xl font-semibold">{formatMoney(Number(revenue._sum.totalAmount || 0), "BDT")}</p></Card>
      </div>
      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
              <tr><th className="px-5 py-4">User</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Plan</th><th className="px-5 py-4">Stores</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id}><td className="px-5 py-4">{user.email}</td><td className="px-5 py-4">{user.role}</td><td className="px-5 py-4">{user.plan.name}</td><td className="px-5 py-4">{user.stores.length}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
