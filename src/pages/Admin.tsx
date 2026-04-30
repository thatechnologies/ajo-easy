
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { apiAdminListContributions, apiListGroups, apiListJoinRequests, apiRecordPayout, apiReviewJoinRequest, apiUpdateGroupBank, type Group, type JoinRequest } from "@/lib/ajo-data";
import { formatNaira } from "@/components/Money";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Copy, Loader2, ShieldCheck, UserPlus, Wallet, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type BankForm = { bankName: string; bankAccountNumber: string; bankAccountName: string };

const BANKS = [
  "Access Bank",
  "Citibank",
  "Ecobank",
  "Fidelity Bank",
  "First Bank",
  "FCMB",
  "Globus Bank",
  "GTBank",
  "Heritage Bank",
  "Jaiz Bank",
  "Keystone Bank",
  "Kuda",
  "Moniepoint Microfinance Bank",
  "Opay",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC",
  "Standard Chartered",
  "Sterling Bank",
  "SunTrust Bank",
  "Titan Trust Bank",
  "UBA",
  "Union Bank",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
];

const toBankForm = (g: Group): BankForm => ({
  bankName: g.bankName ?? "",
  bankAccountNumber: g.bankAccountNumber ?? "",
  bankAccountName: g.bankAccountName ?? "",
});

