import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Expense, Pet, CATEGORY_CONFIG, PET_TYPE_CONFIG } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CategoryBadge } from '@/components/ui/category-badge';
import { cn } from '@/lib/utils';

interface ExpenseCardProps {
  expense: Expense;
  pet?: Pet;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseCard({ expense, pet, onEdit, onDelete }: ExpenseCardProps) {
  const categoryConfig = CATEGORY_CONFIG[expense.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <Card className={cn(
        'group overflow-hidden transition-all hover:shadow-md',
        `border-l-4`
      )} style={{ borderLeftColor: categoryConfig.color }}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            {/* Pet Avatar */}
            {pet && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xl">
                {PET_TYPE_CONFIG[pet.type].emoji}
              </div>
            )}
            
            {/* Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CategoryBadge category={expense.category} size="sm" />
                {pet && (
                  <span className="text-sm text-muted-foreground">• {pet.name}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {format(new Date(expense.date), 'MMM d, yyyy')}
              </p>
              {expense.notes && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {expense.notes}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Amount */}
            <span className="text-xl font-bold text-primary">
              ${expense.amount.toFixed(2)}
            </span>
            
            {/* Actions */}
            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => onEdit(expense)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => onDelete(expense.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
