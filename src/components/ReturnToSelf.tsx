import { useState } from 'react';
import { Bookmark, Compass, CheckCircle2 } from 'lucide-react';
import { CastingResult, JournalRecord } from '../types/divination';
import { saveJournalRecord } from '../lib/storage';

interface ReturnToSelfProps {
  result: CastingResult;
  selfThought: string;
  onSavedToJournal: (record: JournalRecord) => void;
  onNavigateHome: () => void;
  onNavigateJournal: () => void;
}

export function ReturnToSelf({
  result,
  selfThought,
  onSavedToJournal,
  onNavigateHome,
  onNavigateJournal,
}: ReturnToSelfProps) {
  const [afterAiReflection, setAfterAiReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const newRecord: JournalRecord = {
      id: result.id,
      createdAt: result.timestamp,
      question: result.question,
      castingResult: {
        ...result,
        selfReflection: selfThought,
        aiReflection: afterAiReflection,
      },
      selfReflection: selfThought,
      aiReflection: afterAiReflection,
    };

    saveJournalRecord(newRecord);
    onSavedToJournal(newRecord);
    setIsSaved(true);
  };

  return (
    <section
      id="return-to-self-section"
      className="w-full max-w-3xl mx-auto space-y-8 pt-8 pb-16 border-t border-[#D8D4CB]/60"
    >
      {/* Editorial Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-[#9A3F35] text-xs uppercase tracking-[0.2em] font-mono-num mb-1">
          <Compass className="w-3.5 h-3.5" />
          <span>CLOSING REFLECTION</span>
        </div>
        <h2 className="font-serif-sc text-3xl sm:text-4xl text-[#1C1C1A] tracking-wider">
          回到自己
        </h2>
        <div className="font-serif-sc text-sm sm:text-base text-[#85837C] leading-relaxed space-y-1">
          <p>AI 可以提供另一个视角。</p>
          <p className="text-[#1C1C1A] font-medium">但最后怎么理解这件事、如何踏出下一步，还是你的。</p>
        </div>
      </div>

      {/* After-AI Reflection Space */}
      <div className="space-y-2">
        <label
          htmlFor="input-after-ai-thought"
          className="block text-xs font-serif-sc text-[#85837C] tracking-wide"
        >
          听完 AI 的视角后，你现在内心的想法与打算（可选记录）：
        </label>
        <textarea
          id="input-after-ai-thought"
          rows={4}
          value={afterAiReflection}
          onChange={(e) => setAfterAiReflection(e.target.value)}
          placeholder="例如：AI 提醒了我关于节奏的盲点，但我依然决定在下周主动推进……"
          className="w-full bg-[#EBE7DD]/30 border border-[#D8D4CB] focus:border-[#1C1C1A] focus:bg-[#F5F2EA] text-sm sm:text-base font-serif-sc text-[#1C1C1A] placeholder:text-[#A8A59D]/70 p-5 leading-relaxed focus:outline-none transition-all duration-300 resize-y"
        />
      </div>

      {/* Save Action Bar */}
      <div className="p-6 bg-[#EBE7DD]/40 border border-[#D8D4CB] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-serif-sc text-sm sm:text-base font-medium text-[#1C1C1A]">
            归档至个人卦历
          </h4>
          <p className="text-xs text-[#85837C] font-serif-sc">
            完整保存问题、卦象六爻、初始直觉与最终反思，仅存储在本地设备中。
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSaved ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-[#9A3F35] font-serif-sc">
                <CheckCircle2 className="w-4 h-4 text-[#9A3F35]" />
                <span>已存入卦历</span>
              </span>
              <button
                type="button"
                onClick={onNavigateJournal}
                className="px-4 py-2 bg-[#1C1C1A] hover:bg-[#9A3F35] text-[#F5F2EA] font-serif-sc text-xs tracking-wider transition-colors cursor-pointer"
              >
                查看卦历
              </button>
            </div>
          ) : (
            <button
              type="button"
              id="btn-save-journal"
              onClick={handleSave}
              className="px-6 py-2.5 bg-[#1C1C1A] hover:bg-[#9A3F35] text-[#F5F2EA] font-serif-sc text-sm tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <Bookmark className="w-4 h-4" />
              <span>保存这次占卦</span>
            </button>
          )}
        </div>
      </div>

      {/* New Cast Action */}
      <div className="pt-6 text-center">
        <button
          type="button"
          onClick={onNavigateHome}
          className="text-xs font-serif-sc text-[#85837C] hover:text-[#9A3F35] tracking-widest border-b border-transparent hover:border-[#9A3F35] pb-0.5 transition-colors cursor-pointer"
        >
          问另一件事 · 起新卦
        </button>
      </div>
    </section>
  );
}
