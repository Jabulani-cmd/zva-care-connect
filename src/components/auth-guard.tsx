import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useAuth, type Role, ROLE_HOME } from "@/lib/auth";

export function AuthGuard({ role, children }: { role: Role; children: ReactNode }) {
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [ready, setReady] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const didRedirect = useRef(false);

  // Wait for zustand persist to finish hydrating from localStorage before deciding
  useEffect(() => {
    const anyStore = useAuth as unknown as { persist?: { hasHydrated: () => boolean; onFinishHydration: (cb: () => void) => () => void } };
    if (anyStore.persist?.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = anyStore.persist?.onFinishHydration(() => setHydrated(true));
    return () => { unsub?.(); };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (location.pathname.startsWith("/login")) return;

    if (!user) {
      if (didRedirect.current) return;
      didRedirect.current = true;
      navigate({
        to: "/login",
        search: { role, redirect: location.pathname } as any,
        replace: true,
      });
    } else if (user.role !== role) {
      if (didRedirect.current) return;
      didRedirect.current = true;
      navigate({ to: ROLE_HOME[user.role], replace: true });
    } else {
      setReady(true);
    }
  }, [hydrated, user, role, navigate, location.pathname]);

  if (!ready) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 text-center text-slate-500 text-sm">
        Checking access…
      </div>
    );
  }
  return <>{children}</>;
}
