import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, isWithinInterval, subDays, isSameDay } from 'date-fns';
import { TrendingUp, MoreHorizontal, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePets, useExpenses, useBudgets } from '@/hooks/usePetData';
import { Pet, Expense, ExpenseCategory, CATEGORY_CONFIG, PET_TYPE_CONFIG } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { NumberCounter } from '@/components/animated/NumberCounter';
import { EmptyState } from '@/components/ui/empty-state';
import { GlassCard } from '@/components/ui/glass-card'; // New Premium Component
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Replacing with GlassCard
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categoryEmojis: Record<ExpenseCategory, any> = {
  food: '🍖',
  healthcare: '🏥',
  grooming: '✂️',
  toys: '🎾',
  training: '🎓',
  other: '💰'
};

export default function Dashboard() {
  const { pets } = usePets();
  const { expenses } = useExpenses();
  const [selectedPetId, setSelectedPetId] = useState<string>('all');

  const activePet = selectedPetId === 'all' ? undefined : pets.find(p => p.id === selectedPetId);

  const getDateRange = () => {
    const now = new Date();
    return { start: startOfMonth(now), end: endOfMonth(now) };
  };

  const filteredExpenses = useMemo(() => {
    const { start, end } = getDateRange();
    return expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      const isTimeMatch = isWithinInterval(expenseDate, { start, end });
      const isPetMatch = selectedPetId === 'all' || e.petId === selectedPetId;
      return isTimeMatch && isPetMatch;
    });
  }, [expenses, selectedPetId]);

  const stats = useMemo(() => {
    const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const budget = selectedPetId === 'all' ? 1200 : 600;
    const budgetUsed = budget > 0 ? Math.min(100, (total / budget) * 100) : 0;

    const categoryTotals = filteredExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    return {
      total,
      budget,
      budgetUsed,
      categoryTotals,
      remaining: budget - total,
    };
  }, [filteredExpenses, selectedPetId]);

  const lastMonthTotal = 980; // Mock data
  const percentChange = ((stats.total - lastMonthTotal) / lastMonthTotal) * 100;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark lg:pb-12">
      <div>
        <PageHeader title="Pet Parent" />
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between px-8 py-6 mb-2">
        <h1 className="text-3xl font-bold font-display tracking-tight">Dashboard Overview</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white dark:bg-card px-4 py-2 rounded-full border border-border shadow-sm">
            <span className="text-sm font-medium text-muted-foreground">Budget Status:</span>
            <span className={cn("text-sm font-bold flex items-center gap-1", stats.remaining > 0 ? "text-success" : "text-destructive")}>
              {stats.remaining > 0 ? "On Track" : "Over Budget"}
              {stats.remaining > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </span>
          </div>
          <Select value={selectedPetId} onValueChange={setSelectedPetId}>
            <SelectTrigger className="w-[180px] h-10 rounded-full border-border bg-white dark:bg-card shadow-sm">
              <SelectValue placeholder="All Pets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pets 🐾</SelectItem>
              {pets.map(pet => (
                <SelectItem key={pet.id} value={pet.id}>
                  {PET_TYPE_CONFIG[pet.type].emoji} {pet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">

        {/* Left Column: Hero Stats & Budget Overview */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero Stats Card - Primary Spending Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary rounded-3xl p-6 lg:p-10 text-white shadow-xl-warm relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <p className="text-sm lg:text-base font-medium opacity-90 uppercase tracking-wider mb-2">Total Monthly Spend</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl lg:text-6xl font-bold">$</span>
                  <NumberCounter
                    value={stats.total}
                    decimals={0}
                    className="text-4xl lg:text-6xl font-bold"
                  />
                  <span className="text-lg lg:text-2xl opacity-80">.00</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 bg-white/20 w-fit px-4 py-2 rounded-full text-sm backdrop-blur-sm"
              >
                <TrendingUp className="w-4 h-4" />
                <span>{percentChange > 0 ? '+' : ''}{percentChange.toFixed(0)}% from last month</span>
              </motion.div>
            </div>

            {/* Abstract Sunny Background Shape */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-orange-300/20 rounded-full blur-3xl"></div>
          </motion.div>

          {/* Section Header - Mobile Only (Desktop has it in grid) */}
          <div className="flex items-center justify-between pt-2 lg:hidden">
            <h3 className="text-xl font-bold tracking-tight">Budget Overview</h3>
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase">
              {Object.keys(stats.categoryTotals).length} Active
            </span>
          </div>

          {/* Mobile Pet Selector - Hidden on Desktop */}
          <div className="lg:hidden">
            <Select value={selectedPetId} onValueChange={setSelectedPetId}>
              <SelectTrigger className="w-full h-14 rounded-2xl border-2 border-primary/10 bg-white dark:bg-gray-800 shadow-sm touch-target">
                <div className="flex items-center gap-3">
                  {activePet && (
                    <span className="text-2xl">{PET_TYPE_CONFIG[activePet.type].emoji}</span>
                  )}
                  <SelectValue>
                    <span className="font-medium">
                      {activePet ? activePet.name : 'All Pets 🐾'}
                    </span>
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="font-medium">All Pets 🐾</span>
                </SelectItem>
                {pets.map(pet => (
                  <SelectItem key={pet.id} value={pet.id}>
                    <span>{PET_TYPE_CONFIG[pet.type].emoji} {pet.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget Cards Details Table for Desktop / Cards for mobile */}
          <GlassCard className="hidden lg:block p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Category Breakdown</h3>
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase">
                {Object.keys(stats.categoryTotals).length} Active Categories
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(stats.categoryTotals).map(([category, amount], index) => {
                const config = CATEGORY_CONFIG[category as ExpenseCategory];
                const budgetLimit = category === 'food' ? 600 : category === 'healthcare' ? 500 : 150;
                const percentage = Math.min(100, (amount / budgetLimit) * 100);
                return (
                  <div key={category} className="p-4 rounded-2xl border border-border hover:border-primary/50 transition-colors group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-10 rounded-full flex items-center justify-center bg-primary/10">
                        <span className="text-lg">{categoryEmojis[category as ExpenseCategory]}</span>
                      </div>
                      <div>
                        <p className="font-bold">{config.label}</p>
                        <p className="text-xs text-muted-foreground">${amount.toFixed(0)} / ${budgetLimit}</p>
                      </div>
                    </div>
                    <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full bg-primary relative"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>

          {/* Mobile Budget Cards Layout (Keep existing for < lg) */}
          <div className="flex flex-col gap-4 lg:hidden">
            {Object.entries(stats.categoryTotals).map(([category, amount], index) => {
              const config = CATEGORY_CONFIG[category as ExpenseCategory];
              const budgetLimit = category === 'food' ? 600 : category === 'healthcare' ? 500 : 150;
              const percentage = Math.min(100, (amount / budgetLimit) * 100);
              const isUnderBudget = percentage < 80;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative flex flex-col gap-4 rounded-2xl p-5 bg-white dark:bg-gray-800 shadow-playful border border-gray-100 dark:border-gray-700 transition-transform active:scale-[0.98]"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${config.color}15` }}
                      >
                        <span className="text-2xl">{categoryEmojis[category as ExpenseCategory]}</span>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{config.label}</p>
                        <p className={`text-sm font-medium ${isUnderBudget ? 'text-success' : 'text-primary'}`}>
                          {isUnderBudget ? 'Under Budget' : `${percentage.toFixed(0)}% Used`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        $<NumberCounter value={amount} decimals={0} />
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">of ${budgetLimit}</p>
                    </div>
                  </div>

                  {/* Animated Tooltip (shows on hover) */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-2 whitespace-nowrap z-10">
                    <span className="text-primary">${(budgetLimit - amount).toFixed(2)}</span> left to spend
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45"></div>
                  </div>

                  {/* Thick Game-Style Progress Bar with Shimmer */}
                  <div className="relative w-full h-5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden p-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full progress-gradient relative"
                    >
                      {/* Shimmering Layer */}
                      <div className="absolute inset-0 shimmer"></div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}

            {Object.keys(stats.categoryTotals).length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No expenses this month yet!</p>
                <p className="text-sm text-gray-500">Tap the + button to log your first expense</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity (Desktop Sticky) */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="p-6 lg:sticky lg:top-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Recent Activity</h3>
              <button className="text-primary text-sm font-bold hover:underline">View All</button>
            </div>

            <div className="space-y-4">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.slice(0, 8).map((expense, index) => { // Show more on desktop
                  const pet = pets.find(p => p.id === expense.petId);
                  const config = CATEGORY_CONFIG[expense.category];
                  return (
                    <div key={expense.id} className="flex items-center gap-4 group cursor-pointer hover:bg-muted/50 p-2 rounded-xl transition-colors">
                      <div
                        className="size-10 rounded-full flex items-center justify-center flex-shrink-0 bg-secondary/10 group-hover:bg-secondary/20 transition-colors"
                      >
                        <span className="text-lg">{categoryEmojis[expense.category as ExpenseCategory]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{config.label}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {pet?.name} • {format(new Date(expense.date), 'MMM d')}
                        </p>
                      </div>
                      <p className="font-bold text-sm flex-shrink-0">
                        -$<NumberCounter value={expense.amount} decimals={2} />
                      </p>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
