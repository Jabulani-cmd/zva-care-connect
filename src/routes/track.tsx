import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Check, Phone, MessageCircle, X } from "lucide-react";

export const Route = createFileRoute("/track")({
  component: Track,
});

const STEPS = [
  { l: "Order Confirmed", e: "✅" },
  { l: "Pharmacist Reviewing", e: "👨‍⚕️" },
  { l: "Preparing Order", e: "📦" },
  { l: "Driver Assigned", e: "🚗" },
  { l: "Out for Delivery", e: "🛵" },
  { l: "Delivered", e: "🏠" },
];

function Track() {
  const { trackingStep, advanceTracking, resetTracking } = useStore();
  const [chat, setChat] = useState(false);
  const progress = trackingStep / (STEPS.length - 1);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-5">
      <div className="bg-gradient-to-r from-[#1B3A6B] to-[#1E5BC6] rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs opacity-80 font-bold uppercase tracking-wider">Order #KP-2026-00847</div>
            <div className="text-xl font-black mt-1">{STEPS[trackingStep].l}</div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-80">Arriving in</div>
            <div className="text-2xl font-black">{Math.max(2, 12 - trackingStep * 2)} min</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Map */}
        <div className="md:col-span-2 bg-white rounded-2xl p-4 overflow-hidden">
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden bg-gradient-to-br from-[#E0EBFF] via-[#F0F6FF] to-[#E5F4EC]">
            {/* fake streets */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320">
              <g stroke="#CBD5E1" strokeWidth="2" fill="none">
                <path d="M0 80 H400" /><path d="M0 160 H400" /><path d="M0 240 H400" />
                <path d="M80 0 V320" /><path d="M200 0 V320" /><path d="M320 0 V320" />
              </g>
              <path d="M40 280 Q 120 240, 200 200 T 360 60" stroke="#1E5BC6" strokeWidth="3" strokeDasharray="6 6" fill="none" />
            </svg>
            {/* destination */}
            <div className="absolute" style={{ top: "12%", right: "8%" }}>
              <div className="text-3xl">📍</div>
              <div className="text-[10px] font-bold text-[#C0392B] bg-white rounded px-1.5 py-0.5 shadow">Home</div>
            </div>
            {/* car */}
            <motion.div
              className="absolute"
              animate={{
                left: `${10 + progress * 75}%`,
                top: `${82 - progress * 65}%`,
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <div className="text-3xl">🚗</div>
              <div className="text-[10px] font-bold text-[#1E5BC6] bg-white rounded px-1.5 py-0.5 shadow">Tinashe</div>
            </motion.div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={advanceTracking} disabled={trackingStep >= STEPS.length - 1} className="flex-1 h-11 rounded-full bg-[#1B3A6B] text-white font-bold text-sm disabled:opacity-50">▶ Simulate Delivery Progress</button>
            <button onClick={resetTracking} className="px-4 h-11 rounded-full border-2 border-[#1B3A6B] text-[#1B3A6B] font-bold text-sm">Reset</button>
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-2xl p-5">
          <div className="font-black text-[#1B3A6B] mb-3">Delivery Progress</div>
          <ol className="space-y-3">
            {STEPS.map((s, i) => {
              const done = i < trackingStep;
              const current = i === trackingStep;
              return (
                <li key={s.l} className="flex items-start gap-3">
                  <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-sm font-black ${done ? "bg-[#1A7A4A] text-white" : current ? "bg-[#1E5BC6] text-white animate-pulse" : "bg-slate-200 text-slate-400"}`}>
                    {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                  </div>
                  <div className="pt-1">
                    <div className={`text-sm font-bold ${current ? "text-[#1B3A6B]" : done ? "text-foreground" : "text-muted-foreground"}`}>{s.e} {s.l}</div>
                    {current && <div className="text-xs text-[#1E5BC6] font-semibold">In progress…</div>}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Driver card */}
      <div className="bg-white rounded-2xl p-4 flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#1E5BC6] to-[#1B3A6B] flex items-center justify-center text-2xl">👨‍⚕️</div>
        <div className="flex-1">
          <div className="font-black text-[#1B3A6B]">Tinashe M.</div>
          <div className="text-xs text-amber-500">⭐⭐⭐⭐⭐ <span className="text-muted-foreground">4.9 · 327 deliveries</span></div>
        </div>
        <a href="tel:+263771234567" className="h-11 w-11 rounded-full bg-[#1A7A4A] text-white flex items-center justify-center"><Phone className="h-5 w-5" /></a>
        <button onClick={() => setChat(true)} className="h-11 px-4 rounded-full bg-[#1B3A6B] text-white font-bold text-sm flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Chat</button>
      </div>

      <AnimatePresence>
        {chat && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center p-4" onClick={() => setChat(false)}>
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="font-black text-[#1B3A6B]">Chat with Tinashe</div>
                <button onClick={() => setChat(false)}><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-2 h-48 overflow-auto bg-[#F5F7FA] rounded-lg p-3 text-sm">
                <div className="bg-white rounded-lg p-2 max-w-[80%]">Hi! I have your order and I'm 12 min away 🚗</div>
                <div className="bg-[#1E5BC6] text-white rounded-lg p-2 max-w-[80%] ml-auto">Great, please ring at the gate.</div>
                <div className="bg-white rounded-lg p-2 max-w-[80%]">Will do! 👍</div>
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
