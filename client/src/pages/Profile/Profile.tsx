import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!user) return null; // ProtectedRoute guarantees this shouldn't happen

  return (
    <div className="min-h-screen px-6 py-10 max-w-md">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>
      <div className="space-y-2 text-slate-300">
        <p>
          <span className="text-slate-500">Name:</span> {user.name}
        </p>
        <p>
          <span className="text-slate-500">Email:</span> {user.email}
        </p>
        <p>
          <span className="text-slate-500">Resumes analyzed:</span> {user.resumeCount}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="mt-6 rounded-lg border border-red-800 text-red-400 px-4 py-2 hover:bg-red-950/40 transition"
      >
        Log out
      </button>
    </div>
  );
}
