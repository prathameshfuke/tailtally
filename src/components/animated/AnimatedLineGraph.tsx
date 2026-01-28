import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface DataPoint {
  name: string;
  value: number;
}

interface AnimatedLineGraphProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  gradient?: string;
}

export function AnimatedLineGraph({ 
  data, 
  height = 200, 
  color = "#f58a3d",
  gradient = "url(#lineGradient)"
}: AnimatedLineGraphProps) {
  const { points, maxValue, pathD, areaD } = useMemo(() => {
    if (data.length === 0) return { points: [], maxValue: 0, pathD: '', areaD: '' };

    const maxVal = Math.max(...data.map(d => d.value), 1);
    const width = 100; // percentage
    const spacing = width / (data.length - 1 || 1);

    const pts = data.map((d, i) => ({
      x: i * spacing,
      y: 100 - (d.value / maxVal) * 90, // 90% of height, leave 10% padding
      value: d.value,
      name: d.name
    }));

    // Create SVG path for line
    const path = pts.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ');

    // Create SVG path for area (gradient fill)
    const area = `M ${pts[0].x} 100 L ${pts.map(p => `${p.x} ${p.y}`).join(' L ')} L ${pts[pts.length - 1].x} 100 Z`;

    return { points: pts, maxValue: maxVal, pathD: path, areaD: area };
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-gray-400 text-sm">No data yet</p>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height }}>
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f58a3d" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <motion.path
          d={areaD}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Line path */}
        <motion.path
          d={pathD}
          fill="none"
          stroke={gradient}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Dots */}
        {points.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={color}
            stroke="white"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.3, 
              delay: 0.8 + (i * 0.1),
              type: "spring",
              stiffness: 300
            }}
            whileHover={{ scale: 1.5 }}
          />
        ))}
      </svg>

      {/* Labels */}
      <div className="flex justify-between mt-2 px-2">
        {data.map((d, i) => (
          <span key={i} className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
            {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}
