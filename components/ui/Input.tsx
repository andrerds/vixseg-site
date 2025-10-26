import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
    const hasError = !!error;

    return (
      <div className="w-full">
        <div className="relative">
          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "peer w-full px-4 pt-6 pb-2 text-base rounded-lg border-2 transition-all duration-200",
              "bg-white text-[var(--color-foreground)]",
              "focus:outline-none focus:ring-2 focus:ring-offset-1",
              "placeholder-transparent",
              "disabled:bg-gray-100 disabled:cursor-not-allowed",
              hasError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]",
              className
            )}
            placeholder={label}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />

          {/* Floating Label */}
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-4 top-4 text-sm transition-all duration-200 pointer-events-none",
              "peer-placeholder-shown:text-base peer-placeholder-shown:top-4",
              "peer-focus:text-sm peer-focus:top-2",
              "peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:top-2",
              hasError
                ? "text-red-500 peer-focus:text-red-500"
                : "text-gray-500 peer-focus:text-[var(--color-primary)]"
            )}
          >
            {label}
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div
            id={`${inputId}-error`}
            className="flex items-center gap-1 mt-2 text-sm text-red-600"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-2 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
