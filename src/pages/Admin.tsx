
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
=======
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  LogOut,
  Users,
  Wallet,
  Mail,
  Trash2,
  Download,
  CheckCircle2,
  Circle,
  Search,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { mockGroups, type Group, type Member } from "@/lib/ajo-data";
import { formatNaira } from "@/components/Money";
import kowopeLogo from "@/assets/kowope-logo.png";

const WAITLIST_STORAGE_KEY = "kowope:waitlist-entries";
const ADMIN_SESSION_KEY = "kowope:admin-session";
const ADMIN_GROUPS_KEY = "kowope:admin-groups";
const DEFAULT_ADMIN_PASSWORD = "kowope-admin";
const ADMIN_PASSWORD =
  (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ||
  DEFAULT_ADMIN_PASSWORD;

const readWaitlist = (): string[] => {
  try {
    const raw = window.localStorage.getItem(WAITLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
};

const writeWaitlist = (entries: string[]) => {
  window.localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(entries));
};

const readGroups = (): Group[] => {
  try {
    const raw = window.localStorage.getItem(ADMIN_GROUPS_KEY);
    if (!raw) return mockGroups;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : mockGroups;
  } catch {
    return mockGroups;
  }
};

const writeGroups = (groups: Group[]) => {
  window.localStorage.setItem(ADMIN_GROUPS_KEY, JSON.stringify(groups));
};

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [waitlist, setWaitlist] = useState<string[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "1") {
      setAuthed(true);
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
    }
  }, []);

  useEffect(() => {
<<<<<<< HEAD
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
=======
    if (!authed) return;
    setWaitlist(readWaitlist());
    setGroups(readGroups());
  }, [authed]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
      setAuthed(true);
      setPassword("");
      toast({ title: "Welcome back, admin 👋" });
    } else {
      toast({
        title: "Incorrect password",
        description: "Check the VITE_ADMIN_PASSWORD value in your .env.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthed(false);
  };

  const handleDeleteWaitlistEntry = (entry: string) => {
    const next = waitlist.filter((e) => e !== entry);
    writeWaitlist(next);
    setWaitlist(next);
    toast({ title: "Entry removed", description: entry });
  };

  const handleClearWaitlist = () => {
    if (!window.confirm("Clear ALL waitlist entries on this device?")) return;
    writeWaitlist([]);
    setWaitlist([]);
    toast({ title: "Waitlist cleared" });
  };

  const handleExportCsv = () => {
    const rows = [
      ["entry", "type"],
      ...waitlist.map((e) => [e, e.includes("@") ? "email" : "phone"]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kowope-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateGroup = (groupId: string, updater: (g: Group) => Group) => {
    const next = groups.map((g) => (g.id === groupId ? updater(g) : g));
    setGroups(next);
    writeGroups(next);
  };

  const handleToggleMemberPaid = (groupId: string, memberId: string) => {
    updateGroup(groupId, (g) => {
      const members = g.members.map((m) =>
        m.id === memberId ? { ...m, paid: !m.paid } : m
      );
      const paidThisCycle = members.filter((m) => m.paid).length;
      return { ...g, members, paidThisCycle };
    });
  };

  const handleToggleMemberPayout = (groupId: string, memberId: string) => {
    updateGroup(groupId, (g) => ({
      ...g,
      members: g.members.map((m) =>
        m.id === memberId ? { ...m, receivedPayout: !m.receivedPayout } : m
      ),
    }));
  };

  const handleDeleteGroup = (groupId: string) => {
    if (!window.confirm("Delete this group? This cannot be undone.")) return;
    const next = groups.filter((g) => g.id !== groupId);
    setGroups(next);
    writeGroups(next);
    toast({ title: "Group deleted" });
  };

  const handleResetData = () => {
    if (!window.confirm("Reset groups & users back to mock data?")) return;
    writeGroups(mockGroups);
    setGroups(mockGroups);
    toast({ title: "Data reset" });
  };

  const allMembers = useMemo(() => {
    return groups.flatMap((g) =>
      g.members.map((m) => ({ ...m, groupId: g.id, groupName: g.name, amount: g.amount }))
    );
  }, [groups]);

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allMembers;
    return allMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        m.groupName.toLowerCase().includes(q)
    );
  }, [allMembers, search]);

  // ───────────────────────── LOGIN GATE ─────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-5">
        <Card className="w-full max-w-md shadow-elevated">
          <CardHeader className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-primary mx-auto grid place-items-center shadow-glow p-2 mb-3">
              <img src={kowopeLogo} alt="Kowope" className="w-full h-full object-contain" />
            </div>
            <CardTitle>Kowope Admin</CardTitle>
            <CardDescription>
              Enter the admin password to manage groups and users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin password"
                  className="w-full bg-card border-2 border-border rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary transition-smooth font-semibold"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-primary font-bold rounded-xl shadow-glow"
              >
                Sign in
              </Button>
              <Link
                to="/"
                className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-smooth"
              >
                <ArrowLeft className="w-3 h-3" /> Back to landing page
              </Link>
            </form>
          </CardContent>
        </Card>
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
      </div>
    );
  }

