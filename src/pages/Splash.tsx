import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Users, TrendingUp } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="phone-shell bg-gradient-hero text-primary-foreground flex flex-col overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute top-1/3 -left-24 w-64 h-64 rounded-full bg-accent/30 blur-3xl" />
      <div className="absolute -bottom-20 right-0 w-80 h-80 rounded-full bg-primary-glow/30 blur-3xl" />

      <div className="relative flex-1 flex flex-col px-6 pt-16 pb-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5 animate-fade-in">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-glow">
            <span className="text-2xl font-extrabold">₦</span>
          </div>
          <div>
            <p className="text-xs opacity-80 -mb-0.5">Welcome to</p>
            <p className="text-lg font-bold tracking-tight">Kowope</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="flex-1 flex flex-col justify-center my-8 animate-slide-up">
          <p className="text-sm font-medium uppercase tracking-widest opacity-80 mb-3">Welcome</p>
          <h1 className="text-4xl font-extrabold leading-tight mb-4">
            Save together.<br />Grow together.
          </h1>
          <p className="text-base opacity-90 leading-relaxed">
            The simplest way to manage Ajo & Esusu groups with your family, friends, and trade community.
          </p>
        </div>

        {/* Trust pillars */}
        <div className="grid grid-cols-3 gap-3 mb-10 animate-fade-in">
          {[
            { icon: Shield, label: "Trusted" },
            { icon: Users, label: "Together" },
            { icon: TrendingUp, label: "Transparent" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center text-center">
              <Icon className="w-5 h-5 mb-1.5" strokeWidth={2.2} />
              <span className="text-[11px] font-semibold">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-3 animate-fade-in">
          <Button
            size="lg"
            onClick={() => navigate("/signup")}
            className="w-full h-14 bg-white text-primary hover:bg-white/95 font-bold text-base rounded-2xl shadow-elevated"
          >
            Get Started
          </Button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-center text-sm font-medium opacity-90 hover:opacity-100 py-2"
          >
            I already have an account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Splash;
