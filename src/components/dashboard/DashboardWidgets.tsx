import { motion } from 'framer-motion';
import { Sparkles, TrendingDown, TrendingUp, Heart, Calendar, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Pet, Expense, PET_TYPE_CONFIG, CATEGORY_CONFIG } from '@/lib/types';
import { format, differenceInDays, differenceInMonths } from 'date-fns';
import { CuteMascot } from '@/components/ui/cute-mascot';

interface DashboardWidgetsProps {
  pets: Pet[];
  expenses: Expense[];
}

export function DashboardWidgets({ pets, expenses }: DashboardWidgetsProps) {
  // Get random pet of the day (based on current date)
  const petOfTheDay = pets.length > 0 
    ? pets[new Date().getDate() % pets.length]
    : null;

  // Calculate spending insights
  const totalThisMonth = expenses
    .filter(e => {
      const expDate = new Date(e.date);
      const now = new Date();
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const totalLastMonth = expenses
    .filter(e => {
      const expDate = new Date(e.date);
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
      return expDate.getMonth() === lastMonth.getMonth() && expDate.getFullYear() === lastMonth.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const spendingTrend = totalLastMonth > 0 
    ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100 
    : 0;

  // Find longest streak of expense logging
  const getStreak = () => {
    if (expenses.length === 0) return 0;
    const sortedDates = [...new Set(expenses.map(e => format(new Date(e.date), 'yyyy-MM-dd')))].sort();
    let streak = 1;
    let maxStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const diff = differenceInDays(new Date(sortedDates[i]), new Date(sortedDates[i-1]));
      if (diff === 1) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 1;
      }
    }
    return maxStreak;
  };

  // Get savings tip
  const getSavingsTip = () => {
    const categoryTotals = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    
    if (!topCategory) return "Start tracking expenses to get personalized tips! 💡";
    
    const tips: Record<string, string> = {
      food: "Try buying pet food in bulk to save money! 🛒",
      healthcare: "Consider pet insurance for peace of mind! 🏥",
      grooming: "Learn basic grooming at home to cut costs! ✂️",
      toys: "DIY toys can be just as fun and much cheaper! 🧶",
      training: "Group training classes are often more affordable! 🎓",
      other: "Track every expense to spot saving opportunities! 📊",
    };
    
    return tips[topCategory[0]] || tips.other;
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Pet of the Day */}
      {petOfTheDay && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-accent/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">Pet of the Day</span>
              </div>
              <div className="flex items-center gap-3">
                <CuteMascot type={petOfTheDay.type} size="lg" mood="love" />
                <div>
                  <p className="font-bold text-foreground">{petOfTheDay.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {PET_TYPE_CONFIG[petOfTheDay.type].label}
                  </p>
                  <p className="text-xs text-primary mt-1">
                    Give them extra love today! 💕
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Spending Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              {spendingTrend <= 0 ? (
                <TrendingDown className="h-4 w-4 text-success" />
              ) : (
                <TrendingUp className="h-4 w-4 text-warning" />
              )}
              <span className="text-xs font-medium text-muted-foreground">Monthly Trend</span>
            </div>
            <p className={`text-2xl font-bold ${spendingTrend <= 0 ? 'text-success' : 'text-warning'}`}>
              {spendingTrend === 0 ? '—' : `${spendingTrend > 0 ? '+' : ''}${spendingTrend.toFixed(0)}%`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {spendingTrend <= 0 
                ? "Great job saving! 🎉" 
                : spendingTrend > 20 
                  ? "Time to review spending 👀" 
                  : "Slight increase this month"}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Streak Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-4 w-4 text-warning" />
              <span className="text-xs font-medium text-muted-foreground">Tracking Streak</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {getStreak()} days 🔥
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Keep tracking to build your streak!
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Smart Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="overflow-hidden bg-gradient-to-br from-success/10 to-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-success" />
              <span className="text-xs font-medium text-success">Smart Tip</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {getSavingsTip()}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