<<<<<<< HEAD
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
=======
  // ───────────────────────── DASHBOARD ─────────────────────────
  const totalPaidMembers = allMembers.filter((m) => m.paid).length;
  const totalCollected = groups.reduce(
    (sum, g) => sum + g.amount * g.paidThisCycle,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center p-1 shadow-glow">
              <img src={kowopeLogo} alt="Kowope" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-extrabold text-sm leading-tight">Kowope</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Admin
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard label="Waitlist" value={waitlist.length} icon={Mail} />
          <StatCard label="Groups" value={groups.length} icon={Users} />
          <StatCard label="Members paid" value={totalPaidMembers} icon={CheckCircle2} />
          <StatCard
            label="Collected (cycle)"
            value={formatNaira(totalCollected)}
            icon={Wallet}
          />
        </div>

        <Tabs defaultValue="groups" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-5">
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="members">Users</TabsTrigger>
            <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
          </TabsList>

          {/* GROUPS */}
          <TabsContent value="groups" className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <h2 className="text-lg font-bold">Ajo groups</h2>
                <p className="text-sm text-muted-foreground">
                  Mark members as paid, settle payouts, or remove a group.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleResetData}>
                Reset to mock data
              </Button>
            </div>

            {groups.length === 0 && (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground text-sm">
                  No groups yet.
                </CardContent>
              </Card>
            )}

            {groups.map((g) => (
              <Card key={g.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                  <div>
                    <CardTitle className="text-base">{g.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {formatNaira(g.amount)} · {g.frequency} · {g.totalMembers} members ·
                      Cycle {g.currentCycle}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {g.paidThisCycle}/{g.totalMembers} paid
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteGroup(g.id)}
                      aria-label="Delete group"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead className="hidden sm:table-cell">Phone</TableHead>
                        <TableHead className="text-center">Paid</TableHead>
                        <TableHead className="text-center">Payout</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {g.members.map((m) => (
                        <MemberRow
                          key={m.id}
                          member={m}
                          onTogglePaid={() => handleToggleMemberPaid(g.id, m.id)}
                          onTogglePayout={() => handleToggleMemberPayout(g.id, m.id)}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* MEMBERS / USERS */}
          <TabsContent value="members" className="space-y-4">
            <div>
              <h2 className="text-lg font-bold">Users & payments</h2>
              <p className="text-sm text-muted-foreground">
                All members across every group. Click to toggle payment status.
              </p>
            </div>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, phone, or group…"
                className="w-full bg-card border-2 border-border rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-primary transition-smooth text-sm font-medium"
              />
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead className="hidden md:table-cell">Phone</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center">Paid</TableHead>
                      <TableHead className="text-center">Payout</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-10 text-sm">
                          No members match your search.
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredMembers.map((m) => (
                      <TableRow key={`${m.groupId}-${m.id}`}>
                        <TableCell className="font-semibold">
                          {m.name}
                          {m.isAdmin && (
                            <Badge variant="outline" className="ml-2 text-[9px]">admin</Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                          {m.phone}
                        </TableCell>
                        <TableCell className="text-xs">{m.groupName}</TableCell>
                        <TableCell className="text-right tabular-nums text-xs">
                          {formatNaira(m.amount)}
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => handleToggleMemberPaid(m.groupId, m.id)}
                            aria-label="Toggle paid"
                            className="inline-flex"
                          >
                            {m.paid ? (
                              <CheckCircle2 className="w-5 h-5 text-success" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground" />
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => handleToggleMemberPayout(m.groupId, m.id)}
                            aria-label="Toggle payout"
                            className="inline-flex"
                          >
                            {m.receivedPayout ? (
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground" />
                            )}
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* WAITLIST */}
          <TabsContent value="waitlist" className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <h2 className="text-lg font-bold">Waitlist entries</h2>
                <p className="text-sm text-muted-foreground">
                  Stored on this device only. For the full list, check Formspree.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportCsv}
                  disabled={!waitlist.length}
                  className="gap-1.5"
                >
                  <Download className="w-4 h-4" /> CSV
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClearWaitlist}
                  disabled={!waitlist.length}
                  className="text-destructive hover:text-destructive"
                >
                  Clear all
                </Button>
              </div>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Entry</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {waitlist.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-10 text-sm">
                          No entries on this device yet.
                        </TableCell>
                      </TableRow>
                    )}
                    {waitlist.map((entry, i) => (
                      <TableRow key={entry}>
                        <TableCell className="text-muted-foreground tabular-nums">
                          {i + 1}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{entry}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px]">
                            {entry.includes("@") ? "email" : "phone"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteWaitlistEntry(entry)}
                            aria-label="Remove entry"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
    </div>
  );
};

<<<<<<< HEAD
=======
const StatCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <Card>
    <CardContent className="p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-secondary grid place-items-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
          {label}
        </p>
        <p className="font-extrabold text-base truncate">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const MemberRow = ({
  member,
  onTogglePaid,
  onTogglePayout,
}: {
  member: Member;
  onTogglePaid: () => void;
  onTogglePayout: () => void;
}) => (
  <TableRow>
    <TableCell className="font-semibold text-sm">
      {member.name}
      {member.isAdmin && (
        <Badge variant="outline" className="ml-2 text-[9px]">admin</Badge>
      )}
    </TableCell>
    <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">
      {member.phone}
    </TableCell>
    <TableCell className="text-center">
      <button
        onClick={onTogglePaid}
        aria-label="Toggle paid"
        className={cn(
          "inline-flex items-center justify-center w-8 h-8 rounded-lg transition-smooth",
          member.paid ? "bg-success/15" : "hover:bg-muted"
        )}
      >
        {member.paid ? (
          <CheckCircle2 className="w-5 h-5 text-success" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
    </TableCell>
    <TableCell className="text-center">
      <button
        onClick={onTogglePayout}
        aria-label="Toggle payout"
        className={cn(
          "inline-flex items-center justify-center w-8 h-8 rounded-lg transition-smooth",
          member.receivedPayout ? "bg-primary/15" : "hover:bg-muted"
        )}
      >
        {member.receivedPayout ? (
          <CheckCircle2 className="w-5 h-5 text-primary" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
    </TableCell>
  </TableRow>
);

>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
export default Admin;
