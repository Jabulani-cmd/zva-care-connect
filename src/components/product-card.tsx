import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Bell, Upload } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import type { Product } from "@/lib/store";

type Props = {
  p: Product;
  i?: number;
  imageUrl?: string;
};

const STATUS = {
  in: { label: "In Stock", dot: "#1A7A4A", bg: "#E6F4EC", text: "#1A7A4A" },
  low: { label: "Low Stock", dot: "#C47B10", bg: "#FEF3DC", text: "#C47B10" },
  out: { label: "Out of Stock", dot: "#C0392B", bg: "#FDECEA", text: "#C0392B" },
  rx: { label: "Rx Required", dot: "#1E5BC6", bg: "#EEF4FF", text: "#1E5BC6" },
  branch: { label: "Branch Only", dot: "#6C7A89", bg: "#F0F2F5", text: "#6C7A89" },
} as const;

export function ProductCard({ p, i = 0, imageUrl }: Props) {
  const navigate = useNavigate();
  const add = useStore((s) => s.add);
  const user = useAuth((s) => s.user);
  const status = STATUS[p.stock] ?? STATUS.in;
  const isRx = p.stock === "rx";
  const isOut = p.stock === "out";

  function handleCTA(e: React.MouseEvent) {
    e.stopPropagation();
    if (isOut) return;
    if (!user) {
      toast.error("Please sign in to add items to your cart.");
      navigate({ to: "/login" });
      return;
    }
    if (isRx) {
      navigate({ to: "/prescriptions" });
      return;
    }
    add(p.id, 1);
    toast.success(`${p.name} added to cart`);
  }

  function handleNotify(e: React.MouseEvent) {
    e.stopPropagation();
    toast.success(`We'll notify you when ${p.name} is back in stock.`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => navigate({ to: `/product/${p.id}` })}
      className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden
                 hover:border-[#1E5BC6] hover:shadow-lg hover:-translate-y-0.5
                 active:scale-[0.98] transition-all duration-200 cursor-pointer flex flex-col"
    >
      <div className="relative overflow-hidden bg-white border-b border-slate-100" style={{ aspectRatio: "4/3" }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={p.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              img.style.display = "none";
              const fb = img.nextElementSibling as HTMLElement | null;
              if (fb) fb.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="absolute inset-0 w-full h-full items-center justify-center text-5xl"
          style={{ background: p.color, display: imageUrl ? "none" : "flex" }}
        >
          {p.emoji}
        </div>
        {p.stock === "low" && p.stockCount !== undefined && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold rounded-full px-2 py-0.5 shadow">
            Only {p.stockCount} left
          </div>
        )}
        {isOut && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-white/90 text-slate-500 text-xs font-bold rounded-full px-3 py-1 shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3 md:p-4 gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 truncate">{p.brand}</p>
        <h3 className="text-sm font-bold text-[#1B3A6B] leading-tight line-clamp-2 min-h-[2.4em]">{p.name}</h3>

        <span
          className="self-start inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold"
          style={{ background: status.bg, color: status.text }}
        >
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: status.dot }} />
          {status.label}
        </span>

        <div className="flex items-baseline gap-1 mt-auto">
          <span className="text-[#1B3A6B] font-black text-base">${p.price.toFixed(2)}</span>
          <span className="text-slate-400 text-xs">USD</span>
        </div>

        {isOut ? (
          <button
            onClick={handleNotify}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold
                       border-2 border-slate-200 text-slate-500 hover:border-[#1B3A6B] hover:text-[#1B3A6B]
                       hover:bg-slate-50 active:scale-95 transition-all duration-150 focus:outline-none"
          >
            <Bell size={13} /> Notify Me
          </button>
        ) : isRx ? (
          <button
            onClick={handleCTA}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold
                       bg-[#EEF4FF] text-[#1E5BC6] border-2 border-[#1E5BC6]/30
                       hover:bg-[#1E5BC6] hover:text-white hover:border-[#1E5BC6]
                       active:scale-95 transition-all duration-150 focus:outline-none"
          >
            <Upload size={13} /> Upload Rx
          </button>
        ) : (
          <button
            onClick={handleCTA}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold
                       bg-[#1B3A6B] text-white hover:bg-[#1E5BC6] hover:shadow-md
                       active:scale-95 transition-all duration-150 focus:outline-none"
          >
            <ShoppingCart size={13} /> Add to Cart
          </button>
        )}
      </div>
    </motion.div>
  );
}
