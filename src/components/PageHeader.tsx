import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
  variant?: "default" | "hero";
}

export const PageHeader = ({ title, subtitle, back = true, right, variant = "default" }: PageHeaderProps) => {
  const navigate = useNavigate();

  if (variant === "hero") {
    return (
      <div className="bg-gradient-hero text-primary-foreground px-5 pt-12 pb-8 rounded-b-[2rem] shadow-elevated relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex items-center justify-between mb-1">
          {back ? (
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-smooth">
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : <div />}
          {right}
        </div>
        <div className="relative mt-2">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm opacity-90 mt-1">{subtitle}</p>}
        </div>
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border px-5 py-4 flex items-center gap-3">
      {back && (
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-secondary transition-smooth">
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
};
