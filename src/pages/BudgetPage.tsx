import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Save, AlertCircle, CheckCircle, Info, Trophy } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { usePets, useExpenses, useBudgets } from '@/hooks/usePetData';
import { usePetParentLevel } from '@/hooks/usePetParentLevel';
import { useCurrency } from '@/hooks/useCurrency';
import { ExpenseCategory, CATEGORY_CONFIG, PET_TYPE_CONFIG } from '@/lib/types';
import { EmptyState } from '@/components/ui/empty-state';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { startOfMonth, endOfMonth, isWithinInterval, differenceInDays } from 'date-fns';
import { NumberCounter } from '@/components/animated/NumberCounter';
import { BudgetFormDialog } from '@/components/budget/BudgetFormDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const categoryEmojis: Record<ExpenseCategory, string> = {
  food: '🍖',
  healthcare: '🏥',
  grooming: '✂️',
  toys: '🎾',
  training: '🎓',
  other: '💰'
};

const milestoneEmojis: Record<ExpenseCategory, string> = {
  food: '🐾',
  healthcare: '❤️',
  grooming: '✨',
  toys: '🎾',
  training: '⭐',
  other: '💎'
};

const badges = [
  { emoji: '👑', label: 'Master', color: 'yellow' },
  { emoji: '💰', label: 'Saver', color: 'green' },
  { emoji: '🍖', label: 'Treat King', color: 'orange' },
  { emoji: '✨', label: 'Elite', color: 'primary' },
];

