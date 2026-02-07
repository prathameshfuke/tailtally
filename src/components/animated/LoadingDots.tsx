import { motion } from 'framer-motion';

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function LoadingDots({ size = 'md', color = 'bg-primary' }: LoadingDotsProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const dotSize = sizeClasses[size];

  const jumpAnimation = {
    y: [0, -15, 0],
  };

  const transition = {
    duration: 0.6,
    repeat: Infinity,
    ease: "easeInOut" as const
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <motion.div
        className={`${dotSize} ${color} rounded-full`}
        animate={jumpAnimation}
        transition={{ ...transition, delay: 0 }}
      />
      <motion.div
        className={`${dotSize} ${color} rounded-full`}
        animate={jumpAnimation}
        transition={{ ...transition, delay: 0.2 }}
      />
      <motion.div
        className={`${dotSize} ${color} rounded-full`}
        animate={jumpAnimation}
        transition={{ ...transition, delay: 0.4 }}
      />
    </div>
  );
}
