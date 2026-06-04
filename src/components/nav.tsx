import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Pill, ShoppingCart, MapPin, User } from "lucide-react";
import { useStore, cartCount } from "@/lib/store";
import { Logo } from "./logo";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
  { to: "/track", label: "Track", icon: MapPin },
  { to: "/account", label: "Account", icon: User },
] as const;

export function TopNav() {
  const count = useStore((s) => cartCount(s.cart));
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <header className="hidden md:block sticky top-0 z-40 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
        <Link to="/"><Logo /></Link>
        <div className="flex-1 max-w-xl">
          <input placeholder="Search medicines, brands, conditions…" className="w-full h-10 rounded-full bg-[#F5F7FA] px-5 text-sm outline-none focus:ring-2 focus:ring-[#1E5BC6]" />
        </div>
        <nav className="flex items-center gap-1">
          {tabs.map((t) => {
            const active = path === t.to;
            return (
              <Link key={t.to} to={t.to} className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition ${active ? "bg-[#1B3A6B] text-white" : "text-[#1B3A6B] hover:bg-[#F5F7FA]"}`}>
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.to === "/cart" && count > 0 && (
                  <span className="ml-1 bg-[#1E5BC6] text-white text-[10px] rounded-full px-1.5 py-0.5 font-black">{count}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#1E5BC6] to-[#1B3A6B] flex items-center justify-center text-white text-sm font-bold">CM</div>
      </div>
    </header>
  );
}

export function MobileHeader() {
  const count = useStore((s) => cartCount(s.cart));
  return (
    <header className="md:hidden sticky top-0 z-40 bg-white border-b border-border">
      <div className="px-4 h-14 flex items-center gap-3">
        <Link to="/"><Logo compact /></Link>
        <input placeholder="Search…" className="flex-1 h-9 rounded-full bg-[#F5F7FA] px-4 text-sm outline-none" />
        <Link to="/cart" className="relative">
          <ShoppingCart className="h-6 w-6 text-[#1B3A6B]" />
          {count > 0 && <span className="absolute -top-1 -right-1 bg-[#1E5BC6] text-white text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-black">{count}</span>}
        </Link>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#1E5BC6] to-[#1B3A6B] flex items-center justify-center text-white text-xs font-bold">CM</div>
      </div>
    </header>
  );
}

export function BottomTabs() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const count = useStore((s) => cartCount(s.cart));
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        {tabs.map((t) => {
          const active = path === t.to;
          return (
            <Link key={t.to} to={t.to} className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold ${active ? "text-[#1E5BC6]" : "text-muted-foreground"}`}>
              <div className="relative">
                <t.icon className="h-5 w-5" />
                {t.to === "/cart" && count > 0 && <span className="absolute -top-1.5 -right-2 bg-[#1E5BC6] text-white text-[9px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-black">{count}</span>}
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
