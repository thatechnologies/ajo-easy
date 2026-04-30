import { NavLink, useLocation } from "react-router-dom";
<<<<<<< HEAD
import { Home, Users, User, ShieldCheck, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { apiListNotifications } from "@/lib/ajo-data";

export const BottomNav = () => {
  const { pathname } = useLocation();
  const { isAdmin } = useAuth();
  const { data } = useQuery({
    queryKey: ["notifications", "unreadCount"],
    queryFn: () => apiListNotifications({ unread: true, limit: 1 }),
    refetchInterval: 30000,
  });
  const unreadCount = data?.unreadCount ?? 0;
  // Hide nav on onboarding screens
  const hide =
    ["/", "/auth", "/signup", "/kyc"].includes(pathname) ||
    pathname.startsWith("/create-group") ||
    pathname.startsWith("/join-group") ||
    pathname.startsWith("/pay");
  if (hide) return null;

  const items = [
    { to: "/dashboard", label: "Home", icon: Home },
    { to: "/groups", label: "Groups", icon: Users },
    ...(isAdmin ? [{ to: "/admin", label: "Admin", icon: ShieldCheck } as const] : []),
    { to: "/notifications", label: "Alerts", icon: Bell, badge: unreadCount },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur-lg border-t border-border z-40">
      <div className="flex items-center justify-around px-2 py-2 pb-3">
        {items.map(({ to, label, icon: Icon, badge }) => (
=======
import { Home, Users, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/groups", label: "Groups", icon: Users },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
];

export const BottomNav = () => {
  const { pathname } = useLocation();
  // Hide nav on onboarding screens
  const hide = ["/", "/otp", "/profile-setup"].includes(pathname) || pathname.startsWith("/create-group") || pathname.startsWith("/join-group") || pathname.startsWith("/pay");
  if (hide) return null;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur-lg border-t border-border z-40">
      <div className="flex items-center justify-around px-2 py-2 pb-3">
        {items.map(({ to, label, icon: Icon }) => (
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-smooth min-w-[64px]",
                isActive ? "text-primary" : "text-muted-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
<<<<<<< HEAD
                <div className={cn("p-1.5 rounded-xl transition-smooth relative", isActive && "bg-secondary")}>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  {typeof badge === "number" && badge > 0 ? (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-destructive" />
                  ) : null}
=======
                <div className={cn("p-1.5 rounded-xl transition-smooth", isActive && "bg-secondary")}>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
                </div>
                <span className={cn("text-[11px] font-medium", isActive && "font-semibold")}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
