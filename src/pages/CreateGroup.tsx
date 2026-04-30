import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
<<<<<<< HEAD
import { apiCreateGroup } from "@/lib/ajo-data";
=======
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { PageHeader } from "@/components/PageHeader";
import { formatNaira } from "@/components/Money";
import { toast } from "@/hooks/use-toast";
<<<<<<< HEAD
import { useAuth } from "@/hooks/useAuth";
=======
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
import {
  CalendarDays,
  Users,
  Coins,
  Repeat,
  Shuffle,
  ListOrdered,
  Check,
  CalendarIcon,
  Minus,
  Plus,
  Copy,
  Share2,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";

const presetAmounts = [5000, 10000, 20000, 50000, 100000];

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Group name must be at least 3 characters")
    .max(50, "Keep it under 50 characters"),
  amount: z
    .number({ invalid_type_error: "Enter a contribution amount" })
    .min(500, "Minimum is ₦500")
    .max(10_000_000, "Amount is too high"),
  frequency: z.enum(["Weekly", "Monthly"], {
    required_error: "Choose a frequency",
  }),
  members: z
    .number()
    .int("Must be a whole number")
    .min(2, "Need at least 2 members")
    .max(30, "Maximum is 30 members"),
  startDate: z.date({ required_error: "Pick a start date" }).refine(
    (d) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d >= today;
    },
    { message: "Start date can't be in the past" }
  ),
  order: z.enum(["random", "manual"], { required_error: "Choose payout order" }),
<<<<<<< HEAD
  bankName: z.preprocess(
    (v) => {
      const s = typeof v === "string" ? v.trim() : "";
      return s === "" ? undefined : s;
    },
    z.string().max(60, "Keep it under 60 characters").optional(),
  ),
  bankAccountNumber: z.preprocess(
    (v) => {
      const s = typeof v === "string" ? v.trim().replace(/\s/g, "") : "";
      return s === "" ? undefined : s;
    },
    z
      .string()
      .regex(/^\d+$/, "Digits only")
      .min(8, "Too short")
      .max(20, "Too long")
      .optional(),
  ),
  bankAccountName: z.preprocess(
    (v) => {
      const s = typeof v === "string" ? v.trim() : "";
      return s === "" ? undefined : s;
    },
    z.string().max(80, "Keep it under 80 characters").optional(),
  ),
=======
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
});

type FormValues = z.infer<typeof formSchema>;

