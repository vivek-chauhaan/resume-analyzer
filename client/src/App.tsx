import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchProfile } from "./features/auth/authSlice";

export default function App() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);

  // On a fresh page load we have a token in localStorage but no `user` yet
  // (Redux state starts empty). Fetch the profile once to rehydrate it.
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [token, user, dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}
