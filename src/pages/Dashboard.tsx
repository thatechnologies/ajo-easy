import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { Plus, UserPlus, Wallet, ArrowUpRight, Calendar, Users, ChevronRight, Wifi, WifiOff, ArrowDownLeft } from "lucide-react";
import { Money, formatNaira } from "@/components/Money";
import { apiListGroups, apiListNotifications, type AppNotification, type Group } from "@/lib/ajo-data";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
=======
import { Plus, UserPlus, Wallet, ArrowUpRight, Calendar, Users, ChevronRight, Wifi, WifiOff } from "lucide-react";
import { Money, formatNaira } from "@/components/Money";
import { mockGroups } from "@/lib/ajo-data";
import { useState } from "react";
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc

const Dashboard = () => {
  const navigate = useNavigate();
  const [online] = useState(true);
<<<<<<< HEAD
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [activity, setActivity] = useState<AppNotification[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [kycOpen, setKycOpen] = useState(false);

  useEffect(() => {
    apiListGroups()
      .then(setGroups)
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Could not load groups";
        toast({ title: "Failed to load groups", description: message, variant: "destructive" });
      });
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user.kyc_status === "verified") return;
    if (window.sessionStorage.getItem("kowope:kyc:prompted") === "1") return;
    window.sessionStorage.setItem("kowope:kyc:prompted", "1");
    setKycOpen(true);
  }, [user]);

  useEffect(() => {
    setLoadingActivity(true);
    apiListNotifications({ limit: 6 })
      .then((res) => setActivity(res.notifications))
      .catch(() => setActivity([]))
      .finally(() => setLoadingActivity(false));
  }, []);

  const totalContributed = useMemo(() => groups.reduce((s, g) => s + g.myContribution, 0), [groups]);
  const nextPayout = useMemo(() => groups.find((g) => g.nextPayoutMember === "You"), [groups]);
  const pending = useMemo(
    () => groups.filter((g) => g.members.find((m) => m.name === (user?.full_name ?? "You") && !m.paid)).length,
    [groups, user],
  );
