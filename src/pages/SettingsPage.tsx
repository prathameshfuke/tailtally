import { Moon, Sun, Laptop } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/theme-provider';
import { useCurrency } from '@/hooks/useCurrency';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/PageHeader';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const { currency, setCurrency, currencies } = useCurrency();

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-yellow-900/20">
            <div>
                <PageHeader title="Settings ⚙️" />
            </div>

            <div className="px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="border-2 border-primary/10 shadow-playful bg-white dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Theme Preference</CardTitle>
                            <CardDescription>Choose how TailTally looks to you</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`h-24 flex flex-col gap-2 items-center justify-center rounded-xl border-2 transition-all touch-target ${theme === 'light'
                                        ? 'border-primary bg-primary/10'
                                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                                        }`}
                                    onClick={() => setTheme('light')}
                                >
                                    <Sun className="h-6 w-6 text-primary" />
                                    <span className="font-bold text-sm">Light</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`h-24 flex flex-col gap-2 items-center justify-center rounded-xl border-2 transition-all touch-target ${theme === 'dark'
                                        ? 'border-primary bg-primary/10'
                                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                                        }`}
                                    onClick={() => setTheme('dark')}
                                >
                                    <Moon className="h-6 w-6 text-primary" />
                                    <span className="font-bold text-sm">Dark</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`h-24 flex flex-col gap-2 items-center justify-center rounded-xl border-2 transition-all touch-target ${theme === 'system'
                                        ? 'border-primary bg-primary/10'
                                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                                        }`}
                                    onClick={() => setTheme('system')}
                                >
                                    <Laptop className="h-6 w-6 text-primary" />
                                    <span className="font-bold text-sm">System</span>
                                </motion.button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-2 border-primary/10 shadow-playful bg-white dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Currency</CardTitle>
                            <CardDescription>Select your preferred currency for expense tracking</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {currencies.map((curr) => (
                                    <motion.button
                                        key={curr.code}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`h-20 flex flex-col gap-1 items-center justify-center rounded-xl border-2 transition-all touch-target ${currency.code === curr.code
                                            ? 'border-primary bg-primary/10'
                                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                                            }`}
                                        onClick={() => setCurrency(curr.code)}
                                    >
                                        <span className="text-2xl font-bold text-primary">{curr.symbol}</span>
                                        <span className="font-medium text-xs text-muted-foreground">{curr.code}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-2 border-primary/10 shadow-playful bg-white dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">About</CardTitle>
                            <CardDescription>TailTally - Pet Budget Tracker</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                <p>Version 1.0.0</p>
                                <p>Track your pet expenses with ease and style.</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Made for pet parents everywhere</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

