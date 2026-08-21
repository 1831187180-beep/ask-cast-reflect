import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { CastingResult, Line } from '../types/divination';
import { TRIGRAMS } from '../data/trigrams';
import { HexagramSymbol } from './HexagramSymbol';

interface HexagramResultProps {
  result: CastingResult;
}

export function HexagramResult({ result }: HexagramResultProps) {
  const { originalHexagram, changedHexagram, changingLines, question } = result;
  const isChanging = changingLines.length > 0;

  const upperOrig = TRIGRAMS[originalHexagram.upperTrigram];
  const lowerOrig = TRIGRAMS[originalHexagram.lowerTrigram];
  const upperChanged = TRIGRAMS[changedHexagram.upperTrigram];
  const lowerChanged = TRIGRAMS[changedHexagram.lowerTrigram];

  // Accordion state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    guaCi: true,
    xiangCi: true,
    yaoCi: true,
    tuanCi: false,
    trigramDetails: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section id="hexagram-result-section" className="w-full max-w-3xl mx-auto space-y-12">
      {/* 1. Top Question & Header */}
      <div className="text-center space-y-4 border-b border-[#D8D4CB]/60 pb-8">
        <span className="text-xs uppercase tracking-[0.25em] text-[#85837C] font-mono-num block">
          INQUIRY RECORD &middot; {new Date(result.timestamp).toLocaleDateString('zh-CN')}
        </span>
        <h2 className="text-sm sm:text-base font-serif-sc text-[#85837C] tracking-widest">
          所问之事：<span className="text-[#1C1C1A] font-medium">「{question}」</span>
        </h2>
      </div>

      {/* 2. Primary Hexagram Visual & Title (Editorial Centerpiece) */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 py-6">
        {/* Original Hexagram (本卦) */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.2em] text-[#85837C] font-mono-num">
              HEXAGRAM {originalHexagram.id} · 本卦
            </span>
            <h1 className="font-serif-sc text-3xl sm:text-4xl text-[#1C1C1A] font-normal tracking-wide">
              {originalHexagram.chineseName}
            </h1>
            <p className="text-xs text-[#85837C] font-cinzel tracking-wider">
              {originalHexagram.englishName}
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-[#EBE7DD]/40 border border-[#D8D4CB]">
            <HexagramSymbol
              lines={result.lines}
              size="hero"
              highlightChanging={true}
              showLabels={true}
              animateReveal={true}
            />
          </div>

          <div className="text-xs text-[#85837C] font-serif-sc space-y-0.5">
            <p>上卦：{upperOrig.chineseName}为{upperOrig.naturalElement}（{upperOrig.attribute}）</p>
            <p>下卦：{lowerOrig.chineseName}为{lowerOrig.naturalElement}（{lowerOrig.attribute}）</p>
          </div>
        </div>

        {/* Transition Arrow & Changed Hexagram (变卦, if any) */}
        {isChanging && (
          <>
            <div className="flex flex-col items-center justify-center text-[#85837C] py-2">
              <span className="text-[11px] font-mono-num uppercase tracking-wider mb-1 text-[#9A3F35]">
                {changingLines.length} 动爻相变
              </span>
              <ArrowRight className="w-5 h-5 text-[#9A3F35] hidden md:block" />
              <div className="w-px h-6 bg-[#D8D4CB] md:hidden my-2" />
            </div>

            {/* Changed Hexagram (变卦) */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-[0.2em] text-[#85837C] font-mono-num">
                  HEXAGRAM {changedHexagram.id} · 变卦
                </span>
                <h2 className="font-serif-sc text-3xl sm:text-4xl text-[#1C1C1A] font-normal tracking-wide">
                  {changedHexagram.chineseName}
                </h2>
                <p className="text-xs text-[#85837C] font-cinzel tracking-wider">
                  {changedHexagram.englishName}
                </p>
              </div>

              <div className="p-5 sm:p-6 bg-[#EBE7DD]/20 border border-[#D8D4CB]/80">
                <HexagramSymbol
                  lines={result.changedLines}
                  size="hero"
                  highlightChanging={false}
                  showLabels={true}
                  animateReveal={true}
                />
              </div>

              <div className="text-xs text-[#85837C] font-serif-sc space-y-0.5">
                <p>上卦：{upperChanged.chineseName}为{upperChanged.naturalElement}</p>
                <p>下卦：{lowerChanged.chineseName}为{lowerChanged.naturalElement}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. Overview Reflection Callout */}
      {originalHexagram.overview && (
        <div className="p-6 bg-[#EBE7DD]/40 border-l-2 border-[#9A3F35] space-y-2">
          <div className="flex items-center gap-2 text-xs font-serif-sc font-medium text-[#9A3F35] tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>象数义理导读</span>
          </div>
          <p className="font-serif-sc text-sm sm:text-base text-[#1C1C1A] leading-relaxed">
            {originalHexagram.overview}
          </p>
        </div>
      )}

      {/* 4. Progressive Disclosure Classical Texts */}
      <div className="space-y-4 pt-4">
        <h3 className="font-serif-sc text-lg text-[#1C1C1A] tracking-wider border-b border-[#D8D4CB]/60 pb-2">
          易经经典原文
        </h3>

        {/* 卦辞 */}
        <div className="border border-[#D8D4CB] bg-[#F5F2EA]">
          <button
            type="button"
            onClick={() => toggleSection('guaCi')}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#EBE7DD]/40 transition-colors cursor-pointer"
          >
            <span className="font-serif-sc text-sm font-medium text-[#1C1C1A] tracking-wide">
              卦辞（The Judgment）
            </span>
            {expandedSections.guaCi ? (
              <ChevronUp className="w-4 h-4 text-[#85837C]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#85837C]" />
            )}
          </button>
          <AnimatePresence>
            {expandedSections.guaCi && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-5 pb-5 pt-1 text-sm sm:text-base font-serif-sc text-[#1C1C1A] leading-relaxed border-t border-[#D8D4CB]/40"
              >
                {originalHexagram.guaCi}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 象辞 / 大象 */}
        <div className="border border-[#D8D4CB] bg-[#F5F2EA]">
          <button
            type="button"
            onClick={() => toggleSection('xiangCi')}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#EBE7DD]/40 transition-colors cursor-pointer"
          >
            <span className="font-serif-sc text-sm font-medium text-[#1C1C1A] tracking-wide">
              象辞（The Image）
            </span>
            {expandedSections.xiangCi ? (
              <ChevronUp className="w-4 h-4 text-[#85837C]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#85837C]" />
            )}
          </button>
          <AnimatePresence>
            {expandedSections.xiangCi && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-5 pb-5 pt-1 text-sm sm:text-base font-serif-sc text-[#1C1C1A] leading-relaxed border-t border-[#D8D4CB]/40"
              >
                {originalHexagram.image}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 动爻爻辞 (Active Lines, or all lines) */}
        <div className="border border-[#D8D4CB] bg-[#F5F2EA]">
          <button
            type="button"
            onClick={() => toggleSection('yaoCi')}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#EBE7DD]/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="font-serif-sc text-sm font-medium text-[#1C1C1A] tracking-wide">
                爻辞（The Lines）
              </span>
              {isChanging ? (
                <span className="text-[11px] px-2 py-0.5 bg-[#9A3F35]/10 text-[#9A3F35] font-serif-sc">
                  当前有 {changingLines.length} 处动爻
                </span>
              ) : (
                <span className="text-[11px] px-2 py-0.5 bg-[#EBE7DD] text-[#85837C] font-serif-sc">
                  六爻静定
                </span>
              )}
            </div>
            {expandedSections.yaoCi ? (
              <ChevronUp className="w-4 h-4 text-[#85837C]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#85837C]" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.yaoCi && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-5 pb-5 pt-3 space-y-3 text-sm font-serif-sc border-t border-[#D8D4CB]/40"
              >
                {/* Render lines from 6 (top) down to 1 (initial) or 1 to 6 */}
                {([
                  { pos: 6, key: 'top', text: originalHexagram.lineTexts.top },
                  { pos: 5, key: 'fifth', text: originalHexagram.lineTexts.fifth },
                  { pos: 4, key: 'fourth', text: originalHexagram.lineTexts.fourth },
                  { pos: 3, key: 'third', text: originalHexagram.lineTexts.third },
                  { pos: 2, key: 'second', text: originalHexagram.lineTexts.second },
                  { pos: 1, key: 'initial', text: originalHexagram.lineTexts.initial },
                ] as const).map((item) => {
                  const castLine = result.lines.find((l: Line) => l.position === item.pos);
                  const isLineChanging = castLine?.changing;

                  return (
                    <div
                      key={item.pos}
                      className={`p-3 transition-colors ${
                        isLineChanging
                          ? 'bg-[#9A3F35]/8 border-l-2 border-[#9A3F35] text-[#1C1C1A]'
                          : 'text-[#85837C] hover:text-[#1C1C1A]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono-num mb-1">
                        <span className={isLineChanging ? 'text-[#9A3F35] font-semibold' : ''}>
                          【第 {item.pos} 爻】{castLine?.name} · {castLine?.value === 9 ? '老阳' : castLine?.value === 6 ? '老阴' : castLine?.value === 7 ? '少阳' : '少阴'}
                        </span>
                        {isLineChanging && (
                          <span className="text-[#9A3F35] text-[11px] font-serif-sc">
                            ● 动爻（将化为变爻）
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed">{item.text}</p>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 彖传 (彖辞) */}
        {originalHexagram.tuanCi && (
          <div className="border border-[#D8D4CB] bg-[#F5F2EA]">
            <button
              type="button"
              onClick={() => toggleSection('tuanCi')}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#EBE7DD]/40 transition-colors cursor-pointer"
            >
              <span className="font-serif-sc text-sm font-medium text-[#1C1C1A] tracking-wide">
                彖曰（The Commentary）
              </span>
              {expandedSections.tuanCi ? (
                <ChevronUp className="w-4 h-4 text-[#85837C]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#85837C]" />
              )}
            </button>
            <AnimatePresence>
              {expandedSections.tuanCi && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-5 pb-5 pt-1 text-sm sm:text-base font-serif-sc text-[#1C1C1A] leading-relaxed border-t border-[#D8D4CB]/40"
                >
                  {originalHexagram.tuanCi}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Section Divider */}
      <div className="pt-6 flex items-center justify-center">
        <div className="h-px w-24 bg-[#D8D4CB]" />
      </div>
    </section>
  );
}
