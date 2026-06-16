import { useEffect, useRef, useState } from "react";
import { Bell, Package, Truck, FileText, Check } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useNotifications, timeAgo, type NotifKind } from "@/lib/notifications";
import { useAuth } from "@/lib/auth";

const ICON: Record<NotifKind, any> = { order: Package, delivery: Truck, prescription: FileText };
const TONE: Record<NotifKind, string> = {
  order: "bg-[#EAF3FF] text-[#1E5BC6]",
  delivery: "bg-emerald-50 text-emerald-700",
  prescription: "bg-amber-50 text-amber-700",
};

export function NotificationBell() {
  const user = useAuth((s) => s.user);
  const list = useNotifications((s) => s.list);
  const markAllRead = useNotifications((s) => s.markAllRead);
  const markRead = useNotifications((s) => s.markRead);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (!user || user.role !== "customer") return null;

  const mine = list.filter((n) => n.customerId === user.id);
  const unread = mine.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen((v) => !v);
          if (!open && unread > 0) setTimeout(() => markAllRead(user.id), 600);
        }}
        className="relative h-10 w-10 shrink-0 rounded-full bg-white border border-slate-200 hover:border-[#1E5BC6]/40 hover:bg-[#EAF3FF] transition flex items-center justify-center text-[#1B3A6B]"
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
      >
        <Bell className="h-[18px] w-[18px]" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#C0392B] text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center ring-2 ring-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 w-[360px] max-w-[92vw] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
          <div className="px-4 py-3 bg-gradient-to-br from-[#1E5BC6] to-[#1B3A6B] text-white flex items-center justify-between">
            <div>
              <div className="font-black text-sm">Notifications</div>
              <div className="text-[11px] opacity-80">{unread > 0 ? `${unread} new update${unread > 1 ? "s" : ""}` : "You're all caught up"}</div>
            </div>
            {mine.length > 0 && (
              <button onClick={() => markAllRead(user.id)} className="text-[10px] font-bold bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full inline-flex items-center gap-1">
                <Check className="h-3 w-3" /> Mark read
              </button>
            )}
          </div>
          <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-100">
            {mine.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-slate-400">
                <Bell className="h-6 w-6 mx-auto mb-2 opacity-30" />
                No notifications yet.
                <div className="text-[11px] mt-1">Updates about your orders and prescriptions will appear here.</div>
              </div>
            )}
            {mine.slice(0, 20).map((n) => {
              const Icon = ICON[n.kind];
              const clickable = !!n.link;
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    markRead(n.id);
                    if (n.link) {
                      const [path, qs] = n.link.split("?");
                      const search: Record<string, string> = {};
                      if (qs) qs.split("&").forEach((p) => { const [k, v] = p.split("="); if (k) search[k] = v ?? ""; });
                      setOpen(false);
                      navigate({ to: path as any, search: search as any });
                    }
                  }}
                  className={`w-full text-left px-4 py-3 flex gap-3 transition ${n.read ? "" : "bg-[#F8FBFF]"} ${clickable ? "hover:bg-slate-50 cursor-pointer" : "cursor-default"}`}
                >
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${TONE[n.kind]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-sm text-[#1B3A6B] truncate">{n.title}</div>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-[#1E5BC6] shrink-0" />}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">{n.message}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{timeAgo(n.at)}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
