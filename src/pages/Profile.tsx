import { AvatarCircle } from "@/components/AvatarCircle";
import { ArrowLeft, Bell, ChevronRight, HelpCircle, IdCard, LogOut, ShieldCheck, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const [page, setPage] = useState<"profile" | "help">("profile");

  if (page === "help") {
    return (
      <div className="phone-shell flex flex-col">
        <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => setPage("profile")}
            className="p-2 -ml-2 rounded-full hover:bg-secondary transition-smooth"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">Help</h1>
            <p className="text-xs text-muted-foreground truncate">How Kowope works</p>
          </div>
        </header>

        <div className="screen-pad pt-5 pb-20 space-y-4">
          <div className="rounded-3xl bg-card border border-border shadow-soft p-4">
            <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-2">Basics</p>
            <p className="font-bold text-sm mb-1">How Kowope works</p>
            <p className="text-sm text-muted-foreground">
              Join a group, contribute each cycle, and payouts rotate based on payout position. Every action is logged so everyone stays aligned.
            </p>
          </div>

          <div className="rounded-3xl bg-card border border-border shadow-soft p-4">
            <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-2">KYC</p>
            <p className="font-bold text-sm mb-1">Why you must verify</p>
            <p className="text-sm text-muted-foreground">
              KYC helps keep groups safe. You must verify your NIN before you can create or join groups.
            </p>
            <button
              type="button"
              onClick={() => navigate("/kyc")}
              className="mt-3 w-full h-11 rounded-2xl bg-gradient-primary text-primary-foreground font-bold shadow-glow"
            >
              Go to KYC
            </button>
          </div>

          <div className="rounded-3xl bg-card border border-border shadow-soft p-4">
            <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-2">Payments</p>
            <p className="font-bold text-sm mb-1">How payment confirmation works</p>
            <p className="text-sm text-muted-foreground">
              Members submit a payment for the cycle, then the group admin reviews and confirms or rejects it. Confirmed payments count towards payout eligibility.
            </p>
          </div>

          <div className="rounded-3xl bg-card border border-border shadow-soft p-4">
            <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-2">Support</p>
            <p className="font-bold text-sm mb-1">Need help?</p>
            <p className="text-sm text-muted-foreground">Email support@kowope.app</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phone-shell flex flex-col">
      <div className="bg-gradient-hero text-primary-foreground px-5 pt-12 pb-8 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          <AvatarCircle name={user?.full_name ?? "Member"} size="lg" className="mb-3 ring-4 ring-white/20" />
          <h1 className="text-xl font-bold">{user?.full_name ?? "Member"}</h1>
          <p className="text-sm opacity-90">{user?.phone ?? "—"}</p>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full">
            {user?.kyc_status === "verified" ? "KYC verified" : "KYC required"}
          </span>
        </div>
      </div>

      <div className="screen-pad pt-5 space-y-5">
        <div>
          <h2 className="font-bold text-base mb-3 px-1">Settings</h2>
          <div className="bg-card rounded-2xl shadow-soft border border-border/60 overflow-hidden divide-y divide-border">
            {[
              {
                i: IdCard,
                l: "KYC verification",
                d: user?.kyc_status === "verified" ? "Verified" : "Required to join/create groups",
                onClick: () => navigate("/kyc"),
              },
              { i: Users, l: "My groups", d: "Create, join, manage groups", onClick: () => navigate("/groups") },
              { i: Bell, l: "Notifications", d: "Updates and reminders", onClick: () => navigate("/notifications") },
              ...(isAdmin ? [{ i: ShieldCheck, l: "Admin tools", d: "Approve members, manage payouts", onClick: () => navigate("/admin") }] : []),
              { i: HelpCircle, l: "Help", d: "How it works, support", onClick: () => setPage("help") },
            ].map((s, i) => (
              <button
                key={i}
                onClick={s.onClick}
                className="w-full flex items-center gap-3 p-4 hover:bg-secondary/30 transition-smooth text-left"
              >
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

        <button
          onClick={async () => {
            await signOut();
            toast({ title: "Signed out" });
            navigate("/auth");
          }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-destructive/10 text-destructive font-semibold text-sm"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>

        <p className="text-center text-[10px] text-muted-foreground">Kowope v1.0 • Made in Nigeria</p>
      </div>
    </div>
  );
};

export default Profile;
