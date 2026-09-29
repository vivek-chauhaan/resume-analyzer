import Skeleton from "../ui/Skeleton";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  loading?: boolean;
}

export default function StatCard({ label, value, hint, loading }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      {loading ? (
        <>
          <Skeleton className="mt-2 h-8 w-16" />
          <Skeleton className="mt-2 h-3 w-24" />
        </>
      ) : (
        <>
          <p className="mt-1 text-3xl font-semibold text-slate-100">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </>
      )}
    </div>
  );
}