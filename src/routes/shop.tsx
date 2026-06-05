import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PRODUCTS_ALL, PRODUCT_IMAGE } from "@/lib/demo-data";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/shop")({
  head: () => ({ meta: [{ title: "Shop Medicines & Healthcare — Kings Pharmacy" }] }),
  component: Shop,
});

const CATS = [
  "All",
  "Prescription",
  "OTC",
  "Vitamins",
  "Devices",
  "First Aid",
  "Baby Care",
  "Skincare",
  "Health Foods",
] as const;

const CAT_LABEL: Record<string, string> = {
  All: "All",
  Prescription: "Prescription",
  OTC: "OTC Medicines",
  Vitamins: "Vitamins",
  Devices: "Medical Devices",
  "First Aid": "First Aid",
  "Baby Care": "Baby Care",
  Skincare: "Skincare",
  "Health Foods": "Health Foods",
};

type Sort = "featured" | "price-asc" | "price-desc" | "name-asc" | "stock-first";

function Shop() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [sort, setSort] = useState<Sort>("featured");
  const [maxPrice, setMaxPrice] = useState(200);

  const countsByCat = useMemo(() => {
    const m: Record<string, number> = { All: PRODUCTS_ALL.length };
    for (const p of PRODUCTS_ALL) m[p.category] = (m[p.category] ?? 0) + 1;
    return m;
  }, []);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const filtered = PRODUCTS_ALL.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (p.price > maxPrice) return false;
      if (!term) return true;
      return (
        p.name.toLowerCase().includes(term) ||
        (p.brand ?? "").toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    });

    const rank = (s: string) => (s === "out" ? 2 : s === "low" ? 1 : 0);
    const sorted = [...filtered].sort((a, b) => {
      // Always push out-of-stock to bottom
      const r = rank(a.stock) - rank(b.stock);
      if (r !== 0) return r;
      switch (sort) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "name-asc": return a.name.localeCompare(b.name);
        case "stock-first": return rank(a.stock) - rank(b.stock);
        default: return 0;
      }
    });
    return sorted;
  }, [q, cat, sort, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      <header>
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#1E5BC6]">Catalogue</div>
        <h1 className="text-2xl md:text-3xl font-black text-[#1B3A6B]">Shop Medicines & Healthcare</h1>
        <p className="text-sm text-slate-500 mt-1">{PRODUCTS_ALL.length} products — same-day delivery across the city.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, brand or description…"
            className="w-full h-12 rounded-full bg-white border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-[#1E5BC6] focus:ring-2 focus:ring-[#1E5BC6]/15"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="h-12 rounded-full bg-white border border-slate-200 px-4 text-sm font-semibold text-[#1B3A6B] outline-none focus:border-[#1E5BC6]"
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name A–Z</option>
          <option value="stock-first">In Stock First</option>
        </select>
      </div>

      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 max-w-xl">
        <span className="text-xs font-bold text-[#1B3A6B] whitespace-nowrap">Max price</span>
        <input
          type="range" min={0} max={200} step={1} value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="flex-1 accent-[#1E5BC6]"
        />
        <span className="text-xs font-bold text-[#1E5BC6] tabular-nums w-12 text-right">${maxPrice}</span>
      </div>

      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-none">
        {CATS.map((c) => {
          const count = countsByCat[c] ?? 0;
          const active = cat === c;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition border ${
                active
                  ? "bg-[#1B3A6B] border-[#1B3A6B] text-white"
                  : "bg-white border-slate-200 text-[#1B3A6B] hover:border-[#1E5BC6]"
              }`}
            >
              {CAT_LABEL[c] ?? c}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-sm text-slate-500">No products match your search.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {list.map((p, i) => (
            <div key={p.id} className={p.stock === "out" ? "opacity-50 grayscale" : ""}>
              <ProductCard p={p} i={Math.min(i, 6)} imageUrl={PRODUCT_IMAGE[p.id]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
