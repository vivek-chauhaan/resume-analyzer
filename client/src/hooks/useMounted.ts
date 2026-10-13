import { useEffect, useState } from "react";

// Flips to true one frame after mount, so CSS transitions can run from their
// "empty" state (used by the progress bar and score ring).
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return mounted;
}
