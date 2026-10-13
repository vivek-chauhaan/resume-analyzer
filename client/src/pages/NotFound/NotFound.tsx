import { Compass, Home } from "lucide-react";
import Button from "../../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-24 text-center">
      <Compass className="mb-2 h-10 w-10 text-cyan-400" aria-hidden="true" />
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-slate-400">Page not found.</p>
      <Button
        to="/"
        variant="secondary"
        className="mt-4"
        leftIcon={<Home className="h-4 w-4" aria-hidden="true" />}
      >
        Back to home
      </Button>
    </div>
  );
}
