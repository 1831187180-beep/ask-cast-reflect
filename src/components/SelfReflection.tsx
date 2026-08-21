import { useState, useEffect } from 'react';
import { PenTool, CheckCircle2 } from 'lucide-react';

interface SelfReflectionProps {
  initialText?: string;
  onSaveReflection: (text: string) => void;
}

export function SelfReflection({ initialText = '', onSaveReflection }: SelfReflectionProps) {
  const [reflection, setReflection] = useState(initialText);
  const [savedBadge, setSavedBadge] = useState(false);

  useEffect(() => {
    setReflection(initialText);
  }, [initialText]);

  const handleChange = (val: string) => {
    setReflection(val);
    onSaveReflection(val);
    setSavedBadge(true);
    const timer = setTimeout(() => setSavedBadge(false), 2000);
    return () => clearTimeout(timer);
  };

  return (
    <section
      id="self-reflection-section"
      className="w-full max-w-3xl mx-auto space-y-6 pt-4 pb-8"
    >
      {/* Editorial Header */}
      <div className="space-y-2 border-b border-[#D8D4CB]/60 pb-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#9A3F35] text-xs uppercase tracking-[0.2em] font-mono-num mb-1">
            <PenTool className="w-3.5 h-3.5" />
            <span>HUMAN AGENCY FIRST</span>
          </div>
          <h2 className="font-serif-sc text-2xl sm:text-3xl text-[#1C1C1A] tracking-wider">
            先问问自己
          </h2>
          <p className="font-serif-sc text-xs sm:text-sm text-[#85837C] tracking-wide pt-1">
            在听见其他人的看法之前，你对这个卦有什么直觉与感受？
          </p>
        </div>

        {savedBadge && (
          <div className="flex items-center gap-1.5 text-xs text-[#85837C] font-serif-sc mt-2 sm:mt-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#9A3F35]" />
            <span>已实时保存在本页</span>
          </div>
        )}
      </div>

      {/* Reflection Journal Area */}
      <div className="relative group">
        <textarea
          id="input-self-reflection"
          rows={5}
          value={reflection}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="写下你看到卦名、卦辞或动爻后的第一反应……（哪怕只是几个零散词汇、当下的隐忧，或是某个豁然开朗的念头）"
          className="w-full bg-[#EBE7DD]/30 border border-[#D8D4CB] focus:border-[#1C1C1A] focus:bg-[#F5F2EA] text-sm sm:text-base font-serif-sc text-[#1C1C1A] placeholder:text-[#A8A59D]/70 p-5 leading-relaxed focus:outline-none transition-all duration-300 resize-y"
        />

        <div className="flex items-center justify-between pt-2 text-[11px] text-[#85837C] font-serif-sc">
          <span>※ 自省内容将作为你后续带给 AI 对话时的重要基准，亦会沉淀入你的个人卦历中。</span>
          <span className="font-mono-num">{reflection.length} 字</span>
        </div>
      </div>
    </section>
  );
}
