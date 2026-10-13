interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}

export default function SectionHeading({
  title,
  eyebrow,
  description,
  align = "center",
  as: Heading = "h2",
  className = "",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";
  return (
    <div className={`max-w-2xl ${alignment} ${className}`}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
          {eyebrow}
        </p>
      )}
      <Heading className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
        {title}
      </Heading>
      {description && <p className="mt-3 text-sm text-slate-400 sm:text-base">{description}</p>}
    </div>
  );
}
