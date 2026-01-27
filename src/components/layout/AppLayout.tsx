import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Receipt, PawPrint, BarChart3, Settings } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/', label: 'Hub', icon: Home },
  { path: '/expenses', label: 'History', icon: Receipt },
  { path: '/pets', label: 'Pack', icon: PawPrint },
  { path: '/analytics', label: 'Stats', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen font-display">
      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation Bar (iOS/Playful Style) */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 flex items-center justify-around px-6 pb-4 z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1 transition-all duration-200',
                isActive
                  ? 'text-purple-600'
                  : 'text-gray-400'
              )}
            >
              <Icon 
                className={cn(
                  "w-6 h-6 transition-all duration-200",
                  isActive && "scale-110"
                )} 
                fill={isActive ? 'currentColor' : 'none'}
              />
              <span className={cn(
                "text-[10px] font-bold uppercase",
                isActive && "font-extrabold"
              )}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
