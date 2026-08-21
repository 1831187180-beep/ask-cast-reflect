export function Footer() {
  return (
    <footer
      id="app-footer"
      className="w-full max-w-5xl mx-auto px-6 py-12 md:py-16 mt-20 border-t border-[#D8D4CB]/60 text-center select-none"
    >
      <div className="space-y-3">
        <p className="font-serif-sc text-sm md:text-base text-[#1C1C1A] tracking-widest">
          「问一事，起一卦。先听听自己，再听听 AI。」
        </p>
        <p className="text-xs text-[#85837C] tracking-wider leading-relaxed">
          Traditional I Ching &middot; Contemporary Art Direction &middot; Human Agency &middot; AI Reflection
        </p>
      </div>

      <div className="mt-8 flex items-center justify-center gap-6 text-[11px] text-[#A8A59D] font-mono-num">
        <span>HEXAGRAM DETERMINISTIC ENGINE</span>
        <span>&middot;</span>
        <span>ZERO LLM BLACK-BOX IN CASTING</span>
        <span>&middot;</span>
        <span>CLIENT PRIVATE JOURNAL</span>
      </div>
    </footer>
  );
}
