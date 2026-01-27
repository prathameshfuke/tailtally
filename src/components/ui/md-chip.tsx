import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { Check } from "lucide-react";

interface MDChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "assist" | "filter" | "input" | "suggestion";
  selected?: boolean;
  icon?: ReactNode;
  onRemove?: () => void;
  children?: ReactNode;
}

export const MDChip = forwardRef<HTMLButtonElement, MDChipProps>(
  ({ variant = "assist", selected = false, icon, onRemove, children, className, ...props }, ref) => {
    const variantClasses = {
      assist: cn(
        "border border-[hsl(var(--md-outline))]",
        selected 
          ? "bg-[hsl(var(--md-secondary-container))] text-[hsl(var(--md-on-secondary-container))]" 
          : "bg-transparent text-[hsl(var(--md-on-surface))]"
      ),
      filter: cn(
        "border",
        selected 
          ? "bg-[hsl(var(--md-secondary-container))] text-[hsl(var(--md-on-secondary-container))] border-transparent elevation-1" 
          : "border-[hsl(var(--md-outline))] bg-transparent text-[hsl(var(--md-on-surface-variant))]"
      ),
      input: "bg-transparent border border-[hsl(var(--md-outline))] text-[hsl(var(--md-on-surface-variant))]",
      suggestion: "bg-transparent border border-[hsl(var(--md-outline))] text-[hsl(var(--md-on-surface-variant))]",
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-label-large font-medium transition-all duration-200 hover:elevation-1 state-layer",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {selected && variant === "filter" && <Check className="w-4 h-4" />}
        {icon && <span className="inline-flex">{icon}</span>}
        {children}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-[hsl(var(--md-on-surface)_/_0.12)] transition-colors"
          >
            <span className="text-xs">×</span>
          </button>
        )}
      </button>
    );
  }
);

MDChip.displayName = "MDChip";
