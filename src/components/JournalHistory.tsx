import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Trash2, ArrowRight, BookOpen, Calendar, ArrowLeft, Download, Eye } from 'lucide-react';
import { JournalRecord } from '../types/divination';
import { HexagramSymbol } from './HexagramSymbol';

interface JournalHistoryProps {
  records: JournalRecord[];
  onSelectRecord: (record: JournalRecord) => void;
  onDeleteRecord: (id: string) => void;
  onBackToMain: () => void;
  onStartNewCast: () => void;
}

export function JournalHistory({
  records,
  onSelectRecord,
  onDeleteRecord,
  onBackToMain,
  onStartNewCast,
}: JournalHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDetail, setSelectedDetail] = useState<JournalRecord | null>(null);

  const filtered = records.filter((r) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.question.toLowerCase().includes(term) ||
      r.castingResult.originalHexagram.chineseName.toLowerCase().includes(term) ||
      r.castingResult.changedHexagram.chineseName.toLowerCase().includes(term) ||
      (r.selfReflection && r.selfReflection.toLowerCase().includes(term))
    );
  });

  const exportAllAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `问一事_占卦心迹档案_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <motion.div
      id="journal-history-view"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto px-6 py-8 sm:py-12 space-y-8"
    >
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between border-b border-[#D8D4CB]/60 pb-4">
        <button
          type="button"
          onClick={onBackToMain}
          className="flex items-center gap-1.5 text-xs text-[#85837C] hover:text-[#1C1C1A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>返回起卦</span>
        </button>

        <div className="flex items-center gap-3">
          {records.length > 0 && (
            <button
              type="button"
              onClick={exportAllAsJSON}
              className="flex items-center gap-1 text-xs text-[#85837C] hover:text-[#1C1C1A] transition-colors cursor-pointer"
              title="导出备份所有心迹"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出 JSON</span>
            </button>
          )}

          <button
            type="button"
            onClick={onStartNewCast}
            className="px-3 py-1.5 bg-[#1C1C1A] hover:bg-[#9A3F35] text-[#F5F2EA] font-serif-sc text-xs tracking-wider transition-colors cursor-pointer"
          >
            新起一卦
          </button>
        </div>
      </div>

      {/* Main Title & Search Bar */}
      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-[0.25em] text-[#85837C] font-mono-num block">
            PERSONAL ARCHIVE
          </span>
          <h1 className="font-serif-sc text-3xl sm:text-4xl text-[#1C1C1A] tracking-wider">
            卦历 · 占问心迹
          </h1>
          <p className="font-serif-sc text-xs sm:text-sm text-[#85837C] tracking-wide">
            记录每一次提问、卦象流转与你当时写下的真实心绪。
          </p>
        </div>

        {/* Search input if multiple records */}
        {records.length > 1 && (
          <div className="relative">
            <Search className="w-4 h-4 text-[#85837C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索问事内容、卦名或反思记录…"
              className="w-full pl-10 pr-4 py-2 bg-[#EBE7DD]/40 border border-[#D8D4CB] focus:border-[#1C1C1A] text-xs sm:text-sm font-serif-sc text-[#1C1C1A] placeholder:text-[#A8A59D] focus:outline-none transition-colors"
            />
          </div>
        )}
      </div>

      {/* Records List / Empty State */}
      {records.length === 0 ? (
        <div className="py-20 text-center space-y-4 border border-dashed border-[#D8D4CB] bg-[#EBE7DD]/20">
          <BookOpen className="w-8 h-8 text-[#A8A59D] mx-auto opacity-70" />
          <p className="font-serif-sc text-sm text-[#85837C] tracking-wider">
            卦历尚无记录。静下心来，起你的第一卦。
          </p>
          <button
            type="button"
            onClick={onStartNewCast}
            className="px-6 py-2 bg-[#1C1C1A] hover:bg-[#9A3F35] text-[#F5F2EA] font-serif-sc text-xs tracking-widest transition-colors cursor-pointer"
          >
            立即起卦
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#85837C] font-serif-sc">
          未找到与「{searchTerm}」相关的卦历记录
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((record) => {
            const dateStr = new Date(record.createdAt).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            });
            const { originalHexagram, changedHexagram, changingLines } = record.castingResult;
            const hasChange = changingLines.length > 0;

            return (
              <div
                key={record.id}
                className="group border border-[#D8D4CB] bg-[#F5F2EA] hover:border-[#1C1C1A] transition-all duration-200 p-5 sm:p-6 space-y-4"
              >
                {/* Header: Date + Delete */}
                <div className="flex items-center justify-between text-xs text-[#85837C] border-b border-[#D8D4CB]/40 pb-2.5 font-mono-num">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{dateStr}</span>
                    <span className="text-[#A8A59D]">·</span>
                    <span className="text-[11px] uppercase font-serif-sc">
                      第 {originalHexagram.id} 卦 {originalHexagram.chineseName}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('确定要从本地卦历中删除此条记录吗？')) {
                        onDeleteRecord(record.id);
                      }
                    }}
                    className="text-[#85837C] hover:text-[#9A3F35] p-1 transition-colors opacity-60 group-hover:opacity-100 cursor-pointer"
                    title="删除记录"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content Body: Question + Hexagram graphics */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <h3 className="font-serif-sc text-base sm:text-lg text-[#1C1C1A] font-medium leading-snug">
                      「{record.question}」
                    </h3>

                    {/* Self Reflection Snippet */}
                    {record.selfReflection ? (
                      <p className="text-xs text-[#85837C] font-serif-sc line-clamp-2 leading-relaxed italic bg-[#EBE7DD]/30 p-2.5 border-l border-[#D8D4CB]">
                        直觉自省：“{record.selfReflection}”
                      </p>
                    ) : (
                      <p className="text-[11px] text-[#A8A59D] font-serif-sc">未记录文字自省</p>
                    )}

                    {record.aiReflection && (
                      <p className="text-xs text-[#85837C] font-serif-sc line-clamp-1 leading-relaxed">
                        最终心得：“{record.aiReflection}”
                      </p>
                    )}
                  </div>

                  {/* Hexagram Preview Graphics */}
                  <div className="flex items-center gap-4 shrink-0 self-end sm:self-center bg-[#EBE7DD]/40 p-3 border border-[#D8D4CB]/60">
                    <div className="text-center">
                      <HexagramSymbol
                        lines={record.castingResult.lines}
                        size="compact"
                        highlightChanging={true}
                      />
                      <span className="text-[9px] font-serif-sc text-[#85837C] block mt-1">
                        {originalHexagram.chineseName}
                      </span>
                    </div>

                    {hasChange && (
                      <>
                        <ArrowRight className="w-3 h-3 text-[#9A3F35]" />
                        <div className="text-center">
                          <HexagramSymbol
                            lines={record.castingResult.changedLines}
                            size="compact"
                            highlightChanging={false}
                          />
                          <span className="text-[9px] font-serif-sc text-[#85837C] block mt-1">
                            {changedHexagram.chineseName}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => onSelectRecord(record)}
                    className="flex items-center gap-1.5 text-xs font-serif-sc text-[#1C1C1A] hover:text-[#9A3F35] transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>查看完整卦象与反思</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
