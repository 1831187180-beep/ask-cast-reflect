import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CoinThrow, Line, CastingResult, CoinValue } from '../types/divination';
import { throwThreeCoins, createLineFromThrow } from '../lib/divination/coin';
import { buildCastingResult } from '../lib/divination/hexagramResolver';
import { ritualAudio } from '../lib/audio';
import { CoinVisual } from './CoinVisual';
import { HexagramSymbol } from './HexagramSymbol';

interface RitualCastingProps {
  question: string;
  onCastingComplete: (result: CastingResult) => void;
  onCancel: () => void;
}

export function RitualCasting({ question, onCastingComplete, onCancel }: RitualCastingProps) {
  // Current line position being cast: 1 (初爻) to 6 (上爻)
  const [currentPosition, setCurrentPosition] = useState<number>(1);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  // Accumulated results
  const [currentCoins, setCurrentCoins] = useState<[CoinValue, CoinValue, CoinValue]>([3, 2, 3]);
  const [recordedThrows, setRecordedThrows] = useState<CoinThrow[]>([]);
  const [recordedLines, setRecordedLines] = useState<Line[]>([]);

  // State to hold the final resolved result before transitioning
  const finalResultRef = useRef<CastingResult | null>(null);

  // Handle single throw
  const executeThrow = useCallback(() => {
    if (isFlipping || isComplete || currentPosition > 6) return;

    setIsFlipping(true);
    ritualAudio.playCoinSound();

    // Perform deterministic entropy throw
    const throwResult = throwThreeCoins(currentPosition);
    const newLine = createLineFromThrow(throwResult);

    setTimeout(() => {
      setCurrentCoins(throwResult.coins);
      setIsFlipping(false);

      // Play audio chime for the revealed line
      ritualAudio.playYaoSound(newLine.type === 'yang', newLine.changing);

      const nextThrows = [...recordedThrows, throwResult];
      const nextLines = [...recordedLines, newLine];

      setRecordedThrows(nextThrows);
      setRecordedLines(nextLines);

      if (currentPosition < 6) {
        setCurrentPosition((prev) => prev + 1);
      } else {
        // All 6 lines generated!
        setIsComplete(true);
        ritualAudio.playHexagramCompleteSound();

        const fullResult = buildCastingResult(question, nextThrows, nextLines);
        finalResultRef.current = fullResult;

        // Brief meditative stillness before entering result view
        setTimeout(() => {
          if (finalResultRef.current) {
            onCastingComplete(finalResultRef.current);
          }
        }, 1600);
      }
    }, 850);
  }, [isFlipping, isComplete, currentPosition, recordedThrows, recordedLines, question, onCastingComplete]);

  // Keyboard shortcut: Spacebar or Enter to toss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        executeThrow();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeThrow]);

  return (
    <div
      id="ritual-casting-screen"
      onClick={!isComplete && !isFlipping ? executeThrow : undefined}
      className="relative min-h-[75vh] w-full max-w-4xl mx-auto px-6 py-8 sm:py-12 flex flex-col items-center justify-between cursor-pointer select-none"
    >
      {/* Top Inquiry Banner */}
      <div className="w-full flex items-center justify-between text-xs text-[#85837C] border-b border-[#D8D4CB]/40 pb-4">
        <div className="flex items-center gap-2 max-w-md truncate">
          <span className="font-serif-sc text-[#1C1C1A]">问事：</span>
          <span className="truncate italic">「{question}」</span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          className="text-[#85837C] hover:text-[#9A3F35] transition-colors p-1"
        >
          重新提问
        </button>
      </div>

      {/* Center Ritual Stage */}
      <div className="my-auto flex flex-col items-center justify-center space-y-10 py-6">
        {/* Step Indicator / Status */}
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key={`step-${currentPosition}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-1.5"
            >
              <span className="text-xs uppercase tracking-[0.25em] text-[#85837C] font-mono-num">
                CASTING RITUAL
              </span>
              <h2 className="font-serif-sc text-3xl sm:text-4xl text-[#1C1C1A] tracking-wider">
                第 {currentPosition} / 6 爻
              </h2>
              <p className="text-xs sm:text-sm text-[#85837C] font-serif-sc pt-1">
                {isFlipping ? '铜钱翻落中…' : '点击屏幕任意处起爻'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="complete-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-2"
            >
              <h2 className="font-serif-sc text-4xl sm:text-5xl text-[#9A3F35] tracking-widest">
                卦成。
              </h2>
              <p className="text-xs sm:text-sm text-[#85837C] font-serif-sc pt-1 tracking-widest">
                六爻已定，凝视卦象
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Three Bronze Coins Display */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 py-2">
          {currentCoins.map((coinVal, idx) => (
            <CoinVisual
              key={idx}
              value={coinVal}
              isFlipping={isFlipping}
              delayIndex={idx}
              size="normal"
            />
          ))}
        </div>

        {/* Emerging Hexagram Totem */}
        <div className="pt-4 flex flex-col items-center">
          <div className="text-[11px] text-[#A8A59D] uppercase tracking-widest mb-3 font-mono-num">
            {recordedLines.length === 0 ? '初爻虚位以待' : `已成 ${recordedLines.length} 爻 (自下而上)`}
          </div>

          <div className="p-4 bg-[#EBE7DD]/40 border border-[#D8D4CB] min-w-[200px] flex items-center justify-center">
            {recordedLines.length > 0 ? (
              <HexagramSymbol
                lines={recordedLines}
                size="large"
                highlightChanging={true}
                showLabels={true}
                activeLineIndex={currentPosition}
              />
            ) : (
              <div className="h-28 flex items-center justify-center text-xs text-[#A8A59D] font-serif-sc tracking-widest">
                待摇首爻
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Guidance & Tap Action Button */}
      <div className="w-full flex flex-col items-center text-center space-y-3 pt-6 border-t border-[#D8D4CB]/40">
        {!isComplete ? (
          <button
            type="button"
            disabled={isFlipping}
            onClick={(e) => {
              e.stopPropagation();
              executeThrow();
            }}
            className="px-8 py-3 bg-[#1C1C1A] hover:bg-[#9A3F35] text-[#F5F2EA] font-serif-sc text-sm tracking-widest transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isFlipping ? '起爻中…' : `掷铜钱 · 起第 ${currentPosition} 爻`}
          </button>
        ) : (
          <span className="text-xs text-[#9A3F35] font-serif-sc tracking-widest animate-pulse">
            正在生成完整卦象与易理…
          </span>
        )}

        <span className="text-[11px] text-[#A8A59D] tracking-wider hidden sm:inline-block">
          （亦可按键盘【空格键】或【回车键】进行起卦）
        </span>
      </div>
    </div>
  );
}