<<<<<<< HEAD
const CreateGroup = () => {
  const navigate = useNavigate();
  const { markAdmin, user } = useAuth();
=======
const generateInviteCode = (name: string) => {
  const slug =
    name
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 4) || "AJO";
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AJO-${slug}-${rand}`;
};

const CreateGroup = () => {
  const navigate = useNavigate();
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [created, setCreated] = useState<{
    data: FormValues;
    inviteCode: string;
    inviteLink: string;
  } | null>(null);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      amount: 20000,
      frequency: "Weekly",
      members: 8,
      startDate: new Date(),
      order: "random",
<<<<<<< HEAD
      bankName: "",
      bankAccountNumber: "",
      bankAccountName: "",
=======
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
    },
  });

  const values = form.watch();

  const handleNext = async () => {
<<<<<<< HEAD
    if (user?.kyc_status !== "verified") {
      toast({ title: "KYC required", description: "Verify your KYC before creating a group.", variant: "destructive" });
      navigate("/kyc");
      return;
    }
=======
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
    const valid = await form.trigger(["name", "amount", "frequency"]);
    if (valid) setStep(2);
  };

<<<<<<< HEAD
  const onSubmit = async (data: FormValues) => {
    try {
      if (user?.kyc_status !== "verified") {
        toast({ title: "KYC required", description: "Verify your KYC before creating a group.", variant: "destructive" });
        navigate("/kyc");
        return;
      }
      const res = await apiCreateGroup({
        name: data.name,
        amount: data.amount,
        frequency: data.frequency,
        totalMembers: data.members,
        startDate: data.startDate.toISOString().slice(0, 10),
        bankName: data.bankName,
        bankAccountNumber: data.bankAccountNumber,
        bankAccountName: data.bankAccountName,
      });
      const inviteLink = `${window.location.origin}/join-group?code=${res.inviteCode}`;
      setCreated({ data, inviteCode: res.inviteCode, inviteLink });
      setStep(3);
      markAdmin();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Try again";
      if (message === "kyc_required") {
        toast({ title: "KYC required", description: "Verify your KYC before creating a group.", variant: "destructive" });
        navigate("/kyc");
      } else {
        toast({ title: "Could not create group", description: message, variant: "destructive" });
      }
    }
=======
  const onSubmit = (data: FormValues) => {
    const inviteCode = generateInviteCode(data.name);
    const inviteLink = `${window.location.origin}/join-group?code=${inviteCode}`;
    setCreated({ data, inviteCode, inviteLink });
    setStep(3);
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
  };

  const handleCopy = async (value: string, kind: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      toast({
        title: "Copied!",
        description: kind === "code" ? "Invite code copied" : "Invite link copied",
      });
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast({
        title: "Couldn't copy",
        description: "Please copy manually",
        variant: "destructive",
      });
    }
  };

  const buildShareMessage = () => {
    if (!created) return "";
    const { data, inviteCode, inviteLink } = created;
    return `You're invited to join *${data.name}* on Kowope 💸\n\n• Contribution: ${formatNaira(
      data.amount
    )} ${data.frequency.toLowerCase()}\n• Members: ${data.members}\n• Starts: ${format(
      data.startDate,
      "EEE, d MMM yyyy"
    )}\n\nUse invite code: ${inviteCode}\nOr tap: ${inviteLink}`;
  };

  const handleNativeShare = async () => {
    if (!created) return;
    const text = buildShareMessage();
    if (navigator.share) {
      try {
        await navigator.share({
          title: created.data.name,
          text,
          url: created.inviteLink,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      handleCopy(text, "link");
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(buildShareMessage());
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="phone-shell flex flex-col">
      <PageHeader
        title={step === 3 ? "Group created" : "Create new group"}
        subtitle={step === 3 ? "Share the invite" : `Step ${step} of 2`}
        back={step !== 3}
      />
      <div className="screen-pad flex-1 flex flex-col">
        {/* Step progress (hide on success) */}
        {step !== 3 && (
          <div className="flex gap-2 mb-6">
            <div className="flex-1 h-1.5 rounded-full bg-primary" />
            <div
              className={cn(
                "flex-1 h-1.5 rounded-full transition-smooth",
                step === 2 ? "bg-primary" : "bg-muted"
              )}
            />
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 flex flex-col"
          >
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold mb-1">Group basics</h2>
                  <p className="text-sm text-muted-foreground">
                    Name your group and set the contribution.
                  </p>
                </div>

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Group name
                      </FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          placeholder="e.g. Balogun Market Traders"
                          className="w-full bg-card border-2 border-border rounded-2xl px-4 py-3.5 outline-none focus:border-primary transition-smooth font-semibold shadow-soft placeholder:text-muted-foreground/60"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Contribution amount
                      </FormLabel>
                      <FormControl>
                        <div className="bg-card border-2 border-border rounded-2xl px-4 py-4 shadow-soft focus-within:border-primary transition-smooth">
                          <div className="flex items-baseline gap-1 mb-3">
                            <span className="text-2xl font-bold">₦</span>
                            <input
                              type="number"
                              inputMode="numeric"
                              value={Number.isNaN(field.value) ? "" : field.value}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? NaN
                                    : Number(e.target.value)
                                )
                              }
                              onBlur={field.onBlur}
                              className="flex-1 w-full bg-transparent outline-none text-3xl font-extrabold tabular-nums"
                            />
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {presetAmounts.map((a) => (
                              <button
                                type="button"
                                key={a}
                                onClick={() => field.onChange(a)}
                                className={cn(
                                  "text-xs font-semibold px-3 py-1.5 rounded-full transition-smooth",
                                  field.value === a
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground"
                                )}
                              >
                                {formatNaira(a)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Frequency */}
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Frequency
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-3">
                          {(["Weekly", "Monthly"] as const).map((f) => (
                            <button
                              type="button"
                              key={f}
                              onClick={() => field.onChange(f)}
                              className={cn(
                                "rounded-2xl border-2 p-4 text-left transition-smooth",
                                field.value === f
                                  ? "border-primary bg-secondary shadow-soft"
                                  : "border-border bg-card"
                              )}
                            >
                              <Repeat
                                className={cn(
                                  "w-5 h-5 mb-2",
                                  field.value === f
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                )}
                              />
                              <p className="font-bold text-sm">{f}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {f === "Weekly" ? "Every 7 days" : "Once a month"}
                              </p>
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  size="lg"
                  onClick={handleNext}
                  className="w-full h-14 bg-gradient-primary font-bold text-base rounded-2xl shadow-glow"
                >
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold mb-1">Members & schedule</h2>
                  <p className="text-sm text-muted-foreground">
                    How big is the group and who pays first?
                  </p>
                </div>

                {/* Members */}
                <FormField
                  control={form.control}
                  name="members"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Number of members
                      </FormLabel>
                      <FormControl>
                        <div className="bg-card border-2 border-border rounded-2xl p-4 shadow-soft">
                          <div className="flex items-center justify-between mb-3">
                            <button
                              type="button"
                              onClick={() =>
                                field.onChange(Math.max(2, field.value - 1))
                              }
                              className="w-11 h-11 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center disabled:opacity-40"
                              disabled={field.value <= 2}
                              aria-label="Decrease members"
                            >
                              <Minus className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                            <div className="text-center">
                              <p className="text-3xl font-extrabold tabular-nums">
                                {field.value}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                members
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                field.onChange(Math.min(30, field.value + 1))
                              }
                              className="w-11 h-11 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center disabled:opacity-40"
                              disabled={field.value >= 30}
                              aria-label="Increase members"
                            >
                              <Plus className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                          </div>
                          <div className="bg-secondary/60 rounded-xl p-3 text-center">
                            <p className="text-[11px] text-muted-foreground">
                              Each payout will be
                            </p>
                            <p className="font-bold text-base text-primary">
                              {formatNaira(
                                (values.amount || 0) * (field.value || 0)
                              )}
                            </p>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Start date */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Start date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                "w-full h-auto justify-start gap-3 bg-card border-2 border-border rounded-2xl px-4 py-3.5 shadow-soft hover:bg-card",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarDays className="w-5 h-5 text-primary" />
                              <span className="font-semibold text-base">
                                {field.value
                                  ? format(field.value, "EEE, d MMM yyyy")
                                  : "Pick a date"}
                              </span>
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Order */}
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Payout order
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => field.onChange("random")}
                            className={cn(
                              "rounded-2xl border-2 p-4 text-left transition-smooth",
                              field.value === "random"
                                ? "border-primary bg-secondary shadow-soft"
                                : "border-border bg-card"
                            )}
                          >
                            <Shuffle
                              className={cn(
                                "w-5 h-5 mb-2",
                                field.value === "random"
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              )}
                            />
                            <p className="font-bold text-sm">Random</p>
                            <p className="text-[11px] text-muted-foreground">
                              Fair to everyone
                            </p>
                          </button>
                          <button
                            type="button"
                            onClick={() => field.onChange("manual")}
                            className={cn(
                              "rounded-2xl border-2 p-4 text-left transition-smooth",
                              field.value === "manual"
                                ? "border-primary bg-secondary shadow-soft"
                                : "border-border bg-card"
                            )}
                          >
                            <ListOrdered
                              className={cn(
                                "w-5 h-5 mb-2",
                                field.value === "manual"
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              )}
                            />
                            <p className="font-bold text-sm">Manual</p>
                            <p className="text-[11px] text-muted-foreground">
                              Admin sets order
                            </p>
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription className="text-[11px]">
                        You can change the order later in admin settings.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

<<<<<<< HEAD
                {/* Bank details */}
                <div className="rounded-2xl bg-card border-2 border-border p-4 shadow-soft space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Payout account (optional)
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      This is where members will send their contributions.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Bank name
                        </FormLabel>
                        <FormControl>
                          <input
                            {...field}
                            placeholder="e.g. Access Bank"
                            className="w-full bg-background border-2 border-border rounded-2xl px-4 py-3.5 outline-none focus:border-primary transition-smooth font-semibold placeholder:text-muted-foreground/60"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Account number
                        </FormLabel>
                        <FormControl>
                          <input
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            onBlur={field.onBlur}
                            placeholder="e.g. 0123456789"
                            inputMode="numeric"
                            className="w-full bg-background border-2 border-border rounded-2xl px-4 py-3.5 outline-none focus:border-primary transition-smooth font-semibold placeholder:text-muted-foreground/60"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankAccountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Account name
                        </FormLabel>
                        <FormControl>
                          <input
                            {...field}
                            placeholder="e.g. Kowope Ajo"
                            className="w-full bg-background border-2 border-border rounded-2xl px-4 py-3.5 outline-none focus:border-primary transition-smooth font-semibold placeholder:text-muted-foreground/60"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

=======
>>>>>>> 74654b9a46e2cf75a1923c93a4b477e006116acc
                {/* Summary */}
                <div className="rounded-2xl bg-gradient-card border border-border p-4 shadow-soft space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Summary
                  </p>
                  {[
                    {
                      i: <Coins className="w-4 h-4" />,
                      k: "Each contribution",
                      v: formatNaira(values.amount || 0),
                    },
                    {
                      i: <Repeat className="w-4 h-4" />,
                      k: "Frequency",
                      v: values.frequency,
                    },
                    {
                      i: <Users className="w-4 h-4" />,
                      k: "Members",
                      v: `${values.members} people`,
                    },
                    {
                      i: <Check className="w-4 h-4" />,
                      k: "Cycle length",
                      v: `${values.members} ${
                        values.frequency === "Weekly" ? "weeks" : "months"
                      }`,
                    },
                  ].map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm py-1"
                    >
                      <span className="flex items-center gap-2 text-muted-foreground">
                        {r.i} {r.k}
                      </span>
                      <span className="font-bold">{r.v}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="h-14 px-6 font-bold text-base rounded-2xl"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                    className="flex-1 h-14 bg-gradient-primary font-bold text-base rounded-2xl shadow-glow"
                  >
                    Create Group
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>

        {step === 3 && created && (
          <div className="space-y-5 animate-fade-in">
            {/* Success header */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mb-4 animate-scale-in">
                <CheckCircle2 className="w-10 h-10 text-success" strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-extrabold mb-1">Group created! 🎉</h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                Share the invite below to add the {created.data.members - 1} other members to{" "}
                <span className="font-semibold text-foreground">{created.data.name}</span>.
              </p>
            </div>

            {/* Invite code card — entire card is one-tap copy */}
            <button
              type="button"
              onClick={() => handleCopy(created.inviteCode, "code")}
              aria-label={
                copied === "code" ? "Invite code copied" : "Tap to copy invite code"
              }
              aria-live="polite"
              className="w-full text-left rounded-3xl bg-gradient-hero text-primary-foreground p-5 shadow-elevated relative overflow-hidden active:scale-[0.98] transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/50"
            >
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-accent/30 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] uppercase tracking-widest opacity-80 font-semibold">
                    Invite code
                  </p>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-smooth",
                      copied === "code"
                        ? "bg-success text-success-foreground"
                        : "bg-white/15 text-primary-foreground/90"
                    )}
                  >
                    {copied === "code" ? "Copied ✓" : "Tap to copy"}
                  </span>
                </div>
                <div
                  className={cn(
                    "flex items-center justify-between gap-3 backdrop-blur-sm rounded-2xl px-4 py-3.5 border transition-smooth",
                    copied === "code"
                      ? "bg-success/25 border-success/40"
                      : "bg-white/10 border-white/15"
                  )}
                >
                  <p className="font-extrabold tracking-[0.18em] text-xl tabular-nums truncate">
                    {created.inviteCode}
                  </p>
                  <span
                    className={cn(
                      "flex-shrink-0 flex items-center gap-1.5 font-bold text-xs px-3 py-2 rounded-xl shadow-soft transition-smooth",
                      copied === "code"
                        ? "bg-success text-success-foreground animate-scale-in"
                        : "bg-white text-primary"
                    )}
                  >
                    {copied === "code" ? (
                      <>
                        <Check className="w-3.5 h-3.5" strokeWidth={3} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy code
                      </>
                    )}
                  </span>
                </div>
                <p className="text-[11px] opacity-80 mt-3 leading-relaxed">
                  {copied === "code"
                    ? "Code copied — paste it in WhatsApp or SMS to invite members."
                    : "Tap anywhere on this card to copy. Members paste it in Join Group."}
                </p>
              </div>
            </button>

            {/* Invite link */}
            <div className="rounded-2xl bg-card border border-border p-3.5 shadow-soft">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                Invite link
              </p>
              <div className="flex items-center gap-2">
                <p className="flex-1 text-xs font-medium text-foreground/80 truncate">
                  {created.inviteLink}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(created.inviteLink, "link")}
                  className="flex-shrink-0 flex items-center gap-1 text-xs font-bold text-primary px-2.5 py-1.5 rounded-lg hover:bg-secondary transition-smooth"
                >
                  {copied === "link" ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Share actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={handleWhatsApp}
                className="h-14 bg-[hsl(142_70%_38%)] hover:bg-[hsl(142_70%_34%)] text-white font-bold rounded-2xl shadow-soft"
              >
                <MessageCircle className="w-4 h-4 mr-1.5" /> WhatsApp
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleNativeShare}
                className="h-14 font-bold rounded-2xl border-2"
              >
                <Share2 className="w-4 h-4 mr-1.5" /> More
              </Button>
            </div>

            {/* Continue */}
            <Button
              type="button"
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="w-full h-14 bg-gradient-primary font-bold text-base rounded-2xl shadow-glow"
            >
              Done — go to home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateGroup;
