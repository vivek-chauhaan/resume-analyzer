// Single place to edit brand + contact details.
// Social entries with an empty `href` are hidden automatically.
export const siteConfig = {
  name: "Resume Analyzer",
  tagline: "Instant ATS scoring and clear, actionable fixes for your resume.",
  email: "hello@example.com", // TODO: replace with your real contact email
  socials: [
    { label: "GitHub", href: "", icon: "code" },
    { label: "LinkedIn", href: "", icon: "briefcase" },
    { label: "Website", href: "", icon: "globe" },
  ] as { label: string; href: string; icon: "code" | "briefcase" | "globe" }[],
};
