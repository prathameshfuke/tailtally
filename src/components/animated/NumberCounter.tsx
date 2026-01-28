import { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface NumberCounterProps {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function NumberCounter({ 
  value, 
  decimals = 0, 
  duration = 1,
  className = "",
  prefix = "",
  suffix = ""
}: NumberCounterProps) {
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (current) => 
    prefix + current.toFixed(decimals) + suffix
  );

  const prevValueRef = useRef(0);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      spring.set(value);
      prevValueRef.current = value;
    }
  }, [spring, value]);

  return (
    <motion.span className={className}>
      {display}
    </motion.span>
  );
}
