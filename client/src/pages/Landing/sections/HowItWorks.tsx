import { Gauge, Target, UploadCloud } from "lucide-react";
import SectionHeading from "../../../components/ui/SectionHeading";

const steps = [
  {
    icon: UploadCloud,
    title: "Upload your PDF",
    text: "Drop in your resume. No account is needed for a quick free check.",
  },
  {
    icon: Gauge,
    title: "Get your score",
    text: "Receive your ATS score, section breakdown, strengths and weaknesses.",
  },
  {
    icon: Target,
    title: "Fix and match",
    text: "Apply the suggestions, then compare your resume against a job description.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div data-aos="fade-up">
          <SectionHeading
            eyebrow="How it works"
            title="Three simple steps"
            description="Go from upload to a clear action plan in under a minute."
          />
        </div>
        <ol className="relative mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
          <div
            aria-hidden="true"
            className="absolute left-[16.7%] right-[16.7%] top-7 hidden border-t-2 border-dashed border-slate-700 md:block"
          />
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="group relative text-center"
              data-aos="fade-up"
              data-aos-delay={i * 120}
            >
              <span className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/30 ring-4 ring-slate-950 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-3 group-hover:scale-110">
                <s.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-cyan-400">
                Step {i + 1}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-100">{s.title}</h3>
              <p className="mx-auto mt-1 max-w-xs text-sm text-slate-400">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
