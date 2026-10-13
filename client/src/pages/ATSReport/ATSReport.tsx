import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileSearch,
  Info,
  Lightbulb,
  RefreshCw,
  Target,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchAnalysis,
  runAnalysis,
  runJobMatch,
  clearAnalysis,
} from "../../features/analysis/analysisSlice";
import CircularScore from "../../components/charts/CircularScore";
import SemanticMatchGauge from "../../components/charts/SemanticMatchGauge";
import ProgressBar from "../../components/charts/ProgressBar";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";

const SECTION_MAX: Record<string, number> = {
  contact: 10,
  skills: 12,
  education: 8,
  experience: 15,
  projects: 8,
  certifications: 5,
};

export default function ATSReport() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { current, status, jobMatchStatus, error, jobMatchError } = useAppSelector(
    (state) => state.analysis
  );
  const [jobDescription, setJobDescription] = useState("");

  useEffect(() => {
    if (!id) return;
    dispatch(clearAnalysis());
    dispatch(fetchAnalysis(id));
  }, [id, dispatch]);

  if (!id) return null;

  const handleRun = async () => {
    const result = await dispatch(runAnalysis(id));
    if (runAnalysis.fulfilled.match(result)) {
      toast.success("Analysis complete");
    } else {
      toast.error((result.payload as string) || "Analysis failed. Please try again.");
    }
  };

  const handleJobMatch = async () => {
    const result = await dispatch(runJobMatch({ resumeId: id, jobDescription }));
    if (runJobMatch.fulfilled.match(result)) {
      toast.success("Job match updated");
    } else {
      toast.error((result.payload as string) || "Could not calculate the match.");
    }
  };

  // Loading state
  if (status === "loading" && !current) {
    return <LoadingState message="Analyzing your resume…" className="py-24" />;
  }

  // No analysis yet (server 404) or a real failure: offer to run it
  if (!current) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <EmptyState
          icon={FileSearch}
          title="No analysis yet"
          description={error || "This resume hasn't been analyzed yet."}
          action={
            <div className="flex flex-col items-center gap-3">
              <Button onClick={handleRun} loading={status === "loading"}>
                {status === "loading" ? "Analyzing…" : "Run analysis"}
              </Button>
              <Button
                to="/dashboard"
                variant="ghost"
                size="sm"
                leftIcon={<ArrowLeft className="h-4 w-4" aria-hidden="true" />}
              >
                Back to dashboard
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  const { aiInsights } = current;
  const aiUnavailable = aiInsights.modelVersion === "unavailable";

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:space-y-8 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">ATS Report</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRun}
            loading={status === "loading"}
            leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
          >
            {status === "loading" ? "Re-running…" : "Re-run analysis"}
          </Button>
          <Button
            to="/dashboard"
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" aria-hidden="true" />}
          >
            Back
          </Button>
        </div>
      </div>

      {/* Overall score + summary */}
      <Card
        as="section"
        data-aos="fade-up"
        className="flex flex-col items-center gap-5 text-center sm:flex-row sm:gap-6 sm:text-left"
      >
        <CircularScore score={current.overallScore} />
        <p className="text-slate-300">{current.summary}</p>
      </Card>

      {aiUnavailable && (
        <p
          role="status"
          className="flex items-start gap-2 rounded-lg border border-amber-900/60 bg-amber-950/30 px-3 py-2 text-xs text-amber-300"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          AI insights are unavailable right now. This score is based on the rule-based checks only.
        </p>
      )}

      {/* Section breakdown */}
      <Card as="section" data-aos="fade-up" className="space-y-4">
        <h2 className="font-medium">Section breakdown</h2>
        {Object.entries(current.sectionScores).map(([key, value]) => (
          <ProgressBar key={key} label={key} value={value} max={SECTION_MAX[key] ?? 10} />
        ))}
      </Card>

      {/* Strengths / weaknesses / suggestions */}
      <section className="grid gap-4 md:grid-cols-3" data-aos="fade-up">
        <ListCard
          title="Strengths"
          items={current.strengths}
          tone="text-emerald-300"
          icon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
        />
        <ListCard
          title="Weaknesses"
          items={current.weaknesses}
          tone="text-red-300"
          icon={<AlertTriangle className="h-4 w-4" aria-hidden="true" />}
        />
        <ListCard
          title="Suggestions"
          items={current.suggestions}
          tone="text-cyan-300"
          icon={<Lightbulb className="h-4 w-4" aria-hidden="true" />}
        />
      </section>

      {/* Extracted skills */}
      {aiInsights.extractedSkills.length > 0 && (
        <Card as="section" data-aos="fade-up">
          <h2 className="mb-3 font-medium">Skills detected</h2>
          <div className="flex flex-wrap gap-2">
            {aiInsights.extractedSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Job description match */}
      <Card as="section" data-aos="fade-up" className="space-y-4">
        <h2 className="font-medium">Match against a job description</h2>
        <SemanticMatchGauge value={aiInsights.semanticJobMatch} />
        <label htmlFor="job-description" className="sr-only">
          Job description
        </label>
        <textarea
          id="job-description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={6}
          placeholder="Paste the job description here (at least 30 characters)…"
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100
            focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        {jobMatchError && (
          <p role="alert" className="text-sm text-red-400">
            {jobMatchError}
          </p>
        )}
        <Button
          onClick={handleJobMatch}
          loading={jobMatchStatus === "loading"}
          disabled={jobDescription.trim().length < 30}
          leftIcon={<Target className="h-4 w-4" aria-hidden="true" />}
        >
          {jobMatchStatus === "loading" ? "Calculating…" : "Check match"}
        </Button>
      </Card>
    </div>
  );
}

function ListCard({
  title,
  items,
  tone,
  icon,
}: {
  title: string;
  items: string[];
  tone: string;
  icon: ReactNode;
}) {
  return (
    <Card className="p-4 sm:p-4">
      <h3 className={`mb-2 flex items-center gap-2 font-medium ${tone}`}>
        {icon}
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">Nothing to show.</p>
      ) : (
        <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}
