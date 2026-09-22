import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

export default function Navbar() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
      <Link to="/" className="font-semibold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
        Resume Analyzer
      </Link>
      <div className="flex items-center gap-4 text-sm">
        {user ? (
          <>
            <Link to="/dashboard" className="text-slate-300 hover:text-white">
              Dashboard
            </Link>
            <Link to="/profile" className="text-slate-300 hover:text-white">
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-300 hover:text-white">
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-3 py-1.5 text-white"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
