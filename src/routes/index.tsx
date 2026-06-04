import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { PRODUCTS } from "@/lib/store";
import { ProductCard } from "@/components/product-card";
import { ChevronLeft, ChevronRight, ArrowRight, ShoppingBag, Zap, Crown } from "lucide-react";
import logoAsset from "@/assets/kings-logo.webp.asset.json";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kings Pharmacy — Fast Prescription Delivery" },
      { name: "description", content: "Order prescription and OTC medicines online. Fast delivery across Zimbabwe." },
    ],
  }),
  component: Home,
});

const KINGS_LOGO = logoAsset.url;

const slides = [
  {
    id: 0,
    Icon: Zap,
    label: "Fast Delivery",
    title: "Prescriptions\nDelivered Fast",
    sub: "Order before 5 pm — our pharmacists pack and dispatch to your door in 30 minutes across the city.",
    cta: "Order Now",
    route: "/cart",
    img: hero1,
    overlay: "from-[#0D2249]/90 via-[#1B3A6B]/80 to-transparent",
    accent: "#93C5FD",
    badge: "bg-blue-400/20 text-blue-200 border-blue-400/30",
  },
  {
    id: 1,
    Icon: ShoppingBag,
    label: "Shop Online",
    title: "200+ Medicines\nIn Stock Today",
    sub: "Browse our full catalogue of OTC and prescription products. Real stock, real prices, updated live.",
    cta: "Shop Now",
    route: "/cart",
    img: hero2,
    overlay: "from-[#0A3622]/90 via-[#1A7A4A]/80 to-transparent",
    accent: "#6EE7B7",
    badge: "bg-emerald-400/20 text-emerald-200 border-emerald-400/30",
  },
  {
    id: 2,
    Icon: Crown,
    label: "Loyalty Rewards",
    title: "Earn Kings\nRewards Points",
    sub: "Get 5% back in loyalty points on every order. Redeem for discounts, free delivery, and exclusive offers.",
    cta: "Join Free Today",
    route: "/account",
    img: hero3,
    overlay: "from-[#3B0764]/90 via-[#6D28D9]/75 to-transparent",
    accent: "#DDD6FE",
    badge: "bg-violet-400/20 text-violet-200 border-violet-400/30",
  },
];

// ── Category pills ─────────────────────────────────────────────────────────────
const categories = [
  { emoji: "💊", label: "Prescription", route: "/catalogue?cat=prescription" },
  { emoji: "🩺", label: "OTC Medicines", route: "/catalogue?cat=otc" },
  { emoji: "👶", label: "Baby Care", route: "/catalogue?cat=baby" },
  { emoji: "💆", label: "Vitamins", route: "/catalogue?cat=vitamins" },
  { emoji: "🩹", label: "First Aid", route: "/catalogue?cat=firstaid" },
  { emoji: "💄", label: "Cosmetics", route: "/catalogue?cat=cosmetics" },
];

// ── Trust bar items ────────────────────────────────────────────────────────────
const trust = [
  { icon: "🚀", title: "30-Min Delivery", sub: "Across the city" },
  { icon: "👨‍⚕️", title: "Real Pharmacists", sub: "Every Rx verified" },
  { icon: "🔒", title: "Secure Payments", sub: "EcoCash & cards" },
  { icon: "↩️", title: "Easy Returns", sub: "Hassle-free policy" },
];

