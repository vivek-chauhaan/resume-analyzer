import { FileText, LogOut, Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("You've been logged out");
    navigate("/login");
  };

  if (!user) return null; // ProtectedRoute guarantees this shouldn't happen

  const rows = [
    { icon: User, label: "Name", value: user.name },
    { icon: Mail, label: "Email", value: user.email },
    { icon: FileText, label: "Resumes analyzed", value: user.resumeCount },
  ];

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold">Profile</h1>
      <Card data-aos="fade-up">
        <dl className="space-y-4">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-cyan-400">
                <r.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <dt className="text-xs text-slate-500">{r.label}</dt>
                <dd className="truncate text-slate-200">{r.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </Card>
      <Button
        variant="danger"
        onClick={handleLogout}
        className="mt-6"
        leftIcon={<LogOut className="h-4 w-4" aria-hidden="true" />}
      >
        Log out
      </Button>
    </div>
  );
}
