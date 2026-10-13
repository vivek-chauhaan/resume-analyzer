import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import UploadBox from "../../components/upload/UploadBox";
import CircularScore from "../../components/charts/CircularScore";
import ProgressBar from "../../components/charts/ProgressBar";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import LoadingState from "../../components/ui/LoadingState";
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
      toast.success("Analysis complete");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-2xl font-semibold">Try it free — no account needed</h1>
      <p className="mb-6 text-sm text-slate-400">
        This result won&apos;t be saved.{" "}
        <Link to="/register" className="text-cyan-400 hover:underline">
          Sign up
        </Link>{" "}
        to keep your history and re-check your score over time.
      </p>

      {!result && (
        <>
          {error && (
            <p
              role="alert"
              className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2"
            >
              {error}
            </p>
          )}
          <UploadBox onFileSelected={handleFile} disabled={loading} />
          {loading && <LoadingState message="Analyzing…" className="py-8" />}
        </>
      )}

      {result && (
        <div className="space-y-6">
          <Card
            data-aos="fade-up"
            className="flex flex-col items-center gap-5 text-center sm:flex-row sm:gap-6 sm:text-left"
          >
            <CircularScore score={result.overallScore} />
            <p className="text-slate-300">{result.summary}</p>
          </Card>

          <Card data-aos="fade-up" className="space-y-4">
            {Object.entries(result.sectionScores).map(([key, value]) => (
              <ProgressBar
                key={key}
                label={key}
                value={value as number}
                max={SECTION_MAX[key] ?? 10}
              />
            ))}
          </Card>

          <div className="text-center">
            <Button
              to="/register"
              size="lg"
              leftIcon={<UserPlus className="h-4 w-4" aria-hidden="true" />}
            >
              Sign up to save this and analyze more resumes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
