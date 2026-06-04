import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth, ROLE_HOME } from "@/lib/auth";
import { Eye, EyeOff, Lock, Mail, MapPin, Phone, User as UserIcon } from "lucide-react";
import { Logo } from "@/components/logo";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create Account — Kings Pharmacy" }] }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const register = useAuth((s) => s.register);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [address, setAddress] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    const r = register({ firstName, lastName, email, password, phone, address });
    if (!r.ok) return setError(r.error);
    navigate({ to: ROLE_HOME[r.user.role] });
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-[#EAF3FF] via-white to-[#EAF3FF] py-8 md:py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-8">
        <div className="flex items-center justify-between">
          <Logo compact />
          <Link to="/login" className="text-xs font-bold text-[#1E5BC6] hover:underline">Already a member? Sign in →</Link>
        </div>
        <h2 className="text-2xl font-black text-[#1B3A6B] mt-5">Create your account</h2>
        <p className="text-sm text-slate-500 mt-1">Join Kings Pharmacy for fast prescription delivery & exclusive rewards.</p>

        <form onSubmit={onSubmit} className="mt-6 grid md:grid-cols-2 gap-4">
          <Field icon={UserIcon} label="First name">
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Tendai" className="w-full bg-transparent outline-none text-sm" />
          </Field>
          <Field icon={UserIcon} label="Last name">
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Moyo" className="w-full bg-transparent outline-none text-sm" />
          </Field>
          <Field icon={Phone} label="Mobile number">
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+263 77 123 4567" className="w-full bg-transparent outline-none text-sm" />
          </Field>
          <Field icon={Mail} label="Email">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full bg-transparent outline-none text-sm" />
          </Field>
          <Field icon={Lock} label="Password">
            <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="At least 6 characters" className="w-full bg-transparent outline-none text-sm" />
            <button type="button" onClick={() => setShowPw((v) => !v)} className="text-slate-400 hover:text-slate-600">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </Field>
          <Field icon={Lock} label="Confirm password">
            <input type={showPw ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} required placeholder="Re-enter password" className="w-full bg-transparent outline-none text-sm" />
          </Field>
          <div className="md:col-span-2">
            <Field icon={MapPin} label="Delivery address">
              <input value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="12 Samora Machel Ave, Harare" className="w-full bg-transparent outline-none text-sm" />
            </Field>
          </div>

          {error && (
            <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3 rounded-lg">{error}</div>
          )}

          <button
            type="submit"
            className="md:col-span-2 w-full bg-gradient-to-r from-[#1E5BC6] to-[#1B3A6B] text-white font-black py-3.5 rounded-xl hover:opacity-95 transition shadow-lg"
          >
            Create Account & Sign In
          </button>

          <p className="md:col-span-2 text-[11px] text-slate-500 text-center">
            By registering, you agree to Kings Pharmacy's Terms of Service and Privacy Policy.
          </p>
        </form>
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
