import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Check, Phone, Clock } from "lucide-react";
import { BRANCHES, useBranch, type Branch } from "@/lib/branches";

/**
 * Shows a full-screen modal on first visit (no branch selected),
 * and a controlled modal triggered via the `open`/`onClose` props.
 */
export function BranchPicker({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const selectedId = useBranch((s) => s.selectedId);
  const setBranch = useBranch((s) => s.setBranch);
  const [forced, setForced] = useState(false);

  // Auto-open on first visit
  useEffect(() => {
    if (!selectedId) setForced(true);
  }, [selectedId]);

  const visible = open || forced;
  if (!visible) return null;

  const dismiss = () => {
    setForced(false);
    onClose?.();
  };

  function choose(b: Branch) {
    setBranch(b.id);
    dismiss();
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
        onClick={selectedId ? dismiss : undefined}
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-br from-[#1E5BC6] to-[#1B3A6B] text-white p-5">
            <div className="text-[11px] font-bold uppercase tracking-widest opacity-80">Kings Pharmacy · Bulawayo</div>
            <div className="text-xl font-black mt-1">
              {selectedId ? "Switch your branch" : "Choose your branch"}
            </div>
            <div className="text-sm opacity-90 mt-1">
              We'll show stock and delivery options for the branch you pick.
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto divide-y divide-slate-100">
            {BRANCHES.map((b) => {
              const active = b.id === selectedId;
              return (
                <button
                  key={b.id}
                  onClick={() => choose(b)}
                  className={`w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-slate-50 transition ${active ? "bg-[#EAF3FF]" : ""}`}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${active ? "bg-[#1E5BC6] text-white" : "bg-[#EAF3FF] text-[#1E5BC6]"}`}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-[#1B3A6B]">{b.name}</div>
                    <div className="text-xs text-slate-500 truncate">{b.address}</div>
                    <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                      <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {b.phone}</span>
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {b.hours}</span>
                    </div>
                  </div>
                  {active && <Check className="h-5 w-5 text-[#1A7A4A] shrink-0 mt-1" />}
                </button>
              );
            })}
          </div>

          {selectedId && (
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={dismiss}
                className="w-full h-11 rounded-full bg-[#1B3A6B] text-white font-bold text-sm hover:bg-[#1E5BC6] transition"
              >
                Continue
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
