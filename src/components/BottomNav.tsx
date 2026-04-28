import { NavLink, useLocation } from "react-router-dom";
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
                <div className={cn("p-1.5 rounded-xl transition-smooth", isActive && "bg-secondary")}>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
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
