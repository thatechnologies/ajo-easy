<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiListGroups, type Group } from "@/lib/ajo-data";
import { formatNaira } from "@/components/Money";
import { Plus, UserPlus, Users, ChevronRight, Filter, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Groups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiListGroups()
      .then((g) => setGroups(g))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Could not load groups";
        toast({ title: "Failed to load groups", description: message, variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, []);
=======
import { useNavigate } from "react-router-dom";
import { mockGroups } from "@/lib/ajo-data";
import { formatNaira } from "@/components/Money";
import { Plus, UserPlus, Users, ChevronRight, Filter } from "lucide-react";

const Groups = () => {
  const navigate = useNavigate();
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc

  return (
    <div className="phone-shell flex flex-col">
      <div className="bg-gradient-hero text-primary-foreground px-5 pt-12 pb-6 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Groups</h1>
<<<<<<< HEAD
            <p className="text-sm opacity-90">{groups.length} active groups</p>
=======
            <p className="text-sm opacity-90">{mockGroups.length} active groups</p>
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
          </div>
          <button className="p-2.5 rounded-full bg-white/15 hover:bg-white/25"><Filter className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="screen-pad pt-5">
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button onClick={() => navigate("/create-group")} className="bg-card rounded-2xl p-4 shadow-card text-left active:scale-[0.98] transition-smooth">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center mb-2.5"><Plus className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} /></div>
            <p className="font-bold text-sm">Create</p>
          </button>
          <button onClick={() => navigate("/join-group")} className="bg-card rounded-2xl p-4 shadow-card text-left active:scale-[0.98] transition-smooth">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center mb-2.5"><UserPlus className="w-4 h-4 text-accent-foreground" strokeWidth={2.5} /></div>
            <p className="font-bold text-sm">Join</p>
          </button>
        </div>

        <div className="space-y-3">
<<<<<<< HEAD
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
            </div>
          ) : groups.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">No groups yet.</div>
          ) : (
            groups.map((g) => {
              const progress = g.totalMembers ? (g.paidThisCycle / g.totalMembers) * 100 : 0;
=======
          {mockGroups.map((g) => {
            const progress = (g.paidThisCycle / g.totalMembers) * 100;
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
            return (
              <button
                key={g.id}
                onClick={() => navigate(`/group/${g.id}`)}
                className="w-full text-left bg-card hover:bg-secondary/30 transition-smooth rounded-2xl p-4 shadow-soft border border-border/60 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-soft">
                    <Users className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{g.name}</p>
                    <p className="text-[11px] text-muted-foreground">{g.totalMembers} members • {g.frequency}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Cycle {g.currentCycle}/{g.totalMembers}</span>
                  <span className="font-bold text-primary">{formatNaira(g.amount)}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-success rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </button>
            );
<<<<<<< HEAD
          })
          )}
=======
          })}
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
        </div>
      </div>
    </div>
  );
};

export default Groups;
