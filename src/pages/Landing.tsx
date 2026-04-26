import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  Wallet,
  BellRing,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Star,
  Smartphone,
  Lock,
  Zap,
  Share2,
  Copy,
  Check,
  Search,
  XCircle,
  Mail,
} from "lucide-react";

const WAITLIST_STORAGE_KEY = "thatech-ajo:waitlist-entries";

const normalizeEntry = (raw: string) => {
  const v = raw.trim().toLowerCase();
  if (v.includes("@")) return v;
  // treat as phone: keep digits only, drop leading 0/country code variants
  const digits = v.replace(/\D/g, "");
  // normalize Nigerian numbers: 0XXXXXXXXXX -> 234XXXXXXXXXX
  if (digits.startsWith("0") && digits.length === 11) return "234" + digits.slice(1);
  return digits;
};

const readWaitlistEntries = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WAITLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
};

const saveWaitlistEntry = (entry: string) => {
  if (typeof window === "undefined") return;
  const normalized = normalizeEntry(entry);
  if (!normalized) return;
  const existing = readWaitlistEntries();
  if (!existing.includes(normalized)) {
    try {
      window.localStorage.setItem(
        WAITLIST_STORAGE_KEY,
        JSON.stringify([...existing, normalized])
      );
    } catch {
      // ignore quota errors
    }
  }
};

// Formspree endpoint is read from the Vite env var `VITE_FORMSPREE_ENDPOINT`.
// Set it in a `.env` (or `.env.local`) file at the project root, e.g.:
//   VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/abcd1234
// Restart the dev server after changing env vars. See `.env.example` for reference.
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT as
  | string
  | undefined;
const isFormspreeConfigured =
  !!FORMSPREE_ENDPOINT &&
  /^https:\/\/formspree\.io\/f\/.+/.test(FORMSPREE_ENDPOINT);

const features = [
  {
    icon: ShieldCheck,
    title: "Total transparency",
    desc: "Every contribution and payout is logged. No more 'who paid?' arguments.",
  },
  {
    icon: BellRing,
    title: "Smart reminders",
    desc: "Members get nudged before due dates so nobody misses a turn.",
  },
  {
    icon: Wallet,
    title: "Instant payouts",
    desc: "Track collections and payout the recipient with one tap.",
  },
  {
    icon: Users,
    title: "Built for groups",
    desc: "Friends, family, market unions, cooperatives — set up in 60 seconds.",
  },
  {
    icon: Lock,
    title: "Bank-grade security",
    desc: "Your group's money and data are protected with end-to-end encryption.",
  },
  {
    icon: Zap,
    title: "Works on any phone",
    desc: "Light, fast, and built for low-bandwidth Android networks.",
  },
];

const testimonials = [
  {
    name: "Aisha B.",
    role: "Trader, Balogun Market",
    quote:
      "Before Thatech Ajo, we used a notebook. Now everyone sees who paid — no more wahala.",
    initials: "AB",
  },
  {
    name: "Tunde O.",
    role: "Cooperative leader",
    quote:
      "Setting up our 12-member ajo took less than 2 minutes. The reminders alone saved me hours.",
    initials: "TO",
  },
  {
    name: "Chiamaka N.",
    role: "Small business owner",
    quote:
      "I finally trust my savings circle. The receipts and history make everything clear.",
    initials: "CN",
  },
];

const faqs = [
  {
    q: "Is Thatech Ajo free to use?",
    a: "Joining the waitlist is completely free. Early users will get the core ajo features at no cost when we launch.",
  },
  {
    q: "How does the money move?",
    a: "Members contribute via bank transfer, card, or USSD. Thatech Ajo tracks who paid and helps the admin payout the recipient on schedule.",
  },
  {
    q: "Is my group's money safe?",
    a: "We never hold your money. Thatech Ajo is the trust and tracking layer — funds move through trusted Nigerian payment rails.",
  },
  {
    q: "When will it launch?",
    a: "We're rolling out to waitlist members first in the coming weeks. Sign up to be among the first invited.",
  },
];

