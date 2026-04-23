import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { User } from "lucide-react";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  return (
    <div className="phone-shell flex flex-col">
      <PageHeader title="One last thing" subtitle="Help others recognize you" />
      <div className="screen-pad flex-1 flex flex-col">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center mb-5 shadow-glow">
            <User className="w-9 h-9 text-primary-foreground" strokeWidth={2.2} />
          </div>
          <h2 className="text-2xl font-bold mb-2">What should we call you?</h2>
          <p className="text-muted-foreground text-sm">This name will appear in your savings groups.</p>
        </div>

        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Full name</label>
        <input
          type="text"
          placeholder="e.g. Ada Okonkwo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-card border-2 border-border rounded-2xl px-4 py-4 outline-none focus:border-primary transition-smooth text-lg font-semibold shadow-soft placeholder:text-muted-foreground/60"
        />

        <div className="mt-6 p-4 rounded-2xl bg-secondary/60 border border-secondary">
          <p className="text-xs text-secondary-foreground leading-relaxed">
            🔒 Your information is private. We never share your phone number with anyone outside your groups.
          </p>
        </div>

        <div className="mt-auto">
          <Button
            size="lg"
            disabled={name.trim().length < 2}
            onClick={() => navigate("/dashboard")}
            className="w-full h-14 bg-gradient-primary text-primary-foreground hover:opacity-95 font-bold text-base rounded-2xl shadow-glow disabled:opacity-40 disabled:shadow-none"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
