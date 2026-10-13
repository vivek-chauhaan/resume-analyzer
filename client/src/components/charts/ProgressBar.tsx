import { useMounted } from "../../hooks/useMounted";

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
}

export default function ProgressBar({ label, value, max }: ProgressBarProps) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  const mounted = useMounted();

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-300 capitalize">{label}</span>
        <span className="text-slate-500">
          {value}/{max}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className="h-2 rounded-full bg-slate-800 overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-1000 ease-out"
          style={{ width: mounted ? `${percent}%` : "0%" }}
        />
      </div>
    </div>
  );
}
