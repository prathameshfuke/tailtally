"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Visual1Props {
  className?: string;
  mainColor?: string;
  secondaryColor?: string;
  gridColor?: string;
}

export function Visual1({
  className,
  mainColor = "#ff6900",
  secondaryColor = "#f54900",
  gridColor = "#80808015",
}: Visual1Props) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-gradient-to-br from-background to-muted", className)}>
      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${gridColor} 1px, transparent 1px),
            linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Animated circles */}
      <motion.div
        className="absolute w-32 h-32 rounded-full blur-2xl opacity-60"
        style={{ backgroundColor: mainColor }}
        initial={{ x: "20%", y: "20%" }}
        animate={{
          x: ["20%", "60%", "40%", "20%"],
          y: ["20%", "40%", "60%", "20%"],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-24 h-24 rounded-full blur-2xl opacity-50"
        style={{ backgroundColor: secondaryColor }}
        initial={{ x: "60%", y: "60%" }}
        animate={{
          x: ["60%", "30%", "50%", "60%"],
          y: ["60%", "30%", "50%", "60%"],
          scale: [1, 0.8, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Data visualization mockup */}
      <div className="absolute bottom-4 left-4 right-4 flex items-end gap-2">
        {[0.4, 0.6, 0.3, 0.8, 0.5, 0.7, 0.9, 0.4, 0.6, 0.5].map((height, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t"
            style={{
              height: `${height * 60}px`,
              background: `linear-gradient(to top, ${mainColor}, ${secondaryColor})`,
              opacity: 0.6 + i * 0.04,
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{
              delay: i * 0.1,
              duration: 0.6,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Floating avatars */}
      <motion.div
        className="absolute top-4 right-4 flex -space-x-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: mainColor }}
        >
          🐕
        </div>
        <div
          className="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: secondaryColor }}
        >
          🐈
        </div>
      </motion.div>

      {/* Label */}
      <motion.div
        className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg"
        style={{ backgroundColor: mainColor }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        Live Analytics
      </motion.div>
    </div>
  );
}
