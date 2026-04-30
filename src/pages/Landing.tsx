import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ShieldCheck,
  Wallet,
  BellRing,
  Users,
  ArrowRight,
  Star,
  Smartphone,
  Lock,
  Zap,
} from "lucide-react";
import kowopeLogo from "@/assets/kowope-logo.png";

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
      "Before Kowope, we used a notebook. Now everyone sees who paid — no more wahala.",
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
    q: "Is Kowope free to use?",
    a: "Yes. Creating and joining groups is free. We’ll add optional paid features later (e.g., premium admin tools).",
  },
  {
    q: "How does the money move?",
    a: "Members contribute via bank transfer, card, or USSD. Kowope tracks who paid and helps the admin payout the recipient on schedule.",
  },
  {
    q: "Is my group's money safe?",
    a: "We never hold your money. Kowope is the trust and tracking layer — funds move through trusted Nigerian payment rails.",
  },
  {
    q: "How do I start?",
    a: "Create an account, create a group (or join with an invite code), then members submit payments with a transaction reference.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary grid place-items-center shadow-glow p-1">
              <img src={kowopeLogo} alt="Kowope logo" width={40} height={40} className="w-full h-full object-contain" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">
              Kowope
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-smooth">
              Features
            </a>
            <a href="#testimonials" className="hover:text-foreground transition-smooth">
              Stories
            </a>
            <a href="#faq" className="hover:text-foreground transition-smooth">
              FAQ
            </a>
          </nav>
          <Button asChild size="sm" className="hidden sm:inline-flex h-10 rounded-full font-bold bg-foreground text-background hover:opacity-90">
            <Link to="/auth">
              Get started <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
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
              Kowope is the simplest way for friends, family and market
              groups to save together. Track contributions, payouts, and
              reminders — all in one place.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
              <Button asChild size="lg" className="h-12 rounded-2xl font-bold bg-gradient-primary shadow-glow">
                <Link to="/auth?mode=signup">Create account</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-2xl font-bold">
                <Link to="/auth?mode=signin">Sign in</Link>
              </Button>
            </div>

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
                  <Smartphone className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-xs font-bold">Track who paid</p>
                  <p className="text-[10px] text-muted-foreground">in real time</p>
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
              Why Kowope
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
                Start saving with your group today.
              </h2>
              <p className="mt-3 opacity-90 max-w-lg">
                Create an account, create a group (or join with an invite code), and start tracking contributions and payouts.
              </p>
            </div>
            <Button asChild size="lg" className="h-12 rounded-2xl font-bold bg-white text-primary hover:opacity-95">
              <Link to="/auth?mode=signup">
                <Smartphone className="w-5 h-5" /> Create account
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary grid place-items-center p-0.5">
              <img src={kowopeLogo} alt="Kowope logo" width={32} height={32} loading="lazy" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-sm">Kowope</span>
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
            <Link to="/auth" className="hover:text-foreground transition-smooth">
              Open app
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
