import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { ShieldCheck } from "lucide-react";

const Otp = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [seconds, setSeconds] = useState(45);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handleChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...code];
    next[i] = v;
    setCode(next);
    if (v && i < 3) refs.current[i + 1]?.focus();
  };

  const filled = code.every((c) => c !== "");

  return (
    <div className="phone-shell flex flex-col">
      <PageHeader title="Verify phone" subtitle="+234 803 000 0000" />
      <div className="screen-pad flex-1 flex flex-col">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-5">
            <ShieldCheck className="w-7 h-7 text-primary" strokeWidth={2.2} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Enter the 4-digit code</h2>
          <p className="text-muted-foreground text-sm">We sent it to your number. Check your messages.</p>
        </div>

        <div className="flex gap-3 justify-between mb-6">
          {code.map((c, i) => (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={c}
              onChange={(e) => handleChange(i, e.target.value)}
              className="w-full h-16 text-center text-2xl font-bold bg-card border-2 border-border rounded-2xl focus:border-primary focus:outline-none transition-smooth shadow-soft"
            />
          ))}
        </div>

        <div className="text-center text-sm">
          {seconds > 0 ? (
            <p className="text-muted-foreground">Resend code in <span className="font-semibold text-foreground">0:{seconds.toString().padStart(2, "0")}</span></p>
          ) : (
            <button onClick={() => setSeconds(45)} className="text-primary font-semibold">Resend code</button>
          )}
        </div>

        <div className="mt-auto">
          <Button
            size="lg"
            disabled={!filled}
            onClick={() => navigate("/profile-setup")}
            className="w-full h-14 bg-gradient-primary text-primary-foreground hover:opacity-95 font-bold text-base rounded-2xl shadow-glow disabled:opacity-40 disabled:shadow-none"
          >
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Otp;
