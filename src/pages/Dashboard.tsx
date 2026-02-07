import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Target, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePets, useExpenses, useBudgets } from '@/hooks/usePetData';
import { usePetParentLevel } from '@/hooks/usePetParentLevel';
import { useCurrency } from '@/hooks/useCurrency';
import { ExpenseCategory, CATEGORY_CONFIG, PET_TYPE_CONFIG } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { NumberCounter } from '@/components/animated/NumberCounter';
import { GlassCard } from '@/components/ui/glass-card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categoryEmojis: Record<ExpenseCategory, string> = {
  food: '🍖',
  healthcare: '🏥',
  grooming: '✂️',
  toys: '🎾',
  training: '🎓',
  other: '💰'
};

const CHART_COLORS = [
  'hsl(36, 100%, 50%)',   // food - orange
  'hsl(4, 90%, 58%)',     // healthcare - red
  'hsl(187, 100%, 38%)',  // grooming - cyan
  'hsl(291, 64%, 42%)',   // toys - purple
  'hsl(207, 90%, 54%)',   // training - blue
  'hsl(200, 18%, 46%)',   // other - gray
];

export default function Dashboard() {
  const { pets } = usePets();
  const { expenses } = useExpenses();
  const { budgets } = useBudgets();
  const { levelInfo, streakInfo } = usePetParentLevel();
  const { formatAmount, symbol } = useCurrency();
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

    // Calculate actual budget from stored budgets
    let budget = 0;
    if (selectedPetId === 'all') {
      budget = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
    } else {
      budget = budgets.filter(b => b.petId === selectedPetId).reduce((sum, b) => sum + b.monthlyLimit, 0);
    }
    if (budget === 0) budget = 1500; // Fallback

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
      expenseCount: filteredExpenses.length,
    };
  }, [filteredExpenses, selectedPetId, budgets]);

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    return Object.entries(stats.categoryTotals).map(([category, amount], index) => ({
      name: CATEGORY_CONFIG[category as ExpenseCategory].label,
      value: amount,
      color: CHART_COLORS[index % CHART_COLORS.length],
      emoji: categoryEmojis[category as ExpenseCategory],
    }));
  }, [stats.categoryTotals]);

  const lastMonthTotal = 980; // Mock data for comparison
  const percentChange = stats.total > 0 ? ((stats.total - lastMonthTotal) / lastMonthTotal) * 100 : 0;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark lg:pb-12">
      <div>
        <PageHeader title="Dashboard" />
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between px-8 py-6 mb-2">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Track your pet expenses at a glance</p>
        </div>
        <div className="flex items-center gap-4">
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

      {/* Mobile Pet Selector */}
      <div className="lg:hidden px-4 mb-4">
        <Select value={selectedPetId} onValueChange={setSelectedPetId}>
          <SelectTrigger className="w-full h-14 rounded-2xl border-2 border-primary/10 bg-white dark:bg-gray-800 shadow-sm">
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

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">

        {/* Top Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Spending Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-2 bg-gradient-to-br from-primary to-orange-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 opacity-80" />
                <span className="text-sm font-medium opacity-90 uppercase tracking-wider">This Month</span>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl lg:text-5xl font-bold">{symbol}</span>
                <NumberCounter
                  value={stats.total}
                  decimals={0}
                  className="text-4xl lg:text-5xl font-bold"
                />
              </div>
              <div className="flex items-center gap-2 text-sm">
                {percentChange >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{percentChange >= 0 ? '+' : ''}{percentChange.toFixed(0)}% vs last month</span>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-300/20 rounded-full blur-2xl"></div>
          </motion.div>

          {/* Budget Remaining */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-card rounded-3xl p-5 shadow-sm border border-border"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <PiggyBank className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Remaining</p>
            <p className={cn(
              "text-2xl font-bold",
              stats.remaining >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              {symbol}{Math.abs(stats.remaining).toFixed(0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">of {symbol}{stats.budget} budget</p>
          </motion.div>

          {/* Transactions Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-card rounded-3xl p-5 shadow-sm border border-border"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Transactions</p>
            <p className="text-2xl font-bold text-foreground">{stats.expenseCount}</p>
            <p className="text-xs text-muted-foreground mt-1">this month</p>
          </motion.div>
        </div>

        {/* Level & Streak Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Pet Parent Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-card rounded-3xl p-5 shadow-sm border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pet Parent Level</span>
              <span className="text-xs font-bold text-primary">{levelInfo.title}</span>
            </div>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-bold text-primary">Level {levelInfo.level}</span>
              <span className="text-sm font-medium text-muted-foreground">{Math.round(levelInfo.progressPercentage)}%</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-primary rounded-full"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              {levelInfo.isMaxLevel ? '🏆 Max Level!' : `${levelInfo.xpNeeded} XP to next level`}
            </p>
          </motion.div>

          {/* Daily Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl p-5 text-white shadow-sm relative overflow-hidden"
          >
            <div className="relative z-10">
              <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Daily Streak</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold">{streakInfo.currentStreak}</span>
                <span className="text-sm text-white/80">{streakInfo.currentStreak === 1 ? 'Day' : 'Days'} 🔥</span>
              </div>
              <p className="text-[10px] text-white/60 mt-2">
                {streakInfo.currentStreak > 0 ? 'Keep logging expenses!' : 'Log an expense to start!'}
              </p>
            </div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          </motion.div>
        </div>

        {/* Middle Row: Pie Chart + Category Breakdown */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Pie Chart Card */}
          <GlassCard className="lg:col-span-5 p-6">
            <h3 className="text-lg font-bold mb-4">Spending by Category</h3>
            {pieChartData.length > 0 ? (
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`${formatAmount(value)}`, '']}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {pieChartData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-muted-foreground">{item.emoji} {item.name}</span>
                      </div>
                      <span className="font-bold">{formatAmount(item.value, 0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                No expenses this month
              </div>
            )}
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard className="lg:col-span-7 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Recent Activity</h3>
              <button
                onClick={() => window.location.href = '/expenses'}
                className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.slice(0, 6).map((expense) => {
                  const pet = pets.find(p => p.id === expense.petId);
                  const config = CATEGORY_CONFIG[expense.category];
                  return (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div
                        className="size-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${config.color}15` }}
                      >
                        <span className="text-xl">{categoryEmojis[expense.category]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{expense.notes || config.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {pet?.name} • {format(new Date(expense.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <p className="font-bold text-sm flex-shrink-0 text-primary">
                        -{formatAmount(expense.amount)}
                      </p>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No recent activity this month</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Bottom Row: Quick Category Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {(Object.keys(CATEGORY_CONFIG) as ExpenseCategory[]).map((category, index) => {
            const config = CATEGORY_CONFIG[category];
            const amount = stats.categoryTotals[category] || 0;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-card rounded-2xl p-4 shadow-sm border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
              >
                <div
                  className="size-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${config.color}15` }}
                >
                  <span className="text-lg">{categoryEmojis[category]}</span>
                </div>
                <p className="text-xs font-medium text-muted-foreground truncate">{config.label}</p>
                <p className="text-lg font-bold" style={{ color: amount > 0 ? config.color : undefined }}>
                  {formatAmount(amount, 0)}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Pets Overview (if multiple pets) */}
        {pets.length > 1 && selectedPetId === 'all' && (
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold mb-4">Spending by Pet</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pets.map((pet) => {
                const petExpenses = filteredExpenses.filter(e => e.petId === pet.id);
                const petTotal = petExpenses.reduce((sum, e) => sum + e.amount, 0);
                const petPercentage = stats.total > 0 ? (petTotal / stats.total) * 100 : 0;

                return (
                  <div
                    key={pet.id}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedPetId(pet.id)}
                  >
                    <div className="size-14 rounded-2xl overflow-hidden bg-primary/10 flex-shrink-0">
                      {pet.photo ? (
                        <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          {PET_TYPE_CONFIG[pet.type].emoji}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold">{pet.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${petPercentage}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground w-10">
                          {petPercentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <p className="font-bold text-lg">{formatAmount(petTotal, 0)}</p>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
