import type { LucideIcon } from "lucide-react";
import { useCountUp } from "../../hooks/useCountUp";
import Skeleton from "../ui/Skeleton";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  loading?: boolean;
  icon?: LucideIcon;
}

export default function StatCard({ label, value, hint, loading, icon: Icon }: StatCardProps) {
  // Numbers count up; text values (like "—") are shown as-is.
  const animated = useCountUp(typeof value === "number" ? value : 0);
  const shown = typeof value === "number" ? animated : value;

  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/10 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        {Icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>
      {loading ? (
        <>
          <Skeleton className="mt-2 h-8 w-16" />
          <Skeleton className="mt-2 h-3 w-24" />
        </>
      ) : (
        <>
          <p className="mt-1 text-2xl font-semibold text-slate-100 sm:text-3xl">{shown}</p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </>
      )}
    </div>
  );
}
