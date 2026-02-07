import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'default';
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const variantStyles = {
  primary: 'gradient-primary text-white',
  secondary: 'gradient-secondary text-white',
  accent: 'gradient-accent text-white',
  default: 'bg-card text-card-foreground border',
};

export function StatCard({ title, value, icon, variant = 'default', subtitle, trend }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        'rounded-xl p-6 shadow-soft card-hover',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn(
            'text-sm font-medium',
            variant === 'default' ? 'text-muted-foreground' : 'text-white/80'
          )}>
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className={cn(
              'text-sm',
              variant === 'default' ? 'text-muted-foreground' : 'text-white/70'
            )}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={cn(
              'flex items-center gap-1 text-sm font-medium',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn(
          'flex h-12 w-12 items-center justify-center rounded-lg',
          variant === 'default' ? 'bg-primary/10 text-primary' : 'bg-white/20'
        )}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
