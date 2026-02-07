import { useState } from 'react';
import { Menu, Bell, X, Home, Receipt, PawPrint, BarChart3, Target, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  { path: '/budget', label: 'Budget', icon: Target },
  { path: '/pets', label: 'My Pets', icon: PawPrint },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
];

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top App Bar - Sticky & Glassmorphic */}
      <div className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(true)}
            className="size-10 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center"
          >
            <Menu className="text-primary w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="size-10 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center"
            onClick={() => {
              toast({
                title: "No new notifications",
                description: "You're all caught up! 🎉",
              });
            }}
          >
            <Bell className="text-primary w-5 h-5" />
          </motion.button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            {title && (
              <>
                {subtitle && <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{subtitle}</p>}
                <h1 className="text-lg font-bold leading-tight">{title}</h1>
              </>
            )}
            {!title && (
              <>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Welcome back!</p>
                <h1 className="text-lg font-bold leading-tight">TailTally</h1>
              </>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex-shrink-0"
          >
            <img
              src="/logo.jpeg"
              alt="TailTally"
              className="w-10 h-10 rounded-xl object-cover shadow-sm"
            />
          </motion.button>
        </div>
      </div>

      {/* Additional content (like subtitles or custom sections) */}
      {children && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Sliding Menu */}
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 z-[60] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="gradient-warm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <PawPrint className="text-white w-5 h-5" />
                    </div>
                    <h2 className="text-white text-xl font-display font-bold">TailTally</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-white/20 p-2 rounded-full backdrop-blur-md"
                  >
                    <X className="text-white w-5 h-5" />
                  </motion.button>
                </div>
                <p className="text-white/80 text-sm">Your Pet Budget Tracker 🐾</p>
              </div>

              {/* Menu Items */}
              <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <motion.button
                      key={item.path}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                        ? 'bg-primary/10 text-primary border-l-4 border-primary'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Made with ❤️ for pet parents
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Version 1.0.0
                  </p>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
