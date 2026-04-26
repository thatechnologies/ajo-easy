import { AvatarCircle } from "@/components/AvatarCircle";
import { mockTransactions } from "@/lib/ajo-data";
import { formatNaira } from "@/components/Money";
import { ChevronRight, Shield, Bell, HelpCircle, FileText, LogOut, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Profile = () => {
  return (
    <div className="phone-shell flex flex-col">
      <div className="bg-gradient-hero text-primary-foreground px-5 pt-12 pb-8 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          <AvatarCircle name="Ada Okonkwo" size="lg" className="mb-3 ring-4 ring-white/20" />
          <h1 className="text-xl font-bold">Ada Okonkwo</h1>
          <p className="text-sm opacity-90">+234 803 888 8888</p>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full">
            ✓ Verified Member
          </span>
        </div>
      </div>

      <div className="screen-pad pt-5 space-y-5">
        <div>
          <h2 className="font-bold text-base mb-3 px-1">Recent activity</h2>
          <div className="space-y-2">
            {mockTransactions.slice(0, 4).map((t) => (
              <div key={t.id} className="bg-card rounded-2xl p-3.5 shadow-soft border border-border/60 flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  t.type === "payout" ? "bg-success/15" : "bg-primary/15"
                )}>
                  {t.type === "payout"
                    ? <ArrowDownLeft className="w-5 h-5 text-success" />
                    : <ArrowUpRight className="w-5 h-5 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{t.type === "payout" ? "Payout received" : "Contribution"}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{t.groupName} • {t.date}</p>
                </div>
                <span className={cn("font-bold text-sm", t.type === "payout" ? "text-success" : "text-foreground")}>
                  {t.type === "payout" ? "+" : "−"}{formatNaira(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-bold text-base mb-3 px-1">Settings</h2>
          <div className="bg-card rounded-2xl shadow-soft border border-border/60 overflow-hidden divide-y divide-border">
            {[
              { i: Shield, l: "Security & Privacy", d: "PIN, biometrics" },
              { i: Bell, l: "Notifications", d: "Reminders & alerts" },
              { i: FileText, l: "Transaction History", d: "Full statement" },
              { i: HelpCircle, l: "Help & Support", d: "FAQ, contact us" },
            ].map((s, i) => (
              <button key={i} className="w-full flex items-center gap-3 p-4 hover:bg-secondary/30 transition-smooth text-left">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <s.i className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{s.l}</p>
                  <p className="text-[11px] text-muted-foreground">{s.d}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-destructive/10 text-destructive font-semibold text-sm">
          <LogOut className="w-4 h-4" /> Log out
        </button>

        <p className="text-center text-[10px] text-muted-foreground">Kowope v1.0 • Made with ❤️ in Nigeria</p>
      </div>
    </div>
  );
};

export default Profile;
