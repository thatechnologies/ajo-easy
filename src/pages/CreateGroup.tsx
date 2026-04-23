import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { CalendarDays, Users, Coins, Repeat, Shuffle, ListOrdered, Check } from "lucide-react";
import { formatNaira } from "@/components/Money";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const amounts = [5000, 10000, 20000, 50000, 100000];

const CreateGroup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(20000);
  const [freq, setFreq] = useState<"Weekly" | "Monthly">("Weekly");
  const [members, setMembers] = useState(8);
  const [order, setOrder] = useState<"manual" | "random">("random");

  const handleCreate = () => {
    toast({ title: "Group created! 🎉", description: `Share invite code AJO-NEW${members} to add members.` });
    navigate("/dashboard");
  };

  return (
    <div className="phone-shell flex flex-col">
      <PageHeader title="Create new group" subtitle={`Step ${step} of 2`} />
      <div className="screen-pad flex-1 flex flex-col">
        {/* Progress */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1 h-1.5 rounded-full bg-primary" />
          <div className={cn("flex-1 h-1.5 rounded-full transition-smooth", step === 2 ? "bg-primary" : "bg-muted")} />
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold mb-1">Group basics</h2>
              <p className="text-sm text-muted-foreground">Name your group and set the contribution.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Group name</label>
              <input
                type="text"
                placeholder="e.g. Balogun Market Traders"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-card border-2 border-border rounded-2xl px-4 py-3.5 outline-none focus:border-primary transition-smooth font-semibold shadow-soft placeholder:text-muted-foreground/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Contribution amount</label>
              <div className="bg-card border-2 border-border rounded-2xl px-4 py-4 shadow-soft">
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-2xl font-bold">₦</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || 0)}
                    className="flex-1 bg-transparent outline-none text-3xl font-extrabold tabular-nums"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {amounts.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAmount(a)}
                      className={cn(
                        "text-xs font-semibold px-3 py-1.5 rounded-full transition-smooth",
                        amount === a ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      {formatNaira(a)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Frequency</label>
              <div className="grid grid-cols-2 gap-3">
                {(["Weekly", "Monthly"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFreq(f)}
                    className={cn(
                      "rounded-2xl border-2 p-4 text-left transition-smooth",
                      freq === f ? "border-primary bg-secondary shadow-soft" : "border-border bg-card"
                    )}
                  >
                    <Repeat className={cn("w-5 h-5 mb-2", freq === f ? "text-primary" : "text-muted-foreground")} />
                    <p className="font-bold text-sm">{f}</p>
                    <p className="text-[11px] text-muted-foreground">{f === "Weekly" ? "Every 7 days" : "Once a month"}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              disabled={name.length < 3 || amount < 100}
              onClick={() => setStep(2)}
              className="w-full h-14 bg-gradient-primary font-bold text-base rounded-2xl shadow-glow disabled:opacity-40"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold mb-1">Members & schedule</h2>
              <p className="text-sm text-muted-foreground">How big is the group and who pays first?</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Number of members</label>
              <div className="bg-card border-2 border-border rounded-2xl p-4 shadow-soft">
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => setMembers(Math.max(2, members - 1))}
                    className="w-11 h-11 rounded-xl bg-secondary text-secondary-foreground font-bold text-xl"
                  >−</button>
                  <div className="text-center">
                    <p className="text-3xl font-extrabold">{members}</p>
                    <p className="text-[11px] text-muted-foreground">members</p>
                  </div>
                  <button
                    onClick={() => setMembers(Math.min(30, members + 1))}
                    className="w-11 h-11 rounded-xl bg-secondary text-secondary-foreground font-bold text-xl"
                  >+</button>
                </div>
                <div className="bg-secondary/60 rounded-xl p-3 text-center">
                  <p className="text-[11px] text-muted-foreground">Each payout will be</p>
                  <p className="font-bold text-base text-primary">{formatNaira(amount * members)}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Start date</label>
              <div className="flex items-center gap-3 bg-card border-2 border-border rounded-2xl px-4 py-3.5 shadow-soft">
                <CalendarDays className="w-5 h-5 text-primary" />
                <span className="font-semibold">Today, 23 April 2026</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Payout order</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setOrder("random")}
                  className={cn(
                    "rounded-2xl border-2 p-4 text-left transition-smooth",
                    order === "random" ? "border-primary bg-secondary shadow-soft" : "border-border bg-card"
                  )}
                >
                  <Shuffle className={cn("w-5 h-5 mb-2", order === "random" ? "text-primary" : "text-muted-foreground")} />
                  <p className="font-bold text-sm">Random</p>
                  <p className="text-[11px] text-muted-foreground">Fair to everyone</p>
                </button>
                <button
                  onClick={() => setOrder("manual")}
                  className={cn(
                    "rounded-2xl border-2 p-4 text-left transition-smooth",
                    order === "manual" ? "border-primary bg-secondary shadow-soft" : "border-border bg-card"
                  )}
                >
                  <ListOrdered className={cn("w-5 h-5 mb-2", order === "manual" ? "text-primary" : "text-muted-foreground")} />
                  <p className="font-bold text-sm">Manual</p>
                  <p className="text-[11px] text-muted-foreground">Admin sets order</p>
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-2xl bg-gradient-card border border-border p-4 shadow-soft space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Summary</p>
              {[
                { i: <Coins className="w-4 h-4" />, k: "Each contribution", v: formatNaira(amount) },
                { i: <Repeat className="w-4 h-4" />, k: "Frequency", v: freq },
                { i: <Users className="w-4 h-4" />, k: "Members", v: `${members} people` },
                { i: <Check className="w-4 h-4" />, k: "Cycle length", v: `${members} ${freq === "Weekly" ? "weeks" : "months"}` },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-1">
                  <span className="flex items-center gap-2 text-muted-foreground">{r.i} {r.k}</span>
                  <span className="font-bold">{r.v}</span>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              onClick={handleCreate}
              className="w-full h-14 bg-gradient-primary font-bold text-base rounded-2xl shadow-glow"
            >
              Create Group
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateGroup;
