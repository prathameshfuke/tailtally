import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    LineChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
} from 'recharts';
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths, eachMonthOfInterval } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { usePets, useExpenses } from '@/hooks/usePetData';
import { cn } from '@/lib/utils';
import { CATEGORY_CONFIG, PET_TYPE_CONFIG } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categoryEmojis = {
  food: '🍖',
  healthcare: '🏥',
  grooming: '✂️',
  toys: '🎾',
  training: '🎓',
  other: '💰'
};

export default function AnalyticsPage() {
    const { pets } = usePets();
    const { expenses } = useExpenses();
    const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || 'all');

    const activePet = pets.find(p => p.id === selectedPetId);

    const stats = useMemo(() => {
        const now = new Date();
        const start = startOfMonth(now);
        const end = endOfMonth(now);

        const filtered = expenses.filter(e => {
            const d = new Date(e.date);
            const matchTime = isWithinInterval(d, { start, end });
            const matchPet = selectedPetId === 'all' || e.petId === selectedPetId;
            return matchTime && matchPet;
        });

        const totalSpent = filtered.reduce((acc, curr) => acc + curr.amount, 0);
        const budget = 1200;
        const left = budget - totalSpent;
        const dailyAvg = totalSpent / Math.max(1, new Date().getDate());

        return { totalSpent, budget, left, dailyAvg };
    }, [expenses, selectedPetId]);

    const chartData = useMemo(() => {
        const end = new Date();
        const start = subMonths(end, 5);
        const months = eachMonthOfInterval({ start, end });

        return months.map(date => {
            const monthStart = startOfMonth(date);
            const monthEnd = endOfMonth(date);

            const monthlyTotal = expenses
                .filter(e => {
                    const d = new Date(e.date);
                    const matchTime = isWithinInterval(d, { start: monthStart, end: monthEnd });
                    const matchPet = selectedPetId === 'all' || e.petId === selectedPetId;
                    return matchTime && matchPet;
                })
                .reduce((sum, e) => sum + e.amount, 0);

            return {
                name: format(date, 'MMM'),
                value: monthlyTotal
            };
        });
    }, [expenses, selectedPetId]);

    const recentActivity = useMemo(() => {
        return [...expenses]
            .filter(e => selectedPetId === 'all' || e.petId === selectedPetId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
    }, [expenses, selectedPetId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 pb-24">
            <PageHeader title="Analytics 📊" />

            <div className="px-4 pt-6 space-y-6">
                {/* Pet Switcher */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-playful"
                >
                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                        Select Pet
                    </h3>
                    <Select value={selectedPetId} onValueChange={setSelectedPetId}>
                      <SelectTrigger className="w-full h-14 rounded-2xl border-2 border-purple-200 bg-white dark:bg-gray-900">
                        <div className="flex items-center gap-3">
                          {activePet && (
                            <span className="text-2xl">{PET_TYPE_CONFIG[activePet.type].emoji}</span>
                          )}
                          <SelectValue>
                            <span className="font-medium">
                              {activePet ? activePet.name : 'All Pets'}
                            </span>
                          </SelectValue>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <span className="font-medium">All Pets 🐾</span>
                        </SelectItem>
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

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-playful"
                    >
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold mb-2">Budget</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">${stats.budget}</p>
                        <p className="text-xs text-gray-400">This Month</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-playful"
                    >
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold mb-2">Spent</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">${stats.totalSpent.toFixed(0)}</p>
                        <div className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 font-bold">
                            <TrendingUp className="w-3 h-3" />
                            <span>+{((stats.totalSpent / stats.budget) * 100).toFixed(0)}%</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-playful"
                    >
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold mb-2">Left</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">${stats.left.toFixed(0)}</p>
                        <div className="flex items-center gap-1 text-xs text-red-500 font-bold">
                            <TrendingDown className="w-3 h-3" />
                            <span>-5%</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-playful"
                    >
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold mb-2">Daily Avg</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">${stats.dailyAvg.toFixed(0)}</p>
                        <div className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 font-bold">
                            <TrendingUp className="w-3 h-3" />
                            <span>+2%</span>
                        </div>
                    </motion.div>
                </div>

                {/* Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-playful"
                >
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Spending Trends</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Last 6 months overview</p>
                        </div>
                        <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold">
                            TOTAL: $5.2K
                        </div>
                    </div>
                    <div className="h-56 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <defs>
                                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    dy={10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                        padding: '12px'
                                    }}
                                    formatter={(value: number) => [`$${value.toFixed(0)}`, 'Spent']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="url(#lineGradient)"
                                    strokeWidth={3}
                                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                                    activeDot={{ r: 7, fill: '#8b5cf6' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                    </div>
                    <div className="space-y-3">
                        {recentActivity.map((expense, index) => {
                            const pet = pets.find(p => p.id === expense.petId);
                            const config = CATEGORY_CONFIG[expense.category];

                            return (
                                <motion.div
                                    key={expense.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * index }}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-3"
                                >
                                    <div 
                                      className="w-12 h-12 rounded-full flex items-center justify-center"
                                      style={{ backgroundColor: `${config.color}20` }}
                                    >
                                      <span className="text-2xl">{categoryEmojis[expense.category as keyof typeof categoryEmojis]}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 dark:text-white">{config.label}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {pet?.name} • {format(new Date(expense.date), 'MMM d, h:mm a')}
                                        </p>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">-${expense.amount.toFixed(2)}</p>
                                </motion.div>
                            );
                        })}
                        {recentActivity.length === 0 && (
                            <p className="text-gray-400 text-center text-sm py-8">No recent activity.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
