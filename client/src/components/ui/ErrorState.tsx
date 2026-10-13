import { AlertTriangle, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import Button from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  action?: ReactNode;
}

export default function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
  action,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-2xl border border-red-900/60 bg-red-950/20 px-6 py-10 text-center"
    >
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-950/60 text-red-400">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="font-medium text-slate-200">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-slate-400">{message}</p>}
      {(onRetry || action) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onRetry}
              leftIcon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
            >
              {retryLabel}
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}
