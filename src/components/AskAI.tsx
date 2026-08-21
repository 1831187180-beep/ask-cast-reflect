import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, ExternalLink, Sliders, Eye, EyeOff, Bot } from 'lucide-react';
import { CastingResult } from '../types/divination';
import { PROMPT_TEMPLATES, generateStructuredPrompt } from '../lib/prompts';

interface AskAIProps {
  result: CastingResult;
  selfThought: string;
  onSelectAiTool?: (toolName: string) => void;
}

const AI_PLATFORMS = [
  { name: 'ChatGPT', url: 'https://chatgpt.com', desc: 'OpenAI 对话助手' },
  { name: 'Claude', url: 'https://claude.ai', desc: 'Anthropic 深度思辨' },
  { name: 'Gemini', url: 'https://gemini.google.com', desc: 'Google 多模态大模型' },
  { name: 'Grok', url: 'https://grok.com', desc: 'xAI 开放视角' },
  { name: 'DeepSeek', url: 'https://chat.deepseek.com', desc: '深度推理助手' },
];

export function AskAI({ result, selfThought, onSelectAiTool }: AskAIProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('reflection');
  const [copied, setCopied] = useState<boolean>(false);
  const [showPromptPreview, setShowPromptPreview] = useState<boolean>(false);

  const currentPrompt = generateStructuredPrompt(result, selectedTemplateId, selfThought);

  const handleCopyPrompt = async () => {
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentPrompt);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = currentPrompt;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  return (
    <section
      id="ask-ai-section"
      className="w-full max-w-3xl mx-auto space-y-8 pt-4 pb-12"
    >
      {/* Editorial Header */}
      <div className="space-y-2 border-b border-[#D8D4CB]/60 pb-4">
        <div className="flex items-center gap-2 text-[#85837C] text-xs uppercase tracking-[0.2em] font-mono-num mb-1">
          <Bot className="w-3.5 h-3.5" />
          <span>ANOTHER PERSPECTIVE</span>
        </div>
        <h2 className="font-serif-sc text-2xl sm:text-3xl text-[#1C1C1A] tracking-wider">
          问问 AI
        </h2>
        <p className="font-serif-sc text-xs sm:text-sm text-[#85837C] tracking-wide pt-1 leading-relaxed">
          如果你想听听另一个视角，可以把这次卦象、你的第一反应及反思意图，带给你常用的 AI。
          <br className="hidden sm:inline" />
          本站不直接代你预设 AI 解读，唯有经过你的自主判断，AI 才是真正的思考伙伴。
        </p>
      </div>

      {/* 1. Prompt Template Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs text-[#85837C] font-serif-sc">
          <Sliders className="w-3.5 h-3.5" />
          <span>选择你希望 AI 扮演的角色风格：</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PROMPT_TEMPLATES.map((tpl) => {
            const isSelected = selectedTemplateId === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setSelectedTemplateId(tpl.id)}
                className={`p-4 text-left border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1C1C1A] text-[#F5F2EA] border-[#1C1C1A] shadow-sm'
                    : 'bg-[#F5F2EA] hover:bg-[#EBE7DD]/60 text-[#1C1C1A] border-[#D8D4CB]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-serif-sc text-sm font-medium tracking-wide">
                    {tpl.name}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] uppercase font-mono-num tracking-widest text-[#9A3F35] bg-[#F5F2EA] px-1.5 py-0.5">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className={`text-xs leading-relaxed ${isSelected ? 'text-[#D8D4CB]' : 'text-[#85837C]'}`}>
                  {tpl.shortDesc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Copy CTA Button */}
      <div className="p-6 bg-[#EBE7DD]/40 border border-[#D8D4CB] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-serif-sc text-sm sm:text-base font-medium text-[#1C1C1A]">
            已准备好结构化卦象 Prompt
          </h4>
          <p className="text-xs text-[#85837C] font-serif-sc">
            包含所问之事、本卦变卦六爻、动爻爻辞，以及你写下的自我反思。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPromptPreview(!showPromptPreview)}
            className="px-3 py-2 text-xs text-[#85837C] hover:text-[#1C1C1A] border border-[#D8D4CB] hover:border-[#85837C] transition-colors flex items-center gap-1.5 cursor-pointer"
            title="预览 Prompt 内容"
          >
            {showPromptPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showPromptPreview ? '收起预览' : '预览 Prompt'}</span>
          </button>

          <button
            type="button"
            id="btn-copy-prompt"
            onClick={handleCopyPrompt}
            className={`px-6 py-2.5 font-serif-sc text-sm tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              copied
                ? 'bg-[#9A3F35] text-[#F5F2EA]'
                : 'bg-[#1C1C1A] hover:bg-[#9A3F35] text-[#F5F2EA]'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '✓ 已复制到剪贴板' : '复制卦象 Prompt'}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Prompt Preview */}
      <AnimatePresence>
        {showPromptPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-[#EBE7DD]/60 border border-[#D8D4CB] text-xs font-mono text-[#1C1C1A] whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
              {currentPrompt}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. External AI Portals */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs text-[#85837C] font-serif-sc">
          <span>去哪里问？（复制后点击下方链接，前往粘贴）：</span>
          <span className="text-[11px] font-mono-num">OPEN IN NEW TAB</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {AI_PLATFORMS.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onSelectAiTool && onSelectAiTool(platform.name)}
              className="group p-3 border border-[#D8D4CB] hover:border-[#1C1C1A] bg-[#F5F2EA] hover:bg-[#EBE7DD]/50 transition-all text-center flex flex-col items-center justify-center space-y-1 cursor-pointer"
            >
              <div className="flex items-center gap-1 text-sm font-serif-sc font-medium text-[#1C1C1A] group-hover:text-[#9A3F35] transition-colors">
                <span>{platform.name}</span>
                <ExternalLink className="w-3 h-3 text-[#85837C] group-hover:text-[#9A3F35] opacity-70" />
              </div>
              <span className="text-[10px] text-[#85837C] font-mono-num truncate w-full">
                {platform.desc}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
