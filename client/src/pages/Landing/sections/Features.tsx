import { Gauge, LayoutDashboard, Lightbulb, ListChecks, Sparkles, Target } from "lucide-react";
import Card from "../../../components/ui/Card";
import SectionHeading from "../../../components/ui/SectionHeading";

const features = [
  {
    icon: Gauge,
    title: "Instant ATS score",
    text: "Get an overall 0–100 score showing how well your resume will read to applicant tracking systems.",
  },
  {
    icon: ListChecks,
    title: "Section breakdown",
    text: "See how contact, skills, education, experience, projects and certifications each score.",
  },
  {
    icon: Lightbulb,
    title: "Clear next steps",
    text: "Every report lists your strengths, weaknesses and specific suggestions to improve.",
  },
  {
    icon: Sparkles,
    title: "AI skill detection",
    text: "AI insights pull the skills out of your resume so you can check nothing important is missing.",
  },
  {
    icon: Target,
    title: "Job description match",
    text: "Paste a job description and see how closely your resume matches it.",
  },
  {
    icon: LayoutDashboard,
    title: "Your resume dashboard",
    text: "Keep every upload in one place and track your average and best scores over time.",
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div data-aos="fade-up">
          <SectionHeading
            eyebrow="Features"
            title="Everything you need to fix your resume"
            description="From a quick score to a role-specific match, all in one place."
          />
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Card
              key={f.title}
              hoverable
              className="group relative overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={(i % 3) * 100}
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <div
                aria-hidden="true"
                className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-500/10 blur-2xl transition-opacity duration-300 group-hover:bg-cyan-500/20"
              />
              <span className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-400 ring-1 ring-white/5 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
                <f.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="relative font-semibold text-slate-100">{f.title}</h3>
              <p className="relative mt-1.5 text-sm leading-relaxed text-slate-400">{f.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
