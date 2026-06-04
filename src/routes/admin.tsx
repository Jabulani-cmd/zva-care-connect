import { createFileRoute } from "@tanstack/react-router";
import { KPIS, ORDERS, ORDERS_BY_STATUS } from "@/lib/demo-data";
import { DollarSign, ShoppingBag, Users, Truck, TrendingUp, Package } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Kings Pharmacy" }] }),
  component: () => <AuthGuard role="admin"><Admin /></AuthGuard>,
});

const fmt = (n: number) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toLocaleString()}`;

function KPI({ label, value, sub, icon: Icon, tone = "blue" }: any) {
  const toneMap: Record<string, string> = {
    blue: "from-[#1E5BC6] to-[#1B3A6B]",
    green: "from-[#1A7A4A] to-[#0F5C36]",
    amber: "from-[#C47B10] to-[#8B5403]",
    purple: "from-[#6D28D9] to-[#4C1D95]",
  };
  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</div>
          <div className="text-2xl md:text-3xl font-black text-[#1B3A6B] mt-1.5">{value}</div>
          {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
        </div>
        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${toneMap[tone]} text-white flex items-center justify-center shadow`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function Admin() {
  const recent = ORDERS.slice(0, 8);
  const max = Math.max(...KPIS.revenueTrend.map((r) => r.value));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-6">
      <header>
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#1E5BC6]">Admin Portal</div>
        <h1 className="text-2xl md:text-3xl font-black text-[#1B3A6B]">Executive Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time overview of pharmacy operations</p>
      </header>

      {/* Sales KPIs */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Sales Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <KPI label="Today" value={fmt(KPIS.sales.today)} sub="+12% vs yesterday" icon={DollarSign} tone="green" />
          <KPI label="This Week" value={fmt(KPIS.sales.week)} sub="+8% vs last week" icon={DollarSign} tone="blue" />
          <KPI label="This Month" value={fmt(KPIS.sales.month)} sub="+18% vs last month" icon={DollarSign} tone="purple" />
          <KPI label="This Year" value={fmt(KPIS.sales.year)} sub="On track for $1.5M" icon={TrendingUp} tone="amber" />
        </div>
      </section>

      {/* Orders + Customers */}
      <section className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Orders</h2>
          <div className="grid grid-cols-2 gap-3">
            <KPI label="Total" value={KPIS.orders.total.toLocaleString()} icon={ShoppingBag} tone="blue" />
            <KPI label="Completed" value={KPIS.orders.completed.toLocaleString()} icon={Package} tone="green" />
            <KPI label="Pending" value={KPIS.orders.pending} icon={ShoppingBag} tone="amber" />
            <KPI label="Cancelled" value={KPIS.orders.cancelled} icon={ShoppingBag} tone="purple" />
          </div>
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Customers & Delivery</h2>
          <div className="grid grid-cols-2 gap-3">
            <KPI label="Registered" value={KPIS.customers.registered.toLocaleString()} icon={Users} tone="blue" />
            <KPI label="Active" value={KPIS.customers.active.toLocaleString()} icon={Users} tone="green" />
            <KPI label="On-Time" value={`${KPIS.delivery.onTimePct}%`} sub="Last 30 days" icon={Truck} tone="green" />
            <KPI label="Avg Delivery" value={`${KPIS.delivery.avgMinutes}m`} sub={`Satisfaction ${KPIS.delivery.satisfaction}/5`} icon={Truck} tone="purple" />
          </div>
        </div>
      </section>

      {/* Revenue trend */}
      <section className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-black text-[#1B3A6B]">Revenue Trend (12 mo)</h2>
          <span className="text-xs text-slate-500">Last updated just now</span>
        </div>
        <div className="flex items-end gap-2 h-40">
          {KPIS.revenueTrend.map((r) => (
            <div key={r.month} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-[#1E5BC6] to-[#5B8DEF] transition-all hover:from-[#1B3A6B]"
                style={{ height: `${(r.value / max) * 100}%` }}
                title={fmt(r.value)}
              />
              <span className="text-[10px] font-semibold text-slate-500">{r.month}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Top products + Status breakdown */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <h2 className="text-lg font-black text-[#1B3A6B] mb-4">Top Products</h2>
          <ul className="space-y-3">
            {KPIS.topProducts.map((p, i) => {
              const max = KPIS.topProducts[0].units;
              return (
                <li key={p.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-semibold text-[#1B3A6B]">{i + 1}. {p.name}</span>
                    <span className="text-slate-500 tabular-nums">{p.units.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#1E5BC6] to-[#5B8DEF]" style={{ width: `${(p.units / max) * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <h2 className="text-lg font-black text-[#1B3A6B] mb-4">Orders by Status</h2>
          <ul className="space-y-2.5">
            {(Object.keys(ORDERS_BY_STATUS) as (keyof typeof ORDERS_BY_STATUS)[]).map((s) => (
              <li key={s} className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-700">{s}</span>
                <span className="tabular-nums font-bold text-[#1B3A6B]">{ORDERS_BY_STATUS[s].length}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recent orders table */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-black text-[#1B3A6B]">Recent Orders</h2>
          <span className="text-xs text-slate-500">{ORDERS.length.toLocaleString()} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="text-left px-4 py-3 font-bold">Order #</th>
                <th className="text-left px-4 py-3 font-bold">Customer</th>
                <th className="text-left px-4 py-3 font-bold">Pharmacist</th>
                <th className="text-left px-4 py-3 font-bold">Driver</th>
                <th className="text-left px-4 py-3 font-bold">Status</th>
                <th className="text-right px-4 py-3 font-bold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-[#1B3A6B]">{o.id}</td>
                  <td className="px-4 py-3">{o.customer.name}</td>
                  <td className="px-4 py-3 text-slate-600">{o.pharmacist.name}</td>
                  <td className="px-4 py-3 text-slate-600">{o.driver?.name ?? "—"}</td>
                  <td className="px-4 py-3"><StatusPill s={o.status} /></td>
                  <td className="px-4 py-3 text-right font-bold tabular-nums">${o.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatusPill({ s }: { s: string }) {
  const map: Record<string, string> = {
    "Delivered": "bg-emerald-100 text-emerald-700",
    "Out for Delivery": "bg-blue-100 text-blue-700",
    "Driver Assigned": "bg-indigo-100 text-indigo-700",
    "Packed": "bg-cyan-100 text-cyan-700",
    "Approved": "bg-teal-100 text-teal-700",
    "Awaiting Review": "bg-amber-100 text-amber-700",
    "Pending": "bg-yellow-100 text-yellow-700",
    "Cancelled": "bg-red-100 text-red-700",
  };
  return <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${map[s] ?? "bg-slate-100 text-slate-700"}`}>{s}</span>;
}
