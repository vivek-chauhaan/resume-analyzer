import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { registerUser, clearAuthError } from "../../features/auth/authSlice";
import FormInput from "../../components/forms/FormInput";
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
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">Create your account</h1>

        {error && (
          <p className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} onFocus={() => error && dispatch(clearAuthError())}>
          <FormInput
            label="Full name"
            type="text"
            error={errors.name?.message}
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
            })}
          />
          <FormInput
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
          />
          <FormInput
            label="Password"
            type="password"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Must be at least 6 characters" },
            })}
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full mt-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 py-2.5
              font-medium text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {status === "loading" ? "Creating account..." : "Sign up"}
          </button>
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
