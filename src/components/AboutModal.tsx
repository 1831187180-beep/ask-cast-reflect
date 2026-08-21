import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Compass, ShieldCheck } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="about-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1C1C1A]/40 backdrop-blur-xs select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-[#F5F2EA] border border-[#1C1C1A] shadow-xl p-6 sm:p-10 space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#D8D4CB] pb-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#85837C] font-mono-num">
                PHILOSOPHY & HCI RITUAL
              </span>
              <h2 className="font-serif-sc text-2xl text-[#1C1C1A] tracking-wider">
                关于「问一事」
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#85837C] hover:text-[#1C1C1A] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Philosophy Statement */}
          <div className="space-y-4 font-serif-sc text-sm leading-relaxed text-[#1C1C1A]">
            <p className="text-base text-[#9A3F35] font-medium tracking-wide">
              「问一事，起一卦。先听听自己，再听听 AI。」
            </p>

            <p className="text-[#85837C]">
              这是一个结合传统六爻占卦、当代艺术设计和 AI 时代人机交互（HCI）的数字文化体验项目。
              我们拒绝廉价算命的宿命宣称，亦不将决策权拱手让给黑盒算法。
            </p>

            <div className="p-4 bg-[#EBE7DD]/50 border-l-2 border-[#1C1C1A] space-y-2">
              <h4 className="font-semibold text-xs tracking-wider text-[#1C1C1A] uppercase">
                核心交互路径
              </h4>
              <p className="text-xs text-[#85837C] leading-normal font-mono-num">
                Human (提出问题) &rarr; Ritual (掷钱起爻) &rarr; Tradition (经典义理) &rarr; Self Reflection (自主直觉) &rarr; AI (思考伙伴) &rarr; Self Reflection (最终决断)
              </p>
            </div>
          </div>

          {/* Key Principles */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <Compass className="w-4 h-4 text-[#9A3F35] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif-sc text-sm font-semibold text-[#1C1C1A]">
                  AI 是视角（Perspective），不是权威（Authority）
                </h4>
                <p className="text-xs text-[#85837C] font-serif-sc leading-relaxed pt-0.5">
                  网站不直接调用黑盒 API 代你下结论。我们提供严谨的结构化 Prompt，让你自主选择携带问题与直觉，前往 ChatGPT、Claude、Gemini 等大模型展开思辨对话。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#9A3F35] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif-sc text-sm font-semibold text-[#1C1C1A]">
                  严格确定的周易文王六十四卦体系
                </h4>
                <p className="text-xs text-[#85837C] font-serif-sc leading-relaxed pt-0.5">
                  卦象计算完全基于纯数学映射与加密真随机熵源（crypto.getRandomValues），严格遵循文王卦序与八卦二进制定义，绝无任何随机文本拼凑或算法造假。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#9A3F35] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif-sc text-sm font-semibold text-[#1C1C1A]">
                  本地私密心迹留存
                </h4>
                <p className="text-xs text-[#85837C] font-serif-sc leading-relaxed pt-0.5">
                  所有问事记录与自省文字均仅保存在你当前浏览器的本地存储中，不上传至任何外部服务器，随时可导出备份或清除。
                </p>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-4 border-t border-[#D8D4CB] flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-[#1C1C1A] hover:bg-[#9A3F35] text-[#F5F2EA] font-serif-sc text-xs tracking-widest transition-colors cursor-pointer"
            >
              知悉并返回
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
