import { Menu, Bell, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  variant?: 'gradient' | 'solid';
}

export function PageHeader({ title, subtitle, variant = 'solid' }: PageHeaderProps) {
  const navigate = useNavigate();

  if (variant === 'gradient') {
    return (
      <div className="wavy-header pt-12 pb-20 px-6 relative overflow-hidden">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
              <Menu className="text-white w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden">
              <img 
                src="/logo.png" 
                alt="TailTally" 
                className="w-full h-full object-contain mix-blend-screen opacity-90"
              />
            </div>
            <h2 className="text-white text-xl font-fredoka font-bold tracking-tight">TailTally</h2>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/settings')}
              className="bg-white/20 p-2 rounded-full backdrop-blur-md"
            >
              <SettingsIcon className="text-white w-5 h-5" />
            </motion.button>
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
              <Bell className="text-white w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="relative z-10 mb-4">
          <h1 className="text-white text-3xl font-bold leading-tight">{title}</h1>
          {subtitle && <p className="text-white/80 text-sm mt-1">{subtitle}</p>}
        </div>
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 border-b border-purple-100 dark:border-purple-900/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-purple-600 bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-sm"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
              <img 
                src="/logo.png" 
                alt="TailTally" 
                className="w-full h-full object-contain opacity-90"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <h2 className="text-purple-600 dark:text-purple-400 text-lg font-fredoka font-bold">TailTally</h2>
          </div>
          <p className="text-purple-600/60 dark:text-purple-400/60 text-xs font-bold uppercase tracking-wider">{title}</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/settings')}
            className="text-purple-600 bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-sm"
          >
            <SettingsIcon className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-purple-600 bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-sm"
          >
            <Bell className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </header>
  );
}
