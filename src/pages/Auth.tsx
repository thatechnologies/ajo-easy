import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Loader2, Lock, Mail, Phone, User as UserIcon } from "lucide-react";
import type { SVGProps } from "react";
import kowopeLogo from "@/assets/kowope-logo.png";

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Name too short").max(60),
  phone: z.string().trim().min(10, "Enter a valid phone").max(20),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Min 8 characters").max(72),
});

const signInSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(1, "Required"),
});

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "" });

  useEffect(() => {
    const m = searchParams.get("mode");
    if (m === "signin" || m === "signup") setMode(m);
  }, [searchParams]);

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const parsed = signUpSchema.safeParse(form);
        if (!parsed.success) {
          toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
          return;
        }
        await signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          fullName: parsed.data.fullName,
          phone: parsed.data.phone,
        });
        toast({ title: "Welcome to Kowope!", description: "Your account is ready." });
        navigate("/dashboard", { replace: true });
      } else {
        const parsed = signInSchema.safeParse(form);
        if (!parsed.success) {
          toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
          return;
        }
        await signIn({ email: parsed.data.email, password: parsed.data.password });
        navigate("/dashboard", { replace: true });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Try again";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="phone-shell flex flex-col bg-background">
      <div className="bg-gradient-hero text-primary-foreground px-6 pt-12 pb-12 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-14 -right-12 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-glow p-2">
              <img src={kowopeLogo} alt="Kowope" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-xs opacity-80 -mb-0.5">Kowope</p>
              <p className="text-lg font-extrabold tracking-tight">Ajo made simple</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-widest opacity-80 font-semibold mb-2">
              {mode === "signup" ? "Create account" : "Welcome back"}
            </p>
            <h1 className="text-3xl font-extrabold leading-tight">
              {mode === "signup" ? "Start saving with your people." : "Continue where you left off."}
            </h1>
            <p className="text-sm opacity-90 mt-2">
              {mode === "signup" ? "Verify KYC once, then create or join groups." : "Sign in to view your groups and activity."}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="screen-pad -mt-10 relative z-10 flex-1 flex flex-col pb-6">
        <div className="bg-card border border-border rounded-3xl shadow-elevated p-5">
          <div className="flex gap-2 p-1 bg-secondary rounded-2xl mb-6">
            {(["signup", "signin"] as const).map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-smooth ${
                  mode === m ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"
                }`}
              >
                {m === "signup" ? "Sign up" : "Sign in"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {mode === "signup" && (
              <>
                <LabeledField
                  label="Full name"
                  icon={UserIcon}
                  placeholder="e.g. Ada Okonkwo"
                  value={form.fullName}
                  onChange={(v) => setForm({ ...form, fullName: v })}
                />
                <LabeledField
                  label="Phone number"
                  icon={Phone}
                  placeholder="e.g. +234 803 000 0000"
                  type="tel"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                />
              </>
            )}

            <LabeledField
              label="Email"
              icon={Mail}
              placeholder="you@email.com"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="flex items-center gap-3 bg-card border-2 border-border rounded-2xl px-4 py-3.5 shadow-soft focus-within:border-primary transition-smooth">
                <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "signup" ? "Min 8 characters" : "Your password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="flex-1 bg-transparent outline-none font-semibold text-base placeholder:text-muted-foreground/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="p-2 -mr-2 rounded-xl hover:bg-secondary transition-smooth"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5 text-muted-foreground" /> : <Eye className="w-4.5 h-4.5 text-muted-foreground" />}
                </button>
              </div>
              {mode === "signup" && (
                <p className="text-[11px] text-muted-foreground mt-2 px-1">
                  You’ll complete KYC after signup.
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={busy}
              className="w-full h-14 bg-gradient-primary font-extrabold text-base rounded-2xl shadow-glow"
            >
              {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === "signup" ? "Create account" : "Sign in"}
            </Button>

            <button
              type="button"
              onClick={() => setMode((m) => (m === "signup" ? "signin" : "signup"))}
              className="w-full text-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-smooth py-2"
            >
              {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
            </button>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground text-center mt-4 px-2">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </form>
    </div>
  );
};

const LabeledField = ({
  label,
  icon: Icon,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) => (
  <div>
    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
      {label}
    </label>
    <div className="flex items-center gap-3 bg-card border-2 border-border rounded-2xl px-4 py-3.5 shadow-soft focus-within:border-primary transition-smooth">
      <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none font-semibold text-base placeholder:text-muted-foreground/60"
      />
    </div>
  </div>
);

export default Auth;
