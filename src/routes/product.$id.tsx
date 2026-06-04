import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, Minus, Plus, Camera, Image as ImageIcon, AlertTriangle, Upload } from "lucide-react";
import { getProduct, PRODUCTS, useStore } from "@/lib/store";
import { StockBadge } from "@/components/stock-badge";
import { ProductCard } from "@/components/product-card";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
});

type UploadStage = "idle" | "picking" | "preview" | "uploading" | "done";

function ProductPage() {
  const { id } = Route.useParams();
  const p = getProduct(id);
  const add = useStore((s) => s.add);
  const nav = useNavigate();
  const [qty, setQty] = useState(1);
  const [stage, setStage] = useState<UploadStage>("idle");
  const [progress, setProgress] = useState(0);
  const [rxOk, setRxOk] = useState(false);

  if (!p) return <div className="p-10 text-center">Product not found. <Link to="/" className="underline">Back home</Link></div>;

  const related = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 4);
  const requiresRx = p.stock === "rx";

  function startUpload() {
    setStage("preview");
    setTimeout(() => {
      setStage("uploading");
      setProgress(0);
      const iv = setInterval(() => {
        setProgress((v) => {
          if (v >= 100) { clearInterval(iv); setStage("done"); setRxOk(true); return 100; }
          return v + 8;
        });
      }, 120);
    }, 700);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8">
      <button onClick={() => nav({ to: "/" })} className="flex items-center gap-1 text-sm font-semibold text-[#1B3A6B] mb-4"><ChevronLeft className="h-4 w-4" /> Back</button>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="aspect-square rounded-3xl flex items-center justify-center text-[160px] shadow-sm" style={{ background: p.color }}>
          {p.emoji}
        </motion.div>

        <div className="space-y-4">
          <div className="flex items-center gap-2"><StockBadge stock={p.stock} count={p.stockCount} /><span className="text-xs text-muted-foreground">{p.category}</span></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#1B3A6B] leading-tight">{p.name}</h1>
            {p.brand && <div className="text-sm text-muted-foreground mt-1">by {p.brand}</div>}
          </div>
          <div className="text-3xl font-black text-[#1B3A6B]">${p.price.toFixed(2)}</div>
          <p className="text-sm text-foreground/80 leading-relaxed">{p.description}</p>

          <div className="grid grid-cols-3 gap-2 text-xs">
            {p.dosage && <div className="bg-white rounded-xl p-3 border border-border"><div className="font-bold text-[#1B3A6B] mb-0.5">Dosage</div><div className="text-muted-foreground">{p.dosage}</div></div>}
            {p.manufacturer && <div className="bg-white rounded-xl p-3 border border-border"><div className="font-bold text-[#1B3A6B] mb-0.5">Manufacturer</div><div className="text-muted-foreground">{p.manufacturer}</div></div>}
            {p.expiry && <div className="bg-white rounded-xl p-3 border border-border"><div className="font-bold text-[#1B3A6B] mb-0.5">Expiry</div><div className="text-muted-foreground">{p.expiry}</div></div>}
          </div>

          {requiresRx && (
            <div className="rounded-2xl bg-[#E8EFFC] border border-[#1E5BC6]/30 p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📋</div>
                <div className="flex-1">
                  <div className="font-bold text-[#1B3A6B] text-sm">Prescription Required</div>
                  <p className="text-xs text-foreground/70 mt-1">This item requires a valid prescription. Upload yours below for pharmacist review.</p>
                  {stage === "idle" && (
                    <button onClick={() => setStage("picking")} className="mt-3 inline-flex items-center gap-2 bg-[#1E5BC6] text-white rounded-lg px-4 py-2 text-xs font-bold">
                      <Upload className="h-3.5 w-3.5" /> Upload Prescription
                    </button>
                  )}
                  <AnimatePresence>
                    {stage === "picking" && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 flex gap-2">
                        <button onClick={startUpload} className="flex-1 bg-white border-2 border-[#1E5BC6] text-[#1E5BC6] rounded-lg py-2 text-xs font-bold flex items-center justify-center gap-1.5"><Camera className="h-4 w-4" /> Camera</button>
                        <button onClick={startUpload} className="flex-1 bg-white border-2 border-[#1E5BC6] text-[#1E5BC6] rounded-lg py-2 text-xs font-bold flex items-center justify-center gap-1.5"><ImageIcon className="h-4 w-4" /> Gallery</button>
                      </motion.div>
                    )}
                    {stage === "preview" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 bg-white rounded-lg p-3 flex items-center gap-3">
                        <div className="h-14 w-14 rounded bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-2xl">📄</div>
                        <div className="text-xs"><div className="font-bold">prescription.jpg</div><div className="text-muted-foreground">Preparing…</div></div>
                      </motion.div>
                    )}
                    {stage === "uploading" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 bg-white rounded-lg p-3">
                        <div className="text-xs font-semibold mb-2">Uploading… {progress}%</div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-[#1E5BC6] transition-all" style={{ width: `${progress}%` }} /></div>
                      </motion.div>
                    )}
                    {stage === "done" && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-3 bg-[#E5F4EC] border border-[#1A7A4A]/30 rounded-lg p-3 text-xs text-[#0F5C36] font-semibold">
                        ✅ Prescription received. A pharmacist will review within 15 minutes.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

          {requiresRx && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex gap-2 text-xs text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>⚠️ Please inform your pharmacist of all medications you are currently taking, including OTC and herbal supplements.</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center bg-white border border-border rounded-full">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-11 w-11 flex items-center justify-center text-[#1B3A6B]"><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="h-11 w-11 flex items-center justify-center text-[#1B3A6B]"><Plus className="h-4 w-4" /></button>
            </div>
            <button
              disabled={p.stock === "out" || (requiresRx && !rxOk)}
              onClick={() => { add(p.id, qty); toast.success(`Added ${qty} × ${p.name}`); }}
              className="flex-1 h-12 rounded-full bg-[#1B3A6B] text-white font-bold hover:bg-[#1E5BC6] transition disabled:opacity-50"
            >
              {p.stock === "out" ? "Out of Stock" : requiresRx && !rxOk ? "Upload Rx First" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-black text-[#1B3A6B] mb-3">You may also like</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {related.map((r) => (
            <div key={r.id} className="shrink-0 w-44"><ProductCard p={r} /></div>
          ))}
        </div>
      </div>
    </div>
  );
}
