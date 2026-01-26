import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Save, Plus } from 'lucide-react';
import { usePets, useExpenses, useBudgets } from '@/hooks/usePetData';
import { ExpenseCategory, CATEGORY_CONFIG, PET_TYPE_CONFIG } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { CategoryIcon } from '@/components/ui/category-badge';
import { PetAvatar } from '@/components/ui/pet-avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { startOfMonth, endOfMonth, isWithinInterval, addDays, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

export default function BudgetPage() {
  const navigate = useNavigate();
  const { pets } = usePets();
  const { expenses } = useExpenses();
  const { budgets, setBudget, getBudgetsByPet } = useBudgets();
  const { toast } = useToast();

  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || '');
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [budgetInput, setBudgetInput] = useState('');

  const selectedPet = pets.find((p) => p.id === selectedPetId);
  const petBudgets = useMemo(() => getBudgetsByPet(selectedPetId), [selectedPetId, getBudgetsByPet]);

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
    return petBudgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  }, [petBudgets]);

  const daysUntilReset = useMemo(() => {
    const now = new Date();
    const endOfCurrentMonth = endOfMonth(now);
    return differenceInDays(endOfCurrentMonth, now) + 1;
  }, []);

  const handleSaveBudget = (category: ExpenseCategory) => {
    const value = parseFloat(budgetInput);
    if (isNaN(value) || value < 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid budget amount.',
        variant: 'destructive',
      });
      return;
    }

    setBudget(selectedPetId, category, value);
    setBudgetInput('');
    setEditingCategory(null);
    toast({
      title: 'Budget saved!',
      description: `${CATEGORY_CONFIG[category].label} budget set to $${value.toFixed(2)}`,
    });
  };

  if (pets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <EmptyState
          icon={<Wallet className="h-8 w-8" />}
          title="No pets to budget for"
          description="Add a pet first before setting budgets."
          action={
            <Button onClick={() => navigate('/pets')}>
              Add Your First Pet
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-background-dark dark:via-background-dark dark:to-purple-900/10 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-display">Budgets</h1>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-2xl gradient-purple text-white shadow-lg shadow-purple-500/30 flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        <Select value={selectedPetId} onValueChange={setSelectedPetId}>
          <SelectTrigger className="w-full border-2 rounded-2xl h-auto py-3">
            <div className="flex items-center gap-3">
              {selectedPet && (
                <PetAvatar
                  src={selectedPet.photo || PET_TYPE_CONFIG[selectedPet.type].defaultImage}
                  alt={selectedPet.name}
                  size="sm"
                  borderColor="#8b5cf6"
                />
              )}
              <SelectValue>
                <span className="font-bold text-display">
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
      </header>

      <div className="p-4 space-y-6">
        {/* Total Monthly Usage Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mb-2">
            Total Monthly Usage
          </p>
          <p className="text-5xl font-bold text-display mb-4">
            {totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100).toFixed(0) : 0}%
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-full text-sm font-bold mb-4">
            <span>↘️</span>
            5% less than last month
          </div>
          <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full gradient-purple rounded-full"
            />
          </div>
        </motion.div>

        {/* Category Budgets Title */}
        <h2 className="text-xl font-bold text-display">Category Budgets</h2>

        {/* Category Budget Cards */}
        <div className="space-y-4">
          {(Object.keys(CATEGORY_CONFIG) as ExpenseCategory[]).map((category, index) => {
            const config = CATEGORY_CONFIG[category];
            const budget = petBudgets.find((b) => b.category === category);
            const spent = spendingByCategory[category];
            const budgetLimit = budget?.monthlyLimit || 150;
            const percentage = Math.min(100, (spent / budgetLimit) * 100);
            const remaining = Math.max(0, budgetLimit - spent);
            const isEditing = editingCategory === category;
            const isOverBudget = percentage > 100;
            const isNearLimit = percentage > 80 && percentage <= 100;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className={cn(
                  "bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-md border-4 overflow-hidden",
                  isOverBudget && "border-red-400"
                )}
                style={{ borderColor: !isOverBudget ? config.color : undefined }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={category} size="md" />
                    <div>
                      <p className="font-bold text-display text-lg">{config.label}</p>
                      <p className="text-xs text-gray-500">Monthly Allowance</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setEditingCategory(category);
                      setBudgetInput(budgetLimit.toString());
                    }}
                    className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide"
                    style={{
                      backgroundColor: `${config.color}20`,
                      color: config.color
                    }}
                  >
                    Adjust
                  </motion.button>
                </div>

                {isEditing ? (
                  <div className="mb-4 flex gap-2">
                    <Input
                      type="number"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      className="flex-1 rounded-2xl border-2"
                      placeholder="Set budget amount"
                      autoFocus
                    />
                    <Button
                      onClick={() => handleSaveBudget(category)}
                      size="icon"
                      className="rounded-2xl"
                      style={{ backgroundColor: config.color }}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    ${spent.toFixed(2)} of ${budgetLimit.toFixed(2)} spent
                  </p>
                )}

                <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: isOverBudget ? '#ef4444' : config.color }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span
                    className="text-sm font-bold"
                    style={{ color: isOverBudget ? '#ef4444' : config.color }}
                  >
                    {isOverBudget ? `-$${Math.abs(remaining).toFixed(2)} over budget` : `$${remaining.toFixed(2)} remaining`}
                  </span>
                  <span className="text-xs text-gray-400">
                    {isOverBudget ? 'Critical priority' : `Renews in ${daysUntilReset} days`}
                  </span>
                </div>

                {isOverBudget && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl">
                    <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                      ⚠️ You've exceeded this budget by ${Math.abs(remaining).toFixed(2)}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Add New Category Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-semibold">Add New Category</span>
        </motion.button>
      </div>
    </div>
  );
}
