import { Moon, Sun, Laptop } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/theme-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/PageHeader';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 pb-24">
            <PageHeader title="Settings ⚙️" />

            <div className="px-4 pt-6 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-2 border-purple-100 dark:border-purple-900 shadow-playful bg-white dark:bg-gray-800">
                      <CardHeader>
                          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Theme Preference</CardTitle>
                          <CardDescription className="text-gray-600 dark:text-gray-400">Choose how TailTally looks to you</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <div className="grid grid-cols-3 gap-3">
                              <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`h-24 flex flex-col gap-2 items-center justify-center rounded-xl border-2 transition-all ${
                                    theme === 'light' 
                                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                                  }`}
                                  onClick={() => setTheme('light')}
                              >
                                  <Sun className="h-6 w-6 text-gray-900 dark:text-white" />
                                  <span className="font-bold text-sm text-gray-900 dark:text-white">Light</span>
                              </motion.button>
                              <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`h-24 flex flex-col gap-2 items-center justify-center rounded-xl border-2 transition-all ${
                                    theme === 'dark' 
                                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                                  }`}
                                  onClick={() => setTheme('dark')}
                              >
                                  <Moon className="h-6 w-6 text-gray-900 dark:text-white" />
                                  <span className="font-bold text-sm text-gray-900 dark:text-white">Dark</span>
                              </motion.button>
                              <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`h-24 flex flex-col gap-2 items-center justify-center rounded-xl border-2 transition-all ${
                                    theme === 'system' 
                                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                                  }`}
                                  onClick={() => setTheme('system')}
                              >
                                  <Laptop className="h-6 w-6 text-gray-900 dark:text-white" />
                                  <span className="font-bold text-sm text-gray-900 dark:text-white">System</span>
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
                  <Card className="border-2 border-purple-100 dark:border-purple-900 shadow-playful bg-white dark:bg-gray-800">
                      <CardHeader>
                          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">About</CardTitle>
                          <CardDescription className="text-gray-600 dark:text-gray-400">TailTally - Pet Budget Tracker</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                              <p>Version 1.0.0</p>
                              <p>Track your pet expenses with ease and style.</p>
                              <p className="text-xs text-gray-500">Made with ❤️ for pet parents everywhere</p>
                          </div>
                      </CardContent>
                  </Card>
                </motion.div>
            </div>
        </div>
    );
}
