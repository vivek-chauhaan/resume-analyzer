export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
        Resume Analyzer
      </h1>
      <p className="text-slate-400 max-w-md">
        Upload your resume, get an instant ATS score, and see exactly what to fix. Day 1
        scaffold — auth pages arrive Day 2.
      </p>
    </div>
  );
}
