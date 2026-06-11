import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Home, ShoppingCart, MapPin, User, LayoutGrid, Store, Search, LogOut, ChevronDown } from "lucide-react";
import { useStore, cartCount } from "@/lib/store";
import { useAuth, ROLE_HOME, type Role } from "@/lib/auth";
import { useBranch, getBranch } from "@/lib/branches";
import { BranchPicker } from "./branch-picker";
import { Logo } from "./logo";
import { useState, useRef, useEffect } from "react";

function BranchChip({ compact = false }: { compact?: boolean }) {
  const id = useBranch((s) => s.selectedId);
  const branch = getBranch(id);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#1E5BC6]/20 bg-[#EAF3FF] hover:bg-[#1E5BC6]/15 text-[#1B3A6B] font-bold transition ${compact ? "px-2 h-8 text-[11px]" : "px-3 h-9 text-xs"}`}
        title={branch ? branch.address : "Choose your branch"}
      >
        <MapPin className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
        <span className="max-w-[10rem] truncate">{branch ? branch.area : "Choose branch"}</span>
        <ChevronDown className="h-3 w-3 opacity-70" />
      </button>
      {open && <BranchPicker open onClose={() => setOpen(false)} />}
    </>
  );
}

const PUBLIC_TABS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/shop", label: "Shop", icon: Store },
  { to: "/track", label: "Track Order", icon: MapPin },
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

export function TopNav() {
  const count = useStore((s) => cartCount(s.cart));
  const path = useRouterState({ select: (r) => r.location.pathname });
  const user = useAuth((s) => s.user);
  const tabs = [
    ...PUBLIC_TABS,
    ...(user ? ROLE_TABS[user.role] : []),
  ];
  return (
    <header className="hidden md:block sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-[100px] flex items-center gap-6">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>
        <div className="flex-1 max-w-2xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            placeholder="Search medicines, healthcare products, brands and categories..."
            className="w-full h-[50px] rounded-full bg-[#F5F7FA] border border-transparent pl-12 pr-5 text-sm outline-none focus:ring-2 focus:ring-[#1E5BC6] focus:bg-white focus:border-[#1E5BC6]/20 transition"
          />
        </div>
        <nav className="flex items-center gap-1">
          {tabs.map((t) => {
            const active = path === t.to;
            return (
              <Link
                key={t.label}
                to={t.to}
                className={`px-3 py-2 rounded-full text-sm font-semibold transition ${
                  active ? "bg-[#1B3A6B] text-white" : "text-[#1B3A6B] hover:bg-[#F5F7FA]"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
          <Link
            to="/cart"
            className="ml-2 relative inline-flex items-center gap-2 bg-[#1E5BC6] hover:bg-[#1B3A6B] text-white px-4 py-2.5 rounded-full text-sm font-semibold transition"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
            {count > 0 && (
              <span className="bg-white text-[#1E5BC6] text-[10px] rounded-full px-1.5 py-0.5 font-black min-w-5 text-center">
                {count}
              </span>
            )}
          </Link>
        </nav>
        <UserMenu />
      </div>
    </header>
  );
}

export function MobileHeader() {
  const count = useStore((s) => cartCount(s.cart));
  return (
    <header className="md:hidden sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      <div className="px-3 h-16 flex items-center gap-2">
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
        <Link to="/cart" className="relative p-1">
          <ShoppingCart className="h-6 w-6 text-[#1B3A6B]" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-[#1E5BC6] text-white text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-black">
              {count}
            </span>
          )}
        </Link>
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
  return (
    <div className="fixed top-2 right-2 md:top-auto md:bottom-4 md:right-4 z-50 pointer-events-none">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#1E5BC6] to-[#1B3A6B] text-white px-3 py-1.5 text-[10px] font-black shadow-lg uppercase tracking-wider">
        <span className="h-1.5 w-1.5 rounded-full bg-[#1A7A4A] animate-pulse" /> Demo Mode
      </span>
    </div>
  );
}
