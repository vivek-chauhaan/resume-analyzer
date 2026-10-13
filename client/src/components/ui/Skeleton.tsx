export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-shimmer rounded-lg bg-gradient-to-r from-slate-800 via-slate-700/60 to-slate-800 bg-[length:200%_100%] ${className}`}
    />
  );
}
