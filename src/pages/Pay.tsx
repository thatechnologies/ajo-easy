import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { getGroupById } from "@/lib/ajo-data";
import { Money, formatNaira } from "@/components/Money";
import { CheckCircle2, CreditCard, Smartphone, Building2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Method = "bank" | "card" | "ussd";

const Pay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const group = getGroupById(id || "");
  const [method, setMethod] = useState<Method>("bank");
  const [state, setState] = useState<"select" | "loading" | "done">("select");

  if (!group) return <div className="phone-shell p-8">Group not found</div>;

  const handlePay = () => {
    setState("loading");
    setTimeout(() => setState("done"), 1500);
  };

  if (state === "done") {
    return (
      <div className="phone-shell flex flex-col">
        <div className="screen-pad flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-28 h-28 rounded-full bg-success/15 flex items-center justify-center mb-6 animate-scale-in">
            <CheckCircle2 className="w-14 h-14 text-success" strokeWidth={2} />
          </div>
          <h2 className="text-3xl font-extrabold mb-2">Payment successful!</h2>
          <p className="text-muted-foreground mb-8 max-w-xs">Your contribution has been recorded.</p>

          <div className="w-full rounded-3xl bg-gradient-card border border-border p-5 shadow-card space-y-3 mb-8">
            <div className="text-center pb-3 border-b border-border">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Amount paid</p>
              <Money amount={group.amount} size="lg" className="text-primary" />
            </div>
            {[
              { k: "Group", v: group.name },
              { k: "Cycle", v: `${group.currentCycle} of ${group.totalMembers}` },
              { k: "Reference", v: "AJO-PAY-" + Math.random().toString(36).slice(2, 8).toUpperCase() },
              { k: "Date", v: "23 Apr 2026, 10:24 AM" },
            ].map((r) => (
              <div key={r.k} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{r.k}</span>
                <span className="font-bold">{r.v}</span>
              </div>
            ))}
          </div>

          <div className="w-full space-y-3">
            <Button size="lg" onClick={() => navigate(`/group/${group.id}`)} className="w-full h-14 bg-gradient-primary font-bold text-base rounded-2xl shadow-glow">
              Back to group
            </Button>
            <Button size="lg" variant="ghost" onClick={() => navigate("/dashboard")} className="w-full h-12 font-semibold rounded-2xl">
              Go to home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phone-shell flex flex-col">
      <PageHeader title="Make payment" subtitle={group.name} />
      <div className="screen-pad flex-1 flex flex-col">
        <div className="bg-gradient-hero text-primary-foreground rounded-3xl p-5 shadow-elevated mb-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <p className="text-xs uppercase tracking-widest opacity-80 font-semibold mb-2">You're paying</p>
          <Money amount={group.amount} size="xl" className="block" />
          <p className="text-xs opacity-80 mt-2">Cycle {group.currentCycle} contribution • {group.frequency}</p>
        </div>

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Payment method</p>
        <div className="space-y-2.5 mb-6">
          {([
            { k: "bank", l: "Bank Transfer", d: "Pay from any Nigerian bank", i: Building2 },
            { k: "card", l: "Debit Card", d: "Verve, Visa or Mastercard", i: CreditCard },
            { k: "ussd", l: "USSD", d: "Dial *894# from your phone", i: Smartphone },
          ] as const).map(({ k, l, d, i: Icon }) => (
            <button
              key={k}
              onClick={() => setMethod(k)}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-smooth text-left",
                method === k ? "border-primary bg-secondary shadow-soft" : "border-border bg-card"
              )}
            >
              <div className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
                method === k ? "bg-gradient-primary" : "bg-muted"
              )}>
                <Icon className={cn("w-5 h-5", method === k ? "text-primary-foreground" : "text-muted-foreground")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{l}</p>
                <p className="text-[11px] text-muted-foreground">{d}</p>
              </div>
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                method === k ? "border-primary bg-primary" : "border-border"
              )}>
                {method === k && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-secondary/60 border border-secondary p-3.5 mb-4 flex justify-between text-sm">
          <span className="text-muted-foreground">Service fee</span>
          <span className="font-bold text-success">FREE</span>
        </div>

        <div className="mt-auto">
          <Button
            size="lg"
            disabled={state === "loading"}
            onClick={handlePay}
            className="w-full h-14 bg-gradient-primary font-bold text-base rounded-2xl shadow-glow"
          >
            {state === "loading" ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
            ) : (
              `Pay ${formatNaira(group.amount)}`
            )}
          </Button>
          <p className="text-[11px] text-muted-foreground text-center mt-3">
            🔒 Payments secured & encrypted end-to-end
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pay;
