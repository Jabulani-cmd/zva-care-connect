import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useStore, type Product } from "@/lib/store";
import { StockBadge } from "./stock-badge";
import { toast } from "sonner";

export function ProductCard({ p, i = 0 }: { p: Product; i?: number }) {
  const add = useStore((s) => s.add);
  const [notified, setNotified] = useState(false);
  const disabled = p.stock === "out";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04, duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border flex flex-col"
    >
      <Link to="/product/$id" params={{ id: p.id }} className="block">
        <div className="aspect-square flex items-center justify-center text-6xl" style={{ background: p.color }}>
          {p.emoji}
        </div>
      </Link>
      <div className="p-3 flex-1 flex flex-col gap-2">
        <div><StockBadge stock={p.stock} count={p.stockCount} /></div>
        <Link to="/product/$id" params={{ id: p.id }} className="font-semibold text-sm leading-tight line-clamp-2 hover:text-[#1E5BC6]">{p.name}</Link>
        {p.brand && <div className="text-xs text-muted-foreground -mt-1">{p.brand}</div>}
        <div className="flex items-baseline justify-between mt-auto">
          <div className="text-lg font-black text-[#1B3A6B]">${p.price.toFixed(2)}</div>
        </div>
        {p.stock === "out" ? (
          <button
            onClick={() => { setNotified(true); toast.success("We'll notify you when back in stock"); }}
            className="w-full rounded-lg py-2 text-xs font-bold border-2 border-[#1B3A6B] text-[#1B3A6B] hover:bg-[#1B3A6B] hover:text-white transition"
          >
            {notified ? "✓ You'll be notified" : "🔔 Notify Me"}
          </button>
        ) : (
          <button
            disabled={disabled}
            onClick={() => { add(p.id); toast.success(`${p.name} added to cart`); }}
            className="w-full rounded-lg py-2 text-xs font-bold bg-[#1B3A6B] text-white hover:bg-[#1E5BC6] transition disabled:opacity-50"
          >
            {p.stock === "rx" ? "Add (Rx)" : "Add to Cart"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
