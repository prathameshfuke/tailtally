import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef, useState } from "react";

interface MDInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
}

export const MDInput = forwardRef<HTMLInputElement, MDInputProps>(
  ({ label, helperText, error, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);
    
    return (
      <div className={cn("w-full", className)}>
        <div
          className={cn(
            "relative rounded-t-lg bg-[hsl(var(--md-surface-variant))] border-b-2 transition-all duration-200",
            error 
              ? "border-[hsl(var(--md-error))]" 
              : isFocused 
                ? "border-[hsl(var(--md-primary))]" 
                : "border-[hsl(var(--md-outline))]"
          )}
        >
          <label
            className={cn(
              "absolute left-4 transition-all duration-200 pointer-events-none",
              isFocused || hasValue
                ? "top-2 text-label-small"
                : "top-4 text-body-small",
              error
                ? "text-[hsl(var(--md-error))]"
                : isFocused
                  ? "text-[hsl(var(--md-primary))]"
                  : "text-[hsl(var(--md-on-surface-variant))]"
            )}
          >
            {label}
          </label>
          <input
            ref={ref}
            className={cn(
              "w-full bg-transparent px-4 pt-6 pb-2 text-body-large text-[hsl(var(--md-on-surface))] outline-none",
              "placeholder:text-[hsl(var(--md-on-surface-variant))]"
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              setHasValue(!!e.target.value);
            }}
            onChange={(e) => {
              setHasValue(!!e.target.value);
              props.onChange?.(e);
            }}
            {...props}
          />
        </div>
        {(helperText || error) && (
          <p
            className={cn(
              "mt-1 px-4 text-body-small",
              error ? "text-[hsl(var(--md-error))]" : "text-[hsl(var(--md-on-surface-variant))]"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

MDInput.displayName = "MDInput";
