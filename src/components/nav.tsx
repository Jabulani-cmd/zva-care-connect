import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ShoppingCart, MapPin, User, LayoutGrid, Store, Search } from "lucide-react";
import { useStore, cartCount } from "@/lib/store";
import { Logo } from "./logo";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/cart", label: "Shop", icon: Store },
  { to: "/track", label: "Track Order", icon: MapPin },
  { to: "/staff", label: "Pharmacy", icon: LayoutGrid },
  { to: "/driver", label: "Drivers", icon: MapPin },
  { to: "/admin", label: "Admin", icon: LayoutGrid },
  { to: "/account", label: "Account", icon: User },
] as const;

const mobileTabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
  { to: "/track", label: "Track", icon: MapPin },
  { to: "/account", label: "Account", icon: User },
] as const;

export function TopNav() {
  const count = useStore((s) => cartCount(s.cart));
  const path = useRouterState({ select: (r) => r.location.pathname });
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
          {tabs.map((t, i) => {
            const active = path === t.to && i === 0;
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
        <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-[#1E5BC6] to-[#1B3A6B] flex items-center justify-center text-white text-sm font-bold ring-2 ring-[#1E5BC6]/10">
          CM
        </div>
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
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        {mobileTabs.map((t) => {
          const active = path === t.to;
          return (
            <Link
              key={t.to + t.label}
              to={t.to}
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
