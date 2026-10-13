import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart3, CheckCircle2, FileText, Trophy, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchResumes, deleteResume } from "../../features/resume/resumeSlice";
import { fetchDashboardStats } from "../../features/dashboard/dashboardSlice";
import ResumeCard from "../../components/cards/ResumeCard";
import StatCard from "../../components/cards/StatCard";
import Skeleton from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import { ResumeListParams } from "../../types/resume.types";

const RECENT_RESUMES_PARAMS: ResumeListParams = {
  page: 1,
  limit: 5,
  sortBy: "createdAt",
  order: "desc",
};

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items, status: resumeStatus, error: resumeError } = useAppSelector(
    (state) => state.resume
  );
  const { stats, status: statsStatus } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchResumes(RECENT_RESUMES_PARAMS));
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    const result = await dispatch(deleteResume(id));
    if (deleteResume.fulfilled.match(result)) {
      toast.success("Resume deleted");
      dispatch(fetchDashboardStats());
    } else {
      toast.error((result.payload as string) || "Could not delete the resume.");
    }
  };

  const statsLoading = !stats && statsStatus !== "failed";
  const resumesLoading = resumeStatus === "loading" && items.length === 0;
  const resumesFailed = resumeStatus === "failed" && items.length === 0;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Welcome{user ? `, ${user.name}` : ""}</h1>
        <Button to="/upload" leftIcon={<Upload className="h-4 w-4" aria-hidden="true" />}>
          Upload resume
        </Button>
      </div>

      {statsStatus === "failed" && (
        <ErrorState
          title="Couldn't load your stats"
          message="Check your connection and try again."
          onRetry={() => dispatch(fetchDashboardStats())}
        />
      )}

      {/* Stat cards */}
      <section aria-label="Your stats" className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4" data-aos="fade-up">
        <StatCard label="Resumes" value={stats?.totalResumes ?? 0} loading={statsLoading} icon={FileText} />
        <StatCard
          label="Analyzed"
          value={stats?.analyzedCount ?? 0}
          hint={
            stats?.lastAnalysisAt
              ? `Last: ${new Date(stats.lastAnalysisAt).toLocaleDateString()}`
              : "No analyses yet"
          }
          loading={statsLoading}
          icon={CheckCircle2}
        />
        <StatCard label="Average score" value={stats?.averageScore ?? "—"} loading={statsLoading} icon={BarChart3} />
        <StatCard label="Best score" value={stats?.bestScore ?? "—"} loading={statsLoading} icon={Trophy} />
      </section>

      {/* Latest analysis + suggestions preview */}
      {stats?.latest && (
        <Card as="section" data-aos="fade-up">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="font-medium">Latest analysis</h2>
            <Link
              to={`/resumes/${stats.latest.resumeId}/report`}
              className="text-sm text-cyan-400 hover:underline"
            >
              Open full report
            </Link>
          </div>
          <p className="text-sm text-slate-400">
            {stats.latest.fileName} ·{" "}
            <span className="text-slate-200">{stats.latest.overallScore}/100</span>
          </p>
          {stats.latest.suggestions.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-slate-300 list-disc list-inside">
              {stats.latest.suggestions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {/* Recent resumes */}
      <section aria-labelledby="recent-resumes-heading">
        <h2 id="recent-resumes-heading" className="mb-3 font-medium">
          Recent resumes
        </h2>

        {resumesLoading && (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {resumesFailed && (
          <ErrorState
            title="Couldn't load your resumes"
            message={resumeError || undefined}
            onRetry={() => dispatch(fetchResumes(RECENT_RESUMES_PARAMS))}
          />
        )}

        {!resumesLoading && !resumesFailed && items.length === 0 && (
          <EmptyState
            icon={FileText}
            title="No resumes yet"
            description="Upload a PDF to get your first ATS score."
            action={
              <Button to="/upload" size="sm" leftIcon={<Upload className="h-4 w-4" aria-hidden="true" />}>
                Upload one
              </Button>
            }
          />
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