export default function BudgetPage() {
  const navigate = useNavigate();
  const { pets } = usePets();
  const { expenses } = useExpenses();
  const { budgets, setBudget, getBudgetsByPet } = useBudgets();
  const { levelInfo, streakInfo } = usePetParentLevel();
  const { formatAmount, symbol } = useCurrency();
  const { toast } = useToast();

  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || '');
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [categoryBudgets, setCategoryBudgets] = useState<Record<ExpenseCategory, number>>({
    food: 0,
    healthcare: 0,
    grooming: 0,
    toys: 0,
    training: 0,
    other: 0,
  });
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);

  const selectedPet = pets.find((p) => p.id === selectedPetId);
  const petBudgets = useMemo(() => getBudgetsByPet(selectedPetId), [selectedPetId, getBudgetsByPet]);

  useEffect(() => {
    const newValues: Record<ExpenseCategory, number> = {
      food: 0,
      healthcare: 0,
      grooming: 0,
      toys: 0,
      training: 0,
      other: 0,
    };
    petBudgets.forEach((b) => {
      newValues[b.category] = b.monthlyLimit;
    });
    setCategoryBudgets(newValues);
  }, [petBudgets, selectedPetId]);

  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    return expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      return e.petId === selectedPetId && isWithinInterval(expenseDate, { start, end });
    });
  }, [expenses, selectedPetId]);

  const spendingByCategory = useMemo(() => {
    const result: Record<ExpenseCategory, number> = {
      food: 0,
      healthcare: 0,
      grooming: 0,
      toys: 0,
      training: 0,
      other: 0,
    };

    currentMonthExpenses.forEach((e) => {
      result[e.category] += e.amount;
    });

    return result;
  }, [currentMonthExpenses]);

  const totalSpent = useMemo(() => {
    return Object.values(spendingByCategory).reduce((sum, amount) => sum + amount, 0);
  }, [spendingByCategory]);

  const totalBudget = useMemo(() => {
    return Object.values(categoryBudgets).reduce((sum, amount) => sum + amount, 0);
  }, [categoryBudgets]);

  const daysUntilReset = useMemo(() => {
    const now = new Date();
    const endOfCurrentMonth = endOfMonth(now);
    return differenceInDays(endOfCurrentMonth, now) + 1;
  }, []);

  const handleSliderChange = (category: ExpenseCategory, value: number[]) => {
    setCategoryBudgets((prev) => ({ ...prev, [category]: value[0] }));
  };

  const handleSaveBudget = (category: ExpenseCategory) => {
    const value = categoryBudgets[category];
    setBudget(selectedPetId, category, value);
    setEditingCategory(null);
    toast({
      title: 'Budget saved! 🎉',
      description: `${CATEGORY_CONFIG[category].label} budget set to ${formatAmount(value)}`,
    });
  };

  const handleCreateBudget = (data: { petId: string; category: ExpenseCategory; amount: number }) => {
    setBudget(data.petId, data.category, data.amount);

    // Update local slider state if it's the currently viewed pet
    if (data.petId === selectedPetId) {
      setCategoryBudgets(prev => ({ ...prev, [data.category]: data.amount }));
    }

    toast({
      title: 'Budget updated! 🎯',
      description: `Monthly budget for ${data.category} set to ${formatAmount(data.amount)}`,
    });
  };

  const getStatusInfo = (percentage: number) => {
    if (percentage > 100) {
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        message: 'Over budget!',
        color: 'text-red-600',
      };
    } else if (percentage > 80) {
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        message: 'Near limit!',
        color: 'text-warning',
      };
    } else if (percentage > 50) {
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        message: 'Under budget',
        color: 'text-success',
      };
    } else {
      return {
        icon: <Info className="w-4 h-4" />,
        message: 'Plenty of room',
        color: 'text-info',
      };
    }
  };

  if (pets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background-light dark:bg-background-dark">
        <EmptyState
          icon={<Trophy className="h-8 w-8" />}
          title="No pets to budget for"
          description="Add a pet first before setting budgets."
          action={
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/pets')}
              className="gradient-warm text-white px-8 py-3 rounded-full shadow-playful-lg font-bold"
            >
              Add Your First Pet
            </motion.button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark lg:pb-12">
      <div>
        <PageHeader title="Budget Tracker" />
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between px-8 py-6 mb-2">
        <h1 className="text-3xl font-bold font-display tracking-tight">Budget & Goals</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white dark:bg-card px-4 py-2 rounded-full border border-border shadow-sm">
            <span className="text-sm font-medium text-muted-foreground">Total Budget:</span>
            <span className="text-sm font-bold flex items-center gap-1 text-primary">
              {symbol}<NumberCounter value={totalBudget} decimals={0} />
            </span>
          </div>
          <Select value={selectedPetId} onValueChange={setSelectedPetId}>
            <SelectTrigger className="w-[180px] h-10 rounded-full border-border bg-white dark:bg-card shadow-sm">
              <SelectValue placeholder="All Pets" />
            </SelectTrigger>
            <SelectContent>
              {pets.map(pet => (
                <SelectItem key={pet.id} value={pet.id}>
                  {PET_TYPE_CONFIG[pet.type].emoji} {pet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => setIsBudgetDialogOpen(true)}
            className="rounded-full font-bold shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5 mr-1" />
            Set Budget
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">

        {/* Mobile Stats & Selectors (Hidden on Desktop) */}
        <div className="lg:hidden space-y-4">
          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5 bg-white dark:bg-gray-800 shadow-playful border border-gray-100 dark:border-gray-700"
            >
              <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Current Level</p>
              <div className="flex items-baseline gap-1 mb-2">
                <p className="text-primary text-2xl font-bold">Level {levelInfo.level}</p>
                <span className="text-primary text-sm font-medium">{Math.round(levelInfo.progressPercentage)}%</span>
              </div>
              <div className="w-full bg-primary/10 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="progress-gradient h-full rounded-full"
                />
              </div>
              <p className="text-gray-400 text-[10px] mt-1">{levelInfo.title}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl p-5 gradient-warm text-white shadow-playful relative overflow-hidden"
            >
              <div className="absolute -right-2 -top-2 opacity-20 transform rotate-12">
                <Flame className="w-16 h-16" />
              </div>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2 relative">Daily Streak</p>
              <p className="text-white text-2xl font-bold relative">{streakInfo.currentStreak} {streakInfo.currentStreak === 1 ? 'Day' : 'Days'} 🔥</p>
              <p className="text-white/60 text-xs font-medium relative">{streakInfo.currentStreak > 0 ? 'Keep it up!' : 'Log an expense!'}</p>
            </motion.div>
          </div>

          {/* Pet Selector */}
          <Select value={selectedPetId} onValueChange={setSelectedPetId}>
            <SelectTrigger className="w-full h-14 rounded-2xl border-2 border-primary/10 bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex items-center gap-3">
                {selectedPet && (
                  <span className="text-2xl">{PET_TYPE_CONFIG[selectedPet.type].emoji}</span>
                )}
                <SelectValue>
                  <span className="font-medium">
                    {selectedPet ? selectedPet.name : 'Select a pet'}
                  </span>
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              {pets.map((pet) => (
                <SelectItem key={pet.id} value={pet.id}>
                  <div className="flex items-center gap-2">
                    {PET_TYPE_CONFIG[pet.type].emoji} {pet.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => setIsBudgetDialogOpen(true)}
            className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-primary/20 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Set Monthly Budget
          </Button>

          {/* Badges Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Active Badges</h2>
              <motion.span
                whileHover={{ scale: 1.05 }}
                onClick={() => toast({ title: 'Badges Gallery', description: 'Full badges gallery coming soon! 🏆' })}
                className="text-primary text-sm font-bold cursor-pointer"
              >
                View All
              </motion.span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer flex-shrink-0"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shadow-md border-2 border-primary/20">
                    <span className="text-3xl">{badge.emoji}</span>
                  </div>
                  <span className="text-[10px] font-bold text-center uppercase text-gray-500 dark:text-gray-400">{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Left Column: Budget Quests (Desktop Main Content) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 shadow-playful border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold font-display">Budget Quests</h2>
                <p className="text-muted-foreground text-sm">Manage your monthly spending limits</p>
              </div>
              <div className="hidden lg:flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Info className="w-3 h-3" />
                <span>{daysUntilReset} Days Left</span>
              </div>
            </div>

            <div className="space-y-6">
              {(Object.keys(CATEGORY_CONFIG) as ExpenseCategory[]).map((category, index) => {
                const config = CATEGORY_CONFIG[category];
                const spent = spendingByCategory[category];
                const budgetLimit = categoryBudgets[category];
                const percentage = Math.min(100, (spent / budgetLimit) * 100);
                const isEditing = editingCategory === category;
                const statusInfo = getStatusInfo(percentage);

                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">
                          {categoryEmojis[category]}
                        </div>
                        <div>
                          <p className="text-lg font-bold">{config.label}</p>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`${statusInfo.color} text-xs font-bold flex items-center gap-1`}
                          >
                            {statusInfo.icon} {statusInfo.message}
                          </motion.p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {symbol}<NumberCounter value={spent} decimals={0} /> <span className="text-gray-400 text-sm">/ {symbol}{budgetLimit.toFixed(0)}</span>
                        </p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isEditing && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 pt-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <Slider
                                value={[categoryBudgets[category]]}
                                onValueChange={(value) => handleSliderChange(category, value)}
                                max={1000}
                                step={10}
                                className="w-full"
                              />
                            </div>
                            <span className="text-primary font-bold min-w-[60px] text-right">
                              {symbol}{categoryBudgets[category]}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSaveBudget(category)}
                              className="flex-1 bg-primary text-white py-2 px-4 rounded-full font-bold flex items-center justify-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setEditingCategory(null)}
                              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full font-bold text-gray-600 dark:text-gray-300"
                            >
                              Cancel
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!isEditing && (
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => setEditingCategory(category)}
                        className="text-primary text-xs font-bold hover:underline"
                      >
                        Adjust Budget
                      </motion.button>
                    )}

                    <div className="relative h-6 rounded-full bg-gray-100 dark:bg-gray-700 p-1 overflow-visible">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        className="h-full rounded-full progress-gradient relative overflow-hidden"
                      >
                        <div className="absolute inset-0 shimmer"></div>
                      </motion.div>


                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Gamification & Stats (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
          {/* Desktop Gamification Card */}
          <div className="bg-white dark:bg-card rounded-3xl p-6 shadow-xl-warm border border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Trophy className="w-24 h-24 rotate-12" />
            </div>

            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-4 font-display">Pet Parent Level</h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-primary">{levelInfo.level}</span>
                <span className="text-muted-foreground font-medium mb-1">{levelInfo.title}</span>
              </div>
              <div className="w-full bg-muted h-3 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progressPercentage}%` }}
                  className="bg-primary h-full rounded-full"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {levelInfo.isMaxLevel
                  ? '🏆 Max Level Reached!'
                  : `${levelInfo.xpNeeded} XP to Level ${levelInfo.level + 1}`}
              </p>
              <p className="text-[10px] text-muted-foreground/70 mt-1">Total XP: {levelInfo.currentXP}</p>
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="font-bold text-3xl">{streakInfo.currentStreak} {streakInfo.currentStreak === 1 ? 'Day' : 'Days'}</p>
                <p className="text-white/80 text-sm font-medium">Daily Streak</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          </div>

          {/* Badges Grid */}
          <div className="bg-white dark:bg-card rounded-3xl p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Badges</h3>
              <button onClick={() => toast({ title: 'Badges Gallery', description: 'Full badges gallery coming soon! 🏆' })} className="text-xs font-bold text-primary hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.label}
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <span className="text-2xl">{badge.emoji}</span>
                  <span className="text-xs font-bold text-muted-foreground uppercase">{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>


      <BudgetFormDialog
        open={isBudgetDialogOpen}
        onOpenChange={setIsBudgetDialogOpen}
        onSubmit={handleCreateBudget}
        pets={pets}
        selectedPetId={selectedPetId}
      />
    </div >
  );
}