const Landing = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusInput, setStatusInput] = useState("");
  const [checkResult, setCheckResult] = useState<
    null | { found: boolean; value: string }
  >(null);

  const handleCheckStatus = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = statusInput.trim();
    if (!trimmed) {
      toast({
        title: "Enter your email or phone",
        description: "Type the email or phone number you used to join.",
        variant: "destructive",
      });
      return;
    }
    const normalized = normalizeEntry(trimmed);
    const entries = readWaitlistEntries();
    const found = !!normalized && entries.includes(normalized);
    setCheckResult({ found, value: trimmed });
  };

  const shareUrl =
    typeof window !== "undefined" ? window.location.origin + "/" : "";
  const shareMessage =
    "I just joined the Thatech Ajo waitlist — the easiest way to run a savings circle without the wahala. Join me 👉 ";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share it with your group on WhatsApp, SMS, or anywhere.",
      });
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast({
        title: "Couldn't copy",
        description: "Long-press the link to copy it manually.",
        variant: "destructive",
      });
    }
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    shareMessage + shareUrl
  )}`;

  const isValidEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast({
        title: "Check your email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    if (!isFormspreeConfigured) {
      toast({
        title: "Waitlist not configured",
        description:
          "Set VITE_FORMSPREE_ENDPOINT in your .env file to start collecting signups.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT as string, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          source: "Thatech Ajo landing page",
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      saveWaitlistEntry(email);
      setSubmitted(true);
      setEmail("");
      toast({
        title: "You're on the list! 🎉",
        description: "We'll email you the moment Thatech Ajo is ready.",
      });
    } catch {
      toast({
        title: "Couldn't join the waitlist",
        description:
          "Please try again in a moment, or DM us on social if it keeps failing.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">
              Thatech Ajo
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-smooth">
              Features
            </a>
            <a href="#testimonials" className="hover:text-foreground transition-smooth">
              Stories
            </a>
            <a href="#share" className="hover:text-foreground transition-smooth">
              Share
            </a>
            <a href="#status" className="hover:text-foreground transition-smooth">
              Status
            </a>
            <a href="#faq" className="hover:text-foreground transition-smooth">
              FAQ
            </a>
          </nav>
          <a
            href="#waitlist"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold bg-foreground text-background px-4 py-2 rounded-full hover:opacity-90 transition-smooth"
          >
            Join waitlist <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -right-32 w-[36rem] h-[36rem] rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-accent/15 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground rounded-full px-3 py-1.5 text-xs font-bold mb-6">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Now in private beta — Nigeria 🇳🇬
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Run your{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Ajo
              </span>{" "}
              without the wahala.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Thatech Ajo is the simplest way for friends, family and market
              groups to save together. Track contributions, payouts, and
              reminders — all in one place.
            </p>

            {/* Waitlist form */}
            <form
              id="waitlist"
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                disabled={submitting || submitted}
                className="flex-1 bg-card border-2 border-border rounded-2xl px-4 py-3.5 outline-none focus:border-primary transition-smooth font-semibold shadow-soft placeholder:text-muted-foreground/60 disabled:opacity-60"
                aria-label="Email address"
              />
              <Button
                type="submit"
                size="lg"
                disabled={submitting || submitted}
                className={cn(
                  "h-auto py-3.5 px-6 font-bold rounded-2xl shadow-glow transition-smooth",
                  submitted
                    ? "bg-success text-success-foreground hover:bg-success"
                    : "bg-gradient-primary"
                )}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Joining…
                  </>
                ) : submitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> You're in
                  </>
                ) : (
                  <>
                    Join waitlist <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">
              No spam. We'll only email you when there's a spot for your group.
            </p>

            {/* Mini social proof */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["A", "T", "C", "M"].map((c, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold grid place-items-center border-2 border-background shadow-soft"
                  >
                    {c}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 text-warning">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Loved by 1,200+ early users
                </p>
              </div>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative flex justify-center lg:justify-end animate-slide-up">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-hero opacity-20 blur-3xl rounded-full" />
              <div className="relative w-[280px] sm:w-[320px] aspect-[9/19] rounded-[2.5rem] bg-foreground p-3 shadow-elevated">
                <div className="w-full h-full rounded-[2rem] bg-gradient-hero overflow-hidden relative">
                  {/* Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-foreground rounded-b-2xl z-10" />
                  {/* Screen content */}
                  <div className="p-5 pt-10 text-primary-foreground h-full flex flex-col">
                    <p className="text-[11px] uppercase tracking-widest opacity-80 font-semibold">
                      Total saved
                    </p>
                    <p className="text-3xl font-extrabold mt-1">₦480,000</p>
                    <p className="text-xs opacity-80 mt-0.5">across 3 groups</p>

                    <div className="mt-5 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-sm">Balogun Traders</p>
                        <span className="text-[10px] bg-success px-2 py-0.5 rounded-full font-bold">
                          Paid
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-white rounded-full" />
                      </div>
                      <p className="text-[11px] opacity-80 mt-2">
                        Week 6 of 8 • Next payout: Ade
                      </p>
                    </div>

                    <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-sm">Family Circle</p>
                        <span className="text-[10px] bg-warning text-warning-foreground px-2 py-0.5 rounded-full font-bold">
                          Due
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-white rounded-full" />
                      </div>
                      <p className="text-[11px] opacity-80 mt-2">
                        Week 4 of 8 • Pay ₦20,000
                      </p>
                    </div>

                    <div className="mt-auto">
                      <div className="bg-white text-primary rounded-2xl py-3 text-center font-bold text-sm shadow-soft">
                        Pay now
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating card */}
              <div className="absolute -left-4 sm:-left-8 bottom-24 bg-card border border-border rounded-2xl p-3 shadow-elevated hidden sm:flex items-center gap-2.5 animate-fade-in">
                <div className="w-9 h-9 rounded-xl bg-success/15 grid place-items-center">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-xs font-bold">Tunde paid ₦20,000</p>
                  <p className="text-[10px] text-muted-foreground">2 min ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-20 lg:py-28 bg-secondary/40 border-y border-border/60"
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Why Thatech Ajo
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Everything you need to run a trusted savings circle.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Designed for the way Nigerian groups actually save — simple
              enough for everyone, powerful enough for serious cooperatives.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-card border border-border rounded-3xl p-6 shadow-soft hover:shadow-card transition-smooth"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="mt-5 font-bold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Start in 3 simple steps.
            </h2>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                n: "01",
                t: "Create your group",
                d: "Set the amount, frequency, members, and payout order. Done in 60 seconds.",
              },
              {
                n: "02",
                t: "Invite members",
                d: "Share an invite code via WhatsApp. Members join with one tap.",
              },
              {
                n: "03",
                t: "Save & payout",
                d: "Track contributions, get reminders, and payout the recipient on schedule.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="relative bg-gradient-card border border-border rounded-3xl p-6 shadow-soft"
              >
                <span className="text-5xl font-extrabold bg-gradient-primary bg-clip-text text-transparent">
                  {s.n}
                </span>
                <h3 className="mt-3 font-bold text-lg">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-20 lg:py-28 bg-secondary/40 border-y border-border/60"
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Trusted by groups
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Real stories from real ajo groups.
            </h2>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="bg-card border border-border rounded-3xl p-6 shadow-soft flex flex-col"
              >
                <div className="flex gap-0.5 text-warning mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-foreground/90 flex-1">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary text-primary-foreground text-sm font-bold grid place-items-center">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Share waitlist */}
      <section id="share" className="py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="relative bg-card border border-border rounded-[2rem] p-8 sm:p-10 shadow-elevated overflow-hidden">
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-accent/15 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground rounded-full px-3 py-1.5 text-xs font-bold mb-5">
                <Share2 className="w-3.5 h-3.5" />
                Share this waitlist
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Ajo is better with your people.
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl">
                Invite your group, family, or market crew so you're all ready
                to start saving together the moment we launch.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-success text-success-foreground font-bold py-3.5 px-5 rounded-2xl shadow-soft hover:opacity-95 active:scale-[0.98] transition-smooth"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M19.05 4.91A10 10 0 0 0 4.1 18.27L3 22l3.83-1.04A10 10 0 1 0 19.05 4.9Zm-7.06 15.4a8.3 8.3 0 0 1-4.23-1.16l-.3-.18-2.27.62.6-2.22-.2-.32a8.3 8.3 0 1 1 6.4 3.26Zm4.55-6.18c-.25-.13-1.47-.73-1.7-.81-.22-.08-.39-.13-.55.13-.16.25-.63.81-.78.98-.14.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23a7.5 7.5 0 0 1-1.39-1.72c-.14-.25-.02-.38.11-.5.11-.11.25-.29.38-.43.13-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.13-.55-1.34-.76-1.83-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2 0 1.18.86 2.32.98 2.48.13.16 1.7 2.6 4.12 3.65.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.47-.29Z" />
                  </svg>
                  Share on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 font-bold py-3.5 px-5 rounded-2xl border-2 shadow-soft active:scale-[0.98] transition-smooth",
                    copied
                      ? "bg-success/10 border-success text-success"
                      : "bg-card border-border hover:border-primary hover:text-primary"
                  )}
                  aria-live="polite"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" /> Link copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" /> Copy link
                    </>
                  )}
                </button>
              </div>

              <div className="mt-5 flex items-center gap-2 bg-secondary/60 border border-border rounded-xl px-3 py-2.5">
                <Share2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <p className="text-xs sm:text-sm font-mono text-muted-foreground truncate">
                  {shareUrl}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Questions? We've got you.
            </h2>
          </div>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-border"
              >
                <AccordionTrigger className="text-left font-bold text-base hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-5xl mx-auto rounded-[2rem] bg-gradient-hero text-primary-foreground p-10 sm:p-14 shadow-elevated relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Be first in line when we launch.
              </h2>
              <p className="mt-3 opacity-90 max-w-lg">
                Join the waitlist and we'll invite your group as soon as a slot
                opens. No spam — just one email when it's your turn.
              </p>
            </div>
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold py-4 px-6 rounded-2xl shadow-soft active:scale-[0.98] transition-smooth"
            >
              <Smartphone className="w-5 h-5" /> Join the waitlist
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-primary grid place-items-center">
              <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">Thatech Ajo</span>
            <span className="text-xs text-muted-foreground ml-2">
              © {new Date().getFullYear()} — Made for Nigeria 🇳🇬
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-smooth">
              Features
            </a>
            <a href="#faq" className="hover:text-foreground transition-smooth">
              FAQ
            </a>
            <Link to="/get-started" className="hover:text-foreground transition-smooth">
              Open app
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
