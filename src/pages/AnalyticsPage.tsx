import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    LineChart,
    Line,
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine,
} from 'recharts';
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths, eachMonthOfInterval } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { usePets, useExpenses } from '@/hooks/usePetData';
import { useCurrency } from '@/hooks/useCurrency';
import { CATEGORY_CONFIG, PET_TYPE_CONFIG } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import heroPet from '@/assets/hero-pet.jpg';
import cutePetGif from '@/assets/cute-pet.gif';

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
    const { formatAmount, symbol } = useCurrency();

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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-yellow-900/20 lg:pb-12 lg:bg-none lg:bg-background-light lg:dark:bg-background-dark">
            <div>
                <PageHeader title="Analytics 📊" />
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between px-8 py-6 mb-2">
                <h1 className="text-3xl font-bold font-display tracking-tight">Analytics Overview</h1>
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

            <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 lg:pt-0 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">

                {/* Mobile Pet Switcher (Hidden on Desktop) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:hidden bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-playful"
                >
                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                        Select Pet
                    </h3>
                    <Select value={selectedPetId} onValueChange={setSelectedPetId}>
                        <SelectTrigger className="w-full h-14 rounded-2xl border-2 border-primary/20 bg-white dark:bg-gray-900">
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

                {/* Left Column (Desktop) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {/* Mobile Only Vibe Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:hidden bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 shadow-playful col-span-2 sm:col-span-1 flex items-center justify-between overflow-hidden relative"
                        >
                            <div className="z-10 relative">
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold mb-1">Daily Vibe</p>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">You're doing great!</p>
                            </div>
                            <img
                                src={cutePetGif}
                                alt="Cute Pet"
                                className="w-16 h-16 object-cover rounded-xl mix-blend-multiply dark:mix-blend-normal"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-card rounded-2xl p-4 sm:p-5 shadow-playful border border-transparent lg:border-border"
                        >
                            <p className="text-xs text-gray-500 dark:text-muted-foreground uppercase tracking-wide font-bold mb-2">Budget</p>
                            <p className="text-2xl sm:text-3xl font-bold gradient-text-warm mb-1">{symbol}{stats.budget}</p>
                            <p className="text-xs text-gray-400">This Month</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="bg-white dark:bg-card rounded-2xl p-4 sm:p-5 shadow-playful border border-transparent lg:border-border"
                        >
                            <p className="text-xs text-gray-500 dark:text-muted-foreground uppercase tracking-wide font-bold mb-2">Spent</p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{formatAmount(stats.totalSpent, 0)}</p>
                            <div className="flex items-center gap-1 text-xs text-success font-bold">
                                <TrendingUp className="w-3 h-3" />
                                <span>{((stats.totalSpent / stats.budget) * 100).toFixed(0)}%</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-card rounded-2xl p-4 sm:p-5 shadow-playful border border-transparent lg:border-border"
                        >
                            <p className="text-xs text-gray-500 dark:text-muted-foreground uppercase tracking-wide font-bold mb-2">Remaining</p>
                            <p className="text-2xl sm:text-3xl font-bold text-success mb-1">{formatAmount(stats.left, 0)}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 font-bold">
                                <TrendingDown className="w-3 h-3" />
                                <span>{stats.left < 0 ? 'Over' : 'Left'}</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white dark:bg-card rounded-2xl p-4 sm:p-5 shadow-playful border border-transparent lg:border-border"
                        >
                            <p className="text-xs text-gray-500 dark:text-muted-foreground uppercase tracking-wide font-bold mb-2">Daily Avg</p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{formatAmount(stats.dailyAvg, 0)}</p>
                            <div className="flex items-center gap-1 text-xs text-info font-bold">
                                <TrendingUp className="w-3 h-3" />
                                <span>Per day</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Chart Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-card rounded-3xl p-6 lg:p-8 shadow-playful border border-transparent lg:border-border"
                    >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                            <div>
                                <h3 className="text-xl sm:text-2xl font-bold font-display">Spending Trends</h3>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-muted-foreground mt-1">Last 6 months activity</p>
                            </div>
                            <div className="sm:ml-auto px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 text-primary dark:text-orange-300 rounded-full text-sm font-bold whitespace-nowrap">
                                Total: {formatAmount(chartData.reduce((sum, d) => sum + d.value, 0), 0)}
                            </div>
                        </div>
                        <div className="h-64 lg:h-96 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                    <defs>
                                        <linearGradient id="lineGradientWarm" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#FBBF24" />
                                            <stop offset="100%" stopColor="#FB923C" />
                                        </linearGradient>
                                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#FBBF24" stopOpacity={0.15} />
                                            <stop offset="100%" stopColor="#FBBF24" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid 
                                        strokeDasharray="3 3" 
                                        stroke="#e5e7eb" 
                                        vertical={false}
                                        className="dark:stroke-gray-700"
                                    />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#9ca3af' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#9ca3af' }}
                                        tickFormatter={(value) => `${symbol}${(value / 1000).toFixed(0)}k`}
                                        width={50}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(251, 191, 36, 0.1)', strokeWidth: 0 }}
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '12px',
                                            border: '1px solid #e5e7eb',
                                            boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)',
                                            padding: '12px 16px',
                                            backdropFilter: 'blur(8px)'
                                        }}
                                        formatter={(value: number) => [`${formatAmount(value, 0)}`, 'Spent']}
                                        labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
                                        wrapperStyle={{ outline: 'none' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        fill="url(#areaGradient)"
                                        stroke="url(#lineGradientWarm)"
                                        strokeWidth={3}
                                        dot={{ fill: '#FBBF24', strokeWidth: 2, r: 5, stroke: '#fff' }}
                                        activeDot={{ r: 7, fill: '#F97316', stroke: '#fff', strokeWidth: 3 }}
                                        animationDuration={1500}
                                        isAnimationActive={true}
                                    />
                                    <ReferenceLine
                                        y={Math.max(...chartData.map(d => d.value))}
                                        stroke="#fbbf24"
                                        strokeDasharray="5 5"
                                        opacity={0.3}
                                        label={{ value: 'Peak', position: 'right', fill: '#9ca3af', fontSize: 12 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column (Desktop) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Desktop Vibe Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="hidden lg:block bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden h-[200px]"
                    >
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <p className="text-white/80 font-bold uppercase tracking-widest text-xs">Daily Vibe</p>
                                <h3 className="text-2xl font-bold mt-1">You're doing great!</h3>
                            </div>

                            <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1.5 rounded-full text-xs backdrop-blur-md">
                                <span>✨ Top 5% Saver</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-32 h-32">
                            <img
                                src={cutePetGif}
                                alt="Cute Pet"
                                className="w-full h-full object-cover opacity-90 mix-blend-multiply dark:mix-blend-overlay"
                            />
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                    </motion.div>

                    {/* Recent Activity List */}
                    <div className="bg-white dark:bg-card rounded-3xl p-6 shadow-sm border border-transparent lg:border-border">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Recent Activity</h3>
                            <button className="text-primary text-xs font-bold hover:underline">See All</button>
                        </div>
                        <div className="space-y-4">
                            {recentActivity.map((expense, index) => {
                                const pet = pets.find(p => p.id === expense.petId);
                                const config = CATEGORY_CONFIG[expense.category];

                                return (
                                    <motion.div
                                        key={expense.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * index }}
                                        className="flex items-center gap-4 group cursor-pointer hover:bg-muted/50 p-2 rounded-xl transition-colors"
                                    >
                                        <div
                                            className="size-10 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: `${config.color}20` }}
                                        >
                                            <span className="text-lg">{categoryEmojis[expense.category as keyof typeof categoryEmojis]}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{config.label}</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {pet?.name} • {format(new Date(expense.date), 'MMM d')}
                                            </p>
                                        </div>
                                        <p className="text-sm font-bold flex-shrink-0">-{formatAmount(expense.amount)}</p>
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
        </div>
    );
}
