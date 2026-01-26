import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PetAvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  borderColor?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PetAvatar({ 
  src, 
  alt, 
  size = 'md', 
  borderColor = '#8b5cf6',
  selected = false,
  onClick,
  className 
}: PetAvatarProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  const borderWidthClasses = {
    sm: 'border-2',
    md: 'border-3',
    lg: 'border-4',
    xl: 'border-4',
  };

  return (
    <motion.div
      whileHover={{ scale: onClick ? 1.1 : 1 }}
      whileTap={{ scale: onClick ? 0.95 : 1 }}
      className={cn(
        "relative cursor-pointer transition-all duration-200",
        className
      )}
      onClick={onClick}
    >
      <div 
        className={cn(
          "rounded-full overflow-hidden",
          sizeClasses[size],
          borderWidthClasses[size],
          selected ? "ring-4 ring-offset-2" : ""
        )}
        style={{ 
          borderColor,
          borderStyle: 'solid'
        }}
      >
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      </div>
      {selected && (
        <div 
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
          style={{ backgroundColor: borderColor }}
        >
          ✓
        </div>
      )}
    </motion.div>
  );
}