const bankOptionsFor = (current: string) => {
  const trimmed = current.trim();
  if (!trimmed) return BANKS;
  if (BANKS.includes(trimmed)) return BANKS;
  return [trimmed, ...BANKS];
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin, refreshAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [bankForms, setBankForms] = useState<Record<string, BankForm>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [bankOpenByGroup, setBankOpenByGroup] = useState<Record<string, boolean>>({});
  const [requestsByGroup, setRequestsByGroup] = useState<Record<string, JoinRequest[]>>({});
  const [loadingRequestsFor, setLoadingRequestsFor] = useState<string | null>(null);
  const [reviewingRequestId, setReviewingRequestId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [all, pending] = await Promise.all([
        apiListGroups(),
        apiAdminListContributions("pending").catch(() => ({ contributions: [] })),
      ]);
      const adminGroups = all.filter((g) => g.isAdmin);
      setGroups(adminGroups);
      setPendingCount(pending.contributions.length);
      setBankForms((prev) => {
        const next: Record<string, BankForm> = { ...prev };
        for (const g of adminGroups) {
          if (!next[g.id]) next[g.id] = toBankForm(g);
        }
        return next;
      });
      setBankOpenByGroup((prev) => {
        const next: Record<string, boolean> = { ...prev };
        for (const g of adminGroups) {
          if (next[g.id] === undefined) next[g.id] = false;
        }
        return next;
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Try again";
      toast({ title: "Failed to load admin tools", description: message, variant: "destructive" });
      setGroups([]);
      setPendingCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (authLoading || !user) return;
    load();
  }, [authLoading, user, load]);

  const canRecordPayout = (g: Group) => (g.paidThisCycle ?? 0) >= (g.totalMembers ?? 0);

  const copyInvite = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({ title: "Invite code copied", description: code });
    } catch {
      toast({ title: "Couldn't copy", description: "Copy manually", variant: "destructive" });
    }
  };

  const toggleRequests = async (groupId: string) => {
    if (requestsByGroup[groupId]) {
      setRequestsByGroup((p) => {
        const next = { ...p };
        delete next[groupId];
        return next;
      });
      return;
    }
    setLoadingRequestsFor(groupId);
    try {
      const { requests } = await apiListJoinRequests(groupId, "pending");
      setRequestsByGroup((p) => ({ ...p, [groupId]: requests }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Try again";
      toast({ title: "Could not load join requests", description: message, variant: "destructive" });
    } finally {
      setLoadingRequestsFor(null);
    }
  };

  const reviewJoin = async (groupId: string, requestId: string, status: "approved" | "rejected") => {
    setReviewingRequestId(requestId);
    try {
      await apiReviewJoinRequest(groupId, requestId, status);
      toast({ title: status === "approved" ? "Member approved" : "Request rejected" });
      setRequestsByGroup((p) => ({
        ...p,
        [groupId]: (p[groupId] ?? []).filter((r) => r.id !== requestId),
      }));
      await load();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Try again";
      toast({ title: "Could not update request", description: message, variant: "destructive" });
    } finally {
      setReviewingRequestId(null);
    }
  };

  const saveBank = async (groupId: string) => {
    const f = bankForms[groupId];
    if (!f) return;
    setSavingId(groupId);
    try {
      await apiUpdateGroupBank(groupId, {
        bankName: f.bankName.trim() ? f.bankName.trim() : null,
        bankAccountNumber: f.bankAccountNumber.trim() ? f.bankAccountNumber.trim().replace(/\s/g, "") : null,
        bankAccountName: f.bankAccountName.trim() ? f.bankAccountName.trim() : null,
      });
      await Promise.all([load(), refreshAdmin()]);
      toast({ title: "Account updated", description: "Payout account saved." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Try again";
      toast({ title: "Could not save account", description: message, variant: "destructive" });
    } finally {
      setSavingId(null);
    }
  };

  const recordPayout = async (groupId: string) => {
    setRecordingId(groupId);
    try {
      await apiRecordPayout(groupId);
      await load();
      toast({ title: "Payout recorded", description: "Cycle advanced." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Try again";
      toast({ title: "Could not record payout", description: message, variant: "destructive" });
    } finally {
      setRecordingId(null);
    }
  };

  const totalPot = useMemo(() => {
    return (g: Group) => (g.amount ?? 0) * (g.totalMembers ?? 0);
  }, []);

  if (authLoading) {
    return (
      <div className="phone-shell flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="phone-shell flex flex-col">
        <PageHeader title="Admin" subtitle="Group admin tools" />
        <div className="screen-pad flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <ShieldCheck className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="font-bold mb-1">No admin groups yet</p>
          <p className="text-sm text-muted-foreground max-w-xs mb-6">
            Create a group to unlock admin actions like reviewing payments and recording payouts.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/create-group")}
            className="w-full h-14 bg-gradient-primary font-bold text-base rounded-2xl shadow-glow"
          >
            Create a group
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="phone-shell flex flex-col">
      <PageHeader title="Admin" subtitle="Manage your groups" />
      <div className="screen-pad flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-2xl bg-card border border-border shadow-soft p-4">
            <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">Admin groups</p>
            <p className="text-2xl font-extrabold mt-1 tabular-nums">{groups.length}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/payments")}
            className="rounded-2xl bg-card border border-border shadow-soft p-4 text-left hover:border-primary/40 transition-smooth"
          >
            <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">Pending reviews</p>
            <p className="text-2xl font-extrabold mt-1 tabular-nums">{pendingCount}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Tap to review</p>
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <Button variant="outline" className="flex-1 h-11 rounded-2xl font-bold" onClick={load} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
          </Button>
          <Button className="flex-1 h-11 rounded-2xl font-bold bg-gradient-primary shadow-glow" onClick={() => navigate("/payments")}>
            Review payments
          </Button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
        ) : groups.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <p className="font-bold mb-1">No admin groups found</p>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">Create a group to get started.</p>
            <Button
              size="lg"
              onClick={() => navigate("/create-group")}
              className="w-full h-14 bg-gradient-primary font-bold text-base rounded-2xl shadow-glow"
            >
              Create a group
            </Button>
          </div>
        ) : (
          <div className="space-y-3 pb-20">
            {groups.map((g) => {
              const form = bankForms[g.id] ?? toBankForm(g);
              const progress = g.totalMembers ? (g.paidThisCycle / g.totalMembers) * 100 : 0;
              const pot = totalPot(g);
              const openRequests = requestsByGroup[g.id];
              return (
                <div key={g.id} className="rounded-3xl bg-card border border-border shadow-soft p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="font-extrabold text-base truncate">{g.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {formatNaira(g.amount)}/{g.frequency === "Weekly" ? "wk" : "mo"} • {g.totalMembers} members • pot {formatNaira(pot)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyInvite(g.inviteCode)}
                      className="px-3 py-2 rounded-2xl bg-secondary text-secondary-foreground text-xs font-bold inline-flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" /> Code
                    </button>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">This cycle</span>
                      <span className="font-bold">
                        {g.paidThisCycle}/{g.totalMembers} submitted • {g.confirmedThisCycle ?? 0}/{g.totalMembers} confirmed
                      </span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-success rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Button
                      variant="outline"
                      className="h-11 rounded-2xl font-bold"
                      onClick={() => navigate(`/group/${g.id}`)}
                    >
                      Open group
                    </Button>
                    <Button
                      className="h-11 rounded-2xl font-bold bg-gradient-primary shadow-glow"
                      onClick={() => navigate("/payments")}
                    >
                      Review
                    </Button>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 rounded-2xl font-bold mb-3"
                    onClick={() => toggleRequests(g.id)}
                    disabled={loadingRequestsFor === g.id}
                  >
                    {loadingRequestsFor === g.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" /> {openRequests ? "Hide join requests" : "View join requests"}
                      </>
                    )}
                  </Button>

                  {openRequests && (
                    <div className="rounded-2xl bg-secondary/40 border border-border/60 p-3 mb-3">
                      <p className="text-xs font-bold mb-3">Pending join requests</p>
                      {openRequests.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No pending requests.</p>
                      ) : (
                        <div className="space-y-2">
                          {openRequests.map((r) => (
                            <div key={r.id} className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3">
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm truncate">{r.full_name}</p>
                                <p className="text-[11px] text-muted-foreground truncate">{r.phone} • {r.email}</p>
                              </div>
                              <Button
                                size="sm"
                                className="h-9 rounded-xl font-bold bg-success text-success-foreground hover:bg-success/90"
                                onClick={() => reviewJoin(g.id, r.id, "approved")}
                                disabled={reviewingRequestId === r.id}
                              >
                                {reviewingRequestId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 rounded-xl px-3 border-destructive/30 text-destructive hover:bg-destructive/10"
                                onClick={() => reviewJoin(g.id, r.id, "rejected")}
                                disabled={reviewingRequestId === r.id}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <Collapsible
                    open={!!bankOpenByGroup[g.id]}
                    onOpenChange={(open) => setBankOpenByGroup((p) => ({ ...p, [g.id]: open }))}
                  >
                    <div className="rounded-2xl bg-secondary/40 border border-border/60 overflow-hidden">
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          className="w-full flex items-center justify-between gap-3 px-3 py-3 text-left hover:bg-secondary/40 transition-smooth"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold">Payout account</p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {g.bankAccountNumber
                                ? `${g.bankAccountName ?? "Account"} • ${g.bankAccountNumber.slice(-4)} • ${g.bankName ?? "Bank"}`
                                : "Add bank details for payouts"}
                            </p>
                          </div>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 text-muted-foreground transition-transform",
                              bankOpenByGroup[g.id] ? "rotate-180" : "rotate-0",
                            )}
                          />
                        </button>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="px-3 pb-3">
                          <div className="space-y-2">
                            <Select
                              value={form.bankName.trim() ? form.bankName.trim() : undefined}
                              onValueChange={(v) => setBankForms((p) => ({ ...p, [g.id]: { ...form, bankName: v } }))}
                            >
                              <SelectTrigger className="w-full h-auto bg-card border-2 border-border rounded-2xl px-4 py-3 shadow-soft focus:ring-0 focus:ring-offset-0 focus:outline-none focus:border-primary transition-smooth font-semibold text-sm">
                                <SelectValue placeholder="Select bank" />
                              </SelectTrigger>
                              <SelectContent>
                                {bankOptionsFor(form.bankName).map((b) => (
                                  <SelectItem key={b} value={b}>
                                    {b}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <input
                              value={form.bankAccountNumber}
                              onChange={(e) =>
                                setBankForms((p) => ({ ...p, [g.id]: { ...form, bankAccountNumber: e.target.value } }))
                              }
                              placeholder="Account number"
                              inputMode="numeric"
                              className="w-full bg-card border-2 border-border rounded-2xl px-4 py-3 outline-none focus:border-primary transition-smooth font-semibold text-sm tabular-nums"
                            />
                            <input
                              value={form.bankAccountName}
                              onChange={(e) =>
                                setBankForms((p) => ({ ...p, [g.id]: { ...form, bankAccountName: e.target.value } }))
                              }
                              placeholder="Account name"
                              className="w-full bg-card border-2 border-border rounded-2xl px-4 py-3 outline-none focus:border-primary transition-smooth font-semibold text-sm"
                            />

                            <Button
                              size="sm"
                              className="w-full h-11 rounded-2xl font-bold bg-gradient-primary shadow-glow"
                              onClick={() => saveBank(g.id)}
                              disabled={savingId === g.id}
                            >
                              {savingId === g.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Check className="w-4 h-4 mr-1.5" /> Save payout account
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>

                  {canRecordPayout(g) && (
                    <Button
                      size="lg"
                      onClick={() => recordPayout(g.id)}
                      disabled={recordingId === g.id}
                      className={cn("w-full h-12 rounded-2xl font-bold mt-3", "bg-success text-success-foreground hover:bg-success/90")}
                    >
                      {recordingId === g.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Wallet className="w-4 h-4 mr-2" /> Record payout</>}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
