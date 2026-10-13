import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { to?: undefined };

type ButtonAsLink = CommonProps & {
  to: string;
  onClick?: () => void;
  "aria-label"?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "group relative overflow-hidden bg-gradient-to-r from-cyan-500 via-violet-500 to-cyan-500 bg-[length:200%_100%] text-white shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 hover:bg-right hover:shadow-xl hover:shadow-violet-500/30 active:translate-y-0",
  secondary:
    "border border-slate-700 text-slate-200 hover:-translate-y-0.5 hover:border-cyan-500/50 hover:bg-slate-800/60 active:translate-y-0",
  ghost: "text-slate-300 hover:bg-slate-800/60 hover:text-white",
  danger: "border border-red-800 text-red-400 hover:bg-red-950/40",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = "primary",
    size = "md",
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = "",
    children,
  } = props;

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`;

  const content = (
    <>
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -translate-x-full bg-white/25 group-hover:animate-shine"
        />
      )}
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </>
  );

  if (props.to !== undefined) {
    return (
      <Link
        to={props.to}
        onClick={props.onClick}
        aria-label={props["aria-label"]}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  const {
    // strip our custom props so they don't reach the DOM
    variant: _v,
    size: _s,
    loading: _l,
    fullWidth: _f,
    leftIcon: _li,
    rightIcon: _ri,
    className: _c,
    children: _ch,
    to: _to,
    disabled,
    type = "button",
    ...rest
  } = props;

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
    >
      {content}
    </button>
  );
}
