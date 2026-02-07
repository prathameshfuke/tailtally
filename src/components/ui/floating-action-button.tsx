import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Receipt, PawPrint, Calculator } from 'lucide-react';
import { useState } from 'react';
import { Button } from './button';
import { useNavigate } from 'react-router-dom';

interface FABOption {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  color?: string;
}

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const options: FABOption[] = [
    {
      icon: <Receipt className="h-4 w-4" />,
      label: 'Log Expense',
      action: () => {
        navigate('/expenses');
        setIsOpen(false);
      },
    },
    {
      icon: <PawPrint className="h-4 w-4" />,
      label: 'Add Pet',
      action: () => {
        navigate('/pets');
        setIsOpen(false);
      },
    },
    {
      icon: <Calculator className="h-4 w-4" />,
      label: 'Estimate Costs',
      action: () => {
        navigate('/estimator');
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-center gap-3">
      {/* Options */}
      <AnimatePresence>
        {isOpen && (
          <>
            {options.map((option, index) => (
              <motion.div
                key={option.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { delay: index * 0.05 }
                }}
                exit={{ 
                  opacity: 0, 
                  y: 20, 
                  scale: 0.8,
                  transition: { delay: (options.length - index) * 0.05 }
                }}
                className="flex items-center gap-2"
              >
                <span className="rounded-full bg-card px-3 py-1.5 text-sm font-medium shadow-lg">
                  {option.label}
                </span>
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
                  onClick={option.action}
                >
                  {option.icon}
                </Button>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
      
      {/* Main FAB */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-glow bg-gradient-to-br from-primary to-[hsl(280,70%,50%)]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </motion.div>
        </Button>
      </motion.div>
      
      {/* Paw print decoration */}
      {!isOpen && (
        <motion.div
          className="absolute -top-2 -right-2 text-lg"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 15, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity 
          }}
        >
          🐾
        </motion.div>
      )}
    </div>
  );
}
