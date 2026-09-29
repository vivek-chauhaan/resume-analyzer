import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchResumes, deleteResume } from "../../features/resume/resumeSlice";
import { fetchDashboardStats } from "../../features/dashboard/dashboardSlice";
import ResumeCard from "../../components/cards/ResumeCard";
import StatCard from "../../components/cards/StatCard";
import Skeleton from "../../components/ui/Skeleton";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items, status: resumeStatus } = useAppSelector((state) => state.resume);
  const { stats, status: statsStatus } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchResumes({ page: 1, limit: 5, sortBy: "createdAt", order: "desc" }));
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    const result = await dispatch(deleteResume(id));
    if (deleteResume.fulfilled.match(result)) {
      dispatch(fetchDashboardStats());
    }
  };

  const statsLoading = !stats && statsStatus !== "failed";
  const resumesLoading = resumeStatus === "loading" && items.length === 0;

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Welcome{user ? `, ${user.name}` : ""}</h1>
        <Link
          to="/upload"
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-sm font-medium text-white"
        >
          Upload resume
        </Link>
      </div>

      {statsStatus === "failed" && (
        <p className="text-sm text-red-400">Couldn&apos;t load your stats. Refresh to try again.</p>
      )}

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Resumes" value={stats?.totalResumes ?? 0} loading={statsLoading} />
        <StatCard
          label="Analyzed"
          value={stats?.analyzedCount ?? 0}
          hint={
            stats?.lastAnalysisAt
              ? `Last: ${new Date(stats.lastAnalysisAt).toLocaleDateString()}`
              : "No analyses yet"
          }
          loading={statsLoading}
        />
        <StatCard label="Average score" value={stats?.averageScore ?? "—"} loading={statsLoading} />
        <StatCard label="Best score" value={stats?.bestScore ?? "—"} loading={statsLoading} />
      </section>

      {/* Latest analysis + suggestions preview */}
      {stats?.latest && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium">Latest analysis</h2>
            <Link
              to={`/resumes/${stats.latest.resumeId}/report`}
              className="text-sm text-cyan-400 hover:underline"
            >
              Open full report
            </Link>
          </div>
          <p className="text-sm text-slate-400">
            {stats.latest.fileName} · <span className="text-slate-200">{stats.latest.overallScore}/100</span>
          </p>
          {stats.latest.suggestions.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-slate-300 list-disc list-inside">
              {stats.latest.suggestions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Recent resumes */}
      <section>
        <h2 className="font-medium mb-3">Recent resumes</h2>

        {resumesLoading && (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {!resumesLoading && items.length === 0 && (
          <p className="text-slate-400">
            No resumes yet.{" "}
            <Link to="/upload" className="text-cyan-400 hover:underline">
              Upload one
            </Link>{" "}
            to get started.
          </p>
        )}

        <div className="space-y-3">
          {items.map((resume) => (
            <ResumeCard key={resume._id} resume={resume} onDelete={handleDelete} />
          ))}
        </div>
      </section>
    </div>
  );
}