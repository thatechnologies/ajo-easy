import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Mail, Lock, User as UserIcon, Phone } from "lucide-react";

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
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "" });

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
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: parsed.data.fullName, phone: parsed.data.phone },
          },
        });
        if (error) {
          if (error.message.toLowerCase().includes("already")) {
            toast({ title: "Account exists", description: "Try signing in instead.", variant: "destructive" });
            setMode("signin");
          } else throw error;
          return;
        }
        toast({ title: "Welcome to Kowope!", description: "Your account is ready." });
        navigate("/dashboard", { replace: true });
      } else {
        const parsed = signInSchema.safeParse(form);
        if (!parsed.success) {
          toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        navigate("/dashboard", { replace: true });
      }
    } catch (err: any) {
      toast({ title: "Something went wrong", description: err.message ?? "Try again", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="phone-shell flex flex-col">
      <PageHeader title={mode === "signup" ? "Create account" : "Welcome back"} subtitle="Kowope Ajo" />
      <form onSubmit={handleSubmit} className="screen-pad flex-1 flex flex-col">
        <div className="flex gap-2 p-1 bg-secondary rounded-2xl mb-6">
          {(["signup", "signin"] as const).map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-smooth ${
                mode === m ? "bg-card shadow-soft" : "text-muted-foreground"
              }`}
            >
              {m === "signup" ? "Sign up" : "Sign in"}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {mode === "signup" && (
            <>
              <Field icon={UserIcon} placeholder="Full name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} />
              <Field icon={Phone} placeholder="Phone (e.g. +234 803...)" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            </>
          )}
          <Field icon={Mail} placeholder="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field icon={Lock} placeholder="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
        </div>

        <div className="mt-auto pt-6">
          <Button
            type="submit"
            size="lg"
            disabled={busy}
            className="w-full h-14 bg-gradient-primary font-bold text-base rounded-2xl shadow-glow"
          >
            {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === "signup" ? "Create account" : "Sign in"}
          </Button>
          <p className="text-[11px] text-muted-foreground text-center mt-3">
            🔒 Your data is encrypted and secure
          </p>
        </div>
      </form>
    </div>
  );
};

const Field = ({
  icon: Icon, placeholder, value, onChange, type = "text",
}: { icon: any; placeholder: string; value: string; onChange: (v: string) => void; type?: string }) => (
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
);

export default Auth;
