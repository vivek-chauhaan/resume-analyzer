import { forwardRef, useId, useState, InputHTMLAttributes } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
}

// forwardRef is required so react-hook-form's register() can attach its ref
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon: Icon, type, ...rest }, ref) => {
    const errorId = useId();
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <label className="block text-left mb-4">
        <span className="text-sm text-slate-300">{label}</span>
        <div className="relative mt-1">
          {Icon && (
            <Icon
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />
          )}
          <input
            ref={ref}
            {...rest}
            type={isPassword && showPassword ? "text" : type}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={`w-full rounded-lg bg-slate-900 border py-2 text-slate-100 transition
              focus:outline-none focus:ring-2 focus:ring-cyan-500
              ${Icon ? "pl-9" : "pl-3"} ${isPassword ? "pr-10" : "pr-3"}
              ${error ? "border-red-500" : "border-slate-700"}`}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
        {error && (
          <span id={errorId} role="alert" className="mt-1 block text-xs text-red-400">
            {error}
          </span>
        )}
      </label>
    );
  }
);

FormInput.displayName = "FormInput";
export default FormInput;
