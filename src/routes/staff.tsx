import { createFileRoute } from "@tanstack/react-router";
import { ORDERS_BY_STATUS, PRESCRIPTIONS, PHARMACISTS, ASSISTANTS, PRODUCTS_ALL } from "@/lib/demo-data";
import { FileText, Package, Truck, AlertTriangle, MessageCircle, Star } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";

export const Route = createFileRoute("/staff")({
  head: () => ({ meta: [{ title: "Pharmacy Staff Portal — Kings Pharmacy" }] }),
  component: () => <AuthGuard role="staff"><Staff /></AuthGuard>,
});

function Staff() {
  const pending = PRESCRIPTIONS.filter((p) => p.status === "Pending Review");
  const newOrders = [...ORDERS_BY_STATUS["Pending"], ...ORDERS_BY_STATUS["Awaiting Review"]].slice(0, 8);
  const dispatch = [...ORDERS_BY_STATUS["Packed"], ...ORDERS_BY_STATUS["Approved"]].slice(0, 6);
  const lowStock = PRODUCTS_ALL.filter((p) => p.stock === "low" || p.stock === "out").slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-6">
      <header>
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#1E5BC6]">Pharmacy Staff Portal</div>
        <h1 className="text-2xl md:text-3xl font-black text-[#1B3A6B]">Today at the Counter</h1>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={FileText} label="Pending Rx" value={pending.length} tone="amber" />
        <StatCard icon={Package} label="New Orders" value={newOrders.length} tone="blue" />
        <StatCard icon={Truck} label="Awaiting Dispatch" value={dispatch.length} tone="purple" />
        <StatCard icon={AlertTriangle} label="Low Stock" value={lowStock.length} tone="red" />
      </div>

      <section className="grid lg:grid-cols-2 gap-6">
        <Card title="Pending Prescriptions" subtitle="Verify and approve">
          {pending.slice(0, 6).map((p) => (
            <Row key={p.id}>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-[#1B3A6B] truncate">{p.medication}</div>
                <div className="text-xs text-slate-500 truncate">{p.customer.name} · {p.doctor}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600">Approve</button>
                <button className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200">Review</button>
              </div>
            </Row>
          ))}
        </Card>

        <Card title="New Orders Queue" subtitle="Awaiting pharmacist action">
          {newOrders.map((o) => (
            <Row key={o.id}>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs text-slate-500">{o.id}</div>
                <div className="font-bold text-sm text-[#1B3A6B] truncate">{o.customer.name} — ${o.total.toFixed(2)}</div>
                <div className="text-xs text-slate-500">{o.items.length} items · {o.payment}</div>
              </div>
              <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 shrink-0">{o.status}</span>
            </Row>
          ))}
        </Card>

        <Card title="Awaiting Dispatch" subtitle="Ready for driver pickup">
          {dispatch.map((o) => (
            <Row key={o.id}>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs text-slate-500">{o.id}</div>
                <div className="font-bold text-sm text-[#1B3A6B] truncate">{o.customer.name}</div>
                <div className="text-xs text-slate-500 truncate">{o.customer.address}</div>
              </div>
              <button className="px-3 py-1.5 rounded-full bg-[#1E5BC6] text-white text-xs font-bold shrink-0">Assign Driver</button>
            </Row>
          ))}
        </Card>

        <Card title="Inventory Alerts" subtitle="Low or out of stock">
          {lowStock.map((p) => (
            <Row key={p.id}>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-[#1B3A6B] truncate">{p.name}</div>
                <div className="text-xs text-slate-500 truncate">{p.category} · {p.brand}</div>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold shrink-0 ${p.stock === "out" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                {p.stock === "out" ? "Out" : `Only ${p.stockCount} left`}
              </span>
            </Row>
          ))}
        </Card>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <Card title="Pharmacists On Duty">
          {PHARMACISTS.map((p) => (
            <Row key={p.id}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-full bg-[#EAF3FF] flex items-center justify-center text-lg shrink-0">{p.avatar}</div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-[#1B3A6B] truncate">{p.name}</div>
                  <div className="text-xs text-slate-500 truncate">{(p as any).role} · {(p as any).shift}</div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-slate-500">{(p as any).ordersHandled} orders</div>
                <div className="text-xs text-amber-500 font-bold flex items-center gap-0.5 justify-end"><Star size={11} fill="currentColor" /> {p.rating}</div>
              </div>
            </Row>
          ))}
        </Card>
        <Card title="Pharmacy Assistants">
          {ASSISTANTS.map((p) => (
            <Row key={p.id}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-full bg-[#EAF3FF] flex items-center justify-center text-lg shrink-0">{p.avatar}</div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-[#1B3A6B] truncate">{p.name}</div>
                  <div className="text-xs text-slate-500 truncate">{(p as any).shift}</div>
                </div>
              </div>
              <button className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center shrink-0"><MessageCircle size={14} /></button>
            </Row>
          ))}
        </Card>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone }: any) {
  const toneMap: Record<string, string> = {
    blue: "from-[#1E5BC6] to-[#1B3A6B]",
    amber: "from-[#C47B10] to-[#8B5403]",
    purple: "from-[#6D28D9] to-[#4C1D95]",
    red: "from-[#C0392B] to-[#7E2118]",
  };
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${toneMap[tone]} text-white flex items-center justify-center`}>
        <Icon size={18} />
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</div>
        <div className="text-2xl font-black text-[#1B3A6B] leading-none mt-0.5">{value}</div>
      </div>
    </div>
  );
}
function Card({ title, subtitle, children }: any) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="font-black text-[#1B3A6B]">{title}</div>
        {subtitle && <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>}
      </div>
      <div className="divide-y divide-slate-100">{children}</div>
    </div>
  );
}
function Row({ children }: any) {
  return <div className="px-5 py-3 flex items-center gap-3">{children}</div>;
}
