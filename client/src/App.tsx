import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AOS from "aos";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollManager from "./components/layout/ScrollManager";
import PageTransition from "./components/layout/PageTransition";
import ScrollToTop from "./components/layout/ScrollToTop";
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

  // Scroll animations: run once per element, respect "reduce motion"
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }, []);

  return (
    <BrowserRouter>
      <ScrollManager />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen flex-col overflow-x-clip">
        <Navbar />
        <main id="main-content" className="flex-1">
          <PageTransition>
            <AppRoutes />
          </PageTransition>
        </main>
        <Footer />
      </div>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#0f172a",
            color: "#e2e8f0",
            border: "1px solid #1e293b",
            fontSize: "0.875rem",
          },
          success: { iconTheme: { primary: "#22d3ee", secondary: "#0f172a" } },
          error: { iconTheme: { primary: "#f87171", secondary: "#0f172a" } },
        }}
      />
    </BrowserRouter>
  );
}
