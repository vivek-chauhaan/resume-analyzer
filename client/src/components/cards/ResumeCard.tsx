import { useState } from "react";
import { Link } from "react-router-dom";
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

export default function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 transition-colors hover:border-slate-700">
      <div>
        <p className="font-medium text-slate-200">{resume.originalFileName}</p>
        <p className="text-xs text-slate-500">
          {(resume.fileSize / 1024).toFixed(0)} KB ·{" "}
          {new Date(resume.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          to={`/resumes/${resume._id}/report`}
          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          View report
        </Link>
        <span
          className={`text-xs px-2 py-1 rounded-full ${statusColors[resume.status]}`}
        >
          {resume.status}
        </span>

        {confirming ? (
          <span className="flex items-center gap-2 text-xs">
            <button
              onClick={() => onDelete(resume._id)}
              className="text-red-400 hover:text-red-300 font-medium"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-slate-500 hover:text-slate-300"
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
