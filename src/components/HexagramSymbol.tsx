import { motion } from 'motion/react';
import { Line } from '../types/divination';

interface HexagramSymbolProps {
  lines: Line[]; // Array of 6 lines where index 0 is position 1 (bottom), index 5 is position 6 (top)
  size?: 'hero' | 'large' | 'medium' | 'compact' | 'mini';
  highlightChanging?: boolean;
  showLabels?: boolean;
  animateReveal?: boolean;
  activeLineIndex?: number; // For casting progress
}

export function HexagramSymbol({
  lines,
  size = 'large',
  highlightChanging = true,
  showLabels = false,
  animateReveal = false,
  activeLineIndex,
}: HexagramSymbolProps) {
  // Visual order is Top (Position 6) to Bottom (Position 1)
  const displayLines = [...lines].reverse();

  // Size definitions
  const dimensions = {
    hero: {
      width: 'w-48 sm:w-64',
      lineHeight: 'h-3 sm:h-3.5',
      gap: 'gap-3 sm:gap-4',
      centerGap: 'w-4 sm:w-6',
      fontSize: 'text-xs sm:text-sm',
    },
    large: {
      width: 'w-36 sm:w-44',
      lineHeight: 'h-2 sm:h-2.5',
      gap: 'gap-2 sm:gap-2.5',
      centerGap: 'w-3 sm:w-4',
      fontSize: 'text-xs',
    },
    medium: {
      width: 'w-24 sm:w-28',
      lineHeight: 'h-1.5 sm:h-2',
      gap: 'gap-1.5',
      centerGap: 'w-2 sm:w-2.5',
      fontSize: 'text-[10px]',
    },
    compact: {
      width: 'w-16',
      lineHeight: 'h-1',
      gap: 'gap-1',
      centerGap: 'w-1.5',
      fontSize: 'text-[9px]',
    },
    mini: {
      width: 'w-10',
      lineHeight: 'h-0.5',
      gap: 'gap-0.5',
      centerGap: 'w-1',
      fontSize: 'text-[8px]',
    },
  }[size];

  return (
    <div
      id="hexagram-symbol-container"
      className={`flex flex-col ${dimensions.gap} ${dimensions.width} select-none`}
    >
      {displayLines.map((line, visualIdx) => {
        // Visual index 0 corresponds to line.position 6
        // line.position is 1..6
        const isChanging = highlightChanging && line.changing;
        const isYang = line.type === 'yang';
        const isCurrentActive = activeLineIndex !== undefined && line.position === activeLineIndex;

        const lineColor = isChanging
          ? 'bg-[#9A3F35]'
          : isCurrentActive
          ? 'bg-[#1C1C1A]'
          : 'bg-[#1C1C1A]';

        return (
          <motion.div
            key={`line-${line.position}`}
            initial={animateReveal ? { opacity: 0, scaleY: 0.8, filter: 'blur(3px)' } : false}
            animate={{ opacity: 1, scaleY: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.45, delay: visualIdx * 0.04 }}
            className="flex items-center justify-between w-full group relative"
          >
            {/* Left Yao Name (if enabled) */}
            {showLabels && (
              <span
                className={`w-10 text-right pr-2.5 font-serif-sc ${dimensions.fontSize} ${
                  isChanging ? 'text-[#9A3F35] font-semibold' : 'text-[#85837C]'
                }`}
              >
                {line.name}
              </span>
            )}

            {/* Line Bar Graphic */}
            <div className="flex-1 flex items-center">
              {isYang ? (
                // Solid Yang Line
                <div
                  className={`w-full ${dimensions.lineHeight} ${lineColor} rounded-none transition-all duration-300 relative`}
                >
                  {isChanging && (
                    <span
                      title="老阳（变爻）"
                      className="absolute -right-5 sm:-right-6 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#9A3F35]"
                    >
                      ○
                    </span>
                  )}
                </div>
              ) : (
                // Broken Yin Line (two segments with center space)
                <div className="w-full flex items-center justify-between">
                  <div
                    className={`flex-1 ${dimensions.lineHeight} ${lineColor} transition-all duration-300`}
                  />
                  <div className={`${dimensions.centerGap} shrink-0`} />
                  <div
                    className={`flex-1 ${dimensions.lineHeight} ${lineColor} transition-all duration-300 relative`}
                  >
                    {isChanging && (
                      <span
                        title="老阴（变爻）"
                        className="absolute -right-5 sm:-right-6 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#9A3F35]"
                      >
                        ✕
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Changing indicator tag (optional) */}
            {showLabels && isChanging && (
              <span className="w-12 pl-2 text-[11px] text-[#9A3F35] font-mono-num">
                {line.value === 9 ? '老阳' : '老阴'}
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
