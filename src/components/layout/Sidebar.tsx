import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Receipt, PawPrint, BarChart3, Target, LogOut, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/expenses', label: 'Expenses', icon: Receipt },
    { path: '/budget', label: 'Budget', icon: Target },
    { path: '/pets', label: 'My Pets', icon: PawPrint },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar() {
    const location = useLocation();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (document.documentElement.classList.contains('dark')) {
            setIsDark(true);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <div className="hidden lg:flex h-screen w-72 flex-col fixed left-0 top-0 border-r border-border bg-card/50 backdrop-blur-xl z-50">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <img src="/logo.jpeg" alt="TailTally Logo" className="size-10 rounded-xl shadow-lg shadow-primary/20 object-cover" />
                    <div>
                        <h1 className="text-xl font-bold font-display tracking-tight">TailTally</h1>
                        <p className="text-xs text-muted-foreground font-medium">Pro Edition</p>
                    </div>
                </div>

                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                        isActive
                                            ? "bg-primary text-white shadow-lg shadow-primary/25"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )
                                }
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground group-hover:text-primary")} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="font-semibold tracking-wide">{item.label}</span>

                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-primary/10 mix-blend-overlay"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 space-y-2 border-t border-border/50">
                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    <span className="font-semibold">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-semibold">Log Out</span>
                </button>
            </div>
        </div>
    );
}
