import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { Phone } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  return (
    <div className="phone-shell flex flex-col">
      <PageHeader title="Create account" subtitle="We'll send you a code to verify" />
      <div className="screen-pad flex-1 flex flex-col">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-5">
            <Phone className="w-7 h-7 text-primary" strokeWidth={2.2} />
          </div>
          <h2 className="text-2xl font-bold mb-2">What's your phone number?</h2>
          <p className="text-muted-foreground text-sm">Your friends will use this to find you in groups.</p>
        </div>

        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Phone number</label>
        <div className="flex items-center gap-2 bg-card border-2 border-border rounded-2xl px-4 py-4 focus-within:border-primary transition-smooth shadow-soft">
          <span className="text-base font-semibold text-foreground">🇳🇬 +234</span>
          <div className="w-px h-6 bg-border" />
          <input
            type="tel"
            inputMode="numeric"
            placeholder="803 000 0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d ]/g, ""))}
            className="flex-1 bg-transparent outline-none text-lg font-semibold tracking-wide placeholder:text-muted-foreground/60"
          />
        </div>

        <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy. Standard SMS rates may apply.
        </p>

        <div className="mt-auto">
          <Button
            size="lg"
            disabled={phone.replace(/\s/g, "").length < 10}
            onClick={() => navigate("/otp")}
            className="w-full h-14 bg-gradient-primary text-primary-foreground hover:opacity-95 font-bold text-base rounded-2xl shadow-glow disabled:opacity-40 disabled:shadow-none"
          >
            Send Code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
