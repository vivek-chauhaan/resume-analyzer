import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AOS from "aos";

// Renders nothing. On every navigation it:
//  - scrolls to the #hash target if there is one, otherwise back to the top
//  - re-scans the DOM so AOS animates elements on the newly rendered page
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, hash]);

  useEffect(() => {
    const t = window.setTimeout(() => AOS.refreshHard(), 100);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return null;
}
