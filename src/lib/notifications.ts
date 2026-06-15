// ============================================================================
// Kings Pharmacy — In-memory notifications (demo)
// Pushed when staff advances orders / approves Rx / sends quotation, etc.
// ============================================================================
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export type NotifKind = "order" | "delivery" | "prescription";

export interface Notification {
  id: string;
  customerId: string;
  kind: NotifKind;
  title: string;
  message: string;
  at: string;     // ISO
  read: boolean;
  link?: string;
}

interface NotifState {
  list: Notification[];
  add: (n: Omit<Notification, "id" | "at" | "read">) => void;
  markAllRead: (customerId: string) => void;
  markRead: (id: string) => void;
  clear: (customerId: string) => void;
}

let counter = 9000;

export const useNotifications = create<NotifState>()(
  persist(
    (set) => ({
      list: [],
      add: (n) => {
        const note: Notification = {
          ...n,
          id: `N-${counter++}`,
          at: new Date().toISOString(),
          read: false,
        };
        set((s) => ({ list: [note, ...s.list].slice(0, 100) }));
        // Live toast — only fires in the browser
        if (typeof window !== "undefined") {
          toast(note.title, { description: note.message });
        }
      },
      markAllRead: (customerId) =>
        set((s) => ({
          list: s.list.map((x) => (x.customerId === customerId ? { ...x, read: true } : x)),
        })),
      markRead: (id) =>
        set((s) => ({ list: s.list.map((x) => (x.id === id ? { ...x, read: true } : x)) })),
      clear: (customerId) =>
        set((s) => ({ list: s.list.filter((x) => x.customerId !== customerId) })),
    }),
    { name: "kp-notifications", version: 1 },
  ),
);

export function notify(kind: NotifKind, customerId: string, title: string, message: string, link?: string) {
  useNotifications.getState().add({ kind, customerId, title, message, link });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}
