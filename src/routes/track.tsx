import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check, Phone, MessageCircle, X, Star } from "lucide-react";
import { useOrders, ORDER_FLOW } from "@/lib/orders";
import { toast } from "sonner";

export const Route = createFileRoute("/track")({
  validateSearch: (s: Record<string, unknown>) => ({ id: typeof s.id === "string" ? s.id : undefined }),
  component: Track,
});

const STEP_META: Record<string, { e: string }> = {
  "Order Confirmed": { e: "✅" },
  "Pharmacist Reviewing": { e: "👨‍⚕️" },
  "Preparing Order": { e: "📦" },
  "Driver Assigned": { e: "🚗" },
  "Out for Delivery": { e: "🛵" },
  "Delivered": { e: "🏠" },
};

function Track() {
  const { id } = Route.useSearch();
  const orders = useOrders((s) => s.orders);
  const advance = useOrders((s) => s.advance);
  const rate = useOrders((s) => s.rate);
  const rateDelivery = useOrders((s) => s.rateDelivery);
  const order = id ? orders.find((o) => o.id === id) : orders[0];
  const [chat, setChat] = useState(false);

  if (!order) {
    return <div className="max-w-3xl mx-auto px-4 py-10 text-center text-sm text-slate-500">No active orders. Place an order from the shop to start tracking.</div>;
  }

  const stepIdx = ORDER_FLOW.indexOf(order.status);
  const progress = stepIdx / (ORDER_FLOW.length - 1);
  const delivered = order.status === "Delivered";

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-5">
      <div className="bg-gradient-to-r from-[#1B3A6B] to-[#1E5BC6] rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs opacity-80 font-bold uppercase tracking-wider">Order #{order.id}</div>
            <div className="text-xl font-black mt-1">{order.status}</div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-80">Arriving in</div>
            <div className="text-2xl font-black">{Math.max(2, 14 - stepIdx * 2)} min</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-white rounded-2xl p-4 overflow-hidden">
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden bg-gradient-to-br from-[#E0EBFF] via-[#F0F6FF] to-[#E5F4EC]">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="none">
              {/* Street grid */}
              <g stroke="#CBD5E1" strokeWidth="2" fill="none">
                <path d="M0 80 H400" /><path d="M0 160 H400" /><path d="M0 240 H400" />
                <path d="M80 0 V320" /><path d="M200 0 V320" /><path d="M320 0 V320" />
              </g>
              {/* Faded full route */}
              <path d="M40 280 Q 120 240, 200 200 T 360 60" stroke="#CBD5E1" strokeWidth="4" strokeDasharray="6 6" fill="none" strokeLinecap="round" />
              {/* Animated traveled path */}
              <motion.path
                d="M40 280 Q 120 240, 200 200 T 360 60"
                stroke="#1E5BC6"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                pathLength={1}
                initial={false}
                animate={{ strokeDashoffset: 1 - progress }}
                style={{ strokeDasharray: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
              {/* Branch marker */}
              <g>
                <circle cx="40" cy="280" r="10" fill="#1A7A4A" />
                <circle cx="40" cy="280" r="16" fill="#1A7A4A" opacity="0.25">
                  <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>
            <div className="absolute" style={{ left: "6%", bottom: "8%" }}>
              <div className="text-[10px] font-bold text-[#1A7A4A] bg-white rounded px-1.5 py-0.5 shadow">🏪 Branch</div>
            </div>
            <div className="absolute" style={{ top: "12%", right: "8%" }}>
              <div className="text-3xl drop-shadow">📍</div>
              <div className="text-[10px] font-bold text-[#C0392B] bg-white rounded px-1.5 py-0.5 shadow">Home</div>
            </div>
            <motion.div className="absolute -translate-x-1/2 -translate-y-1/2" animate={{ left: `${10 + progress * 80}%`, top: `${88 - progress * 70}%` }} transition={{ duration: 1.2, ease: "easeInOut" }}>
              <motion.div className="text-3xl" animate={{ y: [0, -3, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>🚗</motion.div>
              <div className="text-[10px] font-bold text-[#1E5BC6] bg-white rounded px-1.5 py-0.5 shadow whitespace-nowrap">{order.driverName ?? "Awaiting driver"}</div>
            </motion.div>
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-lg px-2.5 py-1 text-[11px] font-bold text-[#1B3A6B] shadow">
              {Math.round(progress * 100)}% complete
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => { advance(order.id); toast.success("Status advanced"); }} disabled={delivered} className="flex-1 h-11 rounded-full bg-[#1B3A6B] text-white font-bold text-sm disabled:opacity-50">▶ Simulate Next Step</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5">
          <div className="font-black text-[#1B3A6B] mb-3">Delivery Timeline</div>
          <ol className="relative">
            {ORDER_FLOW.map((s, i) => {
              const done = i < stepIdx;
              const current = i === stepIdx;
              const event = order.history.find((h) => h.status === s);
              const ts = event ? new Date(event.at) : null;
              const isLast = i === ORDER_FLOW.length - 1;
              return (
                <li key={s} className="flex items-start gap-3 pb-4 relative">
                  {!isLast && (
                    <span
                      className={`absolute left-4 top-8 -translate-x-1/2 w-0.5 h-full ${done ? "bg-[#1A7A4A]" : "bg-slate-200"}`}
                      aria-hidden
                    />
                  )}
                  <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-sm font-black z-10 ${done ? "bg-[#1A7A4A] text-white" : current ? "bg-[#1E5BC6] text-white animate-pulse ring-4 ring-[#1E5BC6]/20" : "bg-slate-200 text-slate-400"}`}>
                    {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                  </div>
                  <div className="pt-1 flex-1">
                    <div className={`text-sm font-bold ${current ? "text-[#1B3A6B]" : done ? "text-foreground" : "text-muted-foreground"}`}>{STEP_META[s].e} {s}</div>
                    {ts && (
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {ts.toLocaleDateString([], { month: "short", day: "numeric" })} · {ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    )}
                    {current && <div className="text-xs text-[#1E5BC6] font-semibold mt-0.5">In progress…</div>}
                    {!done && !current && <div className="text-[11px] text-slate-400 mt-0.5">Pending</div>}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#1E5BC6] to-[#1B3A6B] flex items-center justify-center text-2xl text-white">🛵</div>
        <div className="flex-1">
          <div className="font-black text-[#1B3A6B]">{order.driverName ?? "Awaiting driver assignment"}</div>
          <div className="text-xs text-amber-500">⭐⭐⭐⭐⭐ <span className="text-muted-foreground">4.9 · {order.items.length} items · ${order.total.toFixed(2)}</span></div>
        </div>
        <a href="tel:+263771234567" className="h-11 w-11 rounded-full bg-[#1A7A4A] text-white flex items-center justify-center"><Phone className="h-5 w-5" /></a>
        <button onClick={() => setChat(true)} className="h-11 px-4 rounded-full bg-[#1B3A6B] text-white font-bold text-sm flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Chat</button>
      </div>

      {delivered && (
        <div className="grid md:grid-cols-2 gap-4">
          <RatingCard title="Rate this order" existing={order.rating} onSubmit={(s, t) => { rate(order.id, s, t); toast.success("Thanks for your rating!"); }} />
          <RatingCard title="Rate your driver" existing={order.deliveryRating} onSubmit={(s, t) => { rateDelivery(order.id, s, t); toast.success("Driver rated."); }} />
        </div>
      )}

      <AnimatePresence>
        {chat && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center p-4" onClick={() => setChat(false)}>
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="font-black text-[#1B3A6B]">Chat with driver</div>
                <button onClick={() => setChat(false)}><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-2 h-48 overflow-auto bg-[#F5F7FA] rounded-lg p-3 text-sm">
                <div className="bg-white rounded-lg p-2 max-w-[80%]">Hi! I have your order and I'm on my way 🚗</div>
                <div className="bg-[#1E5BC6] text-white rounded-lg p-2 max-w-[80%] ml-auto">Great, please ring at the gate.</div>
              </div>
              <div className="flex gap-2 mt-3">
                <input placeholder="Type a message…" className="flex-1 h-10 rounded-full bg-[#F5F7FA] px-4 text-sm outline-none" />
                <button className="h-10 px-4 rounded-full bg-[#1B3A6B] text-white text-sm font-bold">Send</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RatingCard({ title, existing, onSubmit }: { title: string; existing?: { stars: number; text: string }; onSubmit: (s: number, t: string) => void }) {
  const [stars, setStars] = useState(existing?.stars ?? 0);
  const [text, setText] = useState(existing?.text ?? "");
  const submitted = !!existing;
  return (
    <div className="bg-white rounded-2xl p-5">
      <div className="font-black text-[#1B3A6B] mb-2">{title}</div>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => !submitted && setStars(n)} disabled={submitted}>
            <Star className={`h-7 w-7 ${n <= stars ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={submitted}
        rows={2}
        placeholder="Share your experience…"
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#1E5BC6] resize-none disabled:bg-slate-50"
      />
      {!submitted && (
        <button
          onClick={() => stars > 0 && onSubmit(stars, text)}
          disabled={stars === 0}
          className="mt-3 w-full h-10 rounded-full bg-[#1B3A6B] hover:bg-[#1E5BC6] text-white font-bold text-sm disabled:opacity-50"
        >
          Submit rating
        </button>
      )}
      {submitted && <div className="mt-3 text-xs text-emerald-600 font-bold">✓ Thanks — your feedback has been recorded.</div>}
    </div>
  );
}
