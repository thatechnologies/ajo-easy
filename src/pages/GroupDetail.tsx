import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { apiGetGroupMembers, apiListGroups, type Group } from "@/lib/ajo-data";
import { Money, formatNaira } from "@/components/Money";
import { AvatarCircle } from "@/components/AvatarCircle";
import { Button } from "@/components/ui/button";
import { Check, Clock, Crown, Trophy, Share2, Calendar, TrendingUp, History } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"members" | "payouts" | "history">("members");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiListGroups()
      .then((groups) => {
        const found = groups.find((g) => g.id === id) ?? null;
        if (!found) {
          setGroup(null);
          return;
        }
        setGroup(found);
        return apiGetGroupMembers(id).then((members) => {
          setGroup((prev) => (prev ? { ...prev, members } : prev));
        });
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Could not load group";
        toast({ title: "Failed to load group", description: message, variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const me = useMemo(() => {
    if (!group || !user) return null;
    return group.members.find((m) => m.id === user.id) ?? null;
  }, [group, user]);

  const progress = group?.totalMembers ? (group.paidThisCycle / group.totalMembers) * 100 : 0;
  const totalPot = (group?.amount ?? 0) * (group?.totalMembers ?? 0);

  if (loading) {
    return (
      <div className="phone-shell flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!group) return <div className="phone-shell p-8">Group not found</div>;

  return (
    <div className="phone-shell flex flex-col">
      <PageHeader
        title={group.name}
        subtitle={`Cycle ${group.currentCycle} of ${group.totalMembers}`}
        variant="hero"
        right={
          <button
            onClick={() => {
              navigator.clipboard.writeText(group.inviteCode);
              toast({ title: "Code copied!", description: group.inviteCode });
            }}
            className="p-2 rounded-full bg-white/15 hover:bg-white/25"
          >
            <Share2 className="w-5 h-5" />
          </button>
        }
      />

      <div className="px-5 -mt-12 relative z-10">
        {/* Pot card */}
        <div className="bg-card rounded-3xl shadow-card p-5 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Each payout</p>
              <Money amount={totalPot} size="lg" className="text-primary" />
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Per member</p>
              <p className="font-bold text-base">{formatNaira(group.amount)}<span className="text-xs text-muted-foreground font-medium">/{group.frequency === "Weekly" ? "wk" : "mo"}</span></p>
            </div>
          </div>

          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">This cycle progress</span>
              <span className="font-bold">{group.paidThisCycle}/{group.totalMembers} paid</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-success rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/60">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-muted-foreground font-medium">Next payout</p>
              <p className="font-bold text-sm">{group.nextPayoutMember}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-muted-foreground font-medium">Date</p>
              <p className="font-bold text-sm text-primary">{group.nextPayoutDate}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-2xl mb-4">
          {([
            { k: "members", l: "Members", i: TrendingUp },
            { k: "payouts", l: "Payouts", i: Trophy },
            { k: "history", l: "History", i: History },
          ] as const).map(({ k, l, i: Icon }) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-smooth",
                tab === k ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5" /> {l}
            </button>
          ))}
        </div>
      </div>

      <div className="screen-pad pt-0">
        {tab === "members" && (
          <div className="space-y-2 animate-fade-in">
            {group.members.map((m) => (
              <div key={m.id} className="bg-card rounded-2xl p-3.5 shadow-soft border border-border/60 flex items-center gap-3">
                <AvatarCircle name={m.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-sm truncate">{m.name}</p>
                    {m.isAdmin && <Crown className="w-3.5 h-3.5 text-warning flex-shrink-0" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground">Position #{m.payoutPosition}</p>
                </div>
                {m.paid ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-success/15 text-success px-2.5 py-1.5 rounded-full">
                    <Check className="w-3 h-3" /> Paid
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-warning/15 text-warning px-2.5 py-1.5 rounded-full">
                    <Clock className="w-3 h-3" /> Pending
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "payouts" && (
          <div className="space-y-3 animate-fade-in">
            {[...group.members].sort((a, b) => a.payoutPosition - b.payoutPosition).map((m, idx, arr) => (
              <div key={m.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0",
                    m.receivedPayout ? "bg-success text-success-foreground" :
                    m.name === group.nextPayoutMember ? "bg-gradient-primary text-primary-foreground animate-pulse-glow" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {m.receivedPayout ? <Check className="w-4 h-4" /> : m.payoutPosition}
                  </div>
                  {idx < arr.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" style={{ minHeight: "12px" }} />}
                </div>
                <div className={cn(
                  "flex-1 rounded-2xl p-3.5 mb-2 shadow-soft border",
                  m.name === group.nextPayoutMember ? "bg-secondary border-primary/30" : "bg-card border-border/60"
                )}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {m.receivedPayout ? "✓ Received payout" : m.name === group.nextPayoutMember ? "Up next" : "Waiting"}
                      </p>
                    </div>
                    <p className="font-bold text-sm text-primary">{formatNaira(totalPot)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "history" && (
          <div className="space-y-2 animate-fade-in">
            {[
              { d: "Today", t: "Cycle 4 contributions opened", i: Calendar },
              { d: "12 Apr", t: "Tunde A. received ₦160,000 payout", i: Trophy },
              { d: "10 Apr", t: "Cycle 3 completed", i: Check },
              { d: "5 Apr", t: "Bisi O. received ₦160,000 payout", i: Trophy },
              { d: "29 Mar", t: "Cycle 2 completed", i: Check },
              { d: "12 Mar", t: "Group created by Tunde A.", i: TrendingUp },
            ].map((e, i) => (
              <div key={i} className="bg-card rounded-2xl p-3.5 shadow-soft border border-border/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <e.i className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{e.t}</p>
                  <p className="text-[11px] text-muted-foreground">{e.d}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky pay button */}
      {me && !me.paid && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 pb-6 bg-gradient-to-t from-background via-background to-transparent">
          <Button
            size="lg"
            onClick={() => navigate(`/pay/${group.id}`)}
            className="w-full h-14 bg-gradient-primary font-bold text-base rounded-2xl shadow-glow animate-pulse-glow"
          >
            Pay {formatNaira(group.amount)} now
          </Button>
        </div>
      )}
    </div>
  );
};

export default GroupDetail;
