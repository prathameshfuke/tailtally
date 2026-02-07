"use client";

import { cn } from "@/lib/utils";
import { motion, type MotionProps } from "framer-motion";

interface BorderBeamProps extends MotionProps {
  className?: string;
  lightWidth?: number;
  duration?: number;
  lightColor?: string;
  borderWidth?: number;
}

export function BorderBeam({
  className,
  lightWidth = 200,
  duration = 10,
  lightColor = "#FAFAFA",
  borderWidth = 1,
  ...props
}: BorderBeamProps) {
  return (
    <motion.div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        className
      )}
      style={
        {
          "--border-width": `${borderWidth}px`,
          "--light-width": `${lightWidth}px`,
          "--duration": `${duration}s`,
          "--light-color": lightColor,
          background: `radial-gradient(var(--light-width) circle at var(--x) var(--y),var(--light-color),transparent 100%)`,
          WebkitMask: `linear-gradient(white, white) content-box, linear-gradient(white, white)`,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "var(--border-width)",
        } as React.CSSProperties
      }
      initial={{ "--x": "0%", "--y": "0%" } as unknown as Record<string, string>}
      animate={{
        "--x": ["0%", "100%", "100%", "0%", "0%"],
        "--y": ["0%", "0%", "100%", "100%", "0%"],
      } as unknown as Record<string, string[]>}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
      {...props}
    />
  );
}
