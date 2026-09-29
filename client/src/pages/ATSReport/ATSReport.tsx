import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

  const handleRun = () => dispatch(runAnalysis(id));
  const handleJobMatch = () => dispatch(runJobMatch({ resumeId: id, jobDescription }));

  // Loading state
  if (status === "loading" && !current) {
    return <p className="px-6 py-10 text-slate-400">Analyzing your resume…</p>;
  }

  // No analysis yet (server 404) or a real failure: offer to run it
  if (!current) {
    return (
      <div className="px-6 py-10 max-w-xl mx-auto text-center">
        <p className="text-slate-400 mb-4">
          {error || "This resume hasn't been analyzed yet."}
        </p>
        <button
          onClick={handleRun}
          disabled={status === "loading"}
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2 text-white disabled:opacity-50"
        >
          {status === "loading" ? "Analyzing…" : "Run analysis"}
        </button>
        <div className="mt-4">
          <Link to="/dashboard" className="text-sm text-cyan-400 hover:underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { aiInsights } = current;
  const aiUnavailable = aiInsights.modelVersion === "unavailable";

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">ATS Report</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRun}
            disabled={status === "loading"}
            className="text-sm text-cyan-400 hover:underline disabled:opacity-50"
          >
            {status === "loading" ? "Re-running…" : "Re-run analysis"}
          </button>
          <Link to="/dashboard" className="text-sm text-slate-400 hover:text-white">
            Back
          </Link>
        </div>
      </div>

      {/* Overall score + summary */}
      <section className="flex items-center gap-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <CircularScore score={current.overallScore} />
        <p className="text-slate-300">{current.summary}</p>
      </section>

      {aiUnavailable && (
        <p className="text-xs text-amber-400">
          AI insights are unavailable right now. This score is based on the rule-based checks only.
        </p>
      )}

      {/* Section breakdown */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <h2 className="font-medium">Section breakdown</h2>
        {Object.entries(current.sectionScores).map(([key, value]) => (
          <ProgressBar key={key} label={key} value={value} max={SECTION_MAX[key] ?? 10} />
        ))}
      </section>

      {/* Strengths / weaknesses / suggestions */}
      <section className="grid gap-4 md:grid-cols-3">
        <ListCard title="Strengths" items={current.strengths} tone="text-emerald-300" />
        <ListCard title="Weaknesses" items={current.weaknesses} tone="text-red-300" />
        <ListCard title="Suggestions" items={current.suggestions} tone="text-cyan-300" />
      </section>

      {/* Extracted skills */}
      {aiInsights.extractedSkills.length > 0 && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="font-medium mb-3">Skills detected</h2>
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
        </section>
      )}

      {/* Job description match */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <h2 className="font-medium">Match against a job description</h2>
        <SemanticMatchGauge value={aiInsights.semanticJobMatch} />
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={6}
          placeholder="Paste the job description here (at least 30 characters)…"
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100
            focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        {jobMatchError && <p className="text-sm text-red-400">{jobMatchError}</p>}
        <button
          onClick={handleJobMatch}
          disabled={jobMatchStatus === "loading" || jobDescription.trim().length < 30}
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-sm text-white
            disabled:opacity-50"
        >
          {jobMatchStatus === "loading" ? "Calculating…" : "Check match"}
        </button>
      </section>
    </div>
  );
}

function ListCard({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <h3 className={`font-medium mb-2 ${tone}`}>{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">Nothing to show.</p>
      ) : (
        <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}