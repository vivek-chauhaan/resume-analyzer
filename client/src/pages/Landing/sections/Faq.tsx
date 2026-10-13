import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "../../../components/ui/SectionHeading";

const faqs = [
  {
    q: "Which file formats are supported?",
    a: "Only PDF files are accepted right now.",
  },
  {
    q: "Do I need an account?",
    a: "You can run a free one-off check without an account. That result isn't saved, so sign up if you want to keep your history and re-check your score over time.",
  },
  {
    q: "What happens if AI insights are unavailable?",
    a: "Your report is still generated. The score is then based on the rule-based checks only, and the report tells you when that is the case.",
  },
  {
    q: "Can I compare my resume to a job description?",
    a: "Yes. Open any report from your dashboard, paste the job description (at least 30 characters) and check the match.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div data-aos="fade-up">
          <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        </div>
        <div className="mt-10 space-y-3" data-aos="fade-up" data-aos-delay="100">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q} className="rounded-xl border border-slate-800 bg-slate-900/40">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    className="flex w-full items-center justify-between gap-4 rounded-xl px-4 py-4 text-left text-sm font-medium text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:px-5 sm:text-base"
                  >
                    {item.q}
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-button-${i}`}
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 text-sm text-slate-400 sm:px-5">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
