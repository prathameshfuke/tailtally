import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FloatingActionButton } from '@/components/ui/floating-action-button';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/', label: 'Overview', icon: 'dashboard' },
  { path: '/expenses', label: 'Expenses', icon: 'receipt_long' },
  { path: '/pets', label: 'Pets', icon: 'pets' },
  { path: '/analytics', label: 'Analytics', icon: 'insights' },
  { path: '/budget', label: 'Budget', icon: 'account_balance_wallet' }, // Replaced Settings with Budget for now as per existing app features
];

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#131118] dark:text-white font-sans">

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-100 dark:border-white/10 bg-white dark:bg-background-dark p-6">
          <div className="flex items-center gap-3 mb-10">
            <img src="/logo.png" alt="Tail Tally" className="size-10 object-contain" />
            <h1 className="text-xl font-bold tracking-tight">Tail Tally</h1>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                  )
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
              </NavLink>
            ))}
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 mt-auto',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                )
              }
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="font-semibold">Settings</span>
            </NavLink>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className={cn(
        "min-h-screen transition-all duration-200",
        !isMobile ? "pl-64" : "pb-24"
      )}>
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation - Playful Design */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-background-dark/95 backdrop-blur-2xl border-t border-gray-100 dark:border-white/10 safe-area-bottom shadow-2xl">
          <div className="px-4 py-2 flex justify-around items-center">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 transition-all duration-200 py-2 px-3 rounded-2xl',
                    isActive ? 'text-primary scale-110' : 'text-gray-400 dark:text-gray-500 hover:scale-105'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={cn(
                      "material-symbols-outlined text-2xl transition-all",
                      isActive && "font-bold"
                    )}>
                      {item.icon}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold",
                      isActive ? "text-primary" : "text-gray-400"
                    )}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="absolute -bottom-0.5 w-8 h-1 bg-primary rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 transition-all duration-200 py-2 px-3 rounded-2xl',
                  isActive ? 'text-primary scale-110' : 'text-gray-400 dark:text-gray-500 hover:scale-105'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className={cn(
                    "material-symbols-outlined text-2xl transition-all",
                    isActive && "font-bold"
                  )}>
                    settings
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold",
                    isActive ? "text-primary" : "text-gray-400"
                  )}>
                    Settings
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-0.5 w-8 h-1 bg-primary rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          </div>
        </nav>
      )}
    </div>
  );
}
