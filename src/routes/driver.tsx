import { createFileRoute } from "@tanstack/react-router";
import { DRIVERS, ORDERS_BY_STATUS, DRIVER_REVIEWS } from "@/lib/demo-data";
import { Truck, Clock, Star, MapPin, CheckCircle2 } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";

export const Route = createFileRoute("/driver")({
  head: () => ({ meta: [{ title: "Driver Portal — Kings Pharmacy" }] }),
  component: () => <AuthGuard role="driver"><Driver /></AuthGuard>,
});

function Driver() {
  const me = DRIVERS[0];
  const assigned = [...ORDERS_BY_STATUS["Driver Assigned"], ...ORDERS_BY_STATUS["Out for Delivery"]].slice(0, 6);
  const myReviews = DRIVER_REVIEWS.filter((r) => r.subjectId === me.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-6">
      <header className="bg-gradient-to-r from-[#1B3A6B] to-[#1E5BC6] rounded-2xl p-5 md:p-6 text-white flex items-center gap-4 shadow-xl">
        <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl shrink-0">{me.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-widest opacity-80">Driver Portal</div>
          <div className="text-xl md:text-2xl font-black truncate">{me.name}</div>
          <div className="text-xs opacity-80 truncate">{me.vehicle} · {me.phone}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 justify-end text-amber-300"><Star size={16} fill="currentColor" /><span className="font-black text-lg">{me.rating}</span></div>
          <div className="text-xs opacity-80">{me.deliveries} deliveries</div>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={Truck} label="Today" value={6} sub="deliveries" />
        <Stat icon={CheckCircle2} label="Completed" value={5} sub="on-time" />
        <Stat icon={Clock} label="Avg Time" value="32m" sub="per delivery" />
        <Stat icon={Star} label="Rating" value={`${me.rating}/5`} sub={`${me.onTimeRate}% on-time`} />
      </div>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100"><div className="font-black text-[#1B3A6B]">Assigned Deliveries</div></div>
          <ul className="divide-y divide-slate-100">
            {assigned.map((o) => (
              <li key={o.id} className="px-5 py-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#1B3A6B]">{o.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${o.status === "Out for Delivery" ? "bg-blue-100 text-blue-700" : "bg-indigo-100 text-indigo-700"}`}>{o.status}</span>
                  </div>
                  <div className="font-bold text-sm text-[#1B3A6B] mt-1">{o.customer.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={11} />{o.customer.address}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{o.items.length} items · ${o.total.toFixed(2)} · {o.payment}</div>
                </div>
                <div className="flex gap-2 md:flex-col md:items-end shrink-0">
                  <button className="px-4 py-2 rounded-full bg-[#1E5BC6] text-white text-xs font-bold whitespace-nowrap">Navigate</button>
                  <button className="px-4 py-2 rounded-full border-2 border-emerald-500 text-emerald-600 text-xs font-bold whitespace-nowrap">Mark Delivered</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="font-black text-[#1B3A6B] mb-3">Monthly Performance</div>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between"><span className="text-slate-500">Deliveries</span><span className="font-black tabular-nums">128</span></li>
              <li className="flex justify-between"><span className="text-slate-500">On-time</span><span className="font-black text-emerald-600 tabular-nums">{me.onTimeRate}%</span></li>
              <li className="flex justify-between"><span className="text-slate-500">Avg Rating</span><span className="font-black tabular-nums">{me.rating}/5</span></li>
              <li className="flex justify-between"><span className="text-slate-500">Earnings</span><span className="font-black tabular-nums">$642</span></li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="font-black text-[#1B3A6B] mb-3">Recent Reviews</div>
            <ul className="space-y-3">
              {myReviews.map((r) => (
                <li key={r.id} className="text-sm">
                  <div className="text-amber-400">{"★".repeat(r.stars)}<span className="text-slate-200">{"★".repeat(5 - r.stars)}</span></div>
                  <div className="text-slate-700 italic">"{r.text}"</div>
                  <div className="text-xs text-slate-400 mt-0.5">— {r.author}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100"><div className="font-black text-[#1B3A6B]">All Drivers</div></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr><th className="text-left px-4 py-3 font-bold">Driver</th><th className="text-left px-4 py-3 font-bold">Vehicle</th><th className="text-right px-4 py-3 font-bold">Deliveries</th><th className="text-right px-4 py-3 font-bold">On-Time</th><th className="text-right px-4 py-3 font-bold">Rating</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DRIVERS.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><span className="text-xl">{d.avatar}</span><span className="font-bold text-[#1B3A6B]">{d.name}</span></div></td>
                  <td className="px-4 py-3 text-slate-600">{d.vehicle}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{d.deliveries}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{d.onTimeRate}%</td>
                  <td className="px-4 py-3 text-right font-bold text-amber-500 tabular-nums">★ {d.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub }: any) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#1E5BC6] to-[#1B3A6B] text-white flex items-center justify-center"><Icon size={18} /></div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</div>
        <div className="text-xl font-black text-[#1B3A6B] leading-none mt-0.5">{value}</div>
        <div className="text-[11px] text-slate-500">{sub}</div>
      </div>
    </div>
  );
}
