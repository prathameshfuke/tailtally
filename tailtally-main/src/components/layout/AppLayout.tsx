import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Receipt, PawPrint, BarChart3, Target, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import { ExpenseFormDialog } from '@/components/expenses/ExpenseFormDialog';
import { usePets, useExpenses } from '@/hooks/usePetData';
import { useToast } from '@/hooks/use-toast';
import { ExpenseCategory } from '@/lib/types';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  { path: '/budget', label: 'Budget', icon: Target },
  { path: '/pets', label: 'Pets', icon: PawPrint },
  { path: '/analytics', label: 'Stats', icon: BarChart3 },
];

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const { pets } = usePets();
  const { addExpense } = useExpenses();
  const { toast } = useToast();
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);

  const handleAddExpense = (data: {
    petId: string;
    date: Date;
    category: ExpenseCategory;
    amount: number;
    notes?: string;
  }) => {
    addExpense({
      petId: data.petId,
      date: data.date.toISOString(),
      category: data.category,
      amount: data.amount,
      notes: data.notes,
    });
    toast({
      title: 'Expense logged! 🎉',
      description: `$${data.amount.toFixed(2)} expense has been recorded.`,
    });
  };

  return (
    <div className="min-h-screen font-display bg-background-light dark:bg-background-dark flex">
      {/* Main Content - Add padding for bottom nav on mobile */}
      <main className="flex-1 pb-32 lg:pb-0 min-h-screen">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="h-full w-full"
        >
          {children}
        </motion.div>
      </main>

      {/* Floating Bottom Navigation - Premium Pill Design */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-full max-w-[350px] pointer-events-none lg:hidden">
        <div className="pointer-events-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-full px-2 py-2 shadow-2xl border border-white/20 dark:border-gray-700/50 grid grid-cols-5 items-center gap-1">

          {/* Item 1 */}
          <NavLink key={navItems[0].path} to={navItems[0].path} className="flex justify-center">
            {({ isActive }) => (
              <motion.div
                className={cn(
                  "p-3 rounded-full transition-all duration-300",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                whileTap={{ scale: 0.9 }}
              >
                <Home className="size-6" strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
            )}
          </NavLink>

          {/* Item 2 */}
          <NavLink key={navItems[1].path} to={navItems[1].path} className="flex justify-center">
            {({ isActive }) => (
              <motion.div
                className={cn(
                  "p-3 rounded-full transition-all duration-300",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                whileTap={{ scale: 0.9 }}
              >
                <Receipt className="size-6" strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
            )}
          </NavLink>

          {/* Center FAB - Uses absolute positioning to pop out but occupies grid cell for spacing */}
          <div className="relative flex justify-center">
            <div className="absolute -top-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowExpenseDialog(true)}
                className="size-14 bg-gradient-to-br from-primary to-orange-600 text-white rounded-full shadow-xl shadow-primary/30 flex items-center justify-center ring-4 ring-background-light dark:ring-background-dark"
              >
                <Plus className="size-8" strokeWidth={3} />
              </motion.button>
            </div>
          </div>

          {/* Item 3 */}
          <NavLink key={navItems[2].path} to={navItems[2].path} className="flex justify-center">
            {({ isActive }) => (
              <motion.div
                className={cn(
                  "p-3 rounded-full transition-all duration-300",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                whileTap={{ scale: 0.9 }}
              >
                <Target className="size-6" strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
            )}
          </NavLink>

          {/* Item 4 - Combined Pets/Analytics? Or just Stats? Let's use Analytics as it's more critical for "Budget" app */}
          <NavLink key={navItems[4].path} to={navItems[4].path} className="flex justify-center">
            {({ isActive }) => (
              <motion.div
                className={cn(
                  "p-3 rounded-full transition-all duration-300",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                whileTap={{ scale: 0.9 }}
              >
                <BarChart3 className="size-6" strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
            )}
          </NavLink>
        </div>
      </div>

      <ExpenseFormDialog
        open={showExpenseDialog}
        onOpenChange={setShowExpenseDialog}
        onSubmit={handleAddExpense}
        pets={pets}
      />
    </div>
  );
}
