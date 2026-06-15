// ============================================================================
// Kings Pharmacy — Prescription workflow store
// End-to-end Rx lifecycle from customer submission to delivery
// ============================================================================
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { notify } from "./notifications";

export const RX_STATUSES = [
  "Received",
  "Awaiting Pharmacist Review",
  "Info Requested",
  "Approved",
  "Quotation Sent",
  "Awaiting Payment",
  "Paid",
  "Order Prepared",
  "Ready for Dispatch",
  "Out for Delivery",
  "Delivered",
  "Rejected",
] as const;
export type RxStatus = (typeof RX_STATUSES)[number];

// Forward progress timeline (skips Info Requested / Rejected branches)
export const RX_PROGRESS: RxStatus[] = [
  "Received",
  "Awaiting Pharmacist Review",
  "Approved",
  "Quotation Sent",
  "Awaiting Payment",
  "Paid",
  "Order Prepared",
  "Ready for Dispatch",
  "Out for Delivery",
  "Delivered",
];

export interface QuotationItem { name: string; qty: number; price: number }
export interface Quotation {
  items: QuotationItem[];
  notes?: string;
  total: number;
  totalOverride?: number;  // pharmacist-entered final total (if differs from items sum)
  sentAt: string;
  paidAt?: string;
  paymentMethod?: string;
}

export interface RxRecord {
  id: string;
  customerId: string; // matches AuthUser.id when submitted by a logged-in user
  patientName: string;
  contactPhone: string;
  deliveryAddress: string;
  notes: string;
  doctor?: string;
  medication?: string;          // pharmacist can fill on approval
  imageDataUrl: string;          // data: URL of the uploaded image / preview
  fileName: string;
  fileType: string;              // jpeg|png|pdf
  status: RxStatus;
  submittedAt: string;           // ISO
  updatedAt: string;             // ISO
  history: { status: RxStatus; at: string; note?: string }[];
  reviewerNote?: string;
  quotation?: Quotation;
  branchId?: string;
  deliveryTimeSlot?: string;
}

// ── Placeholder prescription images (SVG data URLs, look like Rx slips) ─────
function rxSvg(name: string, drug: string, dose: string, doctor: string, accent: string) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
  <rect width="600" height="800" fill="#FAF9F2"/>
  <rect x="0" y="0" width="600" height="90" fill="${accent}"/>
  <text x="40" y="58" font-family="Georgia, serif" font-size="28" font-weight="700" fill="#fff">Harare Medical Centre</text>
  <text x="40" y="80" font-family="Georgia, serif" font-size="14" fill="#fff" opacity="0.9">12 Borrowdale Rd · Tel +263 4 123 4567</text>

  <text x="40" y="140" font-family="Georgia, serif" font-size="14" fill="#333">Patient: <tspan font-weight="700">${escape(name)}</tspan></text>
  <text x="40" y="165" font-family="Georgia, serif" font-size="14" fill="#333">Date: 02 / 06 / 2026</text>

  <text x="40" y="230" font-family="Brush Script MT, cursive" font-size="74" fill="#1B3A6B" font-weight="700">Rx</text>

  <text x="120" y="240" font-family="Georgia, serif" font-size="26" font-weight="700" fill="#222">${escape(drug)}</text>
  <text x="120" y="270" font-family="Georgia, serif" font-size="18" fill="#444">${escape(dose)}</text>
  <text x="120" y="300" font-family="Georgia, serif" font-size="16" fill="#555">Sig: Take as directed. Complete full course.</text>

  <line x1="40" y1="360" x2="560" y2="360" stroke="#999" stroke-width="1"/>
  <text x="40" y="400" font-family="Georgia, serif" font-size="14" fill="#555">Refills: 1</text>
  <text x="40" y="425" font-family="Georgia, serif" font-size="14" fill="#555">Quantity: 30 tablets</text>

  <text x="380" y="640" font-family="Brush Script MT, cursive" font-size="44" fill="#1B3A6B">${escape(doctor.split(" ").pop() || "")}</text>
  <line x1="360" y1="660" x2="560" y2="660" stroke="#666" stroke-width="1"/>
  <text x="360" y="680" font-family="Georgia, serif" font-size="13" fill="#444">${escape(doctor)}, MD</text>
  <text x="360" y="700" font-family="Georgia, serif" font-size="11" fill="#777">MCAZ Reg. 04${Math.floor(Math.random() * 900 + 100)}</text>

  <rect x="40" y="730" width="120" height="40" fill="none" stroke="#1B3A6B" stroke-width="1.5"/>
  <text x="100" y="755" font-family="Georgia, serif" font-size="14" fill="#1B3A6B" text-anchor="middle" font-weight="700">STAMP</text>
