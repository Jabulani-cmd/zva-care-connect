import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ORDERS_BY_STATUS, PHARMACISTS, ASSISTANTS, PRODUCTS_ALL } from "@/lib/demo-data";
import { FileText, Package, Truck, AlertTriangle, MessageCircle, Star, Check, X, HelpCircle, ChevronRight, ZoomIn, Search, Receipt, Plus, Trash2, Printer } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useRx, statusColor, type RxRecord, type RxStatus, type QuotationItem } from "@/lib/rx";
import { toast } from "sonner";

export const Route = createFileRoute("/staff")({
  head: () => ({ meta: [{ title: "Pharmacy Staff Portal — Kings Pharmacy" }] }),
  component: () => <AuthGuard role="staff"><Staff /></AuthGuard>,
});

type Tab = "overview" | "rx";

function Staff() {
  const [tab, setTab] = useState<Tab>("overview");
  const rxList = useRx((s) => s.list);
  const rxPending = rxList.filter((r) => r.status === "Awaiting Pharmacist Review" || r.status === "Received").length;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8 space-y-6">
      <header>
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#1E5BC6]">Pharmacy Staff Portal</div>
        <h1 className="text-2xl md:text-3xl font-black text-[#1B3A6B]">Today at the Counter</h1>
      </header>

      <div className="flex gap-2 border-b border-slate-200">
        <TabBtn active={tab === "overview"} onClick={() => setTab("overview")}>Overview</TabBtn>
        <TabBtn active={tab === "rx"} onClick={() => setTab("rx")}>
          Prescription Management
          {rxPending > 0 && <span className="ml-2 bg-amber-500 text-white text-[10px] font-black rounded-full px-1.5 py-0.5">{rxPending}</span>}
        </TabBtn>
      </div>

      {tab === "overview" && <Overview />}
      {tab === "rx" && <RxManagement />}
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-bold border-b-2 -mb-px transition ${active ? "border-[#1E5BC6] text-[#1B3A6B]" : "border-transparent text-slate-500 hover:text-[#1B3A6B]"}`}
    >
      {children}
    </button>
  );
}

function Overview() {
  const rxList = useRx((s) => s.list);
  const pendingRx = rxList.filter((r) => r.status === "Awaiting Pharmacist Review" || r.status === "Received");
  const newOrders = [...ORDERS_BY_STATUS["Pending"], ...ORDERS_BY_STATUS["Awaiting Review"]].slice(0, 8);
  const dispatch = [...ORDERS_BY_STATUS["Packed"], ...ORDERS_BY_STATUS["Approved"]].slice(0, 6);
  const lowStock = PRODUCTS_ALL.filter((p) => p.stock === "low" || p.stock === "out").slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={FileText} label="Pending Rx" value={pendingRx.length} tone="amber" />
        <StatCard icon={Package} label="New Orders" value={newOrders.length} tone="blue" />
        <StatCard icon={Truck} label="Awaiting Dispatch" value={dispatch.length} tone="purple" />
        <StatCard icon={AlertTriangle} label="Low Stock" value={lowStock.length} tone="red" />
      </div>

      <section className="grid lg:grid-cols-2 gap-6">
        <Card title="Pending Prescriptions" subtitle="Verify and approve">
          {pendingRx.slice(0, 6).map((p) => (
            <Row key={p.id}>
              <img src={p.imageDataUrl} alt="" className="h-10 w-10 rounded-lg object-cover bg-slate-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-[#1B3A6B] truncate">{p.medication ?? p.patientName}</div>
                <div className="text-xs text-slate-500 truncate">{p.patientName} · {p.doctor ?? "—"}</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700 shrink-0">{p.status}</span>
            </Row>
          ))}
          {pendingRx.length === 0 && <div className="px-5 py-8 text-center text-sm text-slate-400">No prescriptions waiting.</div>}
        </Card>

        <Card title="New Orders Queue" subtitle="Awaiting pharmacist action">
          {newOrders.map((o) => (
            <Row key={o.id}>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs text-slate-500">{o.id}</div>
                <div className="font-bold text-sm text-[#1B3A6B] truncate">{o.customer.name} — ${o.total.toFixed(2)}</div>
                <div className="text-xs text-slate-500">{o.items.length} items · {o.payment}</div>
              </div>
              <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 shrink-0">{o.status}</span>
            </Row>
          ))}
        </Card>

        <Card title="Awaiting Dispatch" subtitle="Ready for driver pickup">
          {dispatch.map((o) => (
            <Row key={o.id}>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs text-slate-500">{o.id}</div>
                <div className="font-bold text-sm text-[#1B3A6B] truncate">{o.customer.name}</div>
                <div className="text-xs text-slate-500 truncate">{o.customer.address}</div>
              </div>
              <button className="px-3 py-1.5 rounded-full bg-[#1E5BC6] text-white text-xs font-bold shrink-0">Assign Driver</button>
            </Row>
          ))}
        </Card>

        <Card title="Inventory Alerts" subtitle="Low or out of stock">
          {lowStock.map((p) => (
            <Row key={p.id}>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-[#1B3A6B] truncate">{p.name}</div>
                <div className="text-xs text-slate-500 truncate">{p.category} · {p.brand}</div>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold shrink-0 ${p.stock === "out" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                {p.stock === "out" ? "Out" : `Only ${p.stockCount} left`}
              </span>
            </Row>
          ))}
        </Card>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <Card title="Pharmacists On Duty">
          {PHARMACISTS.map((p) => (
            <Row key={p.id}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-full bg-[#EAF3FF] flex items-center justify-center text-lg shrink-0">{p.avatar}</div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-[#1B3A6B] truncate">{p.name}</div>
                  <div className="text-xs text-slate-500 truncate">{(p as any).role} · {(p as any).shift}</div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-slate-500">{(p as any).ordersHandled} orders</div>
                <div className="text-xs text-amber-500 font-bold flex items-center gap-0.5 justify-end"><Star size={11} fill="currentColor" /> {p.rating}</div>
              </div>
            </Row>
          ))}
        </Card>
        <Card title="Pharmacy Assistants">
          {ASSISTANTS.map((p) => (
            <Row key={p.id}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-full bg-[#EAF3FF] flex items-center justify-center text-lg shrink-0">{p.avatar}</div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-[#1B3A6B] truncate">{p.name}</div>
                  <div className="text-xs text-slate-500 truncate">{(p as any).shift}</div>
                </div>
              </div>
              <button className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center shrink-0"><MessageCircle size={14} /></button>
            </Row>
          ))}
        </Card>
      </section>
    </div>
  );
}

// ─── Prescription Management ────────────────────────────────────────────────

function RxManagement() {
  const list = useRx((s) => s.list);
  const setStatus = useRx((s) => s.setStatus);
  const [filter, setFilter] = useState<"all" | "queue" | "approved" | "issues" | "completed">("queue");
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = list.filter((r) => {
    if (search && !(r.patientName.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()) || (r.medication ?? "").toLowerCase().includes(search.toLowerCase()))) return false;
    switch (filter) {
      case "queue": return r.status === "Received" || r.status === "Awaiting Pharmacist Review";
      case "approved": return ["Approved", "Order Prepared", "Ready for Dispatch", "Out for Delivery"].includes(r.status);
      case "issues": return r.status === "Info Requested" || r.status === "Rejected";
      case "completed": return r.status === "Delivered";
      default: return true;
    }
  }).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  const counts = {
    queue: list.filter((r) => r.status === "Received" || r.status === "Awaiting Pharmacist Review").length,
    approved: list.filter((r) => ["Approved", "Order Prepared", "Ready for Dispatch", "Out for Delivery"].includes(r.status)).length,
    issues: list.filter((r) => r.status === "Info Requested" || r.status === "Rejected").length,
    completed: list.filter((r) => r.status === "Delivered").length,
    all: list.length,
  };

  const rec = list.find((r) => r.id === selected);

  return (
    <div className="grid lg:grid-cols-[1fr_1.4fr] gap-4">
      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-3 border-b border-slate-100 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient, Rx ID or medication"
              className="w-full h-10 rounded-lg bg-slate-50 pl-9 pr-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#1E5BC6]/20"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            <FilterPill active={filter === "queue"} onClick={() => setFilter("queue")}>Queue · {counts.queue}</FilterPill>
            <FilterPill active={filter === "approved"} onClick={() => setFilter("approved")}>Approved · {counts.approved}</FilterPill>
            <FilterPill active={filter === "issues"} onClick={() => setFilter("issues")}>Issues · {counts.issues}</FilterPill>
            <FilterPill active={filter === "completed"} onClick={() => setFilter("completed")}>Completed · {counts.completed}</FilterPill>
            <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>All · {counts.all}</FilterPill>
          </div>
        </div>
        <div className="max-h-[640px] overflow-y-auto divide-y divide-slate-100">
          {filtered.map((r) => {
            const c = statusColor(r.status);
            const active = selected === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition ${active ? "bg-[#EAF3FF]" : ""}`}
              >
                <img src={r.imageDataUrl} alt="" className="h-12 w-12 rounded-lg object-cover bg-slate-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] text-slate-400">{r.id}</div>
                  <div className="font-bold text-sm text-[#1B3A6B] truncate">{r.medication ?? r.patientName}</div>
                  <div className="text-xs text-slate-500 truncate">{r.patientName}</div>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <span className="block text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.fg }}>{r.status}</span>
                  <div className="text-[10px] text-slate-400">{timeAgo(r.submittedAt)}</div>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">No prescriptions match.</div>}
        </div>
      </div>

      {/* Detail */}
      <div>
        {!rec ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-400">
            Select a prescription to review.
          </div>
        ) : (
          <RxDetailPanel key={rec.id} rec={rec} />
        )}
      </div>
    </div>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${active ? "bg-[#1B3A6B] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{children}</button>
  );
}

