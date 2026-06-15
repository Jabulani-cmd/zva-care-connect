import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth, ROLE_HOME, type Role, DEMO_ACCOUNTS } from "@/lib/auth";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Stethoscope, Truck, User as UserIcon } from "lucide-react";
import { Logo } from "@/components/logo";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — Kings Pharmacy" }] }),
  validateSearch: (s: Record<string, unknown>) => {
    let redirect = typeof s.redirect === "string" ? (s.redirect as string) : undefined;
    // Sanitize: never bounce back to /login (prevents recursive redirect params).
    // Decode aggressively in case the value was multiply URL-encoded.
    if (redirect) {
      let decoded = redirect;
      try {
        for (let i = 0; i < 10 && /%25|%2F|%3F/i.test(decoded); i++) {
          decoded = decodeURIComponent(decoded);
        }
      } catch { /* ignore */ }
      if (/\/login(\?|$|\/)/i.test(decoded) || decoded.length > 200) redirect = undefined;
    }
    return { role: (s.role as Role) || "customer", redirect };
  },
  component: Login,
});

const ROLES: { id: Role; label: string; icon: any; desc: string }[] = [
  { id: "customer", label: "Customer", icon: UserIcon, desc: "Shop, track orders & manage prescriptions" },
  { id: "staff", label: "Pharmacy Staff", icon: Stethoscope, desc: "Approve prescriptions & dispatch orders" },
  { id: "driver", label: "Driver", icon: Truck, desc: "View assigned deliveries & route" },
  { id: "admin", label: "Administrator", icon: ShieldCheck, desc: "Executive dashboard & management" },
];

function Login() {
  const { role: initialRole, redirect: redirectTo } = Route.useSearch();
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);
  const currentUser = useAuth((s) => s.user);

  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirected, setRedirected] = useState(false);

  const goNext = (r: Role) => {
    if (redirected) return;
    setRedirected(true);
    if (redirectTo && r === "customer") {
      // Parse the redirect URL to extract path + search params
      try {
        const url = new URL(redirectTo, window.location.origin);
        navigate({ to: (url.pathname + url.search) as any, replace: true });
      } catch {
        navigate({ to: ROLE_HOME[r], replace: true });
      }
    } else {
      navigate({ to: ROLE_HOME[r], replace: true });
    }
  };

  // Auto-redirect if already logged in (e.g. on page mount)
  useEffect(() => {
    if (currentUser && !loading) goNext(currentUser.role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const demoFor = DEMO_ACCOUNTS.find((u) => u.role === role)!;

  const fillDemo = () => {
    setEmail(demoFor.email);
    setPassword(demoFor.password);
    setError(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    // Simulate 800ms auth
    setTimeout(() => {
      const r = login(email, password, role);
      if (!r.ok) {
        setError("Incorrect email or password");
        setLoading(false);
        return;
      }
      goNext(r.user.role);
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-[#EAF3FF] via-white to-[#EAF3FF] py-8 md:py-12 px-4">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10 items-start">
        {/* Left — brand panel */}
        <div className="hidden lg:block bg-gradient-to-br from-[#1B3A6B] via-[#1E5BC6] to-[#1B3A6B] text-white rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-[200px] opacity-10 select-none">👑</div>
          <div className="text-[11px] font-bold uppercase tracking-widest opacity-80">Kings Pharmacy</div>
          <h1 className="text-4xl font-black mt-3 leading-tight">Welcome back to better care.</h1>
          <p className="mt-4 text-white/80 text-sm leading-relaxed">
            Sign in to access your personalised dashboard — track deliveries, manage prescriptions,
            approve orders, and serve your community.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {["Same-day prescription delivery", "Chronic medication reminders", "24/7 pharmacist support", "Secure & confidential"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — form */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
          <div className="flex items-center justify-between">
            <Logo compact />
            <Link to="/register" className="text-xs font-bold text-[#1E5BC6] hover:underline">Create account →</Link>
          </div>

          <h2 className="text-2xl font-black text-[#1B3A6B] mt-5">Sign in</h2>
          <p className="text-sm text-slate-500 mt-1">Choose your portal to continue.</p>

          {/* Role tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-5">
            {ROLES.map((r) => {
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => { setRole(r.id); setError(null); }}
                  className={`rounded-xl p-2.5 text-left transition border-2 ${active ? "border-[#1E5BC6] bg-[#EAF3FF]" : "border-slate-200 hover:border-slate-300"}`}
                >
                  <r.icon size={16} className={active ? "text-[#1E5BC6]" : "text-slate-500"} />
                  <div className={`text-[11px] font-black mt-1 ${active ? "text-[#1B3A6B]" : "text-slate-600"}`}>{r.label}</div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-2">{ROLES.find((r) => r.id === role)!.desc}</p>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <Field icon={Mail} label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-transparent outline-none text-sm"
              />
            </Field>

            <Field icon={Lock} label="Password">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-transparent outline-none text-sm"
              />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="text-slate-400 hover:text-slate-600">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </Field>

            <div className="flex items-center justify-between text-xs">
              <label className="inline-flex items-center gap-2 text-slate-600">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded" />
                Remember me
              </label>
              <button type="button" className="font-bold text-[#1E5BC6] hover:underline">Forgot password?</button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3 rounded-lg">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1E5BC6] to-[#1B3A6B] text-white font-black py-3.5 rounded-xl hover:opacity-95 transition shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 min-h-[48px]"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : "Sign In"}
            </button>

            <div className="bg-[#EAF3FF] rounded-xl p-3 text-xs">
              <div className="font-black text-[#1B3A6B] mb-1">Demo account for {ROLES.find((r) => r.id === role)!.label}</div>
              <div className="text-slate-600 font-mono">{demoFor.email}</div>
              <div className="text-slate-600 font-mono">Demo123</div>
              <button type="button" onClick={fillDemo} className="mt-2 text-[#1E5BC6] font-bold hover:underline">Use these credentials →</button>
            </div>

            {role === "customer" && (
              <div className="text-center text-xs text-slate-500">
                New to Kings Pharmacy? <Link to="/register" className="font-bold text-[#1E5BC6] hover:underline">Create an account</Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, children }: any) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
      <div className="mt-1 flex items-center gap-2 px-3.5 h-12 rounded-xl border-2 border-slate-200 focus-within:border-[#1E5BC6] bg-white">
        <Icon size={16} className="text-slate-400 shrink-0" />
        {children}
      </div>
    </label>
  );
}
