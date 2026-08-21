import { CastingResult, Line } from '../types/divination';
import { TRIGRAMS } from '../data/trigrams';

export interface PromptTemplate {
  id: string;
  name: string;
  shortDesc: string;
  systemInstruction: string;
  focusTone: string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'reflection',
    name: '思维透镜 · 反思决策',
    shortDesc: '不预测未来，将卦象作为认知框架，启发决策与心境',
    focusTone: '客观、启发性、心理与哲学视角',
    systemInstruction: `请不要将此卦象当作确定性的未来预测或宿命论断，而是将其作为一种东方哲学思维模型和心理反思透镜（Cognitive & Philosophical Framework）。
请结合我当前提出的具体困惑和我的第一反应：
1. 从本卦与变卦的哲学意象（如刚柔、动静、时机、进退）中，提炼出 2~3 个值得我重新审视的盲点或思考维度。
2. 分析动爻所提示的动态张力与临界点。
3. 提出 2 个具有穿透力的开放式追问（Socratic Questions），帮助我自己理清内心的真实抉择。`,
  },
  {
    id: 'traditional',
    name: '传统义理 · 卦爻深度解析',
    shortDesc: '从周易义理、上下卦象生克与动爻爻辞剖析',
    focusTone: '严谨、深厚、忠实于周易经传义理',
    systemInstruction: `请从《周易》传统义理与象数体系对本次占卦进行系统解读：
1. 分析本卦与变卦的上下八卦卦德（如乾健、坤顺、坎险、离明等）及其在现实情境中的互动关系。
2. 重点解读变动之爻的爻辞及其在卦体中的位置（承乘比应、中正与否）。
3. 结合卦辞与大象传，给出合乎易理的行止、修德与应对建议。`,
  },
  {
    id: 'exploration',
    name: '多重可能 · 情境探讨',
    shortDesc: '探讨事态发展的不同路径与关键影响因素',
    focusTone: '开放、务实、情境化可能性探讨',
    systemInstruction: `请结合我的问题与卦象所揭示的态势，探讨该事项可能演变的 3 种不同情境（最佳顺应、潜在风险、转化契机）：
1. 在什么条件下事态会走向变卦所指示的状态？
2. 当前阶段最关键的抓手或应当避免的误区是什么？
3. 如何在保持自主决断的前提下，灵活调整策略？`,
  },
  {
    id: 'mirror',
    name: '心迹对镜 · 极简对话',
    shortDesc: '简练对比我的直觉与卦象隐喻，提炼核心关键词',
    focusTone: '诗意、留白、直指人心',
    systemInstruction: `请用简练、克制且富有文学性的语言，对比我的第一直觉反应与卦象意象：
1. 提炼出 3 个核心意象词。
2. 一段 150 字以内的澄明洞察。
3. 一句献给当下心境的古训或哲学箴言。`,
  },
];

/**
 * Format active changing lines text
 */
function formatChangingLinesText(result: CastingResult): string {
  if (result.changingLines.length === 0) {
    return '无动爻（本卦六爻皆定，本卦即为变卦）';
  }

  return result.changingLines
    .map((line: Line) => {
      const positionKey = getPositionTextKey(line.position);
      const lineText = result.originalHexagram.lineTexts[positionKey] || '';
      return `- 【第 ${line.position} 爻 ${line.name}】（${line.value === 9 ? '老阳·变阴' : '老阴·变阳'}）：${lineText}`;
    })
    .join('\n');
}

function getPositionTextKey(pos: number): 'initial' | 'second' | 'third' | 'fourth' | 'fifth' | 'top' {
  switch (pos) {
    case 1:
      return 'initial';
    case 2:
      return 'second';
    case 3:
      return 'third';
    case 4:
      return 'fourth';
    case 5:
      return 'fifth';
    case 6:
      return 'top';
    default:
      return 'initial';
  }
}

/**
 * Generate complete structured prompt for clipboard copying
 */
export function generateStructuredPrompt(
  result: CastingResult,
  templateId: string = 'reflection',
  customSelfThought?: string
): string {
  const template = PROMPT_TEMPLATES.find((t) => t.id === templateId) || PROMPT_TEMPLATES[0];
  const orig = result.originalHexagram;
  const changed = result.changedHexagram;
  const upperOrig = TRIGRAMS[orig.upperTrigram];
  const lowerOrig = TRIGRAMS[orig.lowerTrigram];
  const upperChanged = TRIGRAMS[changed.upperTrigram];
  const lowerChanged = TRIGRAMS[changed.lowerTrigram];

  const selfThought = customSelfThought?.trim() || result.selfReflection?.trim() || '（我暂未记录具体的第一反应，请直接以中立客观视角展开）';

  const isChanging = result.changingLines.length > 0;

  return `【问一事 · 占卦反思 Prompt】

=== 一、所问之事 ===
问题：「${result.question}」
时间：${new Date(result.timestamp).toLocaleString('zh-CN')}
起卦方式：传统三铜钱摇卦法（Three-Coin Method）

=== 二、卦象数据 ===
【本卦】第 ${orig.id} 卦 · ${orig.chineseName} (${orig.englishName})
- 上卦：${upperOrig.chineseName}（${upperOrig.naturalElement} / ${upperOrig.attribute}）
- 下卦：${lowerOrig.chineseName}（${lowerOrig.naturalElement} / ${lowerOrig.attribute}）
- 卦辞：${orig.guaCi}
- 象辞：${orig.image}
- 彖传简述：${orig.tuanCi || '暂无'}

【动爻】
${formatChangingLinesText(result)}

【变卦】${isChanging ? `第 ${changed.id} 卦 · ${changed.chineseName} (${changed.englishName})` : '无变卦（与本卦同）'}
${
  isChanging
    ? `- 上卦：${upperChanged.chineseName}（${upperChanged.naturalElement}）
- 下卦：${lowerChanged.chineseName}（${lowerChanged.naturalElement}）
- 变卦象义：${changed.overview || changed.guaCi}`
    : ''
}

=== 三、我的第一直觉与自我反思 ===
${selfThought}

=== 四、请你作为思考伙伴的解读要求 ===
${template.systemInstruction}

（提示：我重视我自己的判断力，你的解读是供我参考的「另一个视角」。请以真诚、克制、富有启发性的语气交流。）`;
}
