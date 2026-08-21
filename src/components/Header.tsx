import { useState, useEffect } from 'react';
import { Volume2, VolumeX, BookOpen, Sparkles, Plus } from 'lucide-react';
import { ritualAudio } from '../lib/audio';

interface HeaderProps {
  currentView: 'home' | 'casting' | 'result' | 'journal';
  onNavigateHome: () => void;
  onNavigateJournal: () => void;
  onOpenAbout: () => void;
  journalCount: number;
}

export function Header({
  currentView,
  onNavigateHome,
  onNavigateJournal,
  onOpenAbout,
  journalCount,
}: HeaderProps) {
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    ritualAudio.enabled = audioEnabled;
  }, [audioEnabled]);

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  return (
    <header
      id="app-header"
      className="w-full max-w-5xl mx-auto px-6 py-6 md:py-8 flex items-center justify-between border-b border-[#D8D4CB]/60 select-none"
    >
      {/* Brand / Logo */}
      <button
        id="btn-brand-home"
        onClick={onNavigateHome}
        className="group flex items-baseline gap-3 text-left focus:outline-none cursor-pointer"
      >
        <span className="font-serif-sc text-xl md:text-2xl font-bold tracking-widest text-[#1C1C1A] group-hover:text-[#9A3F35] transition-colors">
          问一事
        </span>
        <span className="text-xs uppercase tracking-[0.2em] text-[#85837C] font-mono-num hidden sm:inline-block">
          Ask · Cast · Reflect
        </span>
      </button>

      {/* Navigation & Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {currentView !== 'home' && (
          <button
            id="btn-new-cast-header"
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#1C1C1A] hover:text-[#9A3F35] border border-[#D8D4CB] hover:border-[#9A3F35] transition-colors tracking-wider"
            title="新起一卦"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">新卦</span>
          </button>
        )}

        <button
          id="btn-nav-journal"
          onClick={onNavigateJournal}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border transition-colors tracking-wider cursor-pointer ${
            currentView === 'journal'
              ? 'bg-[#1C1C1A] text-[#F5F2EA] border-[#1C1C1A]'
              : 'text-[#1C1C1A] hover:text-[#9A3F35] border-[#D8D4CB] hover:border-[#9A3F35]'
          }`}
          title="查看卦历档案"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>卦历</span>
          {journalCount > 0 && (
            <span className="ml-0.5 text-[10px] opacity-70 font-mono-num">({journalCount})</span>
          )}
        </button>

        <button
          id="btn-about-modal"
          onClick={onOpenAbout}
          className="p-1.5 text-[#85837C] hover:text-[#1C1C1A] border border-transparent hover:border-[#D8D4CB] transition-colors cursor-pointer"
          title="理念与易理"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        <button
          id="btn-toggle-sound"
          onClick={toggleAudio}
          className={`p-1.5 border transition-colors cursor-pointer ${
            audioEnabled
              ? 'text-[#85837C] hover:text-[#1C1C1A] border-transparent hover:border-[#D8D4CB]'
              : 'text-[#A8A59D] border-transparent line-through'
          }`}
          title={audioEnabled ? '声音已开启 (点击静音)' : '声音已关闭 (点击开启)'}
        >
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
