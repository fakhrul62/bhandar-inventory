import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - SaaS Dashboard",
  description: "Sign in or create your account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 px-4 py-8 text-slate-950">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[1fr_0.92fr]">
        <section className="relative hidden border-r border-slate-200 bg-[#0f6b3a] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="relative">
            <div className="mb-16 inline-flex items-center gap-3 rounded-full border border-white/20 px-3 py-2 text-sm text-emerald-50">
              <span className="h-2 w-2 rounded-full bg-[#f5a623]" />
              Inventory, sales, and storefront
            </div>
            <h1 className="max-w-xl text-5xl font-semibold leading-tight tracking-tight">
              Bhandar helps Bangladeshi shops sell with less chaos.
            </h1>
          </div>
          <div className="relative grid grid-cols-3 gap-3">
            {["Products", "Orders", "Stock"].map((item, index) => (
              <div
                key={item}
                className="animate-fade-up rounded-lg border border-white/10 bg-white/5 p-4"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">{item}</p>
                <p className="mt-4 text-2xl font-semibold">{index === 0 ? "50" : index === 1 ? "24/7" : "Live"}</p>
              </div>
            ))}
          </div>
        </section>
        <main className="flex items-center justify-center px-5 py-10 sm:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
