import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginUser, clearAuthError } from "../../features/auth/authSlice";
import FormInput from "../../components/forms/FormInput";
import Button from "../../components/ui/Button";
import AuroraBackground from "../../components/layout/AuroraBackground";
import { LoginPayload } from "../../types/auth.types";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>();

  const onSubmit = async (data: LoginPayload) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="relative isolate flex items-center justify-center overflow-hidden px-4 py-12 sm:py-20">
      <AuroraBackground />
      <div
        data-aos="fade-up"
        className="w-full max-w-sm bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-violet-500/10 ring-1 ring-white/5"
      >
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 shadow-lg shadow-cyan-500/30">
          <LogIn className="h-5 w-5 text-white" aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-semibold text-center mb-1">Welcome back</h1>
        <p className="mb-6 text-center text-sm text-slate-400">Log in to see your resume reports.</p>

        {error && (
          <p
            role="alert"
            className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2"
          >
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          onFocus={() => error && dispatch(clearAuthError())}
          noValidate
        >
          <FormInput
            label="Email"
            type="email"
            icon={Mail}
            autoComplete="email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
          />
          <FormInput
            label="Password"
            type="password"
            icon={Lock}
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password", { required: "Password is required" })}
          />

          <Button
            type="submit"
            fullWidth
            loading={status === "loading"}
            leftIcon={<LogIn className="h-4 w-4" aria-hidden="true" />}
            className="mt-2 py-2.5"
          >
            {status === "loading" ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-center text-slate-400">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
