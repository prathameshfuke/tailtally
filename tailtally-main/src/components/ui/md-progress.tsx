import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MDProgressProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function MDProgress({ 
  value, 
  max = 100, 
  color = "hsl(var(--md-primary))", 
  className,
  showLabel = false,
  label
}: MDProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-body-small text-[hsl(var(--md-on-surface-variant))]">
              {label}
            </span>
          )}
          <span className="text-label-medium text-[hsl(var(--md-on-surface))]">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
      <div className="h-2 w-full bg-[hsl(var(--md-surface-variant))] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

interface MDCircularProgressProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

export function MDCircularProgress({ 
  size = 40, 
  strokeWidth = 4, 
  color = "hsl(var(--md-primary))",
  className 
}: MDCircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  return (
    <div className={cn("inline-flex", className)}>
      <svg width={size} height={size} className="animate-spin">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--md-surface-variant))"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          style={{
            transformOrigin: 'center',
          }}
        />
      </svg>
    </div>
  );
}
