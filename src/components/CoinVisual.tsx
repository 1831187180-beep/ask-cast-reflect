import React from 'react';
import { motion } from 'motion/react';
import { CoinValue } from '../types/divination';

export interface CoinVisualProps {
  key?: React.Key;
  value: CoinValue; // 2 (Yin/back) or 3 (Yang/front)
  isFlipping?: boolean;
  delayIndex?: number;
  size?: 'normal' | 'small';
}

export function CoinVisual({
  value,
  isFlipping = false,
  delayIndex = 0,
  size = 'normal',
}: CoinVisualProps) {
  const isYang = value === 3;
  const isNormal = size === 'normal';

  const containerSize = isNormal ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-10 h-10';
  const squareHoleSize = isNormal ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-3 h-3';

  return (
    <div className={`relative flex items-center justify-center ${containerSize} select-none`}>
      <motion.div
        animate={
          isFlipping
            ? {
                rotateY: [0, 720 + (delayIndex * 180), 720],
                rotateX: [0, 360, 0],
                y: [0, -35 - (delayIndex * 10), 0],
                scale: [1, 1.12, 1],
              }
            : { rotateY: 0, rotateX: 0, y: 0, scale: 1 }
        }
        transition={{
          duration: isFlipping ? 0.75 + delayIndex * 0.08 : 0.3,
          ease: [0.25, 1, 0.5, 1],
        }}
        className={`w-full h-full rounded-full border-2 border-[#5C4D3C] bg-gradient-to-br from-[#E2D5C3] via-[#CBBBA8] to-[#9C8A76] shadow-sm flex items-center justify-center relative`}
      >
        {/* Outer Coin Rim Ring */}
        <div className="absolute inset-1 rounded-full border border-[#8C7A67]/40 pointer-events-none" />

        {/* Center Square Hole */}
        <div
          className={`${squareHoleSize} bg-[#F5F2EA] border border-[#5C4D3C] relative shadow-inner`}
        />

        {/* Traditional Value Glyph / Character Ring */}
        <div className="absolute inset-0 flex flex-col justify-between items-center py-1 sm:py-1.5 pointer-events-none text-[9px] sm:text-[11px] font-serif-sc font-medium text-[#4A3B2C] opacity-85">
          <span>{isYang ? '乾' : '坤'}</span>
          <span>{isYang ? '三' : '二'}</span>
        </div>

        {/* Left-Right Dots */}
        <div className="absolute inset-0 flex justify-between items-center px-1.5 pointer-events-none text-[8px] text-[#4A3B2C] opacity-60">
          <span>·</span>
          <span>·</span>
        </div>
      </motion.div>
    </div>
  );
}
