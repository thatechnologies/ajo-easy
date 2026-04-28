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
    }
  }, []);

  useEffect(() => {
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
      </div>
    );
  }

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
    </div>
  );
};

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

export default Admin;
