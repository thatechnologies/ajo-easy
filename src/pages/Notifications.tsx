<<<<<<< HEAD
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiListNotifications, apiMarkAllNotificationsRead, apiMarkNotificationRead, type AppNotification, type ApiNotificationType } from "@/lib/ajo-data";
import { Bell, Trophy, AlertCircle, CheckCircle2, Clock, UserPlus, Wallet, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const iconMap: Record<ApiNotificationType, { icon: any; bg: string; color: string }> = {
  join_request_created: { icon: UserPlus, bg: "bg-warning/15", color: "text-warning" },
  join_request_approved: { icon: CheckCircle2, bg: "bg-success/15", color: "text-success" },
  join_request_rejected: { icon: X, bg: "bg-destructive/15", color: "text-destructive" },
  contribution_submitted: { icon: Wallet, bg: "bg-primary/15", color: "text-primary" },
  contribution_confirmed: { icon: CheckCircle2, bg: "bg-success/15", color: "text-success" },
  contribution_rejected: { icon: AlertCircle, bg: "bg-destructive/15", color: "text-destructive" },
  payout_recorded: { icon: Trophy, bg: "bg-success/15", color: "text-success" },
};

const Notifications = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiListNotifications({ limit: 60 });
      setItems(res.notifications);
      setUnreadCount(res.unreadCount);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Try again";
      toast({ title: "Could not load notifications", description: message, variant: "destructive" });
      setItems([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const headerSubtitle = useMemo(() => {
    if (loading) return "Loading…";
    return `${unreadCount} unread`;
  }, [loading, unreadCount]);

  const openNotification = async (n: AppNotification) => {
    try {
      if (!n.read_at) {
        await apiMarkNotificationRead(n.id);
        setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x)));
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch {
      /* ignore */
    }

    if (n.type === "join_request_created") return navigate("/admin");
    if (n.type === "contribution_submitted") return navigate("/payments");
    if (n.group_id) return navigate(`/group/${n.group_id}`);
  };

  const markAllRead = async () => {
    try {
      await apiMarkAllNotificationsRead();
      setItems((prev) => prev.map((x) => ({ ...x, read_at: x.read_at ?? new Date().toISOString() })));
      setUnreadCount(0);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Try again";
      toast({ title: "Could not mark all read", description: message, variant: "destructive" });
    }
  };

=======
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
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
  return (
    <div className="phone-shell flex flex-col">
      <div className="bg-gradient-hero text-primary-foreground px-5 pt-12 pb-6 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
<<<<<<< HEAD
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-sm opacity-90">{headerSubtitle}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            disabled={unreadCount === 0 || loading}
            onClick={markAllRead}
            className="rounded-xl font-bold"
          >
            Mark all
          </Button>
=======
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm opacity-90">{mockNotifications.filter(n => n.unread).length} unread</p>
          </div>
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
        </div>
      </div>

      <div className="screen-pad pt-5 space-y-2.5">
<<<<<<< HEAD
        {loading ? (
          <div className="text-sm text-muted-foreground text-center py-10">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-10">No notifications yet.</div>
        ) : (
        items.map((n) => {
          const { icon: Icon, bg, color } = iconMap[n.type as ApiNotificationType];
          const unread = !n.read_at;
          const time = formatDistanceToNow(new Date(n.created_at), { addSuffix: true });
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => openNotification(n)}
              className={cn(
                "w-full text-left rounded-2xl p-4 shadow-soft border flex items-start gap-3 transition-smooth",
                unread ? "bg-card border-primary/20" : "bg-card/60 border-border/60"
=======
        {mockNotifications.map((n) => {
          const { icon: Icon, bg, color } = iconMap[n.type];
          return (
            <div
              key={n.id}
              className={cn(
                "rounded-2xl p-4 shadow-soft border flex items-start gap-3 transition-smooth",
                n.unread ? "bg-card border-primary/20" : "bg-card/60 border-border/60"
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
              )}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", bg)}>
                <Icon className={cn("w-5 h-5", color)} />
              </div>
              <div className="flex-1 min-w-0">
<<<<<<< HEAD
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className={cn("font-bold text-sm", unread && "text-foreground")}>{n.title}</p>
                  {unread && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">{time}</p>
              </div>
            </button>
          );
        }))}
=======
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
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
      </div>
    </div>
  );
};

export default Notifications;
