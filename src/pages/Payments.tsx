import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Money } from "@/components/Money";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check, X, Clock, ImageIcon, ExternalLink, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Contribution {
  id: string;
  group_id: string;
  member_id: string;
  cycle_number: number;
  amount: number;
  transaction_reference: string;
  receipt_url: string | null;
  status: "pending" | "confirmed" | "rejected";
  submitted_at: string;
  groups: { name: string } | null;
  profiles: { full_name: string | null; phone: string | null } | null;
}

const Payments = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<"pending" | "confirmed" | "rejected">("pending");
  const [items, setItems] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [openReceipt, setOpenReceipt] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    // Find groups where the current user is admin
    const { data: adminGroups } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", user.id)
      .eq("is_admin", true);
    const groupIds = (adminGroups ?? []).map((g) => g.group_id);
    if (!groupIds.length) {
      setItems([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("contributions")
      .select("*, groups(name)")
      .in("group_id", groupIds)
      .eq("status", tab)
      .order("submitted_at", { ascending: false });
    if (error) {
      toast({ title: "Couldn't load payments", description: error.message, variant: "destructive" });
      setItems([]);
      setLoading(false);
      return;
    }
    // Fetch profiles for member_ids
    const memberIds = Array.from(new Set((data ?? []).map((d: any) => d.member_id)));
    const { data: profs } = memberIds.length
      ? await supabase.from("profiles").select("id, full_name, phone").in("id", memberIds)
      : { data: [] as any[] };
    const profMap = new Map((profs ?? []).map((p: any) => [p.id, p]));
    setItems((data ?? []).map((c: any) => ({ ...c, profiles: profMap.get(c.member_id) ?? null })) as any);
    setLoading(false);
  }, [user, tab]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => { load(); }, [load]);

  const viewReceipt = async (path: string, id: string) => {
    setOpenReceipt(id);
    setReceiptUrl(null);
    const { data, error } = await supabase.storage.from("receipts").createSignedUrl(path, 300);
    if (error) {
      toast({ title: "Couldn't load receipt", description: error.message, variant: "destructive" });
      setOpenReceipt(null);
      return;
    }
    setReceiptUrl(data.signedUrl);
  };

  const review = async (id: string, status: "confirmed" | "rejected") => {
    if (!user) return;
    setReviewingId(id);
    const { error } = await supabase
      .from("contributions")
      .update({ status, reviewed_at: new Date().toISOString(), reviewed_by: user.id })
      .eq("id", id);
    setReviewingId(null);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: status === "confirmed" ? "Payment confirmed ✓" : "Payment rejected" });
    setItems((prev) => prev.filter((i) => i.id !== id));
    setOpenReceipt(null);
  };

  if (authLoading) {
    return <div className="phone-shell flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="phone-shell flex flex-col">
      <PageHeader title="Payment reviews" subtitle="Confirm member contributions" />
      <div className="screen-pad flex-1 flex flex-col">
        {/* Tabs */}
        <div className="flex gap-1.5 p-1 bg-secondary rounded-2xl mb-4">
          {(["pending", "confirmed", "rejected"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-smooth",
                tab === t ? "bg-card shadow-soft" : "text-muted-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <Inbox className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="font-bold mb-1">No {tab} payments</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              {tab === "pending" ? "When members submit receipts, they'll appear here for your review." : `No ${tab} contributions yet.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((c) => (
              <div key={c.id} className="rounded-2xl bg-card border border-border shadow-soft p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{c.profiles?.full_name ?? "Member"}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{c.groups?.name} • Cycle {c.cycle_number}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Money amount={Number(c.amount)} size="md" className="text-primary" />
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(c.submitted_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs bg-secondary/50 rounded-lg px-3 py-2 mb-3">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-bold tabular-nums">{c.transaction_reference}</span>
                </div>

                <div className="flex gap-2">
                  {c.receipt_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewReceipt(c.receipt_url!, c.id)}
                      className="flex-1 h-10 rounded-xl font-semibold"
                    >
                      <ImageIcon className="w-4 h-4 mr-1.5" /> Receipt
                    </Button>
                  )}
                  {tab === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => review(c.id, "confirmed")}
                        disabled={reviewingId === c.id}
                        className="flex-1 h-10 rounded-xl font-bold bg-success text-success-foreground hover:bg-success/90"
                      >
                        {reviewingId === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1" /> Confirm</>}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => review(c.id, "rejected")}
                        disabled={reviewingId === c.id}
                        className="h-10 rounded-xl px-3 border-destructive/30 text-destructive hover:bg-destructive/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  {tab !== "pending" && (
                    <Badge variant={tab === "confirmed" ? "default" : "destructive"} className="h-10 px-3 rounded-xl font-semibold">
                      {tab === "confirmed" ? <Check className="w-3.5 h-3.5 mr-1" /> : <X className="w-3.5 h-3.5 mr-1" />}
                      {tab}
                    </Badge>
                  )}
                </div>

                {/* Inline receipt viewer */}
                {openReceipt === c.id && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-border bg-muted">
                    {receiptUrl ? (
                      <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="block relative">
                        <img src={receiptUrl} alt="Receipt" className="w-full max-h-72 object-contain bg-card" />
                        <div className="absolute top-2 right-2 bg-foreground/70 text-background rounded-full p-1.5">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      </a>
                    ) : (
                      <div className="h-32 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
