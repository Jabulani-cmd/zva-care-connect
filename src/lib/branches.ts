// ============================================================================
// Kings Pharmacy — Bulawayo branch system
// ============================================================================
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Branch {
  id: string;
  name: string;
  area: string;
  address: string;
  phone: string;
  hours: string;
}

export const BRANCHES: Branch[] = [
  { id: "cbd", name: "Kings Pharmacy CBD", area: "City Centre", address: "82 Joshua Mqabuko Nkomo St, Bulawayo CBD", phone: "+263 29 222 4100", hours: "Mon–Sun · 7am – 10pm" },
  { id: "hillside", name: "Kings Pharmacy Hillside", area: "Hillside", address: "14 Cecil Ave, Hillside, Bulawayo", phone: "+263 29 222 4101", hours: "Mon–Sun · 8am – 9pm" },
  { id: "nketa", name: "Kings Pharmacy Nketa", area: "Nketa", address: "Shop 12, Nketa Shopping Centre, Bulawayo", phone: "+263 29 222 4102", hours: "Mon–Sun · 8am – 8pm" },
  { id: "khumalo", name: "Kings Pharmacy Khumalo", area: "Khumalo", address: "Cnr Cecil & Banff Rd, Khumalo, Bulawayo", phone: "+263 29 222 4103", hours: "Mon–Sun · 8am – 9pm" },
  { id: "magwegwe", name: "Kings Pharmacy Magwegwe", area: "Magwegwe", address: "Shop 5, Magwegwe Shopping Centre, Bulawayo", phone: "+263 29 222 4104", hours: "Mon–Sun · 8am – 8pm" },
];

export type BranchStock = "in" | "low" | "out";

// Deterministic hash so the same product/branch always renders the same stock.
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * Per-branch stock for any product id (deterministic).
 * Most branches stock most products; occasionally a branch is low or out.
 */
export function branchStock(productId: string, branchId: string): { status: BranchStock; count: number } {
  const h = hash(productId + ":" + branchId);
  const bucket = h % 100;
  if (bucket < 12) return { status: "out", count: 0 };
  if (bucket < 28) return { status: "low", count: 1 + (h % 4) };
  return { status: "in", count: 12 + (h % 40) };
}

/** Branches where the product is currently in or low stock. */
export function branchesWithStock(productId: string): Branch[] {
  return BRANCHES.filter((b) => branchStock(productId, b.id).status !== "out");
}

interface BranchStore {
  selectedId: string | null;
  setBranch: (id: string) => void;
  clear: () => void;
}

export const useBranch = create<BranchStore>()(
  persist(
    (set) => ({
      selectedId: null,
      setBranch: (id) => set({ selectedId: id }),
      clear: () => set({ selectedId: null }),
    }),
    { name: "kp-branch", version: 1 },
  ),
);

export function getBranch(id: string | null | undefined): Branch | undefined {
  if (!id) return undefined;
  return BRANCHES.find((b) => b.id === id);
}
