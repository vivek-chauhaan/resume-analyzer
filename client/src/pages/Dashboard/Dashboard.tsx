import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchResumes, deleteResume } from "../../features/resume/resumeSlice";
import ResumeCard from "../../components/cards/ResumeCard";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items, status } = useAppSelector((state) => state.resume);

  useEffect(() => {
    dispatch(fetchResumes({ page: 1, limit: 10, sortBy: "createdAt", order: "desc" }));
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteResume(id));
  };

  return (
    <div className="min-h-screen px-6 py-10 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Welcome{user ? `, ${user.name}` : ""}</h1>
        <Link
          to="/upload"
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-sm font-medium text-white"
        >
          Upload resume
        </Link>
      </div>

      {status === "loading" && items.length === 0 && (
        <p className="text-slate-400">Loading your resumes…</p>
      )}

      {status !== "loading" && items.length === 0 && (
        <p className="text-slate-400">
          No resumes yet — <Link to="/upload" className="text-cyan-400 hover:underline">upload one</Link> to get started.
        </p>
      )}

      <div className="space-y-3">
        {items.map((resume) => (
          <ResumeCard key={resume._id} resume={resume} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
