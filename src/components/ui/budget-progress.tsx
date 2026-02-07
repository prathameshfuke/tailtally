import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';

interface BudgetProgressProps {
  spent: number;
  budget: number;
  label?: string;
  showDetails?: boolean;
}

export function BudgetProgress({ spent, budget, label, showDetails = true }: BudgetProgressProps) {
  const { formatAmount } = useCurrency();
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 150) : 0;
  const displayPercentage = Math.min(percentage, 100);

  const getStatusColor = () => {
    if (percentage >= 100) return 'bg-budget-danger';
    if (percentage >= 80) return 'bg-budget-warning';
    return 'bg-budget-safe';
  };

  const getTextColor = () => {
    if (percentage >= 100) return 'text-budget-danger';
    if (percentage >= 80) return 'text-budget-warning';
    return 'text-budget-safe';
  };

  const remaining = budget - spent;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{label}</span>
          <span className={cn('text-sm font-bold', getTextColor())}>
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}

      <div className="relative h-3 overflow-hidden rounded-full bg-budget-track">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${displayPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn('absolute inset-y-0 left-0 rounded-full', getStatusColor())}
        />
      </div>

      {showDetails && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Spent: <span className="font-medium text-foreground">{formatAmount(spent)}</span>
          </span>
          <span className="text-muted-foreground">
            Budget: <span className="font-medium text-foreground">{formatAmount(budget)}</span>
          </span>
        </div>
      )}

      {showDetails && (
        <p className={cn('text-sm font-medium', remaining >= 0 ? 'text-success' : 'text-destructive')}>
          {remaining >= 0
            ? `${formatAmount(remaining)} remaining`
            : `${formatAmount(Math.abs(remaining))} over budget`}
        </p>
      )}
    </div>
  );
}
