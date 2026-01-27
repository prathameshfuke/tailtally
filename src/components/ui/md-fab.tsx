import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { motion } from "framer-motion";

interface MDFABProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onAnimationEnd'> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "default" | "small" | "large";
  extended?: boolean;
  icon: ReactNode;
  label?: string;
}

export const MDFAB = forwardRef<HTMLButtonElement, MDFABProps>(
  ({ variant = "primary", size = "default", extended = false, icon, label, className, onClick, disabled, type, ...props }, ref) => {
    const variantClasses = {
      primary: "bg-[hsl(var(--md-primary-container))] text-[hsl(var(--md-on-primary-container))] hover:elevation-4",
      secondary: "bg-[hsl(var(--md-secondary-container))] text-[hsl(var(--md-on-secondary-container))] hover:elevation-4",
      tertiary: "bg-[hsl(var(--md-tertiary-container))] text-[hsl(var(--md-on-tertiary-container))] hover:elevation-4",
    };
    
    const sizeClasses = {
      small: extended ? "h-10 px-4" : "w-10 h-10",
      default: extended ? "h-14 px-6" : "w-14 h-14",
      large: extended ? "h-24 px-8" : "w-24 h-24",
    };
    
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        disabled={disabled}
        type={type}
        className={cn(
          "fixed bottom-6 right-6 z-50 inline-flex items-center justify-center gap-3 rounded-full elevation-3 transition-all duration-300 state-layer",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
      >
        <span className="inline-flex">{icon}</span>
        {extended && label && (
          <span className="text-label-large font-medium">{label}</span>
        )}
      </motion.button>
    );
  }
);

MDFAB.displayName = "MDFAB";
