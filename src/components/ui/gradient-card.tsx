import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GradientCardProps {
  variant?: 'purple' | 'coral' | 'teal' | 'green' | 'indigo';
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function GradientCard({ 
  variant = 'purple', 
  children, 
  className,
  animate = true 
}: GradientCardProps) {
  const gradientClasses = {
    purple: 'gradient-purple',
    coral: 'gradient-coral',
    teal: 'gradient-teal',
    green: 'gradient-green',
    indigo: 'gradient-indigo',
  };

  const content = (
    <div className={cn(
      "rounded-3xl p-6 text-white shadow-lg",
      gradientClasses[variant],
      className
    )}>
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        className="transition-all duration-200"
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: React.ReactNode;
  variant?: 'purple' | 'coral' | 'teal' | 'green' | 'indigo';
}

export function StatCard({ icon, label, value, badge, variant = 'purple' }: StatCardProps) {
  return (
    <GradientCard variant={variant}>
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
          {icon}
        </div>
        {badge}
      </div>
      <p className="text-white/90 text-sm font-medium uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-3xl font-bold text-display">
        {value}
      </p>
    </GradientCard>
  );
}
