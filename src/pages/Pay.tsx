import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { apiGetGroup, apiSubmitContribution, type Group } from "@/lib/ajo-data";
import { Money, formatNaira } from "@/components/Money";
import { CheckCircle2, Loader2, Copy, Check, Upload, Image as ImageIcon, X, Building2, Hash, User as UserIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const referenceSchema = z.string().trim().min(4, "Reference too short").max(60, "Reference too long");

const Pay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [reference, setReference] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [state, setState] = useState<"form" | "submitting" | "done">("form");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoadingGroup(true);
    apiGetGroup(id)
      .then((g) => setGroup(g))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Could not load group";
        toast({ title: "Failed to load group", description: message, variant: "destructive" });
      })
      .finally(() => setLoadingGroup(false));
  }, [id]);

  const handleCopy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      toast({ title: "Copied!", description: value });
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast({ title: "Couldn't copy", variant: "destructive" });
    }
  };

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB", variant: "destructive" });
      return;
    }
    if (!f.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Upload an image (JPG/PNG)", variant: "destructive" });
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setFilePreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async () => {
    if (!group || !user) return;
    const refCheck = referenceSchema.safeParse(reference);
    if (!refCheck.success) {
      toast({ title: "Enter transaction reference", description: refCheck.error.issues[0].message, variant: "destructive" });
      return;
    }
    if (!file) {
      toast({ title: "Upload your receipt", description: "Screenshot of the transfer is required", variant: "destructive" });
      return;
    }

    setState("submitting");
    try {
      await apiSubmitContribution({
        groupId: group.id,
        transactionReference: refCheck.data,
        receiptUrl: filePreview ?? undefined,
      });
      setState("done");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Try again";
      toast({ title: "Submission failed", description: message, variant: "destructive" });
      setState("form");
    }
  };

  if (loadingGroup) {
    return (
      <div className="phone-shell flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!group) return <div className="phone-shell p-8">Group not found</div>;

  if (state === "done") {
    return (
      <div className="phone-shell flex flex-col">
        <div className="screen-pad flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-28 h-28 rounded-full bg-warning/15 flex items-center justify-center mb-6 animate-scale-in">
            <Clock className="w-14 h-14 text-warning" strokeWidth={2} />
          </div>
          <h2 className="text-3xl font-extrabold mb-2">Receipt submitted!</h2>
          <p className="text-muted-foreground mb-8 max-w-xs">
            Your group admin will review and confirm your contribution shortly.
          </p>

          <div className="w-full rounded-3xl bg-gradient-card border border-border p-5 shadow-card space-y-3 mb-8">
            <div className="text-center pb-3 border-b border-border">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">Amount sent</p>
              <Money amount={group.amount} size="lg" className="text-primary" />
            </div>
            {[
              { k: "Group", v: group.name },
              { k: "Cycle", v: `${group.currentCycle} of ${group.totalMembers}` },
              { k: "Reference", v: reference },
              { k: "Status", v: "Pending review" },
            ].map((r) => (
              <div key={r.k} className="flex justify-between text-sm gap-3">
                <span className="text-muted-foreground flex-shrink-0">{r.k}</span>
                <span className="font-bold text-right truncate">{r.v}</span>
              </div>
            ))}
          </div>

          <div className="w-full space-y-3">
            <Button size="lg" onClick={() => navigate(`/group/${group.id}`)} className="w-full h-14 bg-gradient-primary font-bold text-base rounded-2xl shadow-glow">
              Back to group
            </Button>
            <Button size="lg" variant="ghost" onClick={() => navigate("/dashboard")} className="w-full h-12 font-semibold rounded-2xl">
              Go to home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const bankRows = [
    { icon: Building2, label: "Bank", value: group.bankName ?? "—", key: "bank" },
    { icon: Hash, label: "Account number", value: group.bankAccountNumber ?? "—", key: "acct", mono: true },
    { icon: UserIcon, label: "Account name", value: group.bankAccountName ?? "—", key: "name" },
  ];

  return (
    <div className="phone-shell flex flex-col">
      <PageHeader title="Make payment" subtitle={group.name} />
      <div className="screen-pad flex-1 flex flex-col pb-6">
        {/* Amount banner */}
        <div className="bg-gradient-hero text-primary-foreground rounded-3xl p-5 shadow-elevated mb-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <p className="text-xs uppercase tracking-widest opacity-80 font-semibold mb-2">Transfer this amount</p>
          <Money amount={group.amount} size="xl" className="block" />
          <p className="text-xs opacity-80 mt-2">Cycle {group.currentCycle} contribution</p>
        </div>

        {/* Step 1: Bank details */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</div>
            <p className="text-sm font-bold">Send to group account</p>
          </div>
          <div className="rounded-2xl bg-card border-2 border-border shadow-soft divide-y divide-border">
            {bankRows.map(({ icon: Icon, label, value, key, mono }) => (
              <div key={key} className="flex items-center gap-3 p-3.5">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</p>
                  <p className={cn("font-bold text-sm truncate", mono && "tabular-nums tracking-wide")}>{value}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(value, key)}
                  className="p-2 rounded-lg hover:bg-secondary transition-smooth"
                  aria-label={`Copy ${label}`}
                >
                  {copied === key ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2 px-1">
            💡 Use your bank app or USSD to transfer exactly {formatNaira(group.amount)}
          </p>
        </div>

        {/* Step 2: Reference */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</div>
            <p className="text-sm font-bold">Enter transaction reference</p>
          </div>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. TRF/12345678"
            maxLength={60}
            className="w-full bg-card border-2 border-border rounded-2xl px-4 py-3.5 outline-none focus:border-primary transition-smooth font-semibold shadow-soft tabular-nums placeholder:text-muted-foreground/60 placeholder:font-normal"
          />
          <p className="text-[11px] text-muted-foreground mt-2 px-1">
            From your bank's transfer confirmation SMS or app
          </p>
        </div>

        {/* Step 3: Receipt upload */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">3</div>
            <p className="text-sm font-bold">Upload receipt screenshot</p>
          </div>
          {filePreview ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-border shadow-soft bg-card">
              <img src={filePreview} alt="Receipt preview" className="w-full max-h-64 object-contain bg-muted" />
              <button
                type="button"
                onClick={() => { setFile(null); setFilePreview(null); }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center"
                aria-label="Remove receipt"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="px-3 py-2 text-xs text-muted-foreground border-t border-border bg-card">
                <ImageIcon className="w-3 h-3 inline mr-1" />
                {file?.name} ({((file?.size ?? 0) / 1024).toFixed(0)} KB)
              </div>
            </div>
          ) : (
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
              <div className="rounded-2xl border-2 border-dashed border-border bg-card p-8 text-center shadow-soft hover:border-primary transition-smooth">
                <div className="w-12 h-12 rounded-xl bg-secondary mx-auto mb-3 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <p className="font-bold text-sm">Tap to upload</p>
                <p className="text-[11px] text-muted-foreground mt-1">JPG or PNG, max 5MB</p>
              </div>
            </label>
          )}
        </div>

        <div className="mt-auto">
          <Button
            size="lg"
            disabled={state === "submitting"}
            onClick={handleSubmit}
            className="w-full h-14 bg-gradient-primary font-bold text-base rounded-2xl shadow-glow"
          >
            {state === "submitting" ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>
            ) : (
              "Submit for confirmation"
            )}
          </Button>
          <p className="text-[11px] text-muted-foreground text-center mt-3">
            🔒 Your receipt is private — only group admins can view it
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pay;
