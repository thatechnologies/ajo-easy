import { cn } from "@/lib/utils";

interface AvatarCircleProps {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const colors = [
  "bg-primary text-primary-foreground",
  "bg-accent text-accent-foreground",
  "bg-success text-success-foreground",
  "bg-warning text-warning-foreground",
  "bg-primary-glow text-primary-foreground",
];

export const AvatarCircle = ({ name, className, size = "md" }: AvatarCircleProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const colorIdx = name.charCodeAt(0) % colors.length;
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold flex-shrink-0",
        colors[colorIdx],
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
};
