import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface EmojiReactionProps {
  trigger?: boolean;
  emoji?: string;
  count?: number;
  duration?: number;
}

export function EmojiReaction({ 
  trigger = false, 
  emoji = '❤️', 
  count = 5,
  duration = 1500 
}: EmojiReactionProps) {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: count }, (_, i) => Date.now() + i);
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, count, duration]);

  return (
    <AnimatePresence>
      {particles.map((id, index) => (
        <motion.span
          key={id}
          className="pointer-events-none fixed text-2xl z-50"
          style={{
            left: `${50 + (Math.random() - 0.5) * 20}%`,
            top: '50%',
          }}
          initial={{ 
            opacity: 1, 
            scale: 0.5, 
            y: 0 
          }}
          animate={{ 
            opacity: 0, 
            scale: 1.5, 
            y: -100 - Math.random() * 50,
            x: (Math.random() - 0.5) * 100,
            rotate: Math.random() * 360,
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: duration / 1000,
            delay: index * 0.05,
            ease: "easeOut"
          }}
        >
          {emoji}
        </motion.span>
      ))}
    </AnimatePresence>
  );
}

// Confetti burst for celebrations
export function ConfettiBurst({ trigger = false }: { trigger: boolean }) {
  const confettiEmojis = ['🎉', '✨', '💫', '⭐', '🌟', '💖'];
  
  return (
    <AnimatePresence>
      {trigger && (
        <>
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="pointer-events-none fixed text-xl z-50"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{ 
                opacity: 1, 
                scale: 0 
              }}
              animate={{ 
                opacity: 0, 
                scale: 1,
                x: Math.cos(i * 30 * Math.PI / 180) * 100,
                y: Math.sin(i * 30 * Math.PI / 180) * 100,
                rotate: Math.random() * 360,
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut"
              }}
            >
              {confettiEmojis[i % confettiEmojis.length]}
            </motion.span>
          ))}
        </>
      )}
    </AnimatePresence>
  );
}

// Heart burst animation for positive actions
export function HeartBurst({ trigger = false }: { trigger: boolean }) {
  const hearts = ['💖', '💕', '💗', '💝', '🩷'];
  
  return (
    <EmojiReaction 
      trigger={trigger} 
      emoji={hearts[Math.floor(Math.random() * hearts.length)]}
      count={8}
      duration={1200}
    />
  );
}
