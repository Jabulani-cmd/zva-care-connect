import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { ProductCard } from "./product-card";
import { PRODUCT_IMAGE } from "@/lib/demo-data";
import type { Product } from "@/lib/store";

interface Props {
  title: string;
  eyebrow?: string;
  items: Product[];
  seeAllTo?: string;
  ribbon?: (p: Product, i: number) => string | null;
}

export function ProductCarousel({ title, eyebrow, items, seeAllTo = "/shop", ribbon }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);

  function update() {
    const el = ref.current;
    if (!el) return;
    setCanL(el.scrollLeft > 4);
    setCanR(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }
  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { el.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [items.length]);

  function scrollBy(d: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: d * Math.max(280, el.clientWidth * 0.8), behavior: "smooth" });
  }

  return (
    <section>
      <div className="flex items-end justify-between mb-3 md:mb-4 gap-3">
        <div className="min-w-0">
          {eyebrow && <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#1E5BC6]">{eyebrow}</div>}
          <h2 className="text-lg md:text-2xl font-black text-[#1B3A6B] truncate">{title}</h2>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => scrollBy(-1)} disabled={!canL} aria-label="Scroll left"
            className="hidden md:inline-flex h-9 w-9 rounded-full border border-slate-200 bg-white text-[#1B3A6B] items-center justify-center hover:bg-[#EAF3FF] hover:border-[#1E5BC6] disabled:opacity-30 disabled:hover:bg-white disabled:hover:border-slate-200 transition"
          ><ChevronLeft size={18} /></button>
          <button
            onClick={() => scrollBy(1)} disabled={!canR} aria-label="Scroll right"
            className="hidden md:inline-flex h-9 w-9 rounded-full border border-slate-200 bg-white text-[#1B3A6B] items-center justify-center hover:bg-[#EAF3FF] hover:border-[#1E5BC6] disabled:opacity-30 disabled:hover:bg-white disabled:hover:border-slate-200 transition"
          ><ChevronRight size={18} /></button>
          <button
            onClick={() => navigate({ to: seeAllTo })}
            className="ml-1 inline-flex items-center gap-1 text-xs md:text-sm font-bold text-[#1E5BC6] hover:text-[#1B3A6B] group"
          >See all <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" /></button>
        </div>
      </div>
      <div className="relative">
        <div
          ref={ref}
          className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 pb-2 scrollbar-none"
        >
          {items.map((p, i) => (
            <div key={p.id} className="shrink-0 snap-start w-[160px] sm:w-[200px] md:w-[230px] lg:w-[250px] relative">
              {ribbon && ribbon(p, i) && (
                <div className="absolute z-10 top-2 left-2 bg-[#C0392B] text-white text-[10px] font-black rounded-full px-2 py-0.5 shadow-md">
                  {ribbon(p, i)}
                </div>
              )}
              <ProductCard p={p} i={Math.min(i, 6)} imageUrl={PRODUCT_IMAGE[p.id]} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
