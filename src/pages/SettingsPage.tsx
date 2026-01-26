import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10 mb-6">
                <div className="flex items-center p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center bg-primary/10 rounded-full">
                        <span className="material-symbols-outlined text-primary">settings</span>
                    </div>
                    <h2 className="text-[#131118] dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 px-3">Settings</h2>
                </div>
            </header>

            <div className="px-4">
                <h3 className="text-[#131118] dark:text-white text-xl font-bold mb-4">Appearance</h3>

                <Card className="border-gray-100 dark:border-white/10 shadow-sm bg-white dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="text-lg">Theme Preference</CardTitle>
                        <CardDescription>Choose how the Tail Tally app looks to you.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    className={`h-24 flex flex-col gap-2 ${theme === 'light' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-gray-200 dark:border-gray-700'}`}
                                    onClick={() => setTheme('light')}
                                >
                                    <Sun className="h-6 w-6" />
                                    <span className="font-semibold">Light</span>
                                </Button>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    className={`h-24 flex flex-col gap-2 ${theme === 'dark' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-gray-200 dark:border-gray-700'}`}
                                    onClick={() => setTheme('dark')}
                                >
                                    <Moon className="h-6 w-6" />
                                    <span className="font-semibold">Dark</span>
                                </Button>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    className={`h-24 flex flex-col gap-2 ${theme === 'system' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-gray-200 dark:border-gray-700'}`}
                                    onClick={() => setTheme('system')}
                                >
                                    <Laptop className="h-6 w-6" />
                                    <span className="font-semibold">System</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <h3 className="text-[#131118] dark:text-white text-xl font-bold mb-4 mt-8">About</h3>
                <Card className="border-gray-100 dark:border-white/10 shadow-sm bg-white dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="text-lg">Tail Tally</CardTitle>
                        <CardDescription>v1.0.0</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-500 dark:text-gray-400">
                        <p>Designed with love for your furry friends.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
