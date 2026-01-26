import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CuteMascot } from './cute-mascot';
import { PetType } from '@/lib/types';

interface CuteEmptyStateProps {
  petType?: PetType;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  illustration?: 'sleeping' | 'waiting' | 'playing' | 'curious';
}

const ILLUSTRATIONS = {
  sleeping: { emoji: '😴', mood: 'sleepy' as const, message: 'Zzz...' },
  waiting: { emoji: '👀', mood: 'happy' as const, message: 'Looking for something?' },
  playing: { emoji: '🎾', mood: 'excited' as const, message: 'Let\'s play!' },
  curious: { emoji: '🔍', mood: 'happy' as const, message: 'What\'s next?' },
};

export function CuteEmptyState({ 
  petType = 'other',
  title, 
  description, 
  action, 
  className,
  illustration = 'waiting'
}: CuteEmptyStateProps) {
  const illustrationData = ILLUSTRATIONS[illustration];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-accent/50 to-card p-12 text-center relative overflow-hidden',
        className
      )}
    >
      {/* Decorative paw prints */}
      <div className="absolute top-4 left-4 text-2xl opacity-10 rotate-[-15deg]">🐾</div>
      <div className="absolute top-8 right-8 text-xl opacity-10 rotate-[20deg]">🐾</div>
      <div className="absolute bottom-6 left-8 text-lg opacity-10 rotate-[-25deg]">🐾</div>
      <div className="absolute bottom-4 right-4 text-2xl opacity-10 rotate-[15deg]">🐾</div>
      
      {/* Main mascot */}
      <div className="relative mb-6">
        <CuteMascot 
          type={petType} 
          size="xl" 
          mood={illustrationData.mood}
        />
        <motion.div
          className="absolute -top-4 -right-4 text-2xl"
          animate={{ 
            y: [0, -5, 0],
            rotate: [0, 10, -10, 0] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity 
          }}
        >
          {illustrationData.emoji}
        </motion.div>
      </div>
      
      {/* Speech bubble */}
      <motion.div
        className="mb-4 rounded-2xl bg-primary/10 px-4 py-2 text-sm text-primary font-medium"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        {illustrationData.message}
      </motion.div>
      
      <h3 className="mb-2 text-xl font-bold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-muted-foreground">{description}</p>
      {action}
    </motion.div>
  );
}
