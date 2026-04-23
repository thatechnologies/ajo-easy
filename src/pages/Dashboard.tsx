import { useNavigate } from "react-router-dom";
import { Plus, UserPlus, Wallet, ArrowUpRight, Calendar, Users, ChevronRight, Wifi, WifiOff } from "lucide-react";
import { Money, formatNaira } from "@/components/Money";
import { mockGroups } from "@/lib/ajo-data";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [online] = useState(true);

  const totalContributed = mockGroups.reduce((s, g) => s + g.myContribution, 0);
  const nextPayout = mockGroups.find((g) => g.nextPayoutMember === "You");
  const pending = mockGroups.filter((g) => g.members.find((m) => m.name === "You" && !m.paid)).length;

  return (
    <div className="phone-shell flex flex-col">
      {/* Hero header */}
      <div className="bg-gradient-hero text-primary-foreground px-5 pt-12 pb-24 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-20 -right-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative flex items-center justify-between mb-6">
          <div>
            <p className="text-xs opacity-80">Good morning,</p>
            <p className="text-lg font-bold">Ada Okonkwo 👋</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium bg-white/15 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
            {online ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {online ? "Online" : "Offline"}
          </div>
        </div>

        <div className="relative">
          <p className="text-xs uppercase tracking-widest opacity-80 mb-2 font-semibold">Total Contributed</p>
          <Money amount={totalContributed} size="xl" className="block mb-1" />
          <p className="text-xs opacity-80">Across {mockGroups.length} active groups</p>
        </div>
      </div>

      {/* Quick stats - overlap */}
      <div className="px-5 -mt-14 relative z-10 grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate("/create-group")}
          className="bg-card hover:bg-secondary/50 transition-smooth rounded-2xl p-4 shadow-card text-left active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center mb-3 shadow-soft">
            <Plus className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <p className="font-bold text-sm">Create Group</p>
          <p className="text-[11px] text-muted-foreground">Start a new ajo</p>
        </button>
        <button
          onClick={() => navigate("/join-group")}
          className="bg-card hover:bg-secondary/50 transition-smooth rounded-2xl p-4 shadow-card text-left active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-3 shadow-soft">
            <UserPlus className="w-5 h-5 text-accent-foreground" strokeWidth={2.5} />
          </div>
          <p className="font-bold text-sm">Join Group</p>
          <p className="text-[11px] text-muted-foreground">Use invite code</p>
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

        {/* Groups list */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-bold text-base">My Groups</h2>
            <button onClick={() => navigate("/groups")} className="text-xs font-semibold text-primary flex items-center gap-0.5">
              See all <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {mockGroups.map((g) => {
              const me = g.members.find((m) => m.name === "You");
              const progress = (g.paidThisCycle / g.totalMembers) * 100;
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
                    {me && !me.paid ? (
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
      </div>
    </div>
  );
};

export default Dashboard;
