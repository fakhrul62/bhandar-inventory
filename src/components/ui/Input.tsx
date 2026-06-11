import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-neutral-800">
          {label}
        </label>
      )}
      <input
        className={`rounded-lg border bg-white px-4 py-3 text-sm font-medium text-neutral-950 transition-all duration-200 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 ${
          error ? "border-red-500 focus:ring-red-500" : "border-neutral-300 focus:border-neutral-950"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && <p className="text-sm text-neutral-500">{helperText}</p>}
    </div>
  );
}
