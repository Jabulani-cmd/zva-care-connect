import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth, type Role, ROLE_HOME } from "@/lib/auth";

export function AuthGuard({ role, children }: { role: Role; children: ReactNode }) {
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login", search: { role } as any });
    } else if (user.role !== role) {
      navigate({ to: ROLE_HOME[user.role] });
    } else {
      setReady(true);
    }
  }, [user, role, navigate]);

  if (!ready) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 text-center text-slate-500 text-sm">
        Checking access…
      </div>
    );
  }
  return <>{children}</>;
}
