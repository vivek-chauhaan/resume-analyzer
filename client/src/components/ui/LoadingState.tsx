import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export default function LoadingState({
  message = "Loading…",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-3 px-6 py-16 text-slate-400 ${className}`}
    >
      <Loader2 className="h-8 w-8 animate-spin text-cyan-400" aria-hidden="true" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
