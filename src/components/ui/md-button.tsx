import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { motion } from "framer-motion";

interface MDButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onAnimationEnd'> {
  variant?: "filled" | "filled-tonal" | "outlined" | "text";
  size?: "default" | "small" | "large";
  icon?: ReactNode;
  children?: ReactNode;
}

export const MDButton = forwardRef<HTMLButtonElement, MDButtonProps>(
  ({ variant = "filled", size = "default", icon, children, className, onClick, disabled, type, ...props }, ref) => {
    const variantClasses = {
      filled: "bg-[hsl(var(--md-primary))] text-[hsl(var(--md-on-primary))] elevation-1 hover:elevation-2",
      "filled-tonal": "bg-[hsl(var(--md-secondary-container))] text-[hsl(var(--md-on-secondary-container))] elevation-0 hover:elevation-1",
      outlined: "border border-[hsl(var(--md-outline))] text-[hsl(var(--md-primary))] bg-transparent hover:bg-[hsl(var(--md-primary)_/_0.08)]",
      text: "text-[hsl(var(--md-primary))] bg-transparent hover:bg-[hsl(var(--md-primary)_/_0.08)]",
    };
    
    const sizeClasses = {
      small: "h-10 px-4 text-label-large",
      default: "h-12 px-6 text-label-large",
      large: "h-14 px-8 text-label-large",
    };
    
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        disabled={disabled}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed state-layer",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
      >
        {icon && <span className="inline-flex">{icon}</span>}
        {children}
      </motion.button>
    );
  }
);

MDButton.displayName = "MDButton";
