"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FlippingCardProps {
  className?: string;
  height?: number;
  width?: number;
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
}

export function FlippingCard({
  className,
  height = 300,
  width = 350,
  frontContent,
  backContent,
}: FlippingCardProps) {
  return (
    <div
      className={cn("group perspective-1000", className)}
      style={{ width, height }}
    >
      <div
        className="relative h-full w-full transition-transform duration-500 transform-style-preserve-3d group-hover:rotate-y-180"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl border border-border bg-card shadow-lg backface-hidden"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          {frontContent}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl border border-border bg-card shadow-lg backface-hidden rotate-y-180"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
}