</svg>`;
  return `data:image/svg+xml;base64,${typeof btoa === "function" ? btoa(unescape(encodeURIComponent(svg))) : Buffer.from(svg).toString("base64")}`;
}
function escape(s: string) {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!));
}

// 12 seeded prescriptions across various statuses
function seedRx(): RxRecord[] {
  const base = (Date.UTC(2026, 5, 4) / 1000) | 0;
  const seed: Omit<RxRecord, "history" | "imageDataUrl">[] = [
    { id: "RX-3001", customerId: "c1", patientName: "Tendai Moyo", contactPhone: "+263 77 123 4567", deliveryAddress: "12 Samora Machel Ave, Harare", notes: "Please deliver before 5pm.", doctor: "Dr. T. Mhlanga", medication: "Amoxil 250mg", fileName: "rx-amoxil.png", fileType: "image/png", status: "Awaiting Pharmacist Review", submittedAt: iso(base - 2 * 3600), updatedAt: iso(base - 1800) },
    { id: "RX-3002", customerId: "c2", patientName: "Nyasha Dube", contactPhone: "+263 77 234 5678", deliveryAddress: "45 Borrowdale Rd, Harare", notes: "Chronic medication refill.", doctor: "Dr. R. Chigwedere", medication: "Metformin 500mg", fileName: "rx-metformin.png", fileType: "image/png", status: "Approved", submittedAt: iso(base - 5 * 3600), updatedAt: iso(base - 3 * 3600) },
    { id: "RX-3003", customerId: "c3", patientName: "Blessing Ncube", contactPhone: "+263 71 345 6789", deliveryAddress: "8 Avondale Shopping Centre", notes: "", doctor: "Dr. S. Sibanda", medication: "Augmentin 625mg", fileName: "rx-augmentin.jpg", fileType: "image/jpeg", status: "Out for Delivery", submittedAt: iso(base - 28 * 3600), updatedAt: iso(base - 600) },
    { id: "RX-3004", customerId: "c4", patientName: "Rutendo Chikore", contactPhone: "+263 77 456 7890", deliveryAddress: "22 Newlands, Harare", notes: "Patient is elderly, please call before delivery.", doctor: "Dr. K. Ncube", medication: "Losartan 50mg", fileName: "rx-losartan.png", fileType: "image/png", status: "Delivered", submittedAt: iso(base - 5 * 86400), updatedAt: iso(base - 4 * 86400) },
    { id: "RX-3005", customerId: "c1", patientName: "Tendai Moyo (child)", contactPhone: "+263 77 123 4567", deliveryAddress: "12 Samora Machel Ave, Harare", notes: "For 4-year old. Cherry flavour if possible.", doctor: "Dr. F. Moyo", medication: "Calpol Suspension", fileName: "rx-calpol.jpg", fileType: "image/jpeg", status: "Order Prepared", submittedAt: iso(base - 8 * 3600), updatedAt: iso(base - 2 * 3600) },
    { id: "RX-3006", customerId: "c2", patientName: "Mukoma Dube", contactPhone: "+263 77 234 5678", deliveryAddress: "45 Borrowdale Rd, Harare", notes: "", doctor: "Dr. T. Mhlanga", medication: "Ciprobay 500mg", fileName: "rx-cipro.png", fileType: "image/png", status: "Ready for Dispatch", submittedAt: iso(base - 12 * 3600), updatedAt: iso(base - 1 * 3600) },
    { id: "RX-3007", customerId: "c3", patientName: "Blessing Ncube", contactPhone: "+263 71 345 6789", deliveryAddress: "8 Avondale Shopping Centre", notes: "Image is unclear, please advise.", doctor: "Unknown", fileName: "rx-blur.jpg", fileType: "image/jpeg", status: "Info Requested", submittedAt: iso(base - 10 * 3600), updatedAt: iso(base - 4 * 3600), reviewerNote: "Image is too blurry — please reupload a clearer photo." },
    { id: "RX-3008", customerId: "c4", patientName: "Rutendo Chikore", contactPhone: "+263 77 456 7890", deliveryAddress: "22 Newlands, Harare", notes: "", doctor: "Dr. K. Ncube", fileName: "rx-rejected.jpg", fileType: "image/jpeg", status: "Rejected", submittedAt: iso(base - 30 * 3600), updatedAt: iso(base - 20 * 3600), reviewerNote: "Prescription expired (issued > 6 months ago)." },
    { id: "RX-3009", customerId: "c1", patientName: "Mother Moyo", contactPhone: "+263 77 123 4567", deliveryAddress: "12 Samora Machel Ave, Harare", notes: "Monthly refill", doctor: "Dr. S. Sibanda", medication: "Amlodipine 10mg", fileName: "rx-amlo.png", fileType: "image/png", status: "Delivered", submittedAt: iso(base - 15 * 86400), updatedAt: iso(base - 14 * 86400) },
    { id: "RX-3010", customerId: "c2", patientName: "Nyasha Dube", contactPhone: "+263 77 234 5678", deliveryAddress: "45 Borrowdale Rd, Harare", notes: "Allergy to penicillin noted.", doctor: "Dr. R. Chigwedere", medication: "Doxycycline 100mg", fileName: "rx-doxy.png", fileType: "image/png", status: "Received", submittedAt: iso(base - 25 * 60), updatedAt: iso(base - 25 * 60) },
    { id: "RX-3011", customerId: "c3", patientName: "Blessing Ncube", contactPhone: "+263 71 345 6789", deliveryAddress: "8 Avondale Shopping Centre", notes: "", doctor: "Dr. F. Moyo", medication: "Omeprazole 20mg", fileName: "rx-ome.jpg", fileType: "image/jpeg", status: "Awaiting Pharmacist Review", submittedAt: iso(base - 90 * 60), updatedAt: iso(base - 90 * 60) },
    { id: "RX-3012", customerId: "c4", patientName: "Rutendo Chikore", contactPhone: "+263 77 456 7890", deliveryAddress: "22 Newlands, Harare", notes: "", doctor: "Dr. T. Mhlanga", medication: "Lipitor 20mg", fileName: "rx-lip.png", fileType: "image/png", status: "Approved", submittedAt: iso(base - 6 * 3600), updatedAt: iso(base - 5 * 3600) },
  ];
  const accents = ["#1B3A6B", "#1E5BC6", "#1A7A4A", "#C47B10"];
  return seed.map((s, i) => ({
    ...s,
    imageDataUrl: rxSvg(s.patientName, s.medication ?? "—", "1 tab twice daily, 10 days", s.doctor ?? "Dr. T. Mhlanga", accents[i % accents.length]),
    history: [
      { status: "Received", at: s.submittedAt },
      ...(s.status === "Received" ? [] : [{ status: "Awaiting Pharmacist Review" as RxStatus, at: s.submittedAt }]),
      ...(["Approved", "Order Prepared", "Ready for Dispatch", "Out for Delivery", "Delivered"].includes(s.status)
        ? [{ status: "Approved" as RxStatus, at: s.updatedAt }]
        : []),
      ...(s.status === "Rejected" ? [{ status: "Rejected" as RxStatus, at: s.updatedAt, note: s.reviewerNote }] : []),
      ...(s.status === "Info Requested" ? [{ status: "Info Requested" as RxStatus, at: s.updatedAt, note: s.reviewerNote }] : []),
    ],
  }));
}
function iso(epochSec: number) { return new Date(epochSec * 1000).toISOString(); }

interface RxState {
  list: RxRecord[];
  submit: (input: Omit<RxRecord, "id" | "status" | "submittedAt" | "updatedAt" | "history">) => RxRecord;
  setStatus: (id: string, status: RxStatus, note?: string) => void;
  advance: (id: string) => void;
  sendQuotation: (id: string, items: QuotationItem[], notes?: string, totalOverride?: number) => void;
  payQuotation: (id: string, method: string) => void;
  setDeliveryTimeSlot: (id: string, slot: string) => void;
}

let counter = 4000;
const nextId = () => `RX-${counter++}`;

export const useRx = create<RxState>()(
  persist(
    (set, get) => ({
      list: seedRx(),
      submit: (input) => {
        const now = new Date().toISOString();
        const rec: RxRecord = {
          ...input,
          id: nextId(),
          status: "Received",
          submittedAt: now,
          updatedAt: now,
          history: [{ status: "Received", at: now }],
        };
        // auto-advance to Awaiting Review after a moment (simulated)
        set({ list: [rec, ...get().list] });
        setTimeout(() => {
          get().setStatus(rec.id, "Awaiting Pharmacist Review");
        }, 1200);
        return rec;
      },
      setStatus: (id, status, note) => {
        const rec = get().list.find((r) => r.id === id);
        set((s) => ({
          list: s.list.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status,
                  reviewerNote: note ?? r.reviewerNote,
                  updatedAt: new Date().toISOString(),
                  history: [...r.history, { status, at: new Date().toISOString(), note }],
                }
              : r,
          ),
        }));
        if (rec) {
          const map: Partial<Record<RxStatus, { title: string; msg: string; kind: "prescription" | "order" | "delivery" }>> = {
            "Approved": { title: "Prescription approved", msg: `${rec.id} approved — your quotation is being prepared.`, kind: "prescription" },
            "Info Requested": { title: "More info needed", msg: note ?? `Pharmacist needs more details on ${rec.id}.`, kind: "prescription" },
            "Rejected": { title: "Prescription rejected", msg: note ?? `${rec.id} was rejected.`, kind: "prescription" },
            "Order Prepared": { title: "Order packed", msg: `${rec.id} has been packed and is awaiting dispatch.`, kind: "order" },
            "Ready for Dispatch": { title: "Ready for dispatch", msg: `${rec.id} is ready — a driver will pick it up shortly.`, kind: "order" },
            "Out for Delivery": { title: "Out for delivery", msg: `Your driver is on the way with ${rec.id}.`, kind: "delivery" },
            "Delivered": { title: "Delivered", msg: `${rec.id} has been delivered. Thanks for choosing Kings Pharmacy!`, kind: "delivery" },
          };
          const m = map[status];
          if (m) notify(m.kind, rec.customerId, m.title, m.msg, "/prescriptions");
        }
      },
      advance: (id) => {
        const r = get().list.find((x) => x.id === id);
        if (!r) return;
        const i = RX_PROGRESS.indexOf(r.status);
        if (i >= 0 && i < RX_PROGRESS.length - 1) get().setStatus(id, RX_PROGRESS[i + 1]);
      },
      sendQuotation: (id, items, notes, totalOverride) => {
        const itemsTotal = items.reduce((a, it) => a + it.qty * it.price, 0);
        const total = typeof totalOverride === "number" && totalOverride > 0 ? totalOverride : itemsTotal;
        const now = new Date().toISOString();
        const rec = get().list.find((r) => r.id === id);
        set((s) => ({
          list: s.list.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: "Quotation Sent",
                  updatedAt: now,
                  quotation: { items, notes, total, totalOverride, sentAt: now },
                  history: [...r.history, { status: "Quotation Sent", at: now }],
                }
              : r,
          ),
        }));
        if (rec) notify("prescription", rec.customerId, "Quotation ready", `${rec.id}: $${total.toFixed(2)} — tap to review & pay.`, "/prescriptions");
      },
      payQuotation: (id, method) => {
        const now = new Date().toISOString();
        const rec = get().list.find((r) => r.id === id);
        set((s) => ({
          list: s.list.map((r) =>
            r.id === id && r.quotation
              ? {
                  ...r,
                  status: "Paid",
                  updatedAt: now,
                  quotation: { ...r.quotation, paidAt: now, paymentMethod: method },
                  history: [
                    ...r.history,
                    { status: "Awaiting Payment", at: now },
                    { status: "Paid", at: now },
                  ],
                }
              : r,
          ),
        }));
        if (rec) notify("order", rec.customerId, "Payment received", `Thanks! We're preparing ${rec.id} for dispatch.`, "/prescriptions");
      },
      setDeliveryTimeSlot: (id, slot) =>
        set((s) => ({
          list: s.list.map((r) =>
            r.id === id
              ? { ...r, deliveryTimeSlot: slot, updatedAt: new Date().toISOString() }
              : r,
          ),
        })),
    }),
    { name: "kp-rx", version: 3 },
  ),
);


export function statusColor(s: RxStatus): { bg: string; fg: string } {
  switch (s) {
    case "Received": return { bg: "#E0EBFF", fg: "#1B3A6B" };
    case "Awaiting Pharmacist Review": return { bg: "#FFF1DB", fg: "#8B5403" };
    case "Info Requested": return { bg: "#FEF3C7", fg: "#92400E" };
    case "Approved": return { bg: "#DCFCE7", fg: "#166534" };
    case "Quotation Sent": return { bg: "#FFE9C7", fg: "#9A5A00" };
    case "Awaiting Payment": return { bg: "#FFF1DB", fg: "#8B5403" };
    case "Paid": return { bg: "#DCFCE7", fg: "#166534" };
    case "Order Prepared": return { bg: "#E0E7FF", fg: "#3730A3" };
    case "Ready for Dispatch": return { bg: "#DDD6FE", fg: "#5B21B6" };
    case "Out for Delivery": return { bg: "#CFFAFE", fg: "#155E75" };
    case "Delivered": return { bg: "#1A7A4A", fg: "#fff" };
    case "Rejected": return { bg: "#FEE2E2", fg: "#991B1B" };
  }
}
