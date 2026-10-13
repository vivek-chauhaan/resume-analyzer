import { ArrowRight, Zap } from "lucide-react";
import Button from "../../../components/ui/Button";
import AuroraBackground from "../../../components/layout/AuroraBackground";

export default function CtaSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div
        data-aos="fade-up"
        className="animate-gradient-xy relative isolate mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-br from-cyan-500/10 via-violet-500/10 to-fuchsia-500/10 bg-[length:200%_200%] px-6 py-14 text-center shadow-2xl shadow-violet-500/10 sm:px-12 sm:py-16"
      >
        <AuroraBackground />
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
          Ready to see how your resume scores?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400 sm:text-base">
          Upload a PDF and get your ATS score and improvement tips in moments.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Button
            to="/register"
            size="lg"
            rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
          >
            Get started
          </Button>
          <Button
            to="/try"
            variant="secondary"
            size="lg"
            leftIcon={<Zap className="h-4 w-4" aria-hidden="true" />}
          >
            Try it free
          </Button>
        </div>
      </div>
    </section>
  );
}