function RxDetailPanel({ rec }: { rec: RxRecord }) {
  const setStatus = useRx((s) => s.setStatus);
  const sendQuotation = useRx((s) => s.sendQuotation);
  const [zoom, setZoom] = useState(false);
  const [mode, setMode] = useState<null | "info" | "reject" | "quote">(null);
  const [note, setNote] = useState("");
  const c = statusColor(rec.status);

  function act(status: RxStatus, n?: string) {
    setStatus(rec.id, status, n);
    toast.success(`Prescription ${status.toLowerCase()}.`);
  }

  const canApprove = !["Approved","Quotation Sent","Awaiting Payment","Paid","Order Prepared","Ready for Dispatch","Out for Delivery","Delivered","Rejected"].includes(rec.status);
  const canQuote = ["Approved","Awaiting Pharmacist Review","Received"].includes(rec.status) && !rec.quotation;
  const canAdvance = ["Paid","Order Prepared","Ready for Dispatch","Out for Delivery"].includes(rec.status);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="grid md:grid-cols-2">
        {/* Image */}
        <div className="bg-slate-50 p-4 flex flex-col items-center justify-center min-h-[280px]">
          <div className="relative group">
            <img src={rec.imageDataUrl} alt="" className="max-h-80 w-auto rounded-xl shadow-sm" />
            <button
              onClick={() => setZoom(true)}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow border border-slate-200"
              aria-label="Zoom"
            >
              <ZoomIn className="h-4 w-4 text-[#1B3A6B]" />
            </button>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">{rec.fileName}</div>
          <button
            onClick={() => printPrescription(rec)}
            className="mt-3 inline-flex items-center gap-1.5 px-4 h-9 rounded-full bg-white border border-[#1E5BC6]/30 text-[#1B3A6B] text-xs font-bold hover:bg-[#EAF3FF] transition shadow-sm"
          >
            <Printer className="h-3.5 w-3.5" /> Print for Dispensing
          </button>
        </div>

        {/* Info */}
        <div className="p-5 space-y-3">
          <div>
            <div className="font-mono text-[11px] text-slate-400">{rec.id}</div>
            <div className="font-black text-lg text-[#1B3A6B]">{rec.medication ?? "Pending medication"}</div>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: c.bg, color: c.fg }}>{rec.status}</span>
          </div>
          <Detail2 k="Patient" v={rec.patientName} />
          <Detail2 k="Phone" v={rec.contactPhone} />
          <Detail2 k="Address" v={rec.deliveryAddress} />
          {rec.doctor && <Detail2 k="Doctor" v={rec.doctor} />}
          <Detail2 k="Submitted" v={new Date(rec.submittedAt).toLocaleString()} />
          {rec.notes && (
            <div className="bg-slate-50 rounded-lg p-3 text-sm">
              <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Customer note</div>
              <div className="text-[#1B3A6B] mt-1">{rec.notes}</div>
            </div>
          )}
          {rec.reviewerNote && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
              <div className="text-[10px] font-bold uppercase text-amber-700 tracking-widest">Pharmacist note</div>
              <div className="text-amber-900 mt-1">{rec.reviewerNote}</div>
            </div>
          )}
          {rec.quotation && (
            <div className="bg-[#EAF3FF] border border-[#1E5BC6]/20 rounded-lg p-3 text-sm">
              <div className="text-[10px] font-bold uppercase text-[#1E5BC6] tracking-widest">Quotation</div>
              <ul className="mt-2 space-y-1 text-[#1B3A6B]">
                {rec.quotation.items.map((it, i) => (
                  <li key={i} className="flex justify-between"><span>{it.name} ×{it.qty}</span><span className="font-bold">${(it.qty * it.price).toFixed(2)}</span></li>
                ))}
              </ul>
              <div className="border-t border-[#1E5BC6]/20 mt-2 pt-2 flex justify-between font-black text-[#1B3A6B]">
                <span>Total</span><span>${rec.quotation.total.toFixed(2)}</span>
              </div>
              {rec.quotation.paidAt && (
                <div className="mt-2 text-[11px] font-bold text-emerald-700">✓ Paid via {rec.quotation.paymentMethod}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-slate-100 p-4 bg-slate-50">
        {!mode && rec.status !== "Delivered" && rec.status !== "Rejected" && (
          <div className="grid grid-cols-3 gap-2">
            <ActionBtn intent="ok" icon={Check} label="Approve" onClick={() => act("Approved")} disabled={!canApprove} />
            <ActionBtn intent="warn" icon={HelpCircle} label="Request Info" onClick={() => { setMode("info"); setNote(""); }} />
            <ActionBtn intent="danger" icon={X} label="Reject" onClick={() => { setMode("reject"); setNote(""); }} />
            {canQuote && (
              <button onClick={() => setMode("quote")} className="col-span-3 mt-1 bg-[#1E5BC6] hover:bg-[#1B3A6B] text-white font-bold text-sm py-2.5 rounded-full transition inline-flex items-center justify-center gap-2">
                <Receipt className="h-4 w-4" /> Enter Quotation
              </button>
            )}
            {canAdvance && (
              <button onClick={() => act(nextStatus(rec.status))} className="col-span-3 mt-1 bg-[#1B3A6B] hover:bg-[#1E5BC6] text-white font-bold text-sm py-2.5 rounded-full transition inline-flex items-center justify-center gap-2">
                Advance to "{nextStatus(rec.status)}" <ChevronRight className="h-4 w-4" />
              </button>
            )}
            {rec.status === "Quotation Sent" && (
              <div className="col-span-3 mt-1 text-center text-xs text-slate-500 italic">Waiting for customer to pay the quotation…</div>
            )}
          </div>
        )}

        {(mode === "info" || mode === "reject") && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#1B3A6B]">{mode === "info" ? "Message to customer (request more info)" : "Reason for rejection"}</div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder={mode === "info" ? "e.g. Image is unclear, please reupload." : "e.g. Prescription expired."}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#1E5BC6] resize-none bg-white"
            />
            <div className="flex gap-2">
              <button onClick={() => setMode(null)} className="flex-1 h-10 rounded-full bg-slate-200 hover:bg-slate-300 text-[#1B3A6B] font-bold text-sm">Cancel</button>
              <button
                onClick={() => {
                  if (!note.trim()) return toast.error("Please add a note.");
                  act(mode === "info" ? "Info Requested" : "Rejected", note.trim());
                  setMode(null);
                }}
                className={`flex-1 h-10 rounded-full text-white font-bold text-sm ${mode === "info" ? "bg-amber-500 hover:bg-amber-600" : "bg-[#C0392B] hover:bg-red-700"}`}
              >
                {mode === "info" ? "Send Request" : "Confirm Reject"}
              </button>
            </div>
          </div>
        )}

        {mode === "quote" && (
          <QuotationForm
            initialMedication={rec.medication}
            onCancel={() => setMode(null)}
            onSend={(items, notes) => {
              sendQuotation(rec.id, items, notes);
              toast.success("Quotation sent to customer.");
              setMode(null);
            }}
          />
        )}
      </div>

      <AnimatePresence>
        {zoom && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setZoom(false)} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out">
            <img src={rec.imageDataUrl} alt="" className="max-h-[95vh] max-w-full rounded-xl shadow-2xl" />
            <button onClick={() => setZoom(false)} className="absolute top-4 right-4 h-10 w-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center"><X /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuotationForm({ initialMedication, onCancel, onSend }: { initialMedication?: string; onCancel: () => void; onSend: (items: QuotationItem[], notes?: string) => void }) {
  const [items, setItems] = useState<QuotationItem[]>([
    { name: initialMedication ?? "", qty: 1, price: 0 },
  ]);
  const [notes, setNotes] = useState("");
  const total = items.reduce((a, it) => a + it.qty * it.price, 0);

  function update(i: number, patch: Partial<QuotationItem>) {
    setItems((arr) => arr.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  }
  function remove(i: number) {
    setItems((arr) => arr.filter((_, idx) => idx !== i));
  }
  function add() {
    setItems((arr) => [...arr, { name: "", qty: 1, price: 0 }]);
  }
  function send() {
    const cleaned = items.filter((it) => it.name.trim() && it.price > 0 && it.qty > 0);
    if (cleaned.length === 0) return toast.error("Add at least one item with a price.");
    onSend(cleaned, notes.trim() || undefined);
  }

  return (
    <div className="space-y-3 bg-white rounded-xl p-3 border border-slate-200">
      <div className="text-sm font-black text-[#1B3A6B] flex items-center gap-2"><Receipt className="h-4 w-4" /> Quotation</div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <input value={it.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="Medication / item" className="col-span-6 h-10 rounded-lg border border-slate-200 px-2 text-sm outline-none focus:border-[#1E5BC6]" />
            <input type="number" min={1} value={it.qty} onChange={(e) => update(i, { qty: Math.max(1, parseInt(e.target.value || "1")) })} className="col-span-2 h-10 rounded-lg border border-slate-200 px-2 text-sm outline-none focus:border-[#1E5BC6] text-center" />
            <input type="number" min={0} step={0.01} value={it.price} onChange={(e) => update(i, { price: parseFloat(e.target.value || "0") })} placeholder="$" className="col-span-3 h-10 rounded-lg border border-slate-200 px-2 text-sm outline-none focus:border-[#1E5BC6]" />
            <button onClick={() => remove(i)} disabled={items.length === 1} className="col-span-1 h-10 flex items-center justify-center text-red-500 disabled:opacity-30"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      <button onClick={add} className="text-xs font-bold text-[#1E5BC6] inline-flex items-center gap-1"><Plus className="h-3 w-3" /> Add item</button>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Notes for customer (optional)" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#1E5BC6] resize-none" />
      <div className="flex justify-between items-center font-black text-[#1B3A6B] border-t border-slate-100 pt-2">
        <span>Total</span><span className="text-lg">${total.toFixed(2)}</span>
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 h-10 rounded-full bg-slate-200 hover:bg-slate-300 text-[#1B3A6B] font-bold text-sm">Cancel</button>
        <button onClick={send} className="flex-1 h-10 rounded-full bg-[#1E5BC6] hover:bg-[#1B3A6B] text-white font-bold text-sm">Send Quotation</button>
      </div>
    </div>
  );
}

function nextStatus(s: RxStatus): RxStatus {
  const order: RxStatus[] = ["Paid", "Order Prepared", "Ready for Dispatch", "Out for Delivery", "Delivered"];
  const i = order.indexOf(s);
  return i >= 0 && i < order.length - 1 ? order[i + 1] : "Delivered";
}

function ActionBtn({ intent, icon: Icon, label, onClick, disabled }: { intent: "ok" | "warn" | "danger"; icon: any; label: string; onClick: () => void; disabled?: boolean }) {
  const cls = intent === "ok" ? "bg-emerald-500 hover:bg-emerald-600" : intent === "warn" ? "bg-amber-500 hover:bg-amber-600" : "bg-[#C0392B] hover:bg-red-700";
  return (
    <button onClick={onClick} disabled={disabled} className={`${cls} text-white font-bold text-sm py-2.5 rounded-full transition inline-flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed`}>
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

function Detail2({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-3 text-sm"><span className="text-slate-500">{k}</span><span className="font-bold text-[#1B3A6B] text-right">{v}</span></div>;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

// ─── Shared overview helpers ────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, tone }: any) {
  const toneMap: Record<string, string> = {
    blue: "from-[#1E5BC6] to-[#1B3A6B]",
    amber: "from-[#C47B10] to-[#8B5403]",
    purple: "from-[#6D28D9] to-[#4C1D95]",
    red: "from-[#C0392B] to-[#7E2118]",
  };
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${toneMap[tone]} text-white flex items-center justify-center`}>
        <Icon size={18} />
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</div>
        <div className="text-2xl font-black text-[#1B3A6B] leading-none mt-0.5">{value}</div>
      </div>
    </div>
  );
}
function Card({ title, subtitle, children }: any) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="font-black text-[#1B3A6B]">{title}</div>
        {subtitle && <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>}
      </div>
      <div className="divide-y divide-slate-100">{children}</div>
    </div>
  );
}
function Row({ children }: any) {
  return <div className="px-5 py-3 flex items-center gap-3">{children}</div>;
}
