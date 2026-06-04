import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Package, FileText, MapPin, CreditCard, Heart, Bell, Settings, LogOut } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/account")({
  component: () => <AuthGuard role="customer"><Account /></AuthGuard>,
});

function Account() {
  const [refills, setRefills] = useState({ metformin: true, vitc: false });
  const user = useAuth((s) => s.user)!;
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();
  const initials = user.avatar || (user.firstName[0] + user.lastName[0]).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-5">
      {/* Profile header */}
      <div className="bg-white rounded-2xl p-5 flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#1E5BC6] to-[#1B3A6B] flex items-center justify-center text-white text-2xl font-black">{initials}</div>
        <div className="flex-1">
          <div className="font-black text-xl text-[#1B3A6B]">{user.firstName} {user.lastName}</div>
          <div className="text-xs text-muted-foreground">Member since 2024 · {user.email}</div>
        </div>
      </div>

      {/* Rewards */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1B3A6B] via-[#1E5BC6] to-[#1B3A6B] p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -top-6 text-8xl opacity-20">👑</div>
        <div className="text-xs font-bold uppercase tracking-widest opacity-80">Kings Rewards</div>
        <div className="flex items-baseline gap-2 mt-2">
          <div className="text-4xl font-black">1,240</div>
          <div className="text-sm opacity-80">points</div>
        </div>
        <div className="mt-2 inline-flex items-center gap-1 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">🥇 Gold Member</div>
        <div className="mt-4 text-xs opacity-80">760 pts to Platinum</div>
        <div className="h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden"><div className="h-full bg-white rounded-full" style={{ width: "62%" }} /></div>
      </div>

      {/* Orders */}
      <Section title="My Orders" icon={Package}>
        {[
          { id: "KP-2026-00847", date: "Today", total: "$26.30", status: "Out for Delivery", color: "#1E5BC6" },
          { id: "KP-2026-00712", date: "Mar 28", total: "$18.50", status: "Delivered", color: "#1A7A4A" },
          { id: "KP-2026-00644", date: "Mar 14", total: "$42.10", status: "Delivered", color: "#1A7A4A" },
        ].map((o) => (
          <Row key={o.id}>
            <div>
              <div className="font-bold text-sm text-[#1B3A6B]">#{o.id}</div>
              <div className="text-xs text-muted-foreground">{o.date} · {o.total}</div>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full text-white" style={{ background: o.color }}>{o.status}</span>
          </Row>
        ))}
      </Section>

      <Section title="My Prescriptions" icon={FileText}>
        {[
          { name: "Amoxicillin 250mg", date: "Today, 10:42", status: "Under Review 🔄", color: "#C47B10" },
          { name: "Metformin 500mg", date: "Mar 12", status: "Approved ✅", color: "#1A7A4A" },
        ].map((p) => (
          <Row key={p.name}>
            <div>
              <div className="font-bold text-sm text-[#1B3A6B]">{p.name}</div>
              <div className="text-xs text-muted-foreground">Uploaded {p.date}</div>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full text-white" style={{ background: p.color }}>{p.status}</span>
          </Row>
        ))}
      </Section>

      <Section title="Health Profile" icon={Heart}>
        <Row><div><div className="text-xs text-muted-foreground">Allergies</div><div className="font-bold text-sm text-[#1B3A6B]">Penicillin</div></div></Row>
        <Row><div><div className="text-xs text-muted-foreground">Chronic Medications</div><div className="font-bold text-sm text-[#1B3A6B]">Metformin 500mg (2× daily)</div></div></Row>
      </Section>

      <Section title="Refill Reminders" icon={Bell}>
        <Row>
          <div><div className="font-bold text-sm text-[#1B3A6B]">Metformin 500mg</div><div className="text-xs text-muted-foreground">Every 30 days</div></div>
          <Toggle on={refills.metformin} onChange={(v) => setRefills({ ...refills, metformin: v })} />
        </Row>
        <Row>
          <div><div className="font-bold text-sm text-[#1B3A6B]">Vitamin C 1000mg</div><div className="text-xs text-muted-foreground">Every 60 days</div></div>
          <Toggle on={refills.vitc} onChange={(v) => setRefills({ ...refills, vitc: v })} />
        </Row>
      </Section>

      <Section title="More" icon={Settings}>
        <LinkRow icon={MapPin} label="Saved Addresses" sub="2 saved" />
        <LinkRow icon={CreditCard} label="Payment Methods" sub="EcoCash, Visa •• 4242" />
        <LinkRow icon={Settings} label="Settings & Notifications" />
      </Section>

      <button
        onClick={() => { logout(); navigate({ to: "/login" }); }}
        className="w-full bg-white rounded-2xl py-4 font-bold text-[#C0392B] flex items-center justify-center gap-2 hover:bg-red-50 transition"
      >
        <LogOut className="h-4 w-4" /> Log Out
      </button>
    </div>
  );
}

function Section({ title, icon: Icon, children }: any) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="px-5 py-3 flex items-center gap-2 border-b border-border">
        <Icon className="h-4 w-4 text-[#1E5BC6]" />
        <div className="font-black text-sm text-[#1B3A6B]">{title}</div>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}
function Row({ children }: any) {
  return <div className="px-5 py-3 flex items-center justify-between gap-3">{children}</div>;
}
function LinkRow({ icon: Icon, label, sub }: any) {
  return (
    <Row>
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <div><div className="font-bold text-sm text-[#1B3A6B]">{label}</div>{sub && <div className="text-xs text-muted-foreground">{sub}</div>}</div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Row>
  );
}
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={`h-7 w-12 rounded-full transition relative ${on ? "bg-[#1A7A4A]" : "bg-slate-300"}`}>
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}
