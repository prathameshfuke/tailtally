import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function LandingNav() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}

          <Link to="/" className="flex items-center gap-3 group">
            <motion.img
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              src="/logo.jpeg"
              alt="TailTally Logo"
              className="size-10 sm:size-12 rounded-full object-cover shadow-lg group-hover:shadow-xl transition-shadow ring-2 ring-primary/20 group-hover:ring-primary/40"
            />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-orange-500 to-orange-600 bg-clip-text text-transparent">
              TailTally
            </span>
          </Link>

          {/* CTA Button */}
          <Link to="/dashboard">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="h-10 sm:h-12 px-4 sm:px-8 rounded-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-lg hover:shadow-xl transition-all text-sm sm:text-base font-bold"
              >
                Go to Dashboard
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
