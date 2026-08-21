import { useState, FormEvent, KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Compass } from 'lucide-react';

interface QuestionInputProps {
  onStartCasting: (question: string) => void;
  initialQuestion?: string;
}

const INSPIRATION_QUESTIONS = [
  '我是否应该接受这份新的工作机会？',
  '面对眼前的停滞与阻碍，我该如何破局？',
  '这段合作关系在未来的发展走向如何？',
  '我应当继续坚持当前方向，还是适时调整？',
  '在接下来的关键抉择中，我最该警惕什么？',
];

export function QuestionInput({ onStartCasting, initialQuestion = '' }: QuestionInputProps) {
  const [question, setQuestion] = useState(initialQuestion);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const clean = question.trim();
    if (!clean) {
      setErrorMsg('请写下你心中真正想问的一件事');
      return;
    }
    setErrorMsg('');
    onStartCasting(clean);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      id="question-input-stage"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center"
    >
      {/* Editorial Title */}
      <div className="space-y-4 mb-10 md:mb-14">
        <span className="text-xs uppercase tracking-[0.3em] text-[#85837C] font-mono-num block">
          HEXAGRAM INQUIRY
        </span>
        <h1 className="font-serif-sc text-4xl sm:text-5xl md:text-6xl font-normal tracking-wide text-[#1C1C1A]">
          问一事
        </h1>
        <p className="font-serif-sc text-sm sm:text-base text-[#85837C] tracking-widest max-w-md mx-auto pt-2">
          静下心来，想清楚你真正想问的事。
        </p>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="relative group">
          <textarea
            id="input-user-question"
            rows={3}
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            onKeyDown={handleKeyDown}
            placeholder="例如：我是否应该接受这份新的工作机会？"
            className="w-full bg-transparent border-b-2 border-[#D8D4CB] focus:border-[#1C1C1A] text-lg sm:text-xl md:text-2xl font-serif-sc text-[#1C1C1A] placeholder:text-[#A8A59D]/60 p-4 pb-6 text-center focus:outline-none transition-colors resize-none leading-relaxed"
            autoFocus
          />
        </div>

        {errorMsg && (
          <p className="text-xs text-[#9A3F35] font-serif-sc tracking-wider animate-fade-in">
            {errorMsg}
          </p>
        )}

        {/* Primary CTA Button */}
        <div className="pt-4">
          <button
            type="submit"
            id="btn-start-cast"
            className="group inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-3.5 sm:py-4 bg-[#1C1C1A] hover:bg-[#9A3F35] text-[#F5F2EA] font-serif-sc text-base sm:text-lg tracking-widest transition-all duration-300 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
          >
            <span>起 卦</span>
            <ArrowRight className="w-4 h-4 text-[#F5F2EA] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>

      {/* Suggested Inquiries / Prompts */}
      <div className="mt-14 md:mt-20 w-full pt-10 border-t border-[#D8D4CB]/40">
        <div className="flex items-center justify-center gap-2 text-xs text-[#85837C] tracking-widest font-serif-sc mb-4">
          <Compass className="w-3.5 h-3.5 text-[#A8A59D]" />
          <span>若无头绪，亦可参考这些常问之事</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
          {INSPIRATION_QUESTIONS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuestion(item);
                setErrorMsg('');
              }}
              className="text-xs text-[#85837C] hover:text-[#1C1C1A] bg-[#EBE7DD]/50 hover:bg-[#EBE7DD] px-3 py-1.5 transition-colors border border-transparent hover:border-[#D8D4CB] tracking-wide cursor-pointer text-left"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
