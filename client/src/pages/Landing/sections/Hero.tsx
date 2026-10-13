import { ArrowRight, CheckCircle2, Sparkles, Zap } from "lucide-react";
import { useAppSelector } from "../../../app/hooks";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import AuroraBackground from "../../../components/layout/AuroraBackground";
import CircularScore from "../../../components/charts/CircularScore";
import ProgressBar from "../../../components/charts/ProgressBar";

export default function Hero() {
  const { user, token } = useAppSelector((state) => state.auth);
  const isAuthed = Boolean(user || token);

  return (
    <section className="relative isolate overflow-hidden">
      <AuroraBackground />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:py-32">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <span className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/60 px-3.5 py-1.5 text-xs text-slate-300 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
            AI-powered ATS analysis
          </span>

          <h1
            className="animate-fade-up text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "100ms" }}
          >
            Make your resume <span className="text-gradient-animated">ATS-ready</span>
          </h1>

          <p
            className="animate-fade-up mx-auto mt-6 max-w-md text-base text-slate-400 sm:text-lg lg:mx-0"
            style={{ animationDelay: "200ms" }}
          >
            Upload your resume, get an instant ATS score, and see exactly what to fix.
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start"
            style={{ animationDelay: "300ms" }}
          >
            {isAuthed ? (
              <Button
                to="/dashboard"
                size="lg"
                rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              >
                Go to dashboard
              </Button>
            ) : (
              <>
                <Button
                  to="/register"
                  size="lg"
                  rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                >
                  Get started
                </Button>
                <Button to="/login" variant="secondary" size="lg">
                  Log in
                </Button>
              </>
            )}
            <Button
              to="/try"
              variant="ghost"
              size="lg"
              leftIcon={<Zap className="h-4 w-4 text-cyan-400" aria-hidden="true" />}
            >
              Try it free
            </Button>
          </div>
        </div>

        {/* Illustrative report preview (clearly labelled as a sample) */}
        <div
          className="animate-fade-up relative mx-auto w-full max-w-md"
          style={{ animationDelay: "250ms" }}
        >
          <div
            aria-hidden="true"
            className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-r from-cyan-500/20 to-violet-500/20 blur-2xl"
          />

          <Card className="animate-float border-slate-700/60 shadow-2xl shadow-violet-500/10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Sample report preview
            </p>
            <div className="flex items-center gap-5">
              <CircularScore score={82} size={110} />
              <p className="text-sm text-slate-300">
                Strong structure and skills. Add measurable results to your experience section.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <ProgressBar label="skills" value={10} max={12} />
              <ProgressBar label="experience" value={11} max={15} />
              <ProgressBar label="education" value={8} max={8} />
            </div>
          </Card>

          {/* floating chips */}
          <div
            aria-hidden="true"
            className="animate-float absolute -right-2 -top-5 flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-slate-900/90 px-3 py-1.5 text-xs text-emerald-300 shadow-lg backdrop-blur [animation-delay:-2s] sm:-right-6"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            ATS-friendly
          </div>
          <div
            aria-hidden="true"
            className="animate-float absolute -bottom-5 -left-2 flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-slate-900/90 px-3 py-1.5 text-xs text-cyan-300 shadow-lg backdrop-blur [animation-delay:-4s] sm:-left-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI insights
          </div>
        </div>
      </div>
    </section>
  );
}
