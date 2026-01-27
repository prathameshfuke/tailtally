import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import {
  Wallet,
  Plus,
  Sparkles,
  MoreHorizontal
} from 'lucide-react';
import { usePets, useExpenses } from '@/hooks/usePetData';
import { CATEGORY_CONFIG, ExpenseCategory, PET_TYPE_CONFIG } from '@/lib/types';
import { ExpenseFormDialog } from '@/components/expenses/ExpenseFormDialog';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categoryIcons: Record<ExpenseCategory, any> = {
  food: '🍖',
  healthcare: '🏥',
  grooming: '✂️',
  toys: '🎾',
  training: '🎓',
  other: '💰'
};

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

    return {
      total,
      budget,
      budgetUsed,
      categoryTotals,
      remaining: budget - total,
    };
  }, [filteredExpenses, selectedPetId, pets.length]);

  const pieData = useMemo(() => {
    return Object.entries(stats.categoryTotals).map(([category, value]) => ({
      name: CATEGORY_CONFIG[category as ExpenseCategory].label,
      value,
      color: CATEGORY_CONFIG[category as ExpenseCategory].color,
    }));
  }, [stats]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 pb-24">
      {/* Wavy Gradient Header */}
      <PageHeader
        title="Hey there, Pet Parent! 🎉"
        variant="gradient"
      />

      {/* Main Content */}
      <div className="px-4 -mt-16 relative z-20">
        {/* Glassmorphism Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6 shadow-playful-lg flex items-center gap-4 mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden border-4 border-white">
            {activePet ? (
              <span className="text-4xl">{PET_TYPE_CONFIG[activePet.type].emoji}</span>
            ) : (
              <img src="/logo.png" alt="TailTally" className="w-full h-full object-contain" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-purple-600 font-bold text-lg">
              {activePet ? `${activePet.name} is happy!` : `All your pets are doing great!`}
            </p>
            <p className="text-gray-600 text-sm">
              {activePet
                ? `They've had ${filteredExpenses.length} expenses this month.`
                : `${pets.length} pet${pets.length !== 1 ? 's' : ''} • ${filteredExpenses.length} expenses`}
            </p>
          </div>
        </motion.div>

        {/* Pet Selector */}
        <div className="mb-6">
          <Select value={selectedPetId} onValueChange={setSelectedPetId}>
            <SelectTrigger className="w-full h-14 rounded-2xl border-2 border-purple-200 bg-white shadow-sm">
              <SelectValue />
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

        {/* Quick Stats Bubbles */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 px-2">Quick Stats</h3>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {Object.entries(stats.categoryTotals).slice(0, 4).map(([category, amount]) => {
              const config = CATEGORY_CONFIG[category as ExpenseCategory];
              return (
                <motion.div
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center justify-center min-w-[100px] aspect-square rounded-full bg-white shadow-playful border-b-4 p-4"
                  style={{ borderColor: `${config.color}33` }}
                >
                  <span className="text-3xl mb-1">{categoryIcons[category as ExpenseCategory]}</span>
                  <p className="text-xs font-medium text-gray-600 truncate w-full text-center">{config.label}</p>
                  <p className="text-lg font-bold">${amount.toFixed(0)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Doughnut Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-playful mb-8 relative"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold">Monthly Budget</h3>
              <p className="text-sm text-gray-600">Total spent: ${stats.total.toFixed(2)}</p>
            </div>
            <MoreHorizontal className="text-purple-600 w-6 h-6" />
          </div>

          {pieData.length > 0 ? (
            <div className="flex justify-center items-center py-4 relative">
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      strokeLinecap="round"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold">{stats.budgetUsed.toFixed(0)}%</p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-600">Used</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-48">
              <p className="text-gray-400">No expenses yet!</p>
            </div>
          )}
        </motion.div>

        {/* Recent Activity (Receipt Style) */}
        <div className="mb-12">
          <div className="flex justify-between items-end px-2 mb-4">
            <h3 className="text-xl font-bold">Recent Activity</h3>
            <p className="text-purple-600 text-sm font-bold">View All</p>
          </div>

          <div className="space-y-4">
            {filteredExpenses.slice(0, 5).map((expense) => {
              const pet = pets.find(p => p.id === expense.petId);
              const config = CATEGORY_CONFIG[expense.category];

              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="dashed-border-card rounded-xl p-1"
                >
                  <div className="bg-white rounded-xl p-4 flex items-center justify-between border-b-4 border-dashed border-gray-100">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${config.color}20` }}
                      >
                        <span className="text-2xl">{categoryIcons[expense.category]}</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{config.label}</p>
                        <p className="text-xs text-gray-600">
                          {pet?.name} • {format(new Date(expense.date), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-lg">-${expense.amount.toFixed(2)}</p>
                  </div>
                </motion.div>
              );
            })}

            {filteredExpenses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No expenses yet. Tap the + button to add one!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bouncing FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowExpenseDialog(true)}
        className="fixed bottom-8 right-6 z-50 w-20 h-20 bg-gradient-to-tr from-purple-600 to-pink-500 text-white rounded-full shadow-playful-fab flex items-center justify-center animate-bounce-soft border-4 border-white/30 backdrop-blur-sm"
      >
        <Plus className="w-10 h-10" />
      </motion.button>

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
