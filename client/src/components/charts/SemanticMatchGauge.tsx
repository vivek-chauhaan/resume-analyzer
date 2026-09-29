interface SemanticMatchGaugeProps {
  value: number | null; // 0-100, or null before a job description has been checked
}

export default function SemanticMatchGauge({ value }: SemanticMatchGaugeProps) {
  const hasValue = value !== null;
  const clamped = hasValue ? Math.max(0, Math.min(100, value)) : 0;

  const color =
    clamped >= 70 ? "stroke-emerald-400" : clamped >= 50 ? "stroke-amber-400" : "stroke-red-400";

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 70" className="w-48">
        {/* background track */}
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          pathLength={100}
          className="stroke-slate-800"
        />
        {/* filled portion */}
        {hasValue && (
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${clamped} 100`}
            className={`${color} transition-all duration-700`}
          />
        )}
      </svg>
      <p className="-mt-6 text-2xl font-bold text-slate-100">
        {hasValue ? `${clamped}%` : "—"}
      </p>
      <p className="text-xs text-slate-500 mt-1">Job description match</p>
    </div>
  );
}