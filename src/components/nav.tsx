import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Home, ShoppingCart, MapPin, User, Store, Search, LogOut, ChevronDown, Truck, Building2, Check, Phone, Clock } from "lucide-react";
import { useStore, cartCount } from "@/lib/store";
import { useAuth, ROLE_HOME, type Role } from "@/lib/auth";
import { useBranch, getBranch, BRANCHES } from "@/lib/branches";
import { Logo } from "./logo";
import { NotificationBell } from "./notification-bell";
import { useState, useRef, useEffect } from "react";

function BranchChip({ compact = false }: { compact?: boolean }) {
  const id = useBranch((s) => s.selectedId);
  const setBranch = useBranch((s) => s.setBranch);
  const branch = getBranch(id);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#1E5BC6]/20 bg-[#EAF3FF] hover:bg-[#1E5BC6]/15 text-[#1B3A6B] font-bold transition ${compact ? "px-2 h-8 text-[11px]" : "px-3 h-9 text-xs"}`}
        title={branch ? branch.address : "Choose your branch"}
      >
        <MapPin className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
        <span className="max-w-[10rem] truncate">{branch ? branch.name.replace("Kings Pharmacy ", "") : "Choose branch"}</span>
        <ChevronDown className={`h-3 w-3 opacity-70 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className={`absolute z-50 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden ${compact ? "left-0" : "right-0"}`}>
          <div className="px-4 py-3 bg-gradient-to-br from-[#1E5BC6] to-[#1B3A6B] text-white">
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Kings Pharmacy · Bulawayo</div>
            <div className="text-sm font-black mt-0.5">Choose your branch</div>
          </div>
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
            {BRANCHES.map((b) => {
              const active = b.id === id;
              return (
                <button
                  key={b.id}
                  onClick={() => { setBranch(b.id); setOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 hover:bg-slate-50 transition ${active ? "bg-[#EAF3FF]" : ""}`}
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-[#1E5BC6] text-white" : "bg-[#EAF3FF] text-[#1E5BC6]"}`}>
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-[13px] text-[#1B3A6B]">{b.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{b.address}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex flex-wrap gap-x-2">
                      <span className="inline-flex items-center gap-1"><Phone className="h-2.5 w-2.5" /> {b.phone}</span>
                      <span className="inline-flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {b.hours}</span>
                    </div>
                  </div>
                  {active && <Check className="h-4 w-4 text-[#1A7A4A] shrink-0 mt-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const PUBLIC_TABS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/shop", label: "Shop", icon: Store },
  { to: "/track", label: "Track Order", icon: MapPin },
] as const;

// Secondary nav — category quick links
const CATEGORY_NAV = [
  { label: "Pain Relief", cat: "OTC" },
  { label: "Vitamins", cat: "Vitamins" },
  { label: "Baby Care", cat: "Baby Care" },
  { label: "First Aid", cat: "First Aid" },
  { label: "Devices", cat: "Devices" },
  { label: "Skincare", cat: "Skincare" },
  { label: "Prescription", cat: "Prescription" },
  { label: "Health Foods", cat: "Health Foods" },
] as const;

const ROLE_TABS: Record<Role, { to: string; label: string }[]> = {
  customer: [{ to: "/account", label: "My Account" }, { to: "/prescriptions", label: "Prescriptions" }],
  staff: [{ to: "/staff", label: "Pharmacy Portal" }],
  driver: [{ to: "/driver", label: "Driver Portal" }],
  admin: [{ to: "/admin", label: "Admin Dashboard" }],
};

const mobileTabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
  { to: "/track", label: "Track", icon: MapPin },
  { to: "/account", label: "Account", icon: User },
] as const;

function UserMenu() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login" className="px-4 py-2 rounded-full text-sm font-bold text-[#1B3A6B] hover:bg-[#F5F7FA] transition">Sign In</Link>
        <Link to="/register" className="px-4 py-2 rounded-full text-sm font-bold bg-[#1E5BC6] text-white hover:bg-[#1B3A6B] transition">Register</Link>
      </div>
    );
  }

  const initials = user.avatar || (user.firstName[0] + user.lastName[0]).toUpperCase();
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-[#1E5BC6] to-[#1B3A6B] flex items-center justify-center text-white text-sm font-bold ring-2 ring-[#1E5BC6]/10 hover:ring-[#1E5BC6]/30 transition"
        aria-label="Account menu"
      >
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
          <div className="p-4 bg-gradient-to-br from-[#1E5BC6] to-[#1B3A6B] text-white">
            <div className="font-black">{user.firstName} {user.lastName}</div>
            <div className="text-xs opacity-80 truncate">{user.email}</div>
            <div className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">{user.role}</div>
          </div>
          <div className="p-1">
            <Link to={ROLE_HOME[user.role]} onClick={() => setOpen(false)} className="block px-3 py-2 text-sm font-bold text-[#1B3A6B] hover:bg-[#F5F7FA] rounded-lg">My Dashboard</Link>
            <button
              onClick={() => { logout(); setOpen(false); navigate({ to: "/" }); }}
              className="w-full text-left px-3 py-2 text-sm font-bold text-[#C0392B] hover:bg-red-50 rounded-lg flex items-center gap-2"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PromoStrip() {
  return (
    <div className="hidden md:block bg-gradient-to-r from-[#1B3A6B] via-[#1E5BC6] to-[#1B3A6B] text-white text-[11px] font-semibold">
      <div className="max-w-7xl mx-auto px-6 h-8 flex items-center justify-center gap-6">
        <span>🚚 Free delivery in Bulawayo on orders over $30</span>
        <span className="opacity-50">·</span>
        <span>📋 Upload your prescription for an instant quote</span>
        <span className="opacity-50">·</span>
        <span>💳 EcoCash · ZimSwitch · Telecash accepted</span>
      </div>
    </div>
  );
}

export function TopNav() {
  const count = useStore((s) => cartCount(s.cart));
  const path = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const roleTabs = user ? ROLE_TABS[user.role] : [];

  return (
    <div className="hidden md:block sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      <PromoStrip />
      <header>
        {/* Row 1 — logo · search · branch + cart + account */}
        <div className="max-w-7xl mx-auto px-6 h-[112px] flex items-center gap-5">
          <Link to="/" className="shrink-0">
            <Logo />
          </Link>
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              placeholder="Search medicines, healthcare products, brands and categories..."
              className="w-full h-[48px] rounded-full bg-[#F5F7FA] border border-transparent pl-12 pr-5 text-sm outline-none focus:ring-2 focus:ring-[#1E5BC6] focus:bg-white focus:border-[#1E5BC6]/20 transition"
            />
          </div>
          <BranchChip />
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 bg-[#1E5BC6] hover:bg-[#1B3A6B] text-white px-4 py-2.5 rounded-full text-sm font-semibold transition"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
            {count > 0 && (
              <span className="bg-white text-[#1E5BC6] text-[10px] rounded-full px-1.5 py-0.5 font-black min-w-5 text-center">
                {count}
              </span>
            )}
          </Link>
          <NotificationBell />
          <UserMenu />
        </div>

        {/* Row 2 — category quick links + utility links */}
        <div className="border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-6 h-11 flex items-center justify-between gap-4">
            <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {CATEGORY_NAV.map((c) => (
                <button
                  key={c.label}
                  onClick={() => navigate({ to: "/shop", search: { cat: c.cat } as any } as any)}
                  className="shrink-0 px-3 h-8 rounded-full text-[12px] font-semibold text-[#1B3A6B] hover:bg-[#EAF3FF] hover:text-[#1E5BC6] transition"
                >
                  {c.label}
                </button>
              ))}
            </nav>
            <nav className="flex items-center gap-1 shrink-0">
              {[...PUBLIC_TABS.filter((t) => t.to !== "/"), ...roleTabs].map((t) => {
                const active = path === t.to;
                const Icon = (t as any).icon as React.ComponentType<{ size?: number }> | undefined;
                return (
                  <Link
                    key={t.label}
                    to={t.to}
                    className={`inline-flex items-center gap-1.5 px-3 h-8 rounded-full text-[12px] font-bold transition ${
                      active ? "bg-[#1B3A6B] text-white" : "text-[#1B3A6B] hover:bg-[#F5F7FA]"
                    }`}
                  >
                    {Icon && <Icon size={13} />}
                    {t.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}

export function MobileHeader() {
  const count = useStore((s) => cartCount(s.cart));
  const navigate = useNavigate();
  return (
    <header className="md:hidden sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      <div className="px-3 pt-2 pb-1 flex items-center gap-2">
        <Link to="/" className="shrink-0">
          <Logo compact />
        </Link>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search…"
            className="w-full h-10 rounded-full bg-[#F5F7FA] pl-9 pr-3 text-sm outline-none"
          />
        </div>
        <NotificationBell />
        <Link to="/cart" className="relative p-1">
          <ShoppingCart className="h-6 w-6 text-[#1B3A6B]" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-[#1E5BC6] text-white text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-black">
              {count}
            </span>
          )}
        </Link>
      </div>
      <div className="px-3 pb-2 flex items-center gap-2">
        <BranchChip compact />
        <Link to="/track" className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1B3A6B] bg-slate-100 rounded-full px-2.5 h-8">
          <Truck className="h-3 w-3" /> Track
        </Link>
        <Link to="/prescriptions" className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1B3A6B] bg-slate-100 rounded-full px-2.5 h-8">
          📋 Rx
        </Link>
      </div>
      <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto scrollbar-none">
        {CATEGORY_NAV.map((c) => (
          <button
            key={c.label}
            onClick={() => navigate({ to: "/shop", search: { cat: c.cat } as any } as any)}
            className="shrink-0 px-3 h-7 rounded-full text-[11px] font-semibold text-[#1B3A6B] bg-[#EAF3FF] hover:bg-[#1E5BC6] hover:text-white transition"
          >
            {c.label}
          </button>
        ))}
      </div>
    </header>
  );
}

export function BottomTabs() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const count = useStore((s) => cartCount(s.cart));
  const user = useAuth((s) => s.user);
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        {mobileTabs.map((t) => {
          const active = path === t.to;
          const to = t.to === "/account" && !user ? "/login" : t.to;
          return (
            <Link
              key={t.to + t.label}
              to={to}
              className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold ${
                active ? "text-[#1E5BC6]" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <t.icon className="h-5 w-5" />
                {t.to === "/cart" && count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#1E5BC6] text-white text-[9px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-black">
                    {count}
                  </span>
                )}
              </div>
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function DemoBadge() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState<null | "shopping" | "rx">(null);

  async function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

  async function runShopping() {
    setRunning("shopping");
    setOpen(false);
    const { useOrders } = await import("@/lib/orders");
    const { useAuth } = await import("@/lib/auth");
    const user = useAuth.getState().user;
    const customerId = user?.id ?? "c1";
    const order = useOrders.getState().place({
      customerId,
      customerName: user ? `${user.firstName} ${user.lastName}` : "Demo Customer",
      phone: "+263 77 000 0000",
      address: "Demo Address, Harare",
      payment: "EcoCash",
      items: [{ productId: "demo", name: "Demo Item", price: 12.5, qty: 1 }],
      subtotal: 12.5,
      delivery: 2.5,
      total: 15,
    });
    navigate({ to: "/track", search: { id: order.id } as any });
    await sleep(1500);
    const advance = useOrders.getState().advance;
    for (let i = 0; i < 5; i++) { advance(order.id); await sleep(1500); }
    setRunning(null);
  }

  async function runRx() {
    setRunning("rx");
    setOpen(false);
    const { useRx } = await import("@/lib/rx");
    const { useAuth } = await import("@/lib/auth");
    const user = useAuth.getState().user;
    const customerId = user?.id ?? "c1";
    navigate({ to: "/prescriptions" });
    await sleep(800);
    const rec = useRx.getState().submit({
      customerId,
      patientName: user ? `${user.firstName} ${user.lastName}` : "Demo Patient",
      contactPhone: "+263 77 000 0000",
      deliveryAddress: "Demo Address, Harare",
      notes: "Auto-demo prescription",
      imageDataUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0VBRjNGRiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiBmb250LXNpemU9IjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMUIzQTZCIj7wn5OLPC90ZXh0Pjwvc3ZnPg==",
      fileName: "demo-rx.svg",
      fileType: "image/svg+xml",
    });
    await sleep(1800);
    const rx = useRx.getState();
    rx.setStatus(rec.id, "Approved");
    await sleep(1200);
    rx.sendQuotation(rec.id, [{ name: "Demo medication", qty: 1, price: 8.5 }], "Demo quote");
    await sleep(1500);
    rx.payQuotation(rec.id, "EcoCash");
    await sleep(1200);
    rx.advance(rec.id); await sleep(1200);
    rx.advance(rec.id); await sleep(1200);
    rx.advance(rec.id); await sleep(1500);
    rx.advance(rec.id);
    setRunning(null);
  }

  return (
    <div className="fixed top-2 right-2 md:top-auto md:bottom-4 md:right-4 z-50">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#1E5BC6] to-[#1B3A6B] text-white px-3 py-1.5 text-[10px] font-black shadow-lg uppercase tracking-wider hover:scale-105 transition"
      >
        <span className={`h-1.5 w-1.5 rounded-full ${running ? "bg-amber-300" : "bg-[#1A7A4A]"} animate-pulse`} />
        {running ? `Running demo…` : "Demo Mode"}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="px-3 py-2 bg-gradient-to-br from-[#1E5BC6] to-[#1B3A6B] text-white text-[11px] font-black uppercase tracking-widest">Guided Demo</div>
          <button onClick={runShopping} disabled={!!running} className="w-full text-left px-3 py-3 text-xs font-bold text-[#1B3A6B] hover:bg-slate-50 disabled:opacity-50">
            🛒 Auto-run shopping checkout
            <div className="text-[10px] font-normal text-slate-500 mt-0.5">Place order → track → deliver</div>
          </button>
          <button onClick={runRx} disabled={!!running} className="w-full text-left px-3 py-3 text-xs font-bold text-[#1B3A6B] hover:bg-slate-50 border-t border-slate-100 disabled:opacity-50">
            📋 Auto-run prescription flow
            <div className="text-[10px] font-normal text-slate-500 mt-0.5">Submit → quote → pay → deliver</div>
          </button>
        </div>
      )}
    </div>
  );
}
