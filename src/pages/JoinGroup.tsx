import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { Ticket, Clock, CheckCircle2, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const JoinGroup = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleJoin = () => {
    if (code.length < 4) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="phone-shell flex flex-col">
        <PageHeader title="Awaiting approval" />
        <div className="screen-pad flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6 animate-pulse-glow">
            <Clock className="w-11 h-11 text-primary" strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Request sent!</h2>
          <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mb-8">
            The admin of <span className="font-bold text-foreground">Balogun Market Traders</span> will review your request. You'll get a notification when approved.
          </p>

          <div className="w-full rounded-2xl bg-gradient-card border border-border p-4 shadow-soft mb-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center"><Users className="w-5 h-5 text-primary-foreground" /></div>
              <div className="text-left flex-1">
                <p className="font-bold text-sm">Balogun Market Traders</p>
                <p className="text-[11px] text-muted-foreground">8 members • Weekly • ₦20,000</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-warning bg-warning/10 px-3 py-2 rounded-xl">
              <Clock className="w-3.5 h-3.5" /> Pending admin review
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="w-full h-14 bg-gradient-primary font-bold text-base rounded-2xl shadow-glow"
          >
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="phone-shell flex flex-col">
      <PageHeader title="Join a group" subtitle="Enter the invite code from the admin" />
      <div className="screen-pad flex-1 flex flex-col">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-5">
            <Ticket className="w-7 h-7 text-primary" strokeWidth={2.2} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Got an invite code?</h2>
          <p className="text-muted-foreground text-sm">Type it below or paste a link a friend shared with you.</p>
        </div>

        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Invite code</label>
        <input
          type="text"
          placeholder="AJO-XXXXX"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="w-full bg-card border-2 border-border rounded-2xl px-4 py-4 outline-none focus:border-primary transition-smooth text-xl font-bold tracking-wider shadow-soft placeholder:text-muted-foreground/40 text-center"
        />

        <button
          onClick={() => { setCode("AJO-BMT8"); toast({ title: "Code pasted", description: "From your clipboard." }); }}
          className="text-xs font-semibold text-primary mt-3 self-center"
        >
          Paste from clipboard
        </button>

        <div className="mt-8 p-4 rounded-2xl bg-secondary/60 border border-secondary flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold mb-1">How it works</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The group admin will see your request and approve you. You'll be notified when accepted.
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <Button
            size="lg"
            disabled={code.length < 4}
            onClick={handleJoin}
            className="w-full h-14 bg-gradient-primary font-bold text-base rounded-2xl shadow-glow disabled:opacity-40 disabled:shadow-none"
          >
            Request to Join
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinGroup;
