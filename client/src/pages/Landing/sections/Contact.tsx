import { Mail } from "lucide-react";
import Card from "../../../components/ui/Card";
import SectionHeading from "../../../components/ui/SectionHeading";
import { siteConfig } from "../../../config/site";

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 px-4 pb-20 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div data-aos="fade-up">
          <SectionHeading
            eyebrow="Contact"
            title="Questions or feedback?"
            description="We'd love to hear from you."
          />
        </div>
        <Card hoverable className="mt-8 text-center" data-aos="fade-up" data-aos-delay="100">
          <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-400">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="text-sm text-slate-400">Email us at</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-1 inline-block rounded text-base font-medium text-cyan-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            {siteConfig.email}
          </a>
        </Card>
      </div>
    </section>
  );
}
