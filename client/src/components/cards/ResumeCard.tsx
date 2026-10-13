import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Eye, FileText, Trash2, X } from "lucide-react";
import { Resume } from "../../types/resume.types";

interface ResumeCardProps {
  resume: Resume;
  onDelete: (id: string) => void;
}

const statusColors: Record<Resume["status"], string> = {
  uploaded: "bg-slate-700 text-slate-200",
  analyzing: "bg-amber-900/60 text-amber-300",
  analyzed: "bg-emerald-900/60 text-emerald-300",
  failed: "bg-red-900/60 text-red-300",
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400";

export default function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-cyan-400">
          <FileText className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-200">{resume.originalFileName}</p>
          <p className="text-xs text-slate-500">
            {(resume.fileSize / 1024).toFixed(0)} KB ·{" "}
            {new Date(resume.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:shrink-0">
        <span
          className={`rounded-full px-2 py-1 text-xs ${statusColors[resume.status]}`}
        >
          {resume.status}
        </span>

        <Link
          to={`/resumes/${resume._id}/report`}
          className={`inline-flex items-center gap-1 rounded text-xs text-cyan-400 transition-colors hover:text-cyan-300 ${focusRing}`}
        >
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          View report
        </Link>

        {confirming ? (
          <span className="flex items-center gap-3 text-xs" role="group" aria-label="Confirm delete">
            <button
              type="button"
              onClick={() => onDelete(resume._id)}
              className={`inline-flex items-center gap-1 rounded font-medium text-red-400 hover:text-red-300 ${focusRing}`}
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className={`inline-flex items-center gap-1 rounded text-slate-500 hover:text-slate-300 ${focusRing}`}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Cancel
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label={`Delete ${resume.originalFileName}`}
            className={`inline-flex items-center gap-1 rounded text-xs text-red-400 transition-colors hover:text-red-300 ${focusRing}`}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
