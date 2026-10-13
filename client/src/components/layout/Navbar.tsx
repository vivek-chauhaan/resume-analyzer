import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CircleHelp,
  FileText,
  Home,
  LayoutDashboard,
  ListOrdered,
  LogIn,
  Menu,
  Sparkles,
  Upload,
  User,
  UserPlus,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useAppSelector } from "../../app/hooks";
import Button from "../ui/Button";

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

const guestLinks: NavItem[] = [
  { label: "Home", to: "/", icon: Home },
  { label: "Features", to: "/#features", icon: Sparkles },
  { label: "How it works", to: "/#how-it-works", icon: ListOrdered },
  { label: "FAQ", to: "/#faq", icon: CircleHelp },
  { label: "Try it free", to: "/try", icon: Zap },
];

const authLinks: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Upload", to: "/upload", icon: Upload },
  { label: "Profile", to: "/profile", icon: User },
];

// Items like "/#features" are active only when both path and hash match.
function isActive(item: NavItem, pathname: string, hash: string): boolean {
  const [path, itemHash] = item.to.split("#");
  if (pathname !== (path || "/")) return false;
  return hash === (itemHash ? `#${itemHash}` : "");
}

export default function Navbar() {
  const { user, token } = useAppSelector((state) => state.auth);
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // A stored token means the user is signed in even while `user` is still loading.
  const isAuthed = Boolean(user || token);
  const links = isAuthed ? authLinks : guestLinks;

  // Close the mobile menu after any navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname, hash]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Stronger border/shadow once the page is scrolled
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      // reading-progress bar: updated directly on the element to avoid re-renders
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const desktopLink = (item: NavItem) =>
    `relative rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
     after:absolute after:inset-x-3 after:bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-gradient-to-r after:from-cyan-400 after:to-violet-500 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
      isActive(item, pathname, hash)
        ? "text-white after:scale-x-100"
        : "text-slate-400 hover:text-white after:scale-x-0"
    }`;

  const mobileLink = (item: NavItem) =>
    `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
      isActive(item, pathname, hash)
        ? "bg-slate-800/80 text-white"
        : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
        scrolled
          ? "border-slate-800 bg-slate-950/90 shadow-lg shadow-black/20"
          : "border-slate-800/60 bg-slate-950/70"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="group flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 shadow-md shadow-cyan-500/30 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
            <FileText className="h-4 w-4 text-white" aria-hidden="true" />
          </span>
          <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text font-semibold text-transparent">
            Resume Analyzer
          </span>
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                aria-current={isActive(item, pathname, hash) ? "page" : undefined}
                className={desktopLink(item)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          {isAuthed ? (
            <Button to="/upload" size="sm" leftIcon={<Upload className="h-4 w-4" aria-hidden="true" />}>
              Upload resume
            </Button>
          ) : (
            <>
              <Button to="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button to="/register" size="sm">
                Sign up
              </Button>
            </>
          )}
        </div>

        {/* Hamburger (mobile + tablet) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-800/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 lg:hidden"
        >
          <span className="relative h-5 w-5">
            <Menu
              className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
              }`}
              aria-hidden="true"
            />
            <X
              className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
              }`}
              aria-hidden="true"
            />
          </span>
        </button>
      </nav>

      {/* Mobile panel: animates height via grid rows (0fr -> 1fr) */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`grid transition-all duration-300 ease-out lg:hidden ${
          open ? "visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="space-y-1 border-t border-slate-800 px-4 pb-2 pt-3 sm:px-6">
            {links.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={isActive(item, pathname, hash) ? "page" : undefined}
                  className={mobileLink(item)}
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-3 px-4 pb-4 pt-2 sm:px-6">
            {isAuthed ? (
              <Button
                to="/upload"
                fullWidth
                leftIcon={<Upload className="h-4 w-4" aria-hidden="true" />}
              >
                Upload resume
              </Button>
            ) : (
              <>
                <Button
                  to="/login"
                  variant="secondary"
                  fullWidth
                  leftIcon={<LogIn className="h-4 w-4" aria-hidden="true" />}
                >
                  Log in
                </Button>
                <Button
                  to="/register"
                  fullWidth
                  leftIcon={<UserPlus className="h-4 w-4" aria-hidden="true" />}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reading progress */}
      <div
        ref={barRef}
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500"
      />
    </header>
  );
}
