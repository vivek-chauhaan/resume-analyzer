import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

// Fades each page in when the route changes.
export default function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="animate-page-in">
      {children}
    </div>
  );
}
