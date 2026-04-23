import { mockNotifications } from "@/lib/ajo-data";
import { Bell, Trophy, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  reminder: { icon: Clock, bg: "bg-warning/15", color: "text-warning" },
  payout: { icon: Trophy, bg: "bg-success/15", color: "text-success" },
  missed: { icon: AlertCircle, bg: "bg-destructive/15", color: "text-destructive" },
  success: { icon: CheckCircle2, bg: "bg-primary/15", color: "text-primary" },
};

const Notifications = () => {
  return (
    <div className="phone-shell flex flex-col">
      <div className="bg-gradient-hero text-primary-foreground px-5 pt-12 pb-6 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm opacity-90">{mockNotifications.filter(n => n.unread).length} unread</p>
          </div>
        </div>
      </div>

      <div className="screen-pad pt-5 space-y-2.5">
        {mockNotifications.map((n) => {
          const { icon: Icon, bg, color } = iconMap[n.type];
          return (
            <div
              key={n.id}
              className={cn(
                "rounded-2xl p-4 shadow-soft border flex items-start gap-3 transition-smooth",
                n.unread ? "bg-card border-primary/20" : "bg-card/60 border-border/60"
              )}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", bg)}>
                <Icon className={cn("w-5 h-5", color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <p className={cn("font-bold text-sm", n.unread && "text-foreground")}>{n.title}</p>
                  {n.unread && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
