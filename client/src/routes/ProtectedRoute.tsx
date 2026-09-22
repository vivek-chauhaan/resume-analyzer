import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

// Wrap any set of routes that require a logged-in user.
// Checks the token, not `user` — `user` may still be loading via fetchProfile.
export default function ProtectedRoute() {
  const { token } = useAppSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
