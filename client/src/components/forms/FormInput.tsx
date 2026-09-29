import { forwardRef, InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

// forwardRef is required so react-hook-form's register() can attach its ref
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, ...rest }, ref) => {
    return (
      <label className="block text-left mb-4">
        <span className="text-sm text-slate-300">{label}</span>
        <input
          ref={ref}
          {...rest}
          className={`mt-1 w-full rounded-lg bg-slate-900 border px-3 py-2 text-slate-100
            focus:outline-none focus:ring-2 focus:ring-cyan-500
            ${error ? "border-red-500" : "border-slate-700"}`}
        />
        {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
      </label>
    );
  }
);

FormInput.displayName = "FormInput";
export default FormInput;
