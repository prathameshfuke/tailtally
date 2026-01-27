import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface MDCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  variant?: "elevated" | "filled" | "outlined";
  className?: string;
  animate?: boolean;
}

export function MDCard({ 
  children, 
  elevation = 1, 
  variant = "elevated",
  className,
  animate = true,
  ...props 
}: MDCardProps) {
  const elevationClass = {
    0: "elevation-0",
    1: "elevation-1",
    2: "elevation-2",
    3: "elevation-3",
    4: "elevation-4",
    5: "elevation-5",
  }[elevation];
  
  const variantClasses = {
    elevated: cn(elevationClass, "bg-[hsl(var(--md-surface))]"),
    filled: "bg-[hsl(var(--md-surface-variant))] elevation-0",
    outlined: "border border-[hsl(var(--md-outline))] bg-[hsl(var(--md-surface))] elevation-0",
  };
  
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "rounded-3xl p-6 transition-all duration-300",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div
      className={cn(
        "rounded-3xl p-6 transition-all duration-300",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

interface MDCardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function MDCardHeader({ children, className }: MDCardHeaderProps) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

interface MDCardTitleProps {
  children: ReactNode;
  className?: string;
}

export function MDCardTitle({ children, className }: MDCardTitleProps) {
  return (
    <h3 className={cn("text-headline-small text-[hsl(var(--md-on-surface))] font-medium", className)}>
      {children}
    </h3>
  );
}

interface MDCardContentProps {
  children: ReactNode;
  className?: string;
}

export function MDCardContent({ children, className }: MDCardContentProps) {
  return (
    <div className={cn("text-body-large text-[hsl(var(--md-on-surface))]", className)}>
      {children}
    </div>
  );
}