// ════════════════════════════════════════════════════════════════════════════════
// HERO CAROUSEL
// ════════════════════════════════════════════════════════════════════════════════
function HeroCarousel() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((idx: number, d: 1 | -1 = 1) => {
    setDir(d);
    setCurrent((idx + slides.length) % slides.length);
    setPaused(true);
    setTimeout(() => setPaused(false), 6000);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setDir(1);
      setCurrent((s) => (s + 1) % slides.length);
    }, 5500);
    return () => clearInterval(id);
  }, [paused]);

  const s = slides[current];

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 48 : -48 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -48 : 48 }),
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-2xl select-none"
      style={{ minHeight: "clamp(300px, 42vw, 520px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background photo layer ── */}
      <AnimatePresence initial={false} custom={dir} mode="sync">
        <motion.div
          key={`bg-${s.id}`}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <img src={s.img} alt="" className="w-full h-full object-cover" loading="eager" draggable={false} />
          {/* Directional gradient — text readable on left, photo visible on right */}
          <div className={`absolute inset-0 bg-gradient-to-r ${s.overlay}`} />
          {/* Subtle vignette bottom */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ── Text content ── */}
      <AnimatePresence initial={false} custom={dir} mode="wait">
        <motion.div
          key={`txt-${s.id}`}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1], delay: 0.06 }}
          className="relative z-10 flex flex-col justify-center h-full px-6 md:px-14 py-10 md:py-14"
          style={{ minHeight: "clamp(300px, 42vw, 520px)", maxWidth: 560 }}
        >
          {/* Label pill */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest border ${s.badge} mb-3 md:mb-4`}
            >
              <s.Icon size={11} />
              Kings Pharmacy
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="text-white font-black whitespace-pre-line leading-[1.06]"
            style={{
              fontSize: "clamp(1.8rem, 4.2vw, 3.2rem)",
              letterSpacing: "-0.025em",
              textShadow: "0 2px 16px rgba(0,0,0,0.35)",
            }}
          >
            {s.title}
          </motion.h1>

          {/* Sub-text */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mt-3 text-white/85 leading-relaxed max-w-sm"
            style={{ fontSize: "clamp(0.84rem, 1.55vw, 1rem)", textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
          >
            {s.sub}
          </motion.p>

          {/* CTA — wired to navigate */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
            <button
              onClick={() => navigate({ to: s.route })}
              className="group mt-6 md:mt-8 inline-flex items-center gap-2.5 rounded-full font-bold
                         px-7 py-3.5 text-sm md:text-base bg-white shadow-xl
                         hover:shadow-2xl hover:scale-105 active:scale-95
                         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/70"
              style={{ color: "#1B3A6B" }}
            >
              {s.cta}
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* ── Prev / Next arrows ── */}
      {[
        { label: "Previous", onClick: () => goTo(current - 1, -1), pos: "left-3", Icon: ChevronLeft },
        { label: "Next", onClick: () => goTo(current + 1, 1), pos: "right-3", Icon: ChevronRight },
      ].map(({ label, onClick, pos, Icon: I }) => (
        <button
          key={label}
          onClick={onClick}
          aria-label={label + " slide"}
          className={`absolute ${pos} top-1/2 -translate-y-1/2 z-20
                      w-10 h-10 rounded-full
                      bg-white/15 hover:bg-white/30
                      backdrop-blur-md border border-white/25
                      flex items-center justify-center text-white
                      transition-all duration-200 hover:scale-110 active:scale-95
                      focus:outline-none focus:ring-2 focus:ring-white/50`}
        >
          <I size={20} />
        </button>
      ))}

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            aria-label={`Slide ${i + 1}`}
            className="rounded-full transition-all duration-300 focus:outline-none"
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              background: i === current ? "white" : "rgba(255,255,255,0.45)",
            }}
          />
        ))}
      </div>

      {/* ── Slide counter ── */}
      <div className="absolute top-4 right-5 z-20 font-mono text-xs text-white/55 tabular-nums">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>

      {/* ── Progress bar (auto-advance indicator) ── */}
      {!paused && (
        <motion.div
          key={`bar-${current}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 5.5, ease: "linear" }}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/60 z-20 origin-left"
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// PRODUCT IMAGES — real Unsplash product photos mapped by product id
// ════════════════════════════════════════════════════════════════════════════════
export const PRODUCT_IMAGES: Record<string, string> = {
  p1: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80&auto=format&fit=crop",
  p2: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80&auto=format&fit=crop",
  p3: "https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=400&q=80&auto=format&fit=crop",
  p4: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&q=80&auto=format&fit=crop",
  p5: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80&auto=format&fit=crop",
  p6: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80&auto=format&fit=crop",
  p7: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80&auto=format&fit=crop",
  p8: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80&auto=format&fit=crop",
};

