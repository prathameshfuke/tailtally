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
import { TrendingUp, TrendingDown, Search, Bell } from 'lucide-react';
import { usePets, useExpenses } from '@/hooks/usePetData';
import { cn } from '@/lib/utils';
import { CATEGORY_CONFIG, PET_TYPE_CONFIG } from '@/lib/types';
import { PetAvatar } from '@/components/ui/pet-avatar';
import { CategoryIcon } from '@/components/ui/category-badge';

export default function AnalyticsPage() {
    const { pets } = usePets();
    const { expenses } = useExpenses();
    const [selectedPetId, setSelectedPetId] = useState<string>('all');

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-background-dark dark:via-background-dark dark:to-purple-900/10 pb-24">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/10 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {activePet ? (
                            <PetAvatar
                                src={activePet.photo || PET_TYPE_CONFIG[activePet.type].defaultImage}
                                alt={activePet.name}
                                size="sm"
                                borderColor="#8b5cf6"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-purple flex items-center justify-center text-white">
                                <span className="material-symbols-outlined">bar_chart</span>
                            </div>
                        )}
                        <h1 className="text-xl font-bold text-display">Analytics</h1>
                    </div>
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 flex items-center justify-center"
                        >
                            <Search className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 flex items-center justify-center"
                        >
                            <Bell className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>
            </header>

            <div className="p-4 space-y-6">
                {/* Pet Switcher */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                        Switch Pet Profile
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedPetId('all')}
                            className="flex-shrink-0"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <div className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center border-3 transition-all",
                                    selectedPetId === 'all' 
                                        ? "gradient-purple text-white shadow-lg shadow-purple-500/30" 
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700"
                                )}>
                                    <span className="material-symbols-outlined">all_inclusive</span>
                                </div>
                                <span className={cn(
                                    "text-xs font-bold text-display",
                                    selectedPetId === 'all' ? "text-primary" : "text-gray-500"
                                )}>
                                    Buddy
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
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-md"
                    >
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mb-1">Budget</p>
                        <p className="text-3xl font-bold text-display mb-2">${stats.budget}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            <span>This Month</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-md"
                    >
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mb-1">Spent</p>
                        <p className="text-3xl font-bold text-display mb-2">${stats.totalSpent.toFixed(0)}</p>
                        <div className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 font-semibold">
                            <TrendingUp className="w-3 h-3" />
                            <span>+{((stats.totalSpent / stats.budget) * 100).toFixed(0)}%</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-md"
                    >
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mb-1">Left</p>
                        <p className="text-3xl font-bold text-display mb-2">${stats.left.toFixed(0)}</p>
                        <div className="flex items-center gap-1 text-xs text-red-500 font-semibold">
                            <TrendingDown className="w-3 h-3" />
                            <span>-5%</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-md"
                    >
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mb-1">Daily Avg</p>
                        <p className="text-3xl font-bold text-display mb-2">${stats.dailyAvg.toFixed(0)}</p>
                        <div className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 font-semibold">
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
                    className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md"
                >
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <h3 className="text-lg font-bold text-display">Spending Trends</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Last 6 months overview</p>
                        </div>
                        <div className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-primary rounded-full text-xs font-bold">
                            TOTAL: $5.2K
                        </div>
                    </div>
                    <div className="h-56 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <defs>
                                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="#a78bfa" />
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
                        <h3 className="text-lg font-bold text-display">Recent Activity</h3>
                        <button className="text-sm font-bold text-primary">See All</button>
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
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center gap-3"
                                >
                                    <CategoryIcon category={expense.category} size="sm" />
                                    <div className="flex-1">
                                        <p className="font-bold text-display">{config.label}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {pet?.name} • {format(new Date(expense.date), 'MMM d, h:mm a')}
                                        </p>
                                    </div>
                                    <p className="text-lg font-bold text-display">-${expense.amount.toFixed(2)}</p>
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
