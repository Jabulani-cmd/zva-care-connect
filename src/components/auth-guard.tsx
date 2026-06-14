import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useAuth, type Role, ROLE_HOME } from "@/lib/auth";

export function AuthGuard({ role, children }: { role: Role; children: ReactNode }) {
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [ready, setReady] = useState(false);
  const didRedirect = useRef(false);

  useEffect(() => {
    // Don't run the guard while we're already on the login page (prevents redirect loop)
    if (location.pathname.startsWith("/login")) return;

    if (!user) {
      if (didRedirect.current) return;
      didRedirect.current = true;
      navigate({
        to: "/login",
        search: { role, redirect: location.pathname + location.search } as any,
        replace: true,
      });
    } else if (user.role !== role) {
      if (didRedirect.current) return;
      didRedirect.current = true;
      navigate({ to: ROLE_HOME[user.role], replace: true });
    } else {
      setReady(true);
    }
  }, [user, role, navigate, location.pathname]);

  if (!ready) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 text-center text-slate-500 text-sm">
        Checking access…
      </div>
    );
  }
  return <>{children}</>;
}
