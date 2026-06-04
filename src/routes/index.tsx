import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { PRODUCTS } from "@/lib/store";
import { ProductCard } from "@/components/product-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kings Pharmacy — Fast Prescription Delivery" },
      { name: "description", content: "Order prescription and OTC medicines online. Fast delivery, real pharmacists, Kings Rewards points." },
    ],
  }),
  component: Home,
});

const slides = [
  { title: "Fast Prescription Delivery", sub: "30-min delivery across the city", cta: "Order Now", bg: "from-[#1B3A6B] to-[#1E5BC6]", emoji: "🚀" },
  { title: "Order OTC Medicines Online", sub: "200+ products, in stock today", cta: "Browse Catalog", bg: "from-[#1E5BC6] to-[#1B3A6B]", emoji: "💊" },
  { title: "Earn Kings Rewards Points", sub: "Get 5% back on every order", cta: "Join Free", bg: "from-[#1A7A4A] to-[#1B3A6B]", emoji: "👑" },
];

const categories = [
  { e: "💊", l: "Prescription" },
  { e: "🩺", l: "OTC Medicines" },
  { e: "👶", l: "Baby Care" },
  { e: "💆", l: "Vitamins" },
  { e: "🩹", l: "First Aid" },
  { e: "💄", l: "Cosmetics" },
];

function Home() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, []);
  const s = slides[slide];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
      {/* Hero */}
      <motion.div key={slide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${s.bg} p-6 md:p-10 text-white shadow-xl`}>
        <div className="absolute -right-8 -bottom-8 text-[180px] opacity-20 select-none">{s.emoji}</div>
        <div className="relative max-w-lg">
          <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Kings Pharmacy</div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight">{s.title}</h1>
          <p className="mt-2 md:mt-3 text-white/85 md:text-lg">{s.sub}</p>
          <button className="mt-5 bg-white text-[#1B3A6B] font-bold rounded-full px-6 py-3 text-sm hover:scale-105 transition">{s.cta} →</button>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-1.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className={`h-1.5 rounded-full transition-all ${i === slide ? "w-6 bg-white" : "w-1.5 bg-white/40"}`} />
          ))}
        </div>
      </motion.div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0 pb-2 scrollbar-none">
        {categories.map((c) => (
          <button key={c.l} className="shrink-0 flex flex-col items-center gap-2 bg-white rounded-2xl px-4 py-3 border border-border min-w-[88px] hover:border-[#1E5BC6] hover:shadow-md transition">
            <span className="text-2xl">{c.e}</span>
            <span className="text-xs font-semibold text-[#1B3A6B] whitespace-nowrap">{c.l}</span>
          </button>
        ))}
      </div>

      {/* Promo */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1A7A4A] to-[#0F5C36] text-white px-5 py-4 flex items-center justify-between shadow-md">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">🎉 Flash Sale</div>
          <div className="font-black text-lg">20% off all Vitamins this week</div>
        </div>
        <button className="hidden sm:block bg-white text-[#1A7A4A] font-bold rounded-full px-4 py-2 text-xs">Shop Sale</button>
      </div>

      {/* Products */}
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-black text-[#1B3A6B]">Featured Products</h2>
          <a className="text-sm font-semibold text-[#1E5BC6]">See all →</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {PRODUCTS.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
        </div>
      </div>
    </div>
  );
}
