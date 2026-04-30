import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
<<<<<<< HEAD
import { apiGetGroup, apiGetGroupContributions, apiGetGroupMembers, apiGetGroupPayouts, apiRecordPayout, type Group, type GroupContribution, type GroupPayout } from "@/lib/ajo-data";
import { Money, formatNaira } from "@/components/Money";
import { AvatarCircle } from "@/components/AvatarCircle";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Clock, Copy, Crown, History, Landmark, Share2, TrendingUp, Trophy, Wallet, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
=======
import { getGroupById } from "@/lib/ajo-data";
import { Money, formatNaira } from "@/components/Money";
import { AvatarCircle } from "@/components/AvatarCircle";
import { Button } from "@/components/ui/button";
import { Check, Clock, Crown, Trophy, Share2, Calendar, TrendingUp, History } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
<<<<<<< HEAD
  const { user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"members" | "payouts" | "history">("members");
  const [payouts, setPayouts] = useState<GroupPayout[]>([]);
  const [contributions, setContributions] = useState<GroupContribution[]>([]);
  const [recording, setRecording] = useState(false);
  const [payoutReference, setPayoutReference] = useState("");
  const [payoutNotes, setPayoutNotes] = useState("");
  const [payoutDetailsOpen, setPayoutDetailsOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      apiGetGroup(id),
      apiGetGroupMembers(id),
      apiGetGroupPayouts(id),
      apiGetGroupContributions(id),
    ])
      .then(([g, members, payoutsRes, contribRes]) => {
        setGroup({ ...g, members });
        setPayouts(payoutsRes);
        setContributions(contribRes.contributions);
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
  const canRecordPayout = Boolean(group?.isAdmin) && (group?.paidThisCycle ?? 0) >= (group?.totalMembers ?? 0);

  const nextRecipient = useMemo(() => {
    if (!group) return null;
    const byId = group.nextPayoutMemberId ? group.members.find((m) => m.id === group.nextPayoutMemberId) : null;
    if (byId) return byId;
    return group.members.find((m) => m.name === group.nextPayoutMember) ?? null;
  }, [group]);

  const copyPayoutMessage = async () => {
    if (!group) return;
    const recipientName = nextRecipient?.name ?? group.nextPayoutMember;
    const lines = [
      `Payout: ${formatNaira(totalPot)}`,
      `Group: ${group.name}`,
      `Cycle: ${group.currentCycle} of ${group.totalMembers}`,
      `Recipient: ${recipientName}${nextRecipient?.phone ? ` (${nextRecipient.phone})` : ""}`,
    ];
    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied", description: "Payout message copied to clipboard." });
    } catch {
      toast({ title: "Couldn't copy", variant: "destructive" });
    }
  };

  const recordPayout = async () => {
    if (!group) return;
    setRecording(true);
    try {
      const ref = payoutReference.trim();
      const notes = payoutNotes.trim();
      const combinedNotes = [ref ? `Transfer ref: ${ref}` : null, notes ? notes : null].filter(Boolean).join("\n");
      await apiRecordPayout(group.id, {
        recipientId: group.nextPayoutMemberId ?? undefined,
        notes: combinedNotes ? combinedNotes : undefined,
      });
      const [g, members, p, c] = await Promise.all([
        apiGetGroup(group.id),
        apiGetGroupMembers(group.id),
        apiGetGroupPayouts(group.id),
        apiGetGroupContributions(group.id),
      ]);
      setGroup({ ...g, members });
      setPayouts(p);
      setContributions(c.contributions);
      setPayoutReference("");
      setPayoutNotes("");
      toast({ title: "Payout recorded", description: "Cycle advanced." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Try again";
      toast({ title: "Could not record payout", description: message, variant: "destructive" });
    } finally {
      setRecording(false);
    }
  };

  const handleRecordPayout = async () => {
    if (!group) return;
    if (!canRecordPayout) {
      toast({
        title: "Can't record payout yet",
        description: `${group.paidThisCycle}/${group.totalMembers} members have submitted for this cycle.`,
        variant: "destructive",
      });
      return;
    }
    await recordPayout();
  };

  if (loading) {
    return (
      <div className="phone-shell flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!group) return <div className="phone-shell p-8">Group not found</div>;

=======
  const group = getGroupById(id || "");
  const [tab, setTab] = useState<"members" | "payouts" | "history">("members");

  if (!group) return <div className="phone-shell p-8">Group not found</div>;

  const me = group.members.find((m) => m.name === "You");
  const progress = (group.paidThisCycle / group.totalMembers) * 100;
  const totalPot = group.amount * group.totalMembers;

>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
  return (
    <div className="phone-shell flex flex-col">
      <PageHeader
        title={group.name}
        subtitle={`Cycle ${group.currentCycle} of ${group.totalMembers}`}
        variant="hero"
        right={
          <button
<<<<<<< HEAD
            onClick={() => {
              navigator.clipboard.writeText(group.inviteCode);
              toast({ title: "Code copied!", description: group.inviteCode });
            }}
=======
            onClick={() => { navigator.clipboard.writeText(group.inviteCode); toast({ title: "Code copied!", description: group.inviteCode }); }}
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
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
<<<<<<< HEAD
              <span className="font-bold">
                {group.paidThisCycle}/{group.totalMembers} submitted • {group.confirmedThisCycle ?? 0}/{group.totalMembers} confirmed
              </span>
=======
              <span className="font-bold">{group.paidThisCycle}/{group.totalMembers} paid</span>
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
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
<<<<<<< HEAD

          <div className="mt-4 rounded-2xl bg-secondary/60 p-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
                <Landmark className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium">Payout account</p>
                {group.bankAccountNumber || group.bankName || group.bankAccountName ? (
                  <div className="mt-1">
                    <p className="font-extrabold text-base tabular-nums tracking-wide">
                      {group.bankAccountNumber ?? "—"}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {(group.bankName ?? "—") + " • " + (group.bankAccountName ?? "—")}
                    </p>
                  </div>
                ) : (
                  <p className="font-bold text-sm mt-1">Not set</p>
                )}
              </div>
              {group.bankAccountNumber && (
                <button
                  type="button"
                  onClick={() => {
                    const text = [group.bankAccountNumber, group.bankAccountName, group.bankName].filter(Boolean).join(" • ");
                    navigator.clipboard.writeText(text);
                    toast({ title: "Account copied", description: group.bankAccountNumber });
                  }}
                  className="px-3 py-2 rounded-xl bg-card border border-border hover:bg-card/80 text-xs font-bold inline-flex items-center gap-2"
                  aria-label="Copy payout account"
                >
                  <Copy className="w-4 h-4" /> Copy
                </button>
              )}
            </div>
          </div>

          {!group.myPaidThisCycle ? (
            <Button
              size="lg"
              onClick={() => navigate(`/pay/${group.id}`)}
              className="w-full h-12 rounded-2xl font-bold bg-gradient-primary shadow-glow mt-3"
            >
              <Wallet className="w-4 h-4 mr-2" /> Pay this cycle
            </Button>
          ) : (
            <Button
              size="lg"
              disabled
              className="w-full h-12 rounded-2xl font-bold mt-3"
              variant="outline"
            >
              Payment submitted
            </Button>
          )}
=======
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
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
<<<<<<< HEAD
                {m.paymentStatus === "confirmed" ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-success/15 text-success px-2.5 py-1.5 rounded-full">
                    <Check className="w-3 h-3" /> Confirmed
                  </span>
                ) : m.paymentStatus === "pending" ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-warning/15 text-warning px-2.5 py-1.5 rounded-full">
                    <Clock className="w-3 h-3" /> Pending
                  </span>
                ) : m.paymentStatus === "rejected" ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-destructive/15 text-destructive px-2.5 py-1.5 rounded-full">
                    <X className="w-3 h-3" /> Rejected
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-muted text-muted-foreground px-2.5 py-1.5 rounded-full">
                    <Clock className="w-3 h-3" /> Unpaid
=======
                {m.paid ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-success/15 text-success px-2.5 py-1.5 rounded-full">
                    <Check className="w-3 h-3" /> Paid
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase bg-warning/15 text-warning px-2.5 py-1.5 rounded-full">
                    <Clock className="w-3 h-3" /> Pending
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "payouts" && (
          <div className="space-y-3 animate-fade-in">
<<<<<<< HEAD
            {group.isAdmin && (
              <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/60">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Payout</p>
                    <p className="font-extrabold text-base">
                      {formatNaira(totalPot)} <span className="text-xs text-muted-foreground font-semibold">this cycle</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Send outside the app, then record it here to advance the cycle.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={copyPayoutMessage}
                    className="px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-bold inline-flex items-center gap-2 flex-shrink-0"
                  >
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                </div>

                <Collapsible open={payoutDetailsOpen} onOpenChange={setPayoutDetailsOpen}>
                  <div className="mt-3 rounded-2xl border border-border/60 overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="w-full flex items-center justify-between gap-3 p-3 bg-secondary/60 hover:bg-secondary/70 transition-smooth"
                      >
                        <div className="min-w-0 text-left">
                          <p className="text-xs font-bold">Transfer & notes</p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            Recipient: {nextRecipient?.name ?? group.nextPayoutMember}
                          </p>
                        </div>
                        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", payoutDetailsOpen ? "rotate-180" : "rotate-0")} />
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="p-3 bg-card border-t border-border/60">
                        <div className="rounded-xl bg-secondary/60 p-3">
                          <p className="text-[11px] text-muted-foreground font-medium">Recipient</p>
                          <p className="font-bold text-sm">
                            {nextRecipient?.name ?? group.nextPayoutMember}
                            {nextRecipient?.phone ? <span className="text-muted-foreground font-semibold"> • {nextRecipient.phone}</span> : null}
                          </p>
                        </div>

                        <div className="mt-3 grid gap-2">
                          <input
                            type="text"
                            value={payoutReference}
                            onChange={(e) => setPayoutReference(e.target.value)}
                            placeholder="Transfer reference (optional)"
                            maxLength={80}
                            className="w-full bg-card border-2 border-border rounded-2xl px-4 py-3 outline-none focus:border-primary transition-smooth font-semibold shadow-soft tabular-nums placeholder:text-muted-foreground/60 placeholder:font-normal"
                          />
                          <textarea
                            value={payoutNotes}
                            onChange={(e) => setPayoutNotes(e.target.value)}
                            placeholder="Notes (optional)"
                            maxLength={300}
                            className="w-full min-h-[84px] resize-none bg-card border-2 border-border rounded-2xl px-4 py-3 outline-none focus:border-primary transition-smooth font-semibold shadow-soft placeholder:text-muted-foreground/60 placeholder:font-normal"
                          />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>

                <Button
                  size="lg"
                  disabled={recording}
                  onClick={handleRecordPayout}
                  className={cn(
                    "w-full h-12 bg-gradient-primary font-bold text-sm rounded-2xl shadow-glow mt-3",
                    !canRecordPayout && "opacity-60",
                  )}
                >
                  {recording ? "Recording…" : "Record payout & advance cycle"}
                </Button>
                {!canRecordPayout && (
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Waiting for all members to submit payments for this cycle ({group.paidThisCycle}/{group.totalMembers}).
                  </p>
                )}
              </div>
            )}

            {[...group.members].sort((a, b) => a.payoutPosition - b.payoutPosition).map((m, idx, arr) => {
              const received = payouts.some((p) => p.recipient_id === m.id);
              const isNext = group.nextPayoutMemberId ? m.id === group.nextPayoutMemberId : m.name === group.nextPayoutMember;
              return (
=======
            {group.members.sort((a, b) => a.payoutPosition - b.payoutPosition).map((m, idx, arr) => (
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
              <div key={m.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0",
<<<<<<< HEAD
                    received ? "bg-success text-success-foreground" :
                    isNext ? "bg-gradient-primary text-primary-foreground animate-pulse-glow" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {received ? <Check className="w-4 h-4" /> : m.payoutPosition}
=======
                    m.receivedPayout ? "bg-success text-success-foreground" :
                    m.name === group.nextPayoutMember ? "bg-gradient-primary text-primary-foreground animate-pulse-glow" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {m.receivedPayout ? <Check className="w-4 h-4" /> : m.payoutPosition}
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
                  </div>
                  {idx < arr.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" style={{ minHeight: "12px" }} />}
                </div>
                <div className={cn(
                  "flex-1 rounded-2xl p-3.5 mb-2 shadow-soft border",
<<<<<<< HEAD
                  isNext ? "bg-secondary border-primary/30" : "bg-card border-border/60"
=======
                  m.name === group.nextPayoutMember ? "bg-secondary border-primary/30" : "bg-card border-border/60"
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
                )}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground">
<<<<<<< HEAD
                        {received ? "✓ Received payout" : isNext ? "Up next" : "Waiting"}
=======
                        {m.receivedPayout ? "✓ Received payout" : m.name === group.nextPayoutMember ? "Up next" : "Waiting"}
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
                      </p>
                    </div>
                    <p className="font-bold text-sm text-primary">{formatNaira(totalPot)}</p>
                  </div>
                </div>
              </div>
<<<<<<< HEAD
            );
            })}
=======
            ))}
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
          </div>
        )}

        {tab === "history" && (
          <div className="space-y-2 animate-fade-in">
<<<<<<< HEAD
            {(() => {
              const payoutEvents = payouts.map((p) => ({
                key: `payout:${p.id}`,
                ts: new Date(p.paid_at).getTime(),
                title: `${p.recipient_name ?? "Member"} received ${formatNaira(p.amount)} payout`,
                icon: Trophy,
                time: p.paid_at,
              }));

              const contribEvents = contributions.map((c) => ({
                key: `contrib:${c.id}`,
                ts: new Date(c.submitted_at).getTime(),
                title:
                  c.status === "confirmed"
                    ? `${c.member_name ?? "Member"} payment confirmed`
                    : c.status === "rejected"
                      ? `${c.member_name ?? "Member"} payment rejected`
                      : `${c.member_name ?? "Member"} submitted payment`,
                icon: c.status === "confirmed" ? Check : c.status === "rejected" ? X : Clock,
                time: c.submitted_at,
              }));

              const events = [...payoutEvents, ...contribEvents]
                .filter((e) => Number.isFinite(e.ts))
                .sort((a, b) => b.ts - a.ts)
                .slice(0, 30);

              if (!events.length) {
                return (
                  <div className="bg-card rounded-2xl p-4 shadow-soft border border-border/60 text-sm text-muted-foreground">
                    No activity yet.
                  </div>
                );
              }

              return events.map((e) => (
                <div key={e.key} className="bg-card rounded-2xl p-3.5 shadow-soft border border-border/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <e.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{e.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatDistanceToNow(new Date(e.time), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ));
            })()}
=======
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
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
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