// ════════════════════════════════════════════════════════════════════════════════
// HOME PAGE
// ════════════════════════════════════════════════════════════════════════════════
function Home() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
      {/* ── Hero ── */}
      <HeroCarousel />

      {/* ── Categories ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-0.5">Shop by Category</p>
        <div className="flex gap-3 overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0 pb-2 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.label}
              onClick={() => navigate({ to: c.route })}
              className="shrink-0 flex flex-col items-center gap-2 bg-white rounded-2xl px-4 py-3
                         border border-slate-200 min-w-[90px]
                         hover:border-[#1E5BC6] hover:shadow-md hover:-translate-y-0.5
                         active:scale-95 transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-[#1E5BC6]/30"
            >
              <span className="text-2xl leading-none">{c.emoji}</span>
              <span className="text-xs font-semibold text-[#1B3A6B] whitespace-nowrap">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Flash Sale Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1A7A4A] to-[#0F5C36]
                   text-white px-5 py-4 md:px-8 md:py-5 flex items-center justify-between shadow-lg"
      >
        {/* decorative circles */}
        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/5" />
        <div className="absolute right-16 -bottom-8 w-20 h-20 rounded-full bg-white/5" />
        <div className="relative">
          <div className="text-xs font-bold uppercase tracking-wider text-green-200">
            🎉 Flash Sale — This Week Only
          </div>
          <div className="font-black text-lg md:text-xl leading-tight mt-0.5">
            20% off all Vitamins &amp; Supplements
          </div>
          <div className="text-white/65 text-xs mt-1">
            Use code <span className="font-bold text-white bg-white/20 rounded px-1.5 py-0.5">VITAMINS20</span> at
            checkout
          </div>
        </div>
        <button
          onClick={() => navigate({ to: "/catalogue?cat=vitamins&promo=VITAMINS20" })}
          className="shrink-0 bg-white text-[#1A7A4A] font-bold rounded-full px-5 py-2.5 text-sm
                     hover:shadow-xl hover:scale-105 active:scale-95
                     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/60 ml-4"
        >
          Shop Sale
        </button>
      </motion.div>

      {/* ── Featured Products ── */}
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-black text-[#1B3A6B]">Featured Products</h2>
          <button
            onClick={() => navigate({ to: "/catalogue" })}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#1E5BC6]
                       hover:text-[#1B3A6B] transition-colors group focus:outline-none"
          >
            See all
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} p={p} i={i} imageUrl={PRODUCT_IMAGES[p.id]} />
          ))}
        </div>
      </div>

      {/* ── Trust bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
        {trust.map((t) => (
          <div
            key={t.title}
            className="flex items-center gap-3 bg-white rounded-2xl border border-slate-200
                       px-4 py-3.5 hover:border-[#1E5BC6] hover:shadow-sm transition-all duration-200"
          >
            <span className="text-2xl leading-none">{t.icon}</span>
            <div>
              <div className="text-xs font-bold text-[#1B3A6B] leading-tight">{t.title}</div>
              <div className="text-[11px] text-slate-400">{t.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer brand strip ── */}
      <div className="flex flex-col items-center gap-2 pt-4 pb-6 border-t border-slate-100">
        <img src={KINGS_LOGO} alt="Kings Pharmacy" className="h-14 w-auto object-contain" />
        <p className="text-xs text-slate-400 text-center">
          Kings Pharmacy — at your service &nbsp;·&nbsp; Powered by{" "}
          <span className="font-semibold text-[#1B3A6B]">MavingTech Business Solutions</span>
        </p>
      </div>

      <div className="h-4" />
    </div>
  );
}
