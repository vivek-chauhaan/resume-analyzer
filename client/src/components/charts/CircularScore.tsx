interface CircularScoreProps {
  score: number; // 0-100
  size?: number;
  label?: string;
}

function colorClass(score: number): string {
  if (score >= 75) return "stroke-emerald-400";
  if (score >= 50) return "stroke-amber-400";
  return "stroke-red-400";
}

export default function CircularScore({ score, size = 140, label = "ATS Score" }: CircularScoreProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-slate-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${colorClass(clamped)} transition-all duration-700`}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-bold text-slate-100">{clamped}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}