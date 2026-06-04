// ============================================================================
// Kings Pharmacy — Live customer order store (placed via cart)
// Distinct from the static seeded ORDERS in demo-data.ts. Tracks the
// end-to-end shopping → fulfillment → delivery → rating lifecycle.
// ============================================================================
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DRIVERS, type Person } from "./demo-data";
import { PRODUCTS_ALL } from "./demo-data";

export const ORDER_FLOW = [
  "Order Confirmed",
  "Pharmacist Reviewing",
  "Preparing Order",
  "Driver Assigned",
  "Out for Delivery",
  "Delivered",
] as const;
export type LiveStatus = (typeof ORDER_FLOW)[number];

export interface LiveOrderItem { productId: string; name: string; price: number; qty: number }
export interface LiveOrder {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  address: string;
  payment: string;
  items: LiveOrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  status: LiveStatus;
  placedAt: string;
  driverId?: string;
  driverName?: string;
  history: { status: LiveStatus; at: string }[];
  rating?: { stars: number; text: string; at: string };
  deliveryRating?: { stars: number; text: string; at: string };
}

const NOW = () => new Date().toISOString();

const seedOrders = (): LiveOrder[] => {
  const p1 = PRODUCTS_ALL.find((p) => p.id === "kp-001")!;
  const p2 = PRODUCTS_ALL.find((p) => p.id === "kp-070")!;
  return [
    {
      id: "KP-LIVE-1042",
      customerId: "c1",
      customerName: "Tendai Moyo",
      phone: "+263 77 123 4567",
      address: "12 Samora Machel Ave, Harare",
      payment: "EcoCash",
      items: [
        { productId: p1.id, name: p1.name, price: p1.price, qty: 2 },
        { productId: p2.id, name: p2.name, price: p2.price, qty: 1 },
      ],
      subtotal: p1.price * 2 + p2.price,
      delivery: 2.5,
      total: p1.price * 2 + p2.price + 2.5,
      status: "Out for Delivery",
      placedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      driverId: DRIVERS[0].id,
      driverName: DRIVERS[0].name,
      history: [
        { status: "Order Confirmed", at: new Date(Date.now() - 1000 * 60 * 35).toISOString() },
        { status: "Pharmacist Reviewing", at: new Date(Date.now() - 1000 * 60 * 32).toISOString() },
        { status: "Preparing Order", at: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
        { status: "Driver Assigned", at: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
        { status: "Out for Delivery", at: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
      ],
    },
  ];
};

interface OrdersStore {
  orders: LiveOrder[];
  place: (o: Omit<LiveOrder, "id" | "placedAt" | "status" | "history">) => LiveOrder;
  advance: (id: string) => void;
  setStatus: (id: string, status: LiveStatus) => void;
  assignDriver: (id: string, driver: Person) => void;
  rate: (id: string, stars: number, text: string) => void;
  rateDelivery: (id: string, stars: number, text: string) => void;
}

export const useOrders = create<OrdersStore>()(
  persist(
    (set) => ({
      orders: seedOrders(),
      place: (o) => {
        const id = `KP-LIVE-${Math.floor(1000 + Math.random() * 9000)}`;
        const order: LiveOrder = {
          ...o,
          id,
          status: "Order Confirmed",
          placedAt: NOW(),
          history: [{ status: "Order Confirmed", at: NOW() }],
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        return order;
      },
      advance: (id) => set((s) => ({
        orders: s.orders.map((o) => {
          if (o.id !== id) return o;
          const idx = ORDER_FLOW.indexOf(o.status);
          if (idx >= ORDER_FLOW.length - 1) return o;
          const next = ORDER_FLOW[idx + 1];
          return { ...o, status: next, history: [...o.history, { status: next, at: NOW() }] };
        }),
      })),
      setStatus: (id, status) => set((s) => ({
        orders: s.orders.map((o) => o.id === id ? { ...o, status, history: [...o.history, { status, at: NOW() }] } : o),
      })),
      assignDriver: (id, d) => set((s) => ({
        orders: s.orders.map((o) => o.id === id ? {
          ...o, driverId: d.id, driverName: d.name,
          status: "Driver Assigned",
          history: [...o.history, { status: "Driver Assigned", at: NOW() }],
        } : o),
      })),
      rate: (id, stars, text) => set((s) => ({
        orders: s.orders.map((o) => o.id === id ? { ...o, rating: { stars, text, at: NOW() } } : o),
      })),
      rateDelivery: (id, stars, text) => set((s) => ({
        orders: s.orders.map((o) => o.id === id ? { ...o, deliveryRating: { stars, text, at: NOW() } } : o),
      })),
    }),
    { name: "kp-live-orders", version: 2 },
  ),
);

export function statusBadge(status: LiveStatus) {
  switch (status) {
    case "Order Confirmed": return { bg: "#EEF4FF", fg: "#1E5BC6" };
    case "Pharmacist Reviewing": return { bg: "#FEF3DC", fg: "#C47B10" };
    case "Preparing Order": return { bg: "#F3E8FF", fg: "#7C3AED" };
    case "Driver Assigned": return { bg: "#E0F2FE", fg: "#0369A1" };
    case "Out for Delivery": return { bg: "#DBEAFE", fg: "#1E40AF" };
    case "Delivered": return { bg: "#E6F4EC", fg: "#1A7A4A" };
  }
}
