// Decorative animated background. The parent needs `relative isolate`
// (and usually `overflow-hidden`) so the blobs stay behind its content.
export default function AuroraBackground({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div className="bg-grid absolute inset-0" />
      <div className="animate-blob absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/25 blur-3xl sm:h-96 sm:w-96" />
      <div className="animate-blob absolute -right-24 top-10 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl [animation-delay:-5s] sm:h-96 sm:w-96" />
      <div className="animate-blob absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl [animation-delay:-9s]" />
    </div>
  );
}
