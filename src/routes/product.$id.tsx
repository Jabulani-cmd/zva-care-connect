import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, Minus, Plus, Camera, Image as ImageIcon, AlertTriangle, Upload, Star, Heart, Share2, ShieldCheck, Truck, MapPin } from "lucide-react";
import { getProduct, useStore } from "@/lib/store";
import { PRODUCTS_ALL, PRODUCT_IMAGE } from "@/lib/demo-data";
import { ProductCarousel } from "@/components/product-carousel";
import { useBranch, branchStock, getBranch } from "@/lib/branches";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
});

type UploadStage = "idle" | "picking" | "preview" | "uploading" | "done";
type Tab = "description" | "usage" | "reviews";

const REVIEWS = [
  { name: "Tendai M.", stars: 5, date: "Jun 02, 2026", text: "Fast delivery and authentic product. Will order again." },
  { name: "Rumbidzai S.", stars: 4, date: "May 28, 2026", text: "Good quality. Packaging was sealed and clean." },
  { name: "Tafara N.", stars: 5, date: "May 14, 2026", text: "Pharmacist called to confirm dosage. Excellent service." },
];

function ProductPage() {
  const { id } = Route.useParams();
  const p = getProduct(id);
  const add = useStore((s) => s.add);
  const nav = useNavigate();
  const branchId = useBranch((s) => s.selectedId);
  const branch = getBranch(branchId);

  const [qty, setQty] = useState(1);
  const [stage, setStage] = useState<UploadStage>("idle");
  const [progress, setProgress] = useState(0);
  const [rxOk, setRxOk] = useState(false);
  const [tab, setTab] = useState<Tab>("description");
  const [galleryIdx, setGalleryIdx] = useState(0);

  if (!p) return <div className="p-10 text-center">Product not found. <Link to="/" className="underline">Back home</Link></div>;

  const related = PRODUCTS_ALL.filter((x) => x.id !== p.id && x.category === p.category).slice(0, 12);
  const requiresRx = p.stock === "rx";
  const img = PRODUCT_IMAGE[p.id];

  const bStock = branchId && !requiresRx ? branchStock(p.id, branchId) : null;
  const stockColor =
    requiresRx ? "#1E5BC6" :
    bStock?.status === "out" ? "#C0392B" :
    bStock?.status === "low" ? "#C47B10" : "#1A7A4A";
  const stockLabel =
    requiresRx ? "Prescription Required" :
    bStock?.status === "out" ? `Out of stock${branch ? " at " + branch.area : ""}` :
    bStock?.status === "low" ? `Low stock — only ${bStock.count} left${branch ? " at " + branch.area : ""}` :
    bStock ? `In stock${branch ? " at " + branch.area : ""}` : "In stock";

  const avgStars = (REVIEWS.reduce((a, r) => a + r.stars, 0) / REVIEWS.length).toFixed(1);

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
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
      <button onClick={() => nav({ to: "/shop" })} className="flex items-center gap-1 text-sm font-semibold text-[#1B3A6B] mb-4 hover:text-[#1E5BC6]">
        <ChevronLeft className="h-4 w-4" /> Back to Shop
      </button>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10">
        {/* Gallery */}
        <div>
          <motion.div
            key={galleryIdx}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="aspect-square rounded-3xl flex items-center justify-center shadow-sm overflow-hidden bg-white border border-slate-200"
            style={{ background: img ? "#fff" : p.color }}
          >
            {img ? (
              <img src={img} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[160px]">{p.emoji}</span>
            )}
          </motion.div>
          <div className="mt-3 flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setGalleryIdx(i)}
                className={`h-20 w-20 rounded-xl overflow-hidden border-2 transition ${
                  galleryIdx === i ? "border-[#1E5BC6]" : "border-slate-200 hover:border-slate-300"
                }`}
                style={{ background: img ? "#fff" : p.color }}
              >
                {img ? (
                  <img src={img} alt="" className="w-full h-full object-cover" style={{ filter: i === 0 ? "none" : `hue-rotate(${i * 8}deg) brightness(${1 - i * 0.04})` }} />
                ) : (
                  <span className="text-3xl flex items-center justify-center h-full">{p.emoji}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#1E5BC6] uppercase tracking-wider">{p.category}</span>
            {p.brand && <><span className="text-slate-300">·</span><span className="text-slate-500">{p.brand}</span></>}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1B3A6B] leading-tight">{p.name}</h1>

          {/* Rating row */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={16} className={n <= Math.round(+avgStars) ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
              ))}
            </div>
            <span className="text-sm font-bold text-[#1B3A6B]">{avgStars}</span>
            <button onClick={() => setTab("reviews")} className="text-xs text-slate-500 hover:text-[#1E5BC6]">({REVIEWS.length} reviews)</button>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1B3A6B]">${p.price.toFixed(2)}</span>
            <span className="text-sm text-slate-400">USD</span>
          </div>

          {/* Stock pill */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
            style={{ background: stockColor + "1A", color: stockColor }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: stockColor }} />
            {stockLabel}
          </div>

          <p className="text-sm text-foreground/80 leading-relaxed">{p.description}</p>

          {/* Rx upload card */}
          {requiresRx && (
            <div className="rounded-2xl bg-[#E8EFFC] border border-[#1E5BC6]/30 p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📋</div>
                <div className="flex-1">
                  <div className="font-bold text-[#1B3A6B] text-sm">Prescription Required</div>
                  <p className="text-xs text-foreground/70 mt-1">Upload your prescription for pharmacist review.</p>
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

          {/* Qty + Add to cart */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center bg-white border border-slate-200 rounded-full">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-12 w-12 flex items-center justify-center text-[#1B3A6B]"><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="h-12 w-12 flex items-center justify-center text-[#1B3A6B]"><Plus className="h-4 w-4" /></button>
            </div>
            <button
              disabled={p.stock === "out" || (requiresRx && !rxOk)}
              onClick={() => { add(p.id, qty); toast.success(`Added ${qty} × ${p.name}`); }}
              className="flex-1 h-12 rounded-full bg-[#1B3A6B] text-white font-bold hover:bg-[#1E5BC6] transition disabled:opacity-50"
            >
              {p.stock === "out" ? "Out of Stock" : requiresRx && !rxOk ? "Upload Rx First" : "Add to Cart"}
            </button>
            <button className="h-12 w-12 rounded-full bg-white border border-slate-200 text-[#1B3A6B] flex items-center justify-center hover:border-[#1E5BC6]" aria-label="Wishlist">
              <Heart className="h-4 w-4" />
            </button>
            <button className="h-12 w-12 rounded-full bg-white border border-slate-200 text-[#1B3A6B] flex items-center justify-center hover:border-[#1E5BC6]" aria-label="Share">
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          {/* Trust icons */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="flex items-center gap-2 text-xs text-[#1B3A6B] bg-slate-50 rounded-xl p-2.5">
              <ShieldCheck size={16} className="text-[#1A7A4A]" /> <span className="font-semibold">Authentic</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#1B3A6B] bg-slate-50 rounded-xl p-2.5">
              <Truck size={16} className="text-[#1E5BC6]" /> <span className="font-semibold">Same-day</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#1B3A6B] bg-slate-50 rounded-xl p-2.5">
              <MapPin size={16} className="text-[#C47B10]" /> <span className="font-semibold">5 branches</span>
            </div>
          </div>

          {requiresRx && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex gap-2 text-xs text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Please inform your pharmacist of all medications you are currently taking, including OTC and herbal supplements.</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10 bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          {([
            ["description", "Description"],
            ["usage", "Usage Instructions"],
            ["reviews", `Reviews (${REVIEWS.length})`],
          ] as [Tab, string][]).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`relative px-5 py-3.5 text-sm font-bold transition ${
                tab === k ? "text-[#1B3A6B]" : "text-slate-500 hover:text-[#1B3A6B]"
              }`}
            >
              {label}
              {tab === k && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#1E5BC6]" />}
            </button>
          ))}
        </div>
        <div className="p-5 md:p-7">
          {tab === "description" && (
            <div className="space-y-3 text-sm text-foreground/80 leading-relaxed">
              <p>{p.description}</p>
              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                {p.manufacturer && <Spec label="Manufacturer" value={p.manufacturer} />}
                {p.brand && <Spec label="Brand" value={p.brand} />}
                <Spec label="Category" value={p.category} />
                {p.expiry && <Spec label="Expiry" value={p.expiry} />}
              </div>
            </div>
          )}
          {tab === "usage" && (
            <div className="space-y-3 text-sm text-foreground/80 leading-relaxed">
              {p.dosage ? (
                <>
                  <p><strong className="text-[#1B3A6B]">Dosage:</strong> {p.dosage}</p>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                    <li>Follow the dosage on the label or as advised by your pharmacist.</li>
                    <li>Take with a full glass of water unless directed otherwise.</li>
                    <li>Do not exceed the recommended daily dose.</li>
                    <li>Store in a cool, dry place out of reach of children.</li>
                    <li>Consult a pharmacist if symptoms persist or worsen.</li>
                  </ul>
                </>
              ) : (
                <p className="text-slate-500">Refer to the product packaging for usage instructions, or ask the pharmacist on duty for guidance.</p>
              )}
            </div>
          )}
          {tab === "reviews" && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-3 border-b border-slate-100">
                <div className="text-4xl font-black text-[#1B3A6B]">{avgStars}</div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={16} className={n <= Math.round(+avgStars) ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Based on {REVIEWS.length} verified reviews</div>
                </div>
              </div>
              {REVIEWS.map((r, i) => (
                <div key={i} className="border-b border-slate-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="font-bold text-sm text-[#1B3A6B]">{r.name}</div>
                    <div className="text-[11px] text-slate-400">{r.date}</div>
                  </div>
                  <div className="flex items-center gap-0.5 mb-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={12} className={n <= r.stars ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-10">
          <ProductCarousel eyebrow="You may also like" title="Related Products" items={related} />
        </div>
      )}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="text-sm font-semibold text-[#1B3A6B] mt-0.5">{value}</div>
    </div>
  );
}
