import type { Stock } from "@/lib/store";

export function StockBadge({ stock, count }: { stock: Stock; count?: number }) {
  const map: Record<Stock, { label: string; bg: string; fg: string }> = {
    in: { label: "In Stock", bg: "#1A7A4A", fg: "#fff" },
    low: { label: count ? `Only ${count} left` : "Low Stock", bg: "#C47B10", fg: "#fff" },
    out: { label: "Out of Stock", bg: "#C0392B", fg: "#fff" },
    rx: { label: "Rx Required", bg: "#1E5BC6", fg: "#fff" },
    branch: { label: "Branch Only", bg: "#6B7280", fg: "#fff" },
  };
  const s = map[stock];
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide"
      style={{ background: s.bg, color: s.fg }}>
      {stock === "in" && "🟢"}{stock === "low" && "🟠"}{stock === "out" && "🔴"}{stock === "rx" && "🔵"}{stock === "branch" && "⚫"}
      <span>{s.label}</span>
    </span>
  );
}
