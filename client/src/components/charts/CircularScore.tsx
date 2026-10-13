import { useCountUp } from "../../hooks/useCountUp";
import { useMounted } from "../../hooks/useMounted";

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

  const mounted = useMounted();
  const displayScore = useCountUp(clamped, 1000);

  return (
    <div
      role="img"
      aria-label={`${label}: ${clamped} out of 100`}
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
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
          strokeDashoffset={mounted ? offset : circumference}
          className={`${colorClass(clamped)} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-bold text-slate-100">{displayScore}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}
