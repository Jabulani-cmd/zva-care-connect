import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useStore, getProduct, cartSubtotal } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { useOrders } from "@/lib/orders";
import { Minus, Plus, Trash2, ChevronLeft, Check, Loader2, Lock } from "lucide-react";

export const Route = createFileRoute("/cart")({
  component: CartFlow,
});

const STEPS = ["Cart", "Delivery", "Payment", "Confirmed"] as const;

function CartFlow() {
  const [step, setStep] = useState(0);
  const [placedId, setPlacedId] = useState<string | null>(null);
  const nav = useNavigate();
  const user = useAuth((s) => s.user);

  // Capture delivery details to pass to order
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : "",
    phone: user?.phone ?? "+263 77 123 4567",
    address: user?.address ?? "14 Samora Machel Ave, Harare",
    instructions: "",
  });
  const [payMethod, setPayMethod] = useState<string>("EcoCash");

  useEffect(() => {
    if (user) {
      setDeliveryInfo((d) => ({
        ...d,
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phone ?? d.phone,
        address: user.address ?? d.address,
      }));
    }
  }, [user]);


  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => step === 0 ? nav({ to: "/" }) : setStep(step - 1)} className="flex items-center gap-1 text-sm font-semibold text-[#1B3A6B]">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <div className="hidden md:flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black ${i <= step ? "bg-[#1B3A6B] text-white" : "bg-slate-200 text-slate-500"}`}>{i + 1}</div>
              <span className={`text-xs font-semibold ${i <= step ? "text-[#1B3A6B]" : "text-slate-500"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`h-0.5 w-8 ${i < step ? "bg-[#1B3A6B]" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="md:hidden mb-4">
        <div className="text-xs font-bold text-muted-foreground">Step {step + 1} of 4</div>
        <div className="text-xl font-black text-[#1B3A6B]">{STEPS[step]}</div>
        <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden"><div className="h-full bg-[#1E5BC6] transition-all" style={{ width: `${(step + 1) * 25}%` }} /></div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
          {step === 0 && <CartReview next={() => setStep(1)} />}
          {step === 1 && <Delivery next={() => setStep(2)} />}
          {step === 2 && <Payment next={() => setStep(3)} />}
          {step === 3 && <Confirmed />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function CartReview({ next }: { next: () => void }) {
  const { cart, setQty, remove } = useStore();
  const subtotal = cartSubtotal(cart);
  const delivery = 2.5;
  const total = subtotal + delivery;
  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center">
        <div className="text-6xl mb-3">🛒</div>
        <div className="font-bold text-[#1B3A6B]">Your cart is empty</div>
        <Link to="/" className="inline-block mt-4 bg-[#1B3A6B] text-white rounded-full px-6 py-2 text-sm font-bold">Browse products</Link>
      </div>
    );
  }
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-3">
        {cart.map((c) => {
          const p = getProduct(c.id)!;
          return (
            <div key={c.id} className="bg-white rounded-2xl p-3 flex gap-3 items-center">
              <div className="h-16 w-16 rounded-xl flex items-center justify-center text-3xl shrink-0" style={{ background: p.color }}>{p.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-[#1B3A6B] truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground">${p.price.toFixed(2)}</div>
                <div className="flex items-center gap-1 mt-1">
                  <button onClick={() => setQty(c.id, c.qty - 1)} className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                  <span className="w-7 text-center text-sm font-bold">{c.qty}</span>
                  <button onClick={() => setQty(c.id, c.qty + 1)} className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-[#1B3A6B]">${(p.price * c.qty).toFixed(2)}</div>
                <button onClick={() => remove(c.id)} className="mt-1 text-red-500 text-xs"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-white rounded-2xl p-5 h-fit space-y-2 sticky top-20">
        <div className="font-black text-[#1B3A6B] mb-2">Order Summary</div>
        <Row label="Subtotal" v={`$${subtotal.toFixed(2)}`} />
        <Row label="Delivery" v={`$${delivery.toFixed(2)}`} />
        <div className="border-t my-2" />
        <div className="flex justify-between font-black text-lg text-[#1B3A6B]"><span>Total</span><span>${total.toFixed(2)}</span></div>
        <button onClick={next} className="w-full mt-3 h-12 rounded-full bg-[#1B3A6B] text-white font-bold hover:bg-[#1E5BC6] transition">Proceed to Checkout →</button>
      </div>
    </div>
  );
}

function Row({ label, v }: { label: string; v: string }) {
  return <div className="flex justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-semibold">{v}</span></div>;
}

function Delivery({ next }: { next: () => void }) {
  const [mode, setMode] = useState<"asap" | "slot">("asap");
  const [slot, setSlot] = useState("Morning");
  return (
    <div className="bg-white rounded-2xl p-5 md:p-7 space-y-4 max-w-2xl mx-auto">
      <div className="font-black text-[#1B3A6B] text-lg">Delivery Details</div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Full Name" v="Chipo Moyo" />
        <Field label="Phone Number" v="+263 77 123 4567" />
        <Field label="Delivery Address" v="14 Samora Machel Ave" full />
        <Field label="City" v="Harare" />
        <Field label="Special Instructions" v="" placeholder="e.g. apartment 4B, gate code 1234" full />
      </div>

      <div>
        <div className="font-bold text-sm text-[#1B3A6B] mb-2">Delivery Time</div>
        <div className="flex gap-2">
          <button onClick={() => setMode("asap")} className={`flex-1 rounded-xl py-3 font-bold text-sm border-2 transition ${mode === "asap" ? "border-[#1E5BC6] bg-[#E8EFFC] text-[#1B3A6B]" : "border-border bg-white text-muted-foreground"}`}>⚡ ASAP (30-45 min)</button>
          <button onClick={() => setMode("slot")} className={`flex-1 rounded-xl py-3 font-bold text-sm border-2 transition ${mode === "slot" ? "border-[#1E5BC6] bg-[#E8EFFC] text-[#1B3A6B]" : "border-border bg-white text-muted-foreground"}`}>📅 Schedule</button>
        </div>
        {mode === "slot" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 grid grid-cols-3 gap-2">
            {["Morning", "Afternoon", "Evening"].map((s) => (
              <button key={s} onClick={() => setSlot(s)} className={`py-2 rounded-lg text-xs font-bold border ${slot === s ? "border-[#1E5BC6] bg-[#E8EFFC] text-[#1B3A6B]" : "border-border text-muted-foreground"}`}>{s}<br /><span className="text-[10px] font-normal">{s === "Morning" ? "8-12" : s === "Afternoon" ? "12-5" : "5-9"}</span></button>
            ))}
          </motion.div>
        )}
      </div>

      <button onClick={next} className="w-full h-12 rounded-full bg-[#1B3A6B] text-white font-bold hover:bg-[#1E5BC6] transition">Continue to Payment →</button>
    </div>
  );
}

function Field({ label, v, full, placeholder }: { label: string; v?: string; full?: boolean; placeholder?: string }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-bold text-[#1B3A6B]">{label}</span>
      <input defaultValue={v} placeholder={placeholder} className="mt-1 w-full h-11 rounded-lg border border-border px-3 text-sm outline-none focus:border-[#1E5BC6]" />
    </label>
  );
}

type PayMethod = "ecocash" | "onemoney" | "innbucks" | "telecash" | "zipit" | "card" | "cod";
const methods: { id: PayMethod; name: string; icon: string; iconBg: string; currency: string; desc: string }[] = [
  { id: "ecocash", name: "EcoCash", icon: "📱", iconBg: "#1A7A4A", currency: "ZiG / USD", desc: "Enter your EcoCash number. An OTP will be sent to confirm." },
  { id: "onemoney", name: "OneMoney", icon: "📱", iconBg: "#E67E22", currency: "ZiG / USD", desc: "NetOne mobile money. Enter number + PIN to confirm." },
  { id: "innbucks", name: "InnBucks", icon: "💵", iconBg: "#1E5BC6", currency: "USD", desc: "USD digital wallet. Fast and secure." },
  { id: "telecash", name: "Telecash", icon: "📱", iconBg: "#7E3AC2", currency: "ZiG", desc: "Telecel mobile money payment." },
  { id: "zipit", name: "ZIPIT", icon: "🏦", iconBg: "#1B3A6B", currency: "ZiG / USD", desc: "Instant interbank transfer via ZIPIT network." },
  { id: "card", name: "Visa / Mastercard", icon: "💳", iconBg: "#64748B", currency: "USD", desc: "Secure international card payment." },
  { id: "cod", name: "Cash on Delivery", icon: "💰", iconBg: "#C49A2C", currency: "ZiG / USD", desc: "Pay the driver when your order arrives." },
];

function Payment({ next }: { next: () => void }) {
  const [sel, setSel] = useState<PayMethod | null>(null);
  return (
    <div className="grid md:grid-cols-5 gap-4 max-w-4xl mx-auto">
      <div className="md:col-span-3 space-y-2">
        <div className="font-black text-[#1B3A6B] text-lg mb-2">Choose Payment</div>
        {methods.map((m) => (
          <button key={m.id} onClick={() => setSel(m.id)} className={`w-full text-left bg-white rounded-2xl p-3 flex items-center gap-3 border-2 transition ${sel === m.id ? "border-[#1E5BC6] shadow-md" : "border-transparent hover:border-border"}`}>
            <div className="h-11 w-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: m.iconBg + "22", color: m.iconBg }}>{m.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-[#1B3A6B]">{m.name} <span className="text-[10px] font-semibold text-muted-foreground ml-1">{m.currency}</span></div>
              <div className="text-xs text-muted-foreground line-clamp-1">{m.desc}</div>
            </div>
            <div className={`h-5 w-5 rounded-full border-2 ${sel === m.id ? "border-[#1E5BC6] bg-[#1E5BC6]" : "border-slate-300"} flex items-center justify-center`}>{sel === m.id && <Check className="h-3 w-3 text-white" />}</div>
          </button>
        ))}
      </div>
      <div className="md:col-span-2">
        <div className="bg-white rounded-2xl p-5 sticky top-20">
          {!sel && <div className="text-sm text-muted-foreground text-center py-10">Select a payment method to continue</div>}
          {sel && <PayForm method={methods.find((m) => m.id === sel)!} onSuccess={next} />}
        </div>
      </div>
    </div>
  );
}

function PayForm({ method, onSuccess }: { method: typeof methods[0]; onSuccess: () => void }) {
  const [phase, setPhase] = useState<"form" | "otp" | "processing" | "success">("form");
  const isMobile = ["ecocash", "onemoney", "telecash", "innbucks"].includes(method.id);

  function submit() {
    if (isMobile && phase === "form") return setPhase("otp");
    setPhase("processing");
    setTimeout(() => { setPhase("success"); setTimeout(onSuccess, 1100); }, 1400);
  }

  if (phase === "processing") return (
    <div className="py-10 text-center"><Loader2 className="h-10 w-10 animate-spin text-[#1E5BC6] mx-auto" /><div className="mt-3 font-bold text-[#1B3A6B]">Processing payment…</div></div>
  );
  if (phase === "success") return (
    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-8 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="h-16 w-16 mx-auto rounded-full bg-[#1A7A4A] flex items-center justify-center text-white"><Check className="h-10 w-10" strokeWidth={3} /></motion.div>
      <div className="mt-3 font-black text-[#1B3A6B]">Payment Successful</div>
    </motion.div>
  );

  return (
    <div className="space-y-3">
      <div className="font-bold text-[#1B3A6B] text-sm">{method.name}</div>
      {phase === "form" && isMobile && (
        <>
          <Field label="Phone Number" v="+263 77 123 4567" />
          <Field label="PIN" placeholder="••••" />
          <button onClick={submit} className="w-full h-11 rounded-full bg-[#1B3A6B] text-white font-bold">Send OTP</button>
        </>
      )}
      {phase === "otp" && (
        <>
          <div className="text-xs text-muted-foreground">An OTP was sent to +263 77 123 4567</div>
          <div className="flex gap-2 justify-center my-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <input key={i} maxLength={1} defaultValue={[1,2,3,4,5,6][i]} className="h-11 w-9 text-center font-black text-lg rounded-lg border-2 border-[#1E5BC6] outline-none" />
            ))}
          </div>
          <button onClick={submit} className="w-full h-11 rounded-full bg-[#1B3A6B] text-white font-bold">Verify & Pay $26.30</button>
        </>
      )}
      {phase === "form" && method.id === "zipit" && (
        <>
          <label className="block"><span className="text-xs font-bold text-[#1B3A6B]">Bank</span>
            <select className="mt-1 w-full h-11 rounded-lg border border-border px-3 text-sm"><option>CBZ Bank</option><option>Stanbic</option><option>FBC</option><option>Steward Bank</option></select>
          </label>
          <Field label="Account Number" placeholder="00112233445" />
          <button onClick={submit} className="w-full h-11 rounded-full bg-[#1B3A6B] text-white font-bold">Confirm Transfer</button>
        </>
      )}
      {phase === "form" && method.id === "card" && (
        <>
          <CardNumber />
          <div className="grid grid-cols-2 gap-2"><Field label="Expiry" placeholder="MM/YY" /><Field label="CVV" placeholder="123" /></div>
          <Field label="Cardholder Name" v="Chipo Moyo" />
          <Field label="Billing Address" v="14 Samora Machel Ave, Harare" />
          <button onClick={submit} className="w-full h-11 rounded-full bg-[#1B3A6B] text-white font-bold flex items-center justify-center gap-2"><Lock className="h-4 w-4" /> Pay Securely $26.30</button>
        </>
      )}
      {phase === "form" && method.id === "cod" && (
        <>
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">Have $26.30 ready for the driver on delivery.</div>
          <button onClick={submit} className="w-full h-11 rounded-full bg-[#1B3A6B] text-white font-bold">Confirm Order</button>
        </>
      )}
    </div>
  );
}

function CardNumber() {
  const [v, setV] = useState("");
  return (
    <label className="block"><span className="text-xs font-bold text-[#1B3A6B]">Card Number</span>
      <input value={v} onChange={(e) => {
        const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
        setV(raw.replace(/(.{4})/g, "$1 ").trim());
      }} placeholder="4242 4242 4242 4242" className="mt-1 w-full h-11 rounded-lg border border-border px-3 text-sm font-mono tracking-wider outline-none focus:border-[#1E5BC6]" />
    </label>
  );
}

function Confirmed() {
  const { cart, clear } = useStore();
  const subtotal = cartSubtotal(cart);
  const total = subtotal + 2.5;
  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 text-center shadow-sm">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.7 }} className="h-24 w-24 mx-auto rounded-full bg-[#1A7A4A] flex items-center justify-center text-white shadow-lg">
        <Check className="h-14 w-14" strokeWidth={3} />
      </motion.div>
      <h1 className="text-2xl font-black text-[#1B3A6B] mt-5">Order Confirmed!</h1>
      <div className="text-sm text-muted-foreground mt-1">Order ref</div>
      <div className="font-black text-lg text-[#1E5BC6]">#KP-2026-00847</div>

      <div className="text-left bg-[#F5F7FA] rounded-xl p-4 mt-5 space-y-1 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Items</span><span className="font-bold">{cart.length}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-bold">${total.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="font-bold">14 Samora Machel Ave</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">ETA</span><span className="font-bold text-[#1A7A4A]">30-45 minutes</span></div>
      </div>

      <Link to="/track" onClick={() => clear()} className="block mt-5 h-12 rounded-full bg-[#1B3A6B] text-white font-bold leading-[3rem]">Track My Order →</Link>
    </div>
  );
}
