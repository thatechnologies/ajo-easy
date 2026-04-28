import { cn } from "@/lib/utils";

export const formatNaira = (amount: number) =>
  "₦" + amount.toLocaleString("en-NG", { maximumFractionDigits: 0 });

interface MoneyProps {
  amount: number;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Money = ({ amount, className, size = "md" }: MoneyProps) => {
  const sizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };
  return (
    <span className={cn("font-bold tracking-tight tabular-nums", sizes[size], className)}>
      {formatNaira(amount)}
    </span>
  );
};
