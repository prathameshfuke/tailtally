import { motion } from 'framer-motion';
import { PetType } from '@/lib/types';

interface CuteMascotProps {
  type?: PetType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  mood?: 'happy' | 'excited' | 'sleepy' | 'love';
  className?: string;
}

const PET_MASCOTS: Record<PetType, string> = {
  dog: '🐕',
  cat: '🐱',
  bird: '🐦',
  fish: '🐠',
  rabbit: '🐰',
  other: '🐾',
};

const MOOD_EXTRAS: Record<string, string> = {
  happy: '✨',
  excited: '🎉',
  sleepy: '💤',
  love: '💕',
};

const sizeClasses = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-6xl',
  xl: 'text-8xl',
};

export function CuteMascot({ 
  type = 'other', 
  size = 'md', 
  animate = true, 
  mood = 'happy',
  className = ''
}: CuteMascotProps) {
  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      initial={animate ? { scale: 0.8, opacity: 0 } : undefined}
      animate={animate ? { 
        scale: 1, 
        opacity: 1,
        y: [0, -5, 0],
      } : undefined}
      transition={{
        scale: { duration: 0.3 },
        y: { 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }
      }}
    >
      <span className={sizeClasses[size]}>{PET_MASCOTS[type]}</span>
      {mood && (
        <motion.span
          className="absolute -top-1 -right-1 text-lg"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity 
          }}
        >
          {MOOD_EXTRAS[mood]}
        </motion.span>
      )}
    </motion.div>
  );
}

// Floating pets background decoration
export function FloatingPets({ count = 5 }: { count?: number }) {
  const pets: PetType[] = ['dog', 'cat', 'bird', 'fish', 'rabbit'];
  
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-10 z-0">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 10 - 5, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          {PET_MASCOTS[pets[i % pets.length]]}
        </motion.div>
      ))}
    </div>
  );
}

// Paw print trail decoration
export function PawPrintTrail({ className = '' }: { className?: string }) {
  return (
    <div className={`flex gap-2 opacity-20 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <motion.span
          key={i}
          className="text-primary text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 0], y: [10, 0, -10] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          🐾
        </motion.span>
      ))}
    </div>
  );
}
