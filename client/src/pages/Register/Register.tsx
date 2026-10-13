import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, User, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { registerUser, clearAuthError } from "../../features/auth/authSlice";
import FormInput from "../../components/forms/FormInput";
import Button from "../../components/ui/Button";
import AuroraBackground from "../../components/layout/AuroraBackground";
import { RegisterPayload } from "../../types/auth.types";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPayload>();

  const onSubmit = async (data: RegisterPayload) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created. Welcome aboard!");
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
          <UserPlus className="h-5 w-5 text-white" aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-semibold text-center mb-1">Create your account</h1>
        <p className="mb-6 text-center text-sm text-slate-400">
          Save your resumes and track your scores.
        </p>

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
            label="Full name"
            type="text"
            icon={User}
            autoComplete="name"
            error={errors.name?.message}
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
            })}
          />
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
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Must be at least 6 characters" },
            })}
          />

          <Button
            type="submit"
            fullWidth
            loading={status === "loading"}
            leftIcon={<UserPlus className="h-4 w-4" aria-hidden="true" />}
            className="mt-2 py-2.5"
          >
            {status === "loading" ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-center text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
