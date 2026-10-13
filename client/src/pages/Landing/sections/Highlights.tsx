// Highlights are facts about how the product works (not invented usage numbers).
const highlights = [
  { value: "0–100", label: "Overall ATS score" },
  { value: "6", label: "Resume sections scored" },
  { value: "AI + rules", label: "Hybrid analysis" },
  { value: "PDF", label: "Upload format" },
];

export default function Highlights() {
  return (
    <section aria-label="Highlights" className="border-y border-slate-800 bg-slate-900/30 px-4 py-12 backdrop-blur-sm sm:px-6 sm:py-14">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-slate-800">
        {highlights.map((h, i) => (
          <div key={h.label} className="flex flex-col px-2" data-aos="fade-up" data-aos-delay={i * 100}>
            <dt className="order-2 mt-1 text-sm text-slate-400">{h.label}</dt>
            <dd className="order-1 bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl lg:text-5xl">
              {h.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
