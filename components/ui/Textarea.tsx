import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, rows = 4, ...props }, ref) => {
    const textareaId =
      id || `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;
    const hasError = !!error;

    return (
      <div className="w-full">
        <div className="relative">
          {/* Textarea */}
          <textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            className={cn(
              "peer w-full px-4 pt-6 pb-2 text-base rounded-lg border-2 transition-all duration-200",
              "bg-white text-[var(--color-foreground)]",
              "focus:outline-none focus:ring-2 focus:ring-offset-1",
              "placeholder-transparent resize-y",
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
                ? `${textareaId}-error`
                : helperText
                ? `${textareaId}-helper`
                : undefined
            }
            {...props}
          />

          {/* Floating Label */}
          <label
            htmlFor={textareaId}
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
            id={`${textareaId}-error`}
            className="flex items-center gap-1 mt-2 text-sm text-red-600"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="mt-2 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
