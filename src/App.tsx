import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CastingResult, JournalRecord } from './types/divination';
import { validateHexagramDatabase } from './lib/divination/validation';
import { getJournalRecords, deleteJournalRecord } from './lib/storage';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QuestionInput } from './components/QuestionInput';
import { RitualCasting } from './components/RitualCasting';
import { HexagramResult } from './components/HexagramResult';
import { SelfReflection } from './components/SelfReflection';
import { AskAI } from './components/AskAI';
import { ReturnToSelf } from './components/ReturnToSelf';
import { JournalHistory } from './components/JournalHistory';
import { AboutModal } from './components/AboutModal';

type AppView = 'home' | 'casting' | 'result' | 'journal';

export default function App() {
  const [view, setView] = useState<AppView>('home');
  const [question, setQuestion] = useState<string>('');
  const [castingResult, setCastingResult] = useState<CastingResult | null>(null);
  const [selfThought, setSelfThought] = useState<string>('');
  const [journalRecords, setJournalRecords] = useState<JournalRecord[]>([]);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // Validate deterministic hexagram database and load initial journal records
  useEffect(() => {
    validateHexagramDatabase();
    setJournalRecords(getJournalRecords());
  }, []);

  // Handlers
  const handleStartCasting = (userQuestion: string) => {
    setQuestion(userQuestion);
    setView('casting');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCastingComplete = (result: CastingResult) => {
    setCastingResult(result);
    setSelfThought('');
    setView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRecord = (record: JournalRecord) => {
    setQuestion(record.question);
    setCastingResult(record.castingResult);
    setSelfThought(record.selfReflection || '');
    setView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRecord = (id: string) => {
    deleteJournalRecord(id);
    setJournalRecords(getJournalRecords());
  };

  const handleRecordSaved = (savedRecord: JournalRecord) => {
    const current = getJournalRecords();
    setJournalRecords(current);
  };

  const handleNavigateHome = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateJournal = () => {
    setJournalRecords(getJournalRecords());
    setView('journal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EA] text-[#1C1C1A]">
      {/* Top Editorial Header */}
      <Header
        currentView={view}
        onNavigateHome={handleNavigateHome}
        onNavigateJournal={handleNavigateJournal}
        onOpenAbout={() => setIsAboutOpen(true)}
        journalCount={journalRecords.length}
      />

      {/* Main Narrative Experience */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="view-home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionInput
                onStartCasting={handleStartCasting}
                initialQuestion={question}
              />
            </motion.div>
          )}

          {view === 'casting' && (
            <motion.div
              key="view-casting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <RitualCasting
                question={question}
                onCastingComplete={handleCastingComplete}
                onCancel={handleNavigateHome}
              />
            </motion.div>
          )}

          {view === 'result' && castingResult && (
            <motion.div
              key="view-result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-16"
            >
              {/* Step 5 & 6: Hexagram Display & Classical Text */}
              <HexagramResult result={castingResult} />

              {/* Step 7 & 8: 先问问自己 (Human Agency First) */}
              <SelfReflection
                initialText={selfThought}
                onSaveReflection={(val) => setSelfThought(val)}
              />

              {/* Step 9..11: 问问 AI (Structured Prompt Generator & External AI Portals) */}
              <AskAI
                result={castingResult}
                selfThought={selfThought}
              />

              {/* Step 12: 回到自己 (Closing Reflection & Save to Journal) */}
              <ReturnToSelf
                result={castingResult}
                selfThought={selfThought}
                onSavedToJournal={handleRecordSaved}
                onNavigateHome={handleNavigateHome}
                onNavigateJournal={handleNavigateJournal}
              />
            </motion.div>
          )}

          {view === 'journal' && (
            <motion.div
              key="view-journal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <JournalHistory
                records={journalRecords}
                onSelectRecord={handleSelectRecord}
                onDeleteRecord={handleDeleteRecord}
                onBackToMain={handleNavigateHome}
                onStartNewCast={handleNavigateHome}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Editorial Footer */}
      <Footer />

      {/* Philosophy & Ritual Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
