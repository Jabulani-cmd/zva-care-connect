import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, FileText, X, Check, ChevronRight, ArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/lib/auth";
import { useRx, RX_PROGRESS, statusColor, type RxRecord } from "@/lib/rx";
import { toast } from "sonner";

export const Route = createFileRoute("/prescriptions")({
  head: () => ({ meta: [{ title: "My Prescriptions — Kings Pharmacy" }] }),
  component: () => <AuthGuard role="customer"><Prescriptions /></AuthGuard>,
});

type View = "list" | "new" | { detail: string };

function Prescriptions() {
  const user = useAuth((s) => s.user)!;
  const all = useRx((s) => s.list);
  const mine = all.filter((r) => r.customerId === user.id).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  const [view, setView] = useState<View>("list");

  if (view === "new") {
    return <NewPrescription onDone={(id) => setView({ detail: id })} onCancel={() => setView("list")} />;
  }
  if (typeof view === "object") {
    const rec = all.find((r) => r.id === view.detail);
    if (rec) return <Detail rec={rec} onBack={() => setView("list")} />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#1E5BC6]">Prescriptions</div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1B3A6B]">My Prescriptions</h1>
        </div>
        <button
          onClick={() => setView("new")}
          className="inline-flex items-center gap-2 bg-[#1E5BC6] hover:bg-[#1B3A6B] text-white font-bold text-sm px-4 py-2.5 rounded-full transition"
        >
          <ImagePlus className="h-4 w-4" /> New Prescription
        </button>
      </header>

      {mine.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <FileText className="h-10 w-10 text-[#1E5BC6] mx-auto" />
          <div className="mt-3 font-black text-[#1B3A6B]">No prescriptions yet</div>
          <p className="text-sm text-slate-500 mt-1">Submit one and a pharmacist will review it shortly.</p>
          <button onClick={() => setView("new")} className="mt-4 bg-[#1B3A6B] text-white font-bold px-5 py-2 rounded-full text-sm">Upload prescription</button>
        </div>
      )}

      <div className="space-y-3">
        {mine.map((r) => {
          const c = statusColor(r.status);
          return (
            <button
              key={r.id}
              onClick={() => setView({ detail: r.id })}
              className="w-full text-left bg-white rounded-2xl p-3 flex gap-3 items-center border border-slate-200 hover:border-[#1E5BC6]/40 hover:shadow-sm transition"
            >
              <img src={r.imageDataUrl} alt="" className="h-16 w-16 rounded-xl object-cover bg-slate-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[11px] text-slate-400">{r.id}</div>
                <div className="font-bold text-sm text-[#1B3A6B] truncate">{r.medication ?? r.patientName}</div>
                <div className="text-xs text-slate-500 truncate">{new Date(r.submittedAt).toLocaleString()}</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full shrink-0" style={{ background: c.bg, color: c.fg }}>{r.status}</span>
              <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────

function NewPrescription({ onDone, onCancel }: { onDone: (id: string) => void; onCancel: () => void }) {
  const user = useAuth((s) => s.user)!;
  const submit = useRx((s) => s.submit);
  const [step, setStep] = useState<"capture" | "details" | "submitting">("capture");
  const [image, setImage] = useState<{ url: string; name: string; type: string } | null>(null);
  const [form, setForm] = useState({
    patientName: `${user.firstName} ${user.lastName}`,
    contactPhone: user.phone ?? "",
    deliveryAddress: user.address ?? "",
    notes: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  function onFile(f: File | null) {
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) {
      toast.error("File too large. Please choose an image under 8 MB.");
      return;
    }
    const allowed = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowed.includes(f.type)) {
      toast.error("Unsupported file type. Use JPG, PNG or PDF.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage({ url: String(reader.result), name: f.name, type: f.type });
    };
    reader.readAsDataURL(f);
  }

  function doSubmit() {
    if (!image) { toast.error("Please attach your prescription."); return; }
    if (!form.patientName.trim() || !form.contactPhone.trim() || !form.deliveryAddress.trim()) {
      toast.error("Please complete patient name, phone and address.");
      return;
    }
    setStep("submitting");
    setTimeout(() => {
      const rec = submit({
        customerId: user.id,
        patientName: form.patientName.trim(),
        contactPhone: form.contactPhone.trim(),
        deliveryAddress: form.deliveryAddress.trim(),
        notes: form.notes.trim(),
        imageDataUrl: image.url,
        fileName: image.name,
        fileType: image.type,
      });
      toast.success("Prescription received — a pharmacist will review it shortly.");
      onDone(rec.id);
    }, 900);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
      <button onClick={onCancel} className="inline-flex items-center gap-1 text-sm font-bold text-[#1B3A6B] mb-4"><ArrowLeft className="h-4 w-4" /> Back</button>
      <h1 className="text-2xl font-black text-[#1B3A6B]">Submit Prescription</h1>
      <p className="text-sm text-slate-500 mb-5">Take a photo or upload an image / PDF of your prescription.</p>

      {/* Step 1: capture */}
      {step === "capture" && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
            <button
              onClick={() => cameraRef.current?.click()}
              className="bg-white border-2 border-dashed border-[#1E5BC6]/40 hover:border-[#1E5BC6] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition group"
            >
              <div className="h-12 w-12 rounded-full bg-[#EAF3FF] flex items-center justify-center group-hover:bg-[#1E5BC6] group-hover:text-white text-[#1E5BC6] transition">
                <Camera className="h-6 w-6" />
              </div>
              <div className="font-bold text-[#1B3A6B]">Take a Photo</div>
              <div className="text-xs text-slate-500 text-center">Use your phone camera</div>
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,application/pdf"
              hidden
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="bg-white border-2 border-dashed border-[#1E5BC6]/40 hover:border-[#1E5BC6] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition group"
            >
              <div className="h-12 w-12 rounded-full bg-[#EAF3FF] flex items-center justify-center group-hover:bg-[#1E5BC6] group-hover:text-white text-[#1E5BC6] transition">
                <Upload className="h-6 w-6" />
              </div>
              <div className="font-bold text-[#1B3A6B]">Upload File</div>
              <div className="text-xs text-slate-500 text-center">JPG, PNG or PDF</div>
            </button>
          </div>

          {image && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-sm text-[#1B3A6B] truncate">{image.name}</div>
                <button onClick={() => setImage(null)} className="text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>
              </div>
              {image.type === "application/pdf" ? (
                <div className="bg-slate-50 rounded-xl py-12 text-center">
                  <FileText className="h-10 w-10 mx-auto text-[#C0392B]" />
                  <div className="mt-2 font-bold text-[#1B3A6B] text-sm">PDF attached</div>
                </div>
              ) : (
                <img src={image.url} alt="Prescription preview" className="w-full max-h-96 object-contain rounded-xl bg-slate-50" />
              )}
              <button onClick={() => setStep("details")} className="mt-3 w-full h-12 rounded-full bg-[#1B3A6B] hover:bg-[#1E5BC6] text-white font-bold transition">
                Looks good — Continue →
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Step 2: details */}
      {step === "details" && image && (
        <div className="space-y-3 bg-white rounded-2xl p-5 border border-slate-200">
          <img src={image.url} alt="" className="w-full max-h-44 object-contain rounded-xl bg-slate-50" />
          <Field label="Patient Name" value={form.patientName} onChange={(v) => setForm({ ...form, patientName: v })} />
          <Field label="Contact Number" value={form.contactPhone} onChange={(v) => setForm({ ...form, contactPhone: v })} />
          <Field label="Delivery Address" value={form.deliveryAddress} onChange={(v) => setForm({ ...form, deliveryAddress: v })} />
          <label className="block">
            <span className="text-xs font-bold text-[#1B3A6B]">Notes for Pharmacist (optional)</span>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              placeholder="e.g. allergies, preferred brand, delivery preferences"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#1E5BC6] resize-none"
            />
          </label>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setStep("capture")} className="flex-1 h-12 rounded-full border border-slate-200 font-bold text-[#1B3A6B] hover:bg-slate-50">Back</button>
            <button onClick={doSubmit} className="flex-1 h-12 rounded-full bg-[#1B3A6B] hover:bg-[#1E5BC6] text-white font-bold transition">Submit Prescription</button>
          </div>
        </div>
      )}

      {step === "submitting" && (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <Loader2 className="h-10 w-10 animate-spin text-[#1E5BC6] mx-auto" />
          <div className="mt-3 font-bold text-[#1B3A6B]">Submitting prescription…</div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-[#1B3A6B]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#1E5BC6]"
      />
    </label>
  );
}

// ────────────────────────────────────────────────────────────────────────────

function Detail({ rec, onBack }: { rec: RxRecord; onBack: () => void }) {
  const c = statusColor(rec.status);
  const [zoom, setZoom] = useState(false);
  const currentIdx = RX_PROGRESS.indexOf(rec.status);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-5">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm font-bold text-[#1B3A6B]"><ArrowLeft className="h-4 w-4" /> Back to prescriptions</button>

      <div className="bg-white rounded-2xl p-5 border border-slate-200 flex items-start gap-4">
        <button onClick={() => setZoom(true)} className="shrink-0">
          <img src={rec.imageDataUrl} alt="" className="h-28 w-28 rounded-xl object-cover bg-slate-50 hover:opacity-90 transition" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-xs text-slate-400">{rec.id}</div>
          <div className="font-black text-lg text-[#1B3A6B]">{rec.medication ?? rec.patientName}</div>
          <div className="text-sm text-slate-500">Submitted {new Date(rec.submittedAt).toLocaleString()}</div>
          <span className="inline-block mt-2 text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: c.bg, color: c.fg }}>{rec.status}</span>
        </div>
      </div>

      {(rec.status === "Info Requested" || rec.status === "Rejected") && rec.reviewerNote && (
        <div className={`rounded-2xl p-4 border ${rec.status === "Rejected" ? "border-red-200 bg-red-50 text-red-900" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
          <div className="font-bold text-sm">Message from pharmacist</div>
          <div className="text-sm mt-1">{rec.reviewerNote}</div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="font-black text-[#1B3A6B] mb-4">Status Timeline</div>
        <div className="space-y-3">
          {RX_PROGRESS.map((s, i) => {
            const done = i <= currentIdx && rec.status !== "Rejected";
            const active = i === currentIdx && rec.status !== "Rejected";
            return (
              <div key={s} className="flex items-center gap-3">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${done ? "bg-[#1A7A4A] text-white" : active ? "bg-[#1E5BC6] text-white" : "bg-slate-200 text-slate-400"}`}>
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <div className={`text-sm font-bold ${done || active ? "text-[#1B3A6B]" : "text-slate-400"}`}>{s}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 text-sm space-y-2">
        <Detail2 k="Patient" v={rec.patientName} />
        <Detail2 k="Phone" v={rec.contactPhone} />
        <Detail2 k="Address" v={rec.deliveryAddress} />
        {rec.doctor && <Detail2 k="Doctor" v={rec.doctor} />}
        {rec.notes && <Detail2 k="Notes" v={rec.notes} />}
      </div>

      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
            className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <img src={rec.imageDataUrl} alt="" className="max-h-[90vh] max-w-full rounded-xl shadow-2xl" />
            <button onClick={() => setZoom(false)} className="absolute top-4 right-4 h-10 w-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center"><X /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
function Detail2({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-3"><span className="text-slate-500">{k}</span><span className="font-bold text-[#1B3A6B] text-right">{v}</span></div>;
}
