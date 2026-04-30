import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { CheckCircle2, IdCard, Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiSubmitKyc } from "@/lib/ajo-data";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const ninSchema = z.string().trim().regex(/^\d{11}$/, "NIN must be 11 digits");
const dobSchema = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

const Kyc = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [nin, setNin] = useState("");
  const [dob, setDob] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return ninSchema.safeParse(nin).success && dobSchema.safeParse(dob).success && Boolean(filePreview);
  }, [nin, dob, filePreview]);

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

  const submit = async () => {
    const ninCheck = ninSchema.safeParse(nin);
    if (!ninCheck.success) {
      toast({ title: "Check your NIN", description: ninCheck.error.issues[0].message, variant: "destructive" });
      return;
    }
    const dobCheck = dobSchema.safeParse(dob);
    if (!dobCheck.success) {
      toast({ title: "Check your date of birth", description: dobCheck.error.issues[0].message, variant: "destructive" });
      return;
    }
    if (!filePreview) {
      toast({ title: "Upload your NIN card", description: "A clear photo is required", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      await apiSubmitKyc({ nin: ninCheck.data, dob: dobCheck.data, ninCardDataUrl: filePreview });
      await refreshUser();
      toast({ title: "KYC verified", description: "You can now create or join groups." });
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Try again";
      toast({ title: "KYC failed", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="phone-shell flex flex-col">
      <PageHeader title="Verify KYC" subtitle="NIN verification is required" />
      <div className="screen-pad flex-1 flex flex-col pb-6">
        <div className="mb-7">
          <div className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center mb-5 shadow-glow">
            <IdCard className="w-9 h-9 text-primary-foreground" strokeWidth={2.2} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Verify your identity</h2>
          <p className="text-muted-foreground text-sm">
            Complete KYC to create or join groups.
          </p>
        </div>

        {user?.kyc_status === "verified" && (
          <div className="mb-5 p-4 rounded-2xl bg-success/10 border border-success/20 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
            <div>
              <p className="font-bold text-sm text-success">KYC verified</p>
              <p className="text-xs text-muted-foreground mt-1">You already completed KYC on this account.</p>
            </div>
          </div>
        )}

        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">NIN (11 digits)</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="12345678901"
          value={nin}
          onChange={(e) => setNin(e.target.value.replace(/\D/g, "").slice(0, 11))}
          className="w-full bg-card border-2 border-border rounded-2xl px-4 py-4 outline-none focus:border-primary transition-smooth text-lg font-semibold shadow-soft placeholder:text-muted-foreground/60 tabular-nums tracking-wide"
        />

        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-5">Date of birth</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full bg-card border-2 border-border rounded-2xl px-4 py-4 outline-none focus:border-primary transition-smooth text-base font-semibold shadow-soft"
        />

        <div className="mt-5">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Upload NIN card</label>
          {filePreview ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-border shadow-soft bg-card">
              <img src={filePreview} alt="NIN card preview" className="w-full max-h-64 object-contain bg-muted" />
              <button
                type="button"
                onClick={() => { setFile(null); setFilePreview(null); }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center"
                aria-label="Remove image"
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

        <div className="mt-auto pt-6">
          <Button
            size="lg"
            disabled={!canSubmit || submitting || user?.kyc_status === "verified"}
            onClick={submit}
            className="w-full h-14 bg-gradient-primary text-primary-foreground hover:opacity-95 font-bold text-base rounded-2xl shadow-glow disabled:opacity-40 disabled:shadow-none"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify KYC"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Kyc;
