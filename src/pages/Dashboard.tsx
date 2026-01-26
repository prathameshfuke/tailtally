import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { usePets, useExpenses } from '@/hooks/usePetData';
import { CATEGORY_CONFIG, ExpenseCategory, PET_TYPE_CONFIG } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ExpenseFormDialog } from '@/components/expenses/ExpenseFormDialog';
import { StatCard } from '@/components/ui/gradient-card';
import { PetAvatar } from '@/components/ui/pet-avatar';
import { CategoryIcon } from '@/components/ui/category-badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Dashboard() {
  const { pets } = usePets();
  const { expenses, addExpense } = useExpenses();
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
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
    const budget = selectedPetId === 'all' ? 600 * Math.max(1, pets.length) : 600;
    const budgetUsed = budget > 0 ? Math.min(100, (total / budget) * 100) : 0;

    const categoryTotals = filteredExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    const topCategoryEntry = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    // Calculate monthly average (mock)
    const monthlyAvg = total * 0.85; // Mock calculation

    return {
      total,
      budget,
      budgetUsed,
      categoryTotals,
      topCategory: topCategoryEntry ? { category: topCategoryEntry[0] as ExpenseCategory, amount: topCategoryEntry[1] } : null,
      monthlyAvg,
      changePercent: 12, // Mock
    };
  }, [filteredExpenses, selectedPetId, pets.length]);

  const pieData = useMemo(() => {
    return Object.entries(stats.categoryTotals).map(([category, value]) => ({
      name: CATEGORY_CONFIG[category as ExpenseCategory].label,
      value,
      color: CATEGORY_CONFIG[category as ExpenseCategory].color,
    }));
  }, [stats]);

  const categoryBudgets = {
    food: 200,
    healthcare: 250,
    grooming: 150,
    toys: 100,
    training: 100,
    other: 100
  };

  return (
    <div className="pb-24 min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-background-dark dark:via-background-dark dark:to-purple-900/10">
      {/* Playful Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/10 mb-6">
        <div className="flex items-center p-4 justify-between">
          <div className="flex items-center gap-3">
            <Select value={selectedPetId} onValueChange={setSelectedPetId}>
              <SelectTrigger className="h-auto gap-2 border-none bg-transparent p-0 focus:ring-0 w-auto">
                <div className="flex items-center gap-3">
                  <PetAvatar
                    src={activePet ? (activePet.photo || PET_TYPE_CONFIG[activePet.type].defaultImage) : PET_TYPE_CONFIG['dog'].defaultImage}
                    alt={activePet?.name || 'Pet'}
                    size="sm"
                    borderColor="#8b5cf6"
                  />
                  <div className="text-left">
                    <SelectValue>
                      <p className="text-lg font-bold text-display text-[#131118] dark:text-white">
                        {activePet ? `${activePet.name}'s Budget` : "Family Budget"}
                      </p>
                    </SelectValue>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activePet ? activePet.type : `All ${pets.length} Pets`}
                    </p>
                  </div>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Family Budget (All)</SelectItem>
                {pets.map(pet => (
                  <SelectItem key={pet.id} value={pet.id}>{pet.name}'s Budget</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowExpenseDialog(true)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl gradient-purple text-white shadow-lg shadow-purple-500/30"
          >
            <span className="material-symbols-outlined">add</span>
          </motion.button>
        </div>
      </header>

      <div className="px-4 space-y-6">
        {/* Pet Carousel */}
        {pets.length > 1 && (
          <div className="flex gap-3 overflow-x-auto p-2 scrollbar-hide">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPetId('all')}
              className="flex-shrink-0"
            >
              <div className="flex flex-col items-center gap-2">
                <PetAvatar
                  src={PET_TYPE_CONFIG['dog'].defaultImage}
                  alt="All Pets"
                  size="lg"
                  borderColor={selectedPetId === 'all' ? '#8b5cf6' : '#d1d5db'}
                  selected={selectedPetId === 'all'}
                />
                <span className={cn(
                  "text-xs font-bold text-display",
                  selectedPetId === 'all' ? "text-primary" : "text-gray-500"
                )}>
                  All
                </span>
              </div>
            </motion.div>
            {pets.map(pet => (
              <motion.div
                key={pet.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPetId(pet.id)}
                className="flex-shrink-0"
              >
                <div className="flex flex-col items-center gap-2">
                  <PetAvatar
                    src={pet.photo || PET_TYPE_CONFIG[pet.type].defaultImage}
                    alt={pet.name}
                    size="lg"
                    borderColor={selectedPetId === pet.id ? '#8b5cf6' : '#d1d5db'}
                    selected={selectedPetId === pet.id}
                  />
                  <span className={cn(
                    "text-xs font-bold text-display",
                    selectedPetId === pet.id ? "text-primary" : "text-gray-500"
                  )}>
                    {pet.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Gradient Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            variant="purple"
            icon={<Wallet className="w-5 h-5 text-white" />}
            label="Total Expenses"
            value={`$${stats.total.toFixed(2)}`}
            badge={
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +{stats.changePercent}%
              </div>
            }
          />
          <StatCard
            variant="coral"
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            label="Monthly Avg"
            value={`$${stats.monthlyAvg.toFixed(2)}`}
          />
        </div>

        {/* Monthly Usage Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">Total Monthly Usage</p>
              <p className="text-4xl font-bold text-display mt-1">{stats.budgetUsed.toFixed(0)}%</p>
            </div>
            <div className="px-4 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-full text-xs font-bold flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              5% less than last month
            </div>
          </div>
          <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.budgetUsed}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full gradient-purple rounded-full"
            />
          </div>
        </motion.div>

        {/* Spending Breakdown Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-display mb-6">Spending Breakdown</h3>
          <div className="relative flex justify-center items-center h-64">
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        padding: '12px'
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total</p>
                  <p className="text-3xl font-bold text-display">${stats.total.toFixed(0)}</p>
                </div>
              </>
            ) : (
              <div className="text-gray-400 text-sm">No expenses yet</div>
            )}
          </div>

          {pieData.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-6">
              {pieData.slice(0, 4).map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {entry.name} ({((entry.value / stats.total) * 100).toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Category Budgets */}
        <div>
          <h3 className="text-xl font-bold text-display mb-4">Category Budgets</h3>
          <div className="space-y-3">
            {(Object.keys(stats.categoryTotals) as ExpenseCategory[]).slice(0, 3).map((cat, index) => {
              const amount = stats.categoryTotals[cat];
              const budget = categoryBudgets[cat] || 100;
              const percentage = Math.min(100, (amount / budget) * 100);
              const config = CATEGORY_CONFIG[cat];

              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-md border-4"
                  style={{ borderColor: config.color }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <CategoryIcon category={cat} size="sm" />
                      <div>
                        <p className="font-bold text-display">{config.label}</p>
                        <p className="text-xs text-gray-500">Monthly Allowance</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold" style={{ color: config.color }}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    ${amount.toFixed(2)} of ${budget} spent
                  </p>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-bold" style={{ color: config.color }}>
                      ${Math.max(0, budget - amount).toFixed(2)} remaining
                    </span>
                    <span className="text-xs text-gray-400">
                      Renews in 5 days
                    </span>
                  </div>
                </motion.div>
              );
            })}
            {Object.keys(stats.categoryTotals).length === 0 && (
              <p className="text-gray-400 text-center italic py-8">Start spending to see budget progress!</p>
            )}
          </div>
        </div>
      </div>

      <ExpenseFormDialog
        open={showExpenseDialog}
        onOpenChange={setShowExpenseDialog}
        onSubmit={(data) => {
          addExpense({
            petId: data.petId,
            date: data.date.toISOString(),
            category: data.category,
            amount: data.amount,
            notes: data.notes,
          });
        }}
        pets={pets}
      />
    </div>
  );
}
