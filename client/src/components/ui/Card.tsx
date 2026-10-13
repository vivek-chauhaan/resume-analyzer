import type { ElementType, HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "article";
  hoverable?: boolean;
  children: ReactNode;
}

// Shared surface used across pages. Extra props (e.g. data-aos) are forwarded.
export default function Card({
  as = "div",
  hoverable = false,
  className = "",
  children,
  ...rest
}: CardProps) {
  const Tag = as as ElementType;
  return (
    <Tag
      {...rest}
      className={`rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm sm:p-6 ${
        hoverable
          ? "transition duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/10"
          : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
