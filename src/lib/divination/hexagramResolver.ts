import {
  BinaryDigit,
  CastingResult,
  CoinThrow,
  Hexagram,
  Line,
  Trigram,
  TrigramId,
} from '../../types/divination';
import { TRIGRAMS, TRIGRAM_LIST } from '../../data/trigrams';
import {
  HEXAGRAM_MAP_BY_BINARY,
  HEXAGRAM_MAP_BY_TRIGRAMS,
} from '../../data/hexagrams';
import { getYaoName } from './coin';

/**
 * Resolve a 3-bit binary array [bottom, middle, top] to its corresponding Trigram
 */
export function getTrigram(binary: [number, number, number]): Trigram {
  const match = TRIGRAM_LIST.find(
    (t) =>
      t.binary[0] === binary[0] &&
      t.binary[1] === binary[1] &&
      t.binary[2] === binary[2]
  );
  if (!match) {
    throw new Error(`Invalid trigram binary representation: [${binary.join(', ')}]`);
  }
  return match;
}

/**
 * Resolve Hexagram by Upper and Lower Trigram IDs
 */
export function getHexagramByTrigrams(
  upperTrigram: TrigramId | string,
  lowerTrigram: TrigramId | string
): Hexagram {
  const key = `${upperTrigram}-${lowerTrigram}`;
  const hexagram = HEXAGRAM_MAP_BY_TRIGRAMS[key];
  if (!hexagram) {
    throw new Error(`Hexagram not found for trigrams: Upper=${upperTrigram}, Lower=${lowerTrigram}`);
  }
  return hexagram;
}

/**
 * Resolve Hexagram by 6-bit binary array [bottom..top]
 * lines[0..2] = lower trigram
 * lines[3..5] = upper trigram
 */
export function getHexagram(
  lines: [number, number, number, number, number, number]
): Hexagram {
  const key = lines.join(',');
  const directMatch = HEXAGRAM_MAP_BY_BINARY[key];
  if (directMatch) {
    return directMatch;
  }

  // Decompose into lower and upper trigrams
  const lowerBinary: [number, number, number] = [lines[0], lines[1], lines[2]];
  const upperBinary: [number, number, number] = [lines[3], lines[4], lines[5]];

  const lowerTrigram = getTrigram(lowerBinary);
  const upperTrigram = getTrigram(upperBinary);

  return getHexagramByTrigrams(upperTrigram.id, lowerTrigram.id);
}

/**
 * Extract the base binary digits (0 = Yin, 1 = Yang) from the 6 cast lines
 * 6 -> 0 (Old Yin)
 * 7 -> 1 (Young Yang)
 * 8 -> 0 (Young Yin)
 * 9 -> 1 (Old Yang)
 */
export function getBaseBinaryLines(
  lines: Line[]
): [BinaryDigit, BinaryDigit, BinaryDigit, BinaryDigit, BinaryDigit, BinaryDigit] {
  if (lines.length !== 6) {
    throw new Error(`Expected 6 lines, received ${lines.length}`);
  }
  return lines.map((l) => (l.value === 7 || l.value === 9 ? 1 : 0)) as [
    BinaryDigit,
    BinaryDigit,
    BinaryDigit,
    BinaryDigit,
    BinaryDigit,
    BinaryDigit
  ];
}

/**
 * Compute the transformed lines after dynamic/changing transitions:
 * 6 (Old Yin) -> 1 (Yang)
 * 7 (Young Yang) -> 1 (Yang)
 * 8 (Young Yin) -> 0 (Yin)
 * 9 (Old Yang) -> 0 (Yin)
 */
export function getChangedLines(lines: Line[]): Line[] {
  return lines.map((line) => {
    let newType: 'yin' | 'yang' = line.type;
    let newValue = line.value;

    if (line.value === 6) {
      newType = 'yang';
      newValue = 7;
    } else if (line.value === 9) {
      newType = 'yin';
      newValue = 8;
    }

    return {
      position: line.position,
      value: newValue,
      type: newType,
      changing: false,
      name: getYaoName(line.position, newType === 'yang'),
    };
  });
}

/**
 * Filter out changing/moving lines (6 and 9)
 */
export function getChangingLines(lines: Line[]): Line[] {
  return lines.filter((l) => l.changing || l.value === 6 || l.value === 9);
}

/**
 * Build a complete casting result object
 */
export function buildCastingResult(
  question: string,
  throws: CoinThrow[],
  lines: Line[]
): CastingResult {
  const baseBinary = getBaseBinaryLines(lines);
  const originalHexagram = getHexagram(baseBinary);

  const changingLines = getChangingLines(lines);
  const changedLines = getChangedLines(lines);

  const changedBinary = changedLines.map((l) => (l.type === 'yang' ? 1 : 0)) as [
    BinaryDigit,
    BinaryDigit,
    BinaryDigit,
    BinaryDigit,
    BinaryDigit,
    BinaryDigit
  ];
  const changedHexagram = getHexagram(changedBinary);

  return {
    id: `cast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date().toISOString(),
    question: question.trim(),
    method: 'three-coin',
    throws,
    lines,
    originalHexagram,
    changingLines,
    changedLines,
    changedHexagram,
  };
}
