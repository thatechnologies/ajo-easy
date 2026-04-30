import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { Ticket, CheckCircle2, Users, Loader2, Clock, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiGetGroup, apiJoinGroup } from "@/lib/ajo-data";
import { formatNaira } from "@/components/Money";
import type { Group } from "@/lib/ajo-data";
import { useAuth } from "@/hooks/useAuth";

const JoinGroup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [joining, setJoining] = useState(false);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [loadingGroup, setLoadingGroup] = useState(false);
  const [mode, setMode] = useState<"join" | "pending">("join");

  useEffect(() => {
    const fromLink = searchParams.get("code");
    if (fromLink && fromLink.trim()) setCode(fromLink.trim().toUpperCase());
  }, [searchParams]);

  const handleJoin = async () => {
    if (code.length < 4) return;
    if (user?.kyc_status !== "verified") {
      toast({ title: "KYC required", description: "Verify your KYC before joining a group.", variant: "destructive" });
      navigate("/kyc");
      return;
    }
    setJoining(true);
    try {
      const res = await apiJoinGroup(code);
      setGroupId(res.groupId);
      setMode("pending");
      setSubmitted(true);
      toast({ title: "Request sent", description: "Waiting for admin approval." });
      setLoadingGroup(true);
      try {
        const g = await apiGetGroup(res.groupId);
        setGroup(g);
      } catch {
        setGroup(null);
      } finally {
        setLoadingGroup(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Try again";
      if (message === "kyc_required") {
        toast({ title: "KYC required", description: "Verify your KYC before joining a group.", variant: "destructive" });
        navigate("/kyc");
      } else {
        toast({ title: "Could not join", description: message, variant: "destructive" });
      }
    } finally {
      setJoining(false);
    }
  };

  if (submitted) {
    return (
      <div className="phone-shell flex flex-col">
        <PageHeader title={mode === "pending" ? "Request sent" : "Welcome"} subtitle={mode === "pending" ? "Waiting for approval" : "You're now a member"} />
        <div className="screen-pad flex-1 flex flex-col">
          {mode === "pending" ? (
            <div className="w-16 h-16 rounded-2xl bg-warning/15 flex items-center justify-center mb-5">
              <Clock className="w-7 h-7 text-warning" strokeWidth={2.2} />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-success/15 flex items-center justify-center mb-5">
              <CheckCircle2 className="w-7 h-7 text-success" strokeWidth={2.2} />
            </div>
          )}
          <h2 className="text-2xl font-bold leading-tight">
            {group?.name ? (mode === "pending" ? `Request sent to ${group.name}` : `Welcome to ${group.name}`) : mode === "pending" ? "Request sent" : "You're in!"}
          </h2>
          <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
            {mode === "pending" ? (
              <>
                Your request was sent using invite code <span className="font-bold text-foreground">{code}</span>. You’ll be able to open the group after the admin approves you.
              </>
            ) : (
              <>
                Joined using invite code <span className="font-bold text-foreground">{code}</span>.
              </>
            )}
          </p>

          <div className="mt-6 rounded-2xl bg-gradient-card border border-border p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">Group details</p>
                <p className="text-[11px] text-muted-foreground truncate">{group?.id ?? groupId ?? "—"}</p>
              </div>
              {loadingGroup && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            </div>

            {group && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-card border border-border p-3">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Contribution</p>
                  <p className="font-bold text-sm mt-1">{formatNaira(group.amount)}</p>
                  <p className="text-[11px] text-muted-foreground">{group.frequency}</p>
                </div>
                <div className="rounded-xl bg-card border border-border p-3">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Next payout</p>
                  <p className="font-bold text-sm mt-1 truncate">{group.nextPayoutMember}</p>
                  <p className="text-[11px] text-muted-foreground">{group.nextPayoutDate}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 rounded-2xl bg-secondary/60 border border-secondary p-4">
            <p className="text-sm font-semibold">Next steps</p>
            <div className="mt-3 space-y-2 text-xs text-muted-foreground leading-relaxed">
              {mode === "pending" ? (
                <>
                  <p>1) Wait for the admin to approve your request.</p>
                  <p>2) Once approved, you can pay and submit your transaction reference.</p>
                </>
              ) : (
                <>
                  <p>1) Send your contribution to the group’s payout account.</p>
                  <p>2) Submit your transaction reference so the admin can confirm.</p>
                </>
              )}
            </div>
          </div>

          <div className="mt-auto pt-6 space-y-3">
            {mode !== "pending" && (
              <Button
                size="lg"
                onClick={() => (groupId ? navigate(`/pay/${groupId}`) : navigate("/groups"))}
                className="w-full h-14 bg-gradient-primary font-bold text-base rounded-2xl shadow-glow"
              >
                Pay this cycle
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/groups")}
              className="w-full h-14 font-bold text-base rounded-2xl"
            >
              Back to groups <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const v = (text || "").trim();
      if (!v) {
        toast({ title: "Clipboard is empty", description: "Copy the invite code then try again.", variant: "destructive" });
        return;
      }
      let possibleCode = v;
      if (v.includes("code=")) {
        try {
          possibleCode = new URL(v).searchParams.get("code") ?? v;
        } catch {
          possibleCode = v;
        }
      }
      setCode(possibleCode.trim().toUpperCase());
      toast({ title: "Pasted", description: "Invite code added." });
    } catch {
      toast({ title: "Could not paste", description: "Paste manually into the field.", variant: "destructive" });
    }
  };
  return (
    <div className="phone-shell flex flex-col">
      <PageHeader title="Join a group" subtitle="Enter the invite code from the admin" />
      <div className="screen-pad flex-1 flex flex-col">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-5">
            <Ticket className="w-7 h-7 text-primary" strokeWidth={2.2} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Got an invite code?</h2>
          <p className="text-muted-foreground text-sm">Type it below or paste a link a friend shared with you.</p>
        </div>

        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Invite code</label>
        <input
          type="text"
          placeholder="AJO-XXXXX"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="w-full bg-card border-2 border-border rounded-2xl px-4 py-4 outline-none focus:border-primary transition-smooth text-xl font-bold tracking-wider shadow-soft placeholder:text-muted-foreground/40 text-center"
        />

        <button
          type="button"
          onClick={handlePaste}
          className="text-xs font-semibold text-primary mt-3 self-center"
        >
          Paste from clipboard
        </button>

        <div className="mt-8 p-4 rounded-2xl bg-secondary/60 border border-secondary flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold mb-1">How it works</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The admin will review your request and approve you. After approval, you can pay and submit your transaction reference.
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <Button
            size="lg"
            disabled={code.length < 4}
            onClick={handleJoin}
            className="w-full h-14 bg-gradient-primary font-bold text-base rounded-2xl shadow-glow disabled:opacity-40 disabled:shadow-none"
          >
            {joining ? <Loader2 className="w-5 h-5 animate-spin" /> : "Join group"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinGroup;
