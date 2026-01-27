import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Save, Plus, AlertCircle, Trophy, CheckCircle, Info } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { usePets, useExpenses, useBudgets } from '@/hooks/usePetData';
import { ExpenseCategory, CATEGORY_CONFIG, PET_TYPE_CONFIG } from '@/lib/types';
import { EmptyState } from '@/components/ui/empty-state';
import { MDButton } from '@/components/ui/md-button';
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
  { emoji: '🍖', label: 'Treat King', color: 'blue' },
  { emoji: '✨', label: 'Elite', color: 'purple' },
];

export default function BudgetPage() {
  const navigate = useNavigate();
  const { pets } = usePets();
  const { expenses } = useExpenses();
  const { budgets, setBudget, getBudgetsByPet } = useBudgets();
  const { toast } = useToast();

  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || '');
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [sliderValues, setSliderValues] = useState<Record<ExpenseCategory, number>>({
    food: 200,
    healthcare: 500,
    grooming: 150,
    toys: 100,
    training: 150,
    other: 100,
  });

  const selectedPet = pets.find((p) => p.id === selectedPetId);
  const petBudgets = useMemo(() => getBudgetsByPet(selectedPetId), [selectedPetId, getBudgetsByPet]);

  // Initialize slider values from existing budgets
  useEffect(() => {
    const newValues: Record<ExpenseCategory, number> = {
      food: 200,
      healthcare: 500,
      grooming: 150,
      toys: 100,
      training: 150,
      other: 100,
    };
    petBudgets.forEach((b) => {
      newValues[b.category] = b.monthlyLimit;
    });
    setSliderValues(newValues);
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
    return Object.values(sliderValues).reduce((sum, amount) => sum + amount, 0);
  }, [sliderValues]);

  const daysUntilReset = useMemo(() => {
    const now = new Date();
    const endOfCurrentMonth = endOfMonth(now);
    return differenceInDays(endOfCurrentMonth, now) + 1;
  }, []);

  const handleSliderChange = (category: ExpenseCategory, value: number[]) => {
    setSliderValues((prev) => ({ ...prev, [category]: value[0] }));
  };

  const handleSaveBudget = (category: ExpenseCategory) => {
    const value = sliderValues[category];
    setBudget(selectedPetId, category, value);
    setEditingCategory(null);
    toast({
      title: 'Budget saved!',
      description: `${CATEGORY_CONFIG[category].label} budget set to $${value.toFixed(2)}`,
    });
  };

  const getStatusInfo = (percentage: number) => {
    if (percentage > 100) {
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        message: 'Over budget!',
        color: 'text-red-500',
      };
    } else if (percentage > 80) {
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        message: 'Near limit!',
        color: 'text-orange-500',
      };
    } else if (percentage > 50) {
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        message: 'Under budget',
        color: 'text-green-500',
      };
    } else {
      return {
        icon: <Info className="w-4 h-4" />,
        message: 'Plenty of room',
        color: 'text-blue-500',
      };
    }
  };

  if (pets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <EmptyState
          icon={<Trophy className="h-8 w-8" />}
          title="No pets to budget for"
          description="Add a pet first before setting budgets."
          action={
            <MDButton onClick={() => navigate('/pets')}>
              Add Your First Pet
            </MDButton>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 pb-24">
      {/* Top App Bar */}
      <PageHeader title="Budget Status 🎮" />

      <div className="px-6">
        {/* Stats Section (Level & Streak) */}
        <div className="flex flex-wrap gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-xl p-6 bg-white shadow-playful border-b-4 border-purple-500/20"
          >
            <p className="text-purple-600/60 text-xs font-bold uppercase tracking-widest">Current Level</p>
            <div className="flex items-baseline gap-1">
              <p className="text-purple-600 tracking-light text-2xl font-bold leading-tight">Level 12</p>
              <span className="text-purple-600 text-sm font-medium">EXP 80%</span>
            </div>
            <div className="w-full bg-purple-100 h-1.5 rounded-full mt-1 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '80%' }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="progress-gradient h-full rounded-full"
              />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex min-w-[140px] flex-1 flex-col gap-2 rounded-xl p-6 bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-playful relative overflow-hidden"
          >
            <div className="absolute -right-2 -top-2 opacity-20 transform rotate-12">
              <Flame className="w-16 h-16" />
            </div>
            <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Daily Streak</p>
            <p className="text-white tracking-light text-2xl font-bold leading-tight">5 Days 🔥</p>
            <p className="text-white/60 text-xs font-medium">Keep it up!</p>
          </motion.div>
        </div>

        {/* Pet Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Select value={selectedPetId} onValueChange={setSelectedPetId}>
            <SelectTrigger className="w-full h-14 rounded-2xl border-2 border-purple-200 bg-white shadow-sm">
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
        </motion.div>

        {/* Badges Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-tight">Active Badges</h2>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-purple-600 text-sm font-bold cursor-pointer"
            >
              View All
            </motion.span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-full bg-${badge.color}-100 flex items-center justify-center shadow-md border-2 border-${badge.color}-400`}>
                  <span className="text-3xl">{badge.emoji}</span>
                </div>
                <span className="text-[10px] font-bold text-center uppercase text-gray-500">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget Quests Section */}
      <div className="bg-white dark:bg-gray-900/50 rounded-t-[3rem] p-6 pt-8 flex-1 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-tight mb-6">
          Budget Quests
        </h2>

        <div className="space-y-6">
          {(Object.keys(CATEGORY_CONFIG) as ExpenseCategory[]).map((category, index) => {
            const config = CATEGORY_CONFIG[category];
            const spent = spendingByCategory[category];
            const budgetLimit = sliderValues[category];
            const percentage = Math.min(100, (spent / budgetLimit) * 100);
            const isEditing = editingCategory === category;
            const statusInfo = getStatusInfo(percentage);

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col gap-3 group"
              >
                <div className="flex gap-6 justify-between items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{categoryEmojis[category]}</span>
                    <p className="text-gray-900 dark:text-white text-lg font-bold leading-normal">
                      {config.label}
                    </p>
                  </div>
                  <p className="text-gray-900 dark:text-white text-sm font-bold leading-normal">
                    ${spent.toFixed(0)} <span className="text-gray-400">/ ${budgetLimit.toFixed(0)}</span>
                  </p>
                </div>

                {/* Interactive Slider for Budget Adjustment */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col gap-3 mb-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Slider
                            value={[sliderValues[category]]}
                            onValueChange={(value) => handleSliderChange(category, value)}
                            max={1000}
                            step={10}
                            className="w-full"
                          />
                        </div>
                        <span className="text-purple-600 font-bold min-w-[60px] text-right">
                          ${sliderValues[category]}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSaveBudget(category)}
                          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-full font-bold flex items-center justify-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setEditingCategory(null)}
                          className="px-4 py-2 bg-gray-100 rounded-full font-bold text-gray-600"
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
                    className="text-purple-600 text-xs font-bold self-start hover:underline"
                  >
                    Adjust Budget
                  </motion.button>
                )}

                {/* Progress Bar with Milestone */}
                <div className="relative h-4 rounded-full bg-gray-200 dark:bg-gray-800 p-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full rounded-full progress-gradient shadow-sm"
                  />
                  {/* Character Milestone Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="absolute top-1/2 -translate-y-1/2 -ml-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-purple-600 cursor-pointer"
                    style={{ left: `${Math.min(percentage, 100)}%` }}
                  >
                    <span className="text-xs">{milestoneEmojis[category]}</span>
                  </motion.div>
                </div>

                {/* Status Message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`${statusInfo.color} text-sm font-bold leading-normal flex items-center gap-1`}
                >
                  {statusInfo.icon} {statusInfo.message}
                </motion.p>
              </motion.div>
            );
          })}
        </div>

        {/* Add Expense Button - Stationary */}
        <div className="mt-8 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full shadow-playful flex items-center justify-center gap-3 font-bold"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </motion.button>
        </div>

        {/* Bottom Spacer */}
        <div className="h-4"></div>
      </div>
    </div>
  );
}
