import { cn } from '@/lib/utils';
import { ExpenseCategory, CATEGORY_CONFIG } from '@/lib/types';

interface CategoryBadgeProps {
  category: ExpenseCategory;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  petName?: string;
  variant?: 'dot' | 'pill';
  className?: string;
}

export function CategoryBadge({ 
  category, 
  size = 'md', 
  showLabel = true, 
  petName,
  variant = 'dot',
  className 
}: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category];

  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  if (variant === 'pill') {
    return (
      <div className={cn("inline-flex items-center gap-1.5", className)}>
        {petName && (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-primary text-white">
            {petName}
          </span>
        )}
        <span 
          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white"
          style={{ backgroundColor: config.color }}
        >
          {config.label}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn('rounded-full', sizeClasses[size])}
        style={{ backgroundColor: config.color }}
      />
      {showLabel && (
        <span className={cn('font-medium', textClasses[size])}>
          {config.label}
        </span>
      )}
    </div>
  );
}

interface CategoryIconProps {
  category: ExpenseCategory;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CategoryIcon({ category, size = 'md', className }: CategoryIconProps) {
  const config = CATEGORY_CONFIG[category];
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const icons: Record<ExpenseCategory, string> = {
    food: '🍖',
    healthcare: '🏥',
    grooming: '✂️',
    toys: '🧸',
    training: '🎓',
    other: '📦',
  };

  return (
    <div 
      className={cn(
        "rounded-2xl flex items-center justify-center text-2xl",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: `${config.color}20` }}
    >
      <span>{icons[category]}</span>
    </div>
  );
}