=======

  const totalContributed = mockGroups.reduce((s, g) => s + g.myContribution, 0);
  const nextPayout = mockGroups.find((g) => g.nextPayoutMember === "You");
  const pending = mockGroups.filter((g) => g.members.find((m) => m.name === "You" && !m.paid)).length;
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc

  return (
    <div className="phone-shell flex flex-col">
      {/* Hero header */}
      <div className="bg-gradient-hero text-primary-foreground px-5 pt-12 pb-24 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-20 -right-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative flex items-center justify-between mb-6">
          <div>
            <p className="text-xs opacity-80">Good morning,</p>
<<<<<<< HEAD
            <p className="text-lg font-bold">{user?.full_name ?? "—"} 👋</p>
=======
            <p className="text-lg font-bold">Ada Okonkwo 👋</p>
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium bg-white/15 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
            {online ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {online ? "Online" : "Offline"}
          </div>
        </div>

        <div className="relative">
          <p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-semibold">Total Contributed</p>
          <Money amount={totalContributed} size="xl" className="block mb-1" />
<<<<<<< HEAD
          <p className="text-xs opacity-80">Across {groups.length} active groups</p>
=======
          <p className="text-xs opacity-80">Across {mockGroups.length} active groups</p>
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
        </div>
      </div>

      {/* Quick stats - overlap */}
      <div className="px-5 -mt-14 relative z-10 grid grid-cols-2 gap-3">
        <button
<<<<<<< HEAD
          onClick={() => (user?.kyc_status === "verified" ? navigate("/create-group") : navigate("/kyc"))}
=======
          onClick={() => navigate("/create-group")}
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
          className="bg-card hover:bg-secondary/50 transition-smooth rounded-2xl p-4 shadow-card text-left active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center mb-3 shadow-soft">
            <Plus className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <p className="font-bold text-sm">Create Group</p>
<<<<<<< HEAD
          <p className="text-[11px] text-muted-foreground">{user?.kyc_status === "verified" ? "Start a new ajo" : "Verify KYC first"}</p>
        </button>
        <button
          onClick={() => (user?.kyc_status === "verified" ? navigate("/join-group") : navigate("/kyc"))}
=======
          <p className="text-[11px] text-muted-foreground">Start a new ajo</p>
        </button>
        <button
          onClick={() => navigate("/join-group")}
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
          className="bg-card hover:bg-secondary/50 transition-smooth rounded-2xl p-4 shadow-card text-left active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-3 shadow-soft">
            <UserPlus className="w-5 h-5 text-accent-foreground" strokeWidth={2.5} />
          </div>
          <p className="font-bold text-sm">Join Group</p>
<<<<<<< HEAD
          <p className="text-[11px] text-muted-foreground">{user?.kyc_status === "verified" ? "Use invite code" : "Verify KYC first"}</p>
=======
          <p className="text-[11px] text-muted-foreground">Use invite code</p>
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
        </button>
      </div>

      {/* Highlights */}
      <div className="screen-pad pt-5 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-4 bg-secondary/50 border border-secondary">
            <Wallet className="w-4 h-4 text-primary mb-2" />
            <p className="text-[11px] text-muted-foreground font-medium">Next payout</p>
            <p className="font-bold text-sm">{nextPayout ? formatNaira(nextPayout.amount * nextPayout.totalMembers) : "—"}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{nextPayout?.nextPayoutDate ?? "No payouts yet"}</p>
          </div>
          <div className="rounded-2xl p-4 bg-warning/10 border border-warning/20">
            <Calendar className="w-4 h-4 text-warning mb-2" />
            <p className="text-[11px] text-muted-foreground font-medium">Pending</p>
            <p className="font-bold text-sm">{pending} payment{pending !== 1 && "s"}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Due this week</p>
          </div>
        </div>

<<<<<<< HEAD
        

=======
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
        {/* Groups list */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-bold text-base">My Groups</h2>
            <button onClick={() => navigate("/groups")} className="text-xs font-semibold text-primary flex items-center gap-0.5">
              See all <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
<<<<<<< HEAD
            {groups.map((g) => {
              const mePaid = g.myPaidThisCycle;
              const progress = g.totalMembers ? (g.paidThisCycle / g.totalMembers) * 100 : 0;
=======
            {mockGroups.map((g) => {
              const me = g.members.find((m) => m.name === "You");
              const progress = (g.paidThisCycle / g.totalMembers) * 100;
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
              return (
                <button
                  key={g.id}
                  onClick={() => navigate(`/group/${g.id}`)}
                  className="w-full text-left bg-card hover:bg-secondary/30 transition-smooth rounded-2xl p-4 shadow-soft border border-border/60 active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-soft">
                        <Users className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm truncate">{g.name}</p>
                        <p className="text-[11px] text-muted-foreground">{formatNaira(g.amount)} • {g.frequency}</p>
                      </div>
                    </div>
<<<<<<< HEAD
                    {mePaid === false ? (
=======
                    {me && !me.paid ? (
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
                      <span className="text-[10px] font-bold uppercase bg-warning/15 text-warning px-2 py-1 rounded-full whitespace-nowrap">Pay due</span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase bg-success/15 text-success px-2 py-1 rounded-full whitespace-nowrap">Paid</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                    <span>Cycle {g.currentCycle}/{g.totalMembers}</span>
                    <span className="font-semibold text-foreground">{g.paidThisCycle}/{g.totalMembers} paid</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-success rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      Next: <span className="font-semibold text-foreground">{g.nextPayoutMember}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-primary">{g.nextPayoutDate}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
<<<<<<< HEAD

        {/* Recent activity */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-bold text-base">Recent activity</h2>
          </div>
          {loadingActivity ? (
            <div className="text-sm text-muted-foreground text-center py-6">Loading…</div>
          ) : activity.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-6">No activity yet.</div>
          ) : (
            <div className="space-y-2">
              {activity.slice(0, 4).map((n) => {
                const meta = (n.metadata ?? {}) as any;
                const isPayout = n.type === "payout_recorded";
                const amount = typeof meta.amount === "number" ? meta.amount : null;
                const time = formatDistanceToNow(new Date(n.created_at), { addSuffix: true });
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => {
                      if (n.type === "join_request_created") navigate("/admin");
                      else if (n.type === "contribution_submitted") navigate("/payments");
                      else if (n.group_id) navigate(`/group/${n.group_id}`);
                      else navigate("/notifications");
                    }}
                    className="w-full text-left bg-card rounded-2xl p-3.5 shadow-soft border border-border/60 flex items-center gap-3 hover:bg-secondary/30 transition-smooth"
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                        isPayout ? "bg-success/15" : "bg-primary/15",
                      )}
                    >
                      {isPayout ? (
                        <ArrowDownLeft className="w-5 h-5 text-success" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{n.title}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 font-medium">{time}</p>
                    </div>
                    {amount !== null ? (
                      <span className={cn("font-bold text-sm", isPayout ? "text-success" : "text-foreground")}>
                        {isPayout ? "+" : "−"}
                        {formatNaira(amount)}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={kycOpen} onOpenChange={setKycOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Verify your KYC</AlertDialogTitle>
            <AlertDialogDescription>
              You can browse the app, but you must verify your NIN before you can create or join groups.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setKycOpen(false)}>Later</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => navigate("/kyc")}
              className="bg-gradient-primary text-primary-foreground"
            >
              Verify now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
=======
      </div>
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
    </div>
  );
};

export default Dashboard;
