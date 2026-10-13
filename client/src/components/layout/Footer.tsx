import { Link } from "react-router-dom";
import { Briefcase, Code, FileText, Globe, Mail, type LucideIcon } from "lucide-react";
import { useAppSelector } from "../../app/hooks";
import { siteConfig } from "../../config/site";

const socialIcons: Record<string, LucideIcon> = {
  code: Code,
  briefcase: Briefcase,
  globe: Globe,
};

const productLinks = [
  { label: "Features", to: "/#features" },
  { label: "How it works", to: "/#how-it-works" },
  { label: "FAQ", to: "/#faq" },
  { label: "Contact", to: "/#contact" },
];

export default function Footer() {
  const { user, token } = useAppSelector((state) => state.auth);
  const isAuthed = Boolean(user || token);

  const accountLinks = isAuthed
    ? [
        { label: "Dashboard", to: "/dashboard" },
        { label: "Upload resume", to: "/upload" },
        { label: "Profile", to: "/profile" },
      ]
    : [
        { label: "Log in", to: "/login" },
        { label: "Sign up", to: "/register" },
        { label: "Try it free", to: "/try" },
      ];

  const socials = siteConfig.socials.filter((s) => s.href);
  const linkClass =
    "inline-block rounded text-sm text-slate-400 transition-all duration-200 hover:translate-x-1 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400";
  const iconClass =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400 transition duration-200 hover:-translate-y-1 hover:border-cyan-500/50 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400";

  return (
    <footer className="relative border-t border-slate-800 bg-slate-950">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent"
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500">
              <FileText className="h-4 w-4 text-white" aria-hidden="true" />
            </span>
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text font-semibold text-transparent">
              {siteConfig.name}
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-slate-400">{siteConfig.tagline}</p>

          <div className="mt-5 flex items-center gap-2">
            <a href={`mailto:${siteConfig.email}`} aria-label="Email us" className={iconClass}>
              <Mail className="h-4 w-4" aria-hidden="true" />
            </a>
            {socials.map((s) => {
              const Icon = socialIcons[s.icon];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={iconClass}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>

        <nav aria-label="Product">
          <h2 className="mb-3 text-sm font-semibold text-slate-200">Product</h2>
          <ul className="space-y-2">
            {productLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Account">
          <h2 className="mb-3 text-sm font-semibold text-slate-200">Account</h2>
          <ul className="space-y-2">
            {accountLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-slate-800">
        <p className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-slate-500 sm:px-6">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
