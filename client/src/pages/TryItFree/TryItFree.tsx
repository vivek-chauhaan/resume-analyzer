import { useState } from "react";
import { Link } from "react-router-dom";
import UploadBox from "../../components/upload/UploadBox";
import CircularScore from "../../components/charts/CircularScore";
import ProgressBar from "../../components/charts/ProgressBar";
import { analyzeGuestResumeRequest } from "../../api/publicAnalysis.api";

const SECTION_MAX: Record<string, number> = {
  contact: 10,
  skills: 12,
  education: 8,
  experience: 15,
  projects: 8,
  certifications: 5,
};

export default function TryItFree() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const handleFile = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeGuestResumeRequest(file);
      setResult(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">
        Try it free — no account needed
      </h1>
      <p className="text-slate-400 text-sm mb-6">
        This result won&apos;t be saved.{" "}
        <Link to="/register" className="text-cyan-400 hover:underline">
          Sign up
        </Link>{" "}
        to keep your history and re-check your score over time.
      </p>

      {!result && (
        <>
          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
          <UploadBox onFileSelected={handleFile} disabled={loading} />
          {loading && <p className="mt-4 text-sm text-slate-400">Analyzing…</p>}
        </>
      )}

      {result && (
        <div className="space-y-6">
          <div className="flex items-center gap-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <CircularScore score={result.overallScore} />
            <p className="text-slate-300">{result.summary}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            {Object.entries(result.sectionScores).map(([key, value]) => (
              <ProgressBar
                key={key}
                label={key}
                value={value as number}
                max={SECTION_MAX[key] ?? 10}
              />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/register"
              className="inline-block rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2.5 text-sm font-medium text-white"
            >
              Sign up to save this and analyze more resumes
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
