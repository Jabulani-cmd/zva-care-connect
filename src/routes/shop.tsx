import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PRODUCTS_ALL, PRODUCT_IMAGE } from "@/lib/demo-data";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/shop")({
  head: () => ({ meta: [{ title: "Shop Medicines & Healthcare — Kings Pharmacy" }] }),
  component: Shop,
});

const CATS = ["All", "OTC", "Prescription", "Vitamins", "Baby Care", "Devices", "Personal Care", "Cosmetics"] as const;

function Shop() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return PRODUCTS_ALL.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (!term) return true;
      return (
        p.name.toLowerCase().includes(term) ||
        (p.brand ?? "").toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    });
  }, [q, cat]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      <header>
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#1E5BC6]">Catalogue</div>
        <h1 className="text-2xl md:text-3xl font-black text-[#1B3A6B]">Shop Medicines & Healthcare</h1>
        <p className="text-sm text-slate-500 mt-1">{PRODUCTS_ALL.length} products — same-day delivery across the city.</p>
      </header>

      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, brand or category…"
          className="w-full h-12 rounded-full bg-white border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-[#1E5BC6] focus:ring-2 focus:ring-[#1E5BC6]/15"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-none">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition border ${
              cat === c
                ? "bg-[#1B3A6B] border-[#1B3A6B] text-white"
                : "bg-white border-slate-200 text-[#1B3A6B] hover:border-[#1E5BC6]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-sm text-slate-500">No products match your search.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {list.map((p, i) => (
            <ProductCard key={p.id} p={p} i={Math.min(i, 6)} imageUrl={PRODUCT_IMAGE[p.id]} />
          ))}
        </div>
      )}
    </div>
  );
}
