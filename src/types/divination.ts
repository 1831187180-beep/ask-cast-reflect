export type BinaryDigit = 0 | 1;

export type TrigramId = 'Qian' | 'Kun' | 'Zhen' | 'Xun' | 'Kan' | 'Li' | 'Gen' | 'Dui';

export interface Trigram {
  id: TrigramId;
  chineseName: string;
  naturalElement: string;
  englishName: string;
  binary: [BinaryDigit, BinaryDigit, BinaryDigit]; // [bottom, middle, top]
  symbol: string;
  attribute: string;
}

export interface HexagramLineTexts {
  initial: string;
  second: string;
  third: string;
  fourth: string;
  fifth: string;
  top: string;
}

export interface Hexagram {
  id: number; // 1 - 64 King Wen sequence
  chineseName: string;
  pinyin: string;
  englishName: string;
  upperTrigram: TrigramId;
  lowerTrigram: TrigramId;
  lines: [BinaryDigit, BinaryDigit, BinaryDigit, BinaryDigit, BinaryDigit, BinaryDigit]; // [1st/bottom, 2nd, 3rd, 4th, 5th, 6th/top]
  guaCi: string; // 卦辞
  image: string; // 象辞
  tuanCi?: string; // 彖辞
  lineTexts: HexagramLineTexts; // 爻辞
  overview?: string; // 哲学反思导读
}

export type CoinValue = 2 | 3;
export type LineSum = 6 | 7 | 8 | 9;

export interface CoinThrow {
  linePosition: number; // 1 (bottom) to 6 (top)
  coins: [CoinValue, CoinValue, CoinValue];
  total: LineSum;
}

export interface Line {
  position: number; // 1..6
  value: LineSum;
  type: 'yin' | 'yang';
  changing: boolean;
  name: string; // 初九, 六二, 九三, etc.
}

export interface CastingResult {
  id: string;
  timestamp: string;
  question: string;
  method: 'three-coin';
  throws: CoinThrow[];
  lines: Line[]; // [position 1 (bottom) to position 6 (top)]
  originalHexagram: Hexagram;
  changingLines: Line[];
  changedLines: Line[];
  changedHexagram: Hexagram;
  selfReflection?: string;
  aiReflection?: string;
}

export interface JournalRecord {
  id: string;
  createdAt: string;
  question: string;
  castingResult: CastingResult;
  selfReflection: string;
  aiReflection?: string;
  selectedAiTool?: string;
  promptTemplateId?: string;
}
