import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PRODUCTS_ALL, PRODUCT_IMAGE } from "@/lib/demo-data";
import { ProductCard } from "@/components/product-card";
import { useBranch, branchStock, getBranch } from "@/lib/branches";

interface ShopSearch {
  cat?: string;
}

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    cat: typeof s.cat === "string" ? s.cat : undefined,
  }),
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
type Cat = (typeof CATS)[number];

const CAT_LABEL: Record<string, string> = {
  All: "All Products",
  Prescription: "Prescription",
  OTC: "OTC Medicines",
  Vitamins: "Vitamins",
  Devices: "Medical Devices",
  "First Aid": "First Aid",
  "Baby Care": "Baby Care",
  Skincare: "Skincare",
  "Health Foods": "Health Foods",
};

type Sort = "featured" | "price-asc" | "price-desc" | "name-asc" | "popularity";

const PAGE_SIZE = 12;

function Shop() {
  const search = Route.useSearch();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Cat>((search.cat as Cat) ?? "All");
  const [sort, setSort] = useState<Sort>("featured");
  const [maxPrice, setMaxPrice] = useState(200);
  const [brands, setBrands] = useState<string[]>([]);
  const [branchOnly, setBranchOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const branchId = useBranch((s) => s.selectedId);
  const branch = getBranch(branchId);

  useEffect(() => {
    if (search.cat) setCat(search.cat as Cat);
  }, [search.cat]);

  useEffect(() => {
    setPage(1);
  }, [q, cat, sort, maxPrice, brands, branchOnly]);

  const allBrands = useMemo(() => {
    const s = new Set<string>();
    for (const p of PRODUCTS_ALL) if (p.brand) s.add(p.brand);
    return [...s].sort();
  }, []);

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
      if (brands.length && !brands.includes(p.brand ?? "")) return false;
      if (branchOnly && branchId && p.stock !== "rx") {
        if (branchStock(p.id, branchId).status === "out") return false;
      }
      if (!term) return true;
      return (
        p.name.toLowerCase().includes(term) ||
        (p.brand ?? "").toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    });

    const rank = (s: string) => (s === "out" ? 2 : s === "low" ? 1 : 0);
    return [...filtered].sort((a, b) => {
      const r = rank(a.stock) - rank(b.stock);
      if (r !== 0) return r;
      switch (sort) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "name-asc": return a.name.localeCompare(b.name);
        case "popularity": return (b.stockCount ?? 0) - (a.stockCount ?? 0);
        default: return 0;
      }
    });
  }, [q, cat, sort, maxPrice, brands, branchOnly, branchId]);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const pageItems = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function clearAll() {
    setCat("All"); setMaxPrice(200); setBrands([]); setBranchOnly(false); setQ("");
  }

  const Sidebar = (
    <div className="space-y-5">
      <div>
        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Category</h3>
        <div className="space-y-0.5">
          {CATS.map((c) => {
            const active = cat === c;
            return (
              <button
                key={c}
                onClick={() => { setCat(c); setFiltersOpen(false); }}
                className={`w-full text-left flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-semibold transition ${
                  active ? "bg-[#1B3A6B] text-white" : "text-[#1B3A6B] hover:bg-[#EAF3FF]"
                }`}
              >
                <span>{CAT_LABEL[c] ?? c}</span>
                <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${active ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>
                  {countsByCat[c] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Price Range</h3>
        <div className="bg-slate-50 rounded-xl p-3">
          <input
            type="range" min={0} max={200} step={1} value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[#1E5BC6]"
          />
          <div className="flex justify-between text-xs font-bold text-[#1B3A6B] mt-1">
            <span>$0</span>
            <span className="text-[#1E5BC6]">Up to ${maxPrice}</span>
          </div>
        </div>
      </div>

      {branch && (
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Availability</h3>
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50">
            <input
              type="checkbox"
              checked={branchOnly}
              onChange={(e) => setBranchOnly(e.target.checked)}
              className="h-4 w-4 accent-[#1E5BC6]"
            />
            <span className="text-sm font-semibold text-[#1B3A6B]">In stock at {branch.area}</span>
          </label>
        </div>
      )}

      <div>
        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Brand</h3>
        <div className="max-h-56 overflow-y-auto space-y-0.5 pr-1">
          {allBrands.map((b) => (
            <label key={b} className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50">
              <input
                type="checkbox"
                checked={brands.includes(b)}
                onChange={(e) => setBrands((prev) => e.target.checked ? [...prev, b] : prev.filter((x) => x !== b))}
                className="h-4 w-4 accent-[#1E5BC6]"
              />
              <span className="text-sm text-[#1B3A6B]">{b}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={clearAll} className="w-full h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1B3A6B] font-bold text-sm transition">
        Clear all filters
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
      <header className="mb-4 md:mb-6">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#1E5BC6]">Catalogue</div>
        <h1 className="text-2xl md:text-3xl font-black text-[#1B3A6B]">{CAT_LABEL[cat] ?? "Shop"}</h1>
        <p className="text-sm text-slate-500 mt-1">{list.length} products{branch ? ` · ${branch.area} branch` : ""}</p>
      </header>

      <div className="grid md:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar — desktop */}
        <aside className="hidden md:block">
          <div className="sticky top-[150px] bg-white rounded-2xl border border-slate-200 p-4">
            {Sidebar}
          </div>
        </aside>

        {/* Mobile filter drawer */}
        {filtersOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setFiltersOpen(false)}>
            <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-white p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-[#1B3A6B] text-lg">Filters</h2>
                <button onClick={() => setFiltersOpen(false)} className="p-2"><X className="h-5 w-5" /></button>
              </div>
              {Sidebar}
            </div>
          </div>
        )}

        <div className="min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products…"
                className="w-full h-11 rounded-full bg-white border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-[#1E5BC6] focus:ring-2 focus:ring-[#1E5BC6]/15"
              />
            </div>
            <button
              onClick={() => setFiltersOpen(true)}
              className="md:hidden h-11 px-4 rounded-full bg-white border border-slate-200 text-sm font-bold text-[#1B3A6B] inline-flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-11 rounded-full bg-white border border-slate-200 px-4 text-sm font-semibold text-[#1B3A6B] outline-none focus:border-[#1E5BC6]"
            >
              <option value="featured">Sort: Featured</option>
              <option value="popularity">Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name A–Z</option>
            </select>
          </div>

          {list.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center text-sm text-slate-500">No products match your filters.</div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {pageItems.map((p, i) => (
                  <div key={p.id} className={p.stock === "out" ? "opacity-60" : ""}>
                    <ProductCard p={p} i={Math.min(i, 6)} imageUrl={PRODUCT_IMAGE[p.id]} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="h-9 px-3 rounded-full bg-white border border-slate-200 text-sm font-bold text-[#1B3A6B] disabled:opacity-40"
                  >Prev</button>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const n = i + 1;
                    const active = n === page;
                    return (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`h-9 min-w-9 px-3 rounded-full text-sm font-bold transition ${
                          active ? "bg-[#1B3A6B] text-white" : "bg-white border border-slate-200 text-[#1B3A6B] hover:border-[#1E5BC6]"
                        }`}
                      >{n}</button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="h-9 px-3 rounded-full bg-white border border-slate-200 text-sm font-bold text-[#1B3A6B] disabled:opacity-40"
                  >Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
