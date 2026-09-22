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
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3">
      <div>
        <p className="font-medium text-slate-200">{resume.originalFileName}</p>
        <p className="text-xs text-slate-500">
          {(resume.fileSize / 1024).toFixed(0)} KB · {new Date(resume.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[resume.status]}`}>
          {resume.status}
        </span>
        <button
          onClick={() => onDelete(resume._id)}
          className="text-xs text-red-400 hover:text-red-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
