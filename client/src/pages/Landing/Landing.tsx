import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
        Resume Analyzer
      </h1>
      <p className="text-slate-400 max-w-md">
        Upload your resume, get an instant ATS score, and see exactly what to
        fix.
      </p>
      <div className="flex gap-3">
        <Link
          to="/register"
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Get started
        </Link>
        <Link
          to="/login"
          className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-500"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
