import { create } from "zustand";

export type Stock = "in" | "low" | "out" | "rx" | "branch";

export interface Product {
  id: string;
  name: string;
  brand?: string;
  price: number;
  emoji: string;
  color: string;
  stock: Stock;
  stockCount?: number;
  category: string;
  description: string;
  dosage?: string;
  manufacturer?: string;
  expiry?: string;
}

export const PRODUCTS: Product[] = [
  { id: "p1", name: "Paracetamol 500mg", brand: "Disprin", price: 1.2, emoji: "💊", color: "#E8F1FF", stock: "in", category: "OTC", description: "Fast-acting pain & fever relief tablets for mild to moderate symptoms.", dosage: "1-2 tablets every 4-6 hours, max 8/day", manufacturer: "Reckitt Benckiser", expiry: "06/2027" },
  { id: "p2", name: "Amoxicillin 250mg", brand: "GSK", price: 4.5, emoji: "💊", color: "#E0EBFF", stock: "rx", category: "Prescription", description: "Broad-spectrum antibiotic for bacterial infections.", dosage: "Take as prescribed by physician", manufacturer: "GlaxoSmithKline", expiry: "11/2026" },
  { id: "p3", name: "Vitamin C 1000mg", brand: "Redoxon", price: 3.8, emoji: "🍊", color: "#FFF1DB", stock: "in", category: "Vitamins", description: "Effervescent immune-support tablets with zinc.", dosage: "1 tablet daily dissolved in water", manufacturer: "Bayer", expiry: "03/2027" },
  { id: "p4", name: "Baby Formula", brand: "NAN Optipro", price: 12.0, emoji: "🍼", color: "#FFE6EE", stock: "low", stockCount: 3, category: "Baby Care", description: "Stage 1 infant formula with optimised protein blend.", manufacturer: "Nestlé", expiry: "09/2026" },
  { id: "p5", name: "Blood Pressure Monitor", brand: "Omron", price: 45.0, emoji: "🩺", color: "#E6F4FF", stock: "in", category: "Devices", description: "Automatic upper-arm digital BP monitor with memory.", manufacturer: "Omron Healthcare" },
  { id: "p6", name: "Ibuprofen 400mg", brand: "Brufen", price: 2.1, emoji: "💊", color: "#FFE6E6", stock: "out", category: "OTC", description: "Anti-inflammatory pain relief for headaches & muscle pain.", dosage: "1 tablet every 6-8 hours with food", manufacturer: "Abbott", expiry: "04/2027" },
  { id: "p7", name: "Nivea Body Lotion", brand: "Nivea", price: 6.5, emoji: "🧴", color: "#EAF6FF", stock: "in", category: "Cosmetics", description: "24h moisturising body lotion for dry skin, 400ml.", manufacturer: "Beiersdorf" },
  { id: "p8", name: "Diabetic Test Strips", brand: "Accu-Chek", price: 18.0, emoji: "🩸", color: "#FFE9E9", stock: "rx", category: "Devices", description: "50 glucose test strips for Accu-Chek Active meter.", manufacturer: "Roche", expiry: "12/2026" },
];

export interface CartItem { id: string; qty: number; }
interface Store {
  cart: CartItem[];
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  trackingStep: number;
  advanceTracking: () => void;
  resetTracking: () => void;
}

export const useStore = create<Store>((set) => ({
  cart: [],
  add: (id, qty = 1) => set((s) => {
    const e = s.cart.find((c) => c.id === id);
    if (e) return { cart: s.cart.map((c) => c.id === id ? { ...c, qty: c.qty + qty } : c) };
    return { cart: [...s.cart, { id, qty }] };
  }),
  remove: (id) => set((s) => ({ cart: s.cart.filter((c) => c.id !== id) })),
  setQty: (id, qty) => set((s) => ({ cart: qty <= 0 ? s.cart.filter((c) => c.id !== id) : s.cart.map((c) => c.id === id ? { ...c, qty } : c) })),
  clear: () => set({ cart: [] }),
  trackingStep: 0,
  advanceTracking: () => set((s) => ({ trackingStep: Math.min(5, s.trackingStep + 1) })),
  resetTracking: () => set({ trackingStep: 0 }),
}));

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const cartCount = (cart: CartItem[]) => cart.reduce((a, c) => a + c.qty, 0);
export const cartSubtotal = (cart: CartItem[]) => cart.reduce((a, c) => {
  const p = getProduct(c.id); return a + (p ? p.price * c.qty : 0);
}, 0);
