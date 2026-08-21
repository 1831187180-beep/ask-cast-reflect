import { CoinThrow, CoinValue, Line, LineSum } from '../../types/divination';

/**
 * Generate a single coin toss (2 = Yin / tails, 3 = Yang / heads)
 * Uses crypto.getRandomValues for true cryptographic entropy
 */
export function tossSingleCoin(): CoinValue {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % 2 === 0 ? 3 : 2;
  }
  return Math.random() < 0.5 ? 3 : 2;
}

/**
 * Perform a three-coin throw for a specific line position (1 = bottom to 6 = top)
 */
export function throwThreeCoins(position: number): CoinThrow {
  const coin1 = tossSingleCoin();
  const coin2 = tossSingleCoin();
  const coin3 = tossSingleCoin();
  const total = (coin1 + coin2 + coin3) as LineSum;

  return {
    linePosition: position,
    coins: [coin1, coin2, coin3],
    total,
  };
}

/**
 * Compute the Chinese Yao name based on position (1..6) and Yin/Yang
 */
export function getYaoName(position: number, isYang: boolean): string {
  const numChar = isYang ? '九' : '六';
  switch (position) {
    case 1:
      return isYang ? '初九' : '初六';
    case 2:
      return isYang ? '九二' : '六二';
    case 3:
      return isYang ? '九三' : '六三';
    case 4:
      return isYang ? '九四' : '六四';
    case 5:
      return isYang ? '九五' : '六五';
    case 6:
      return isYang ? '上九' : '上六';
    default:
      return `${position}${numChar}`;
  }
}

/**
 * Convert a CoinThrow into a structured Line
 */
export function createLineFromThrow(throwData: CoinThrow): Line {
  const { linePosition, total } = throwData;
  const isYang = total === 7 || total === 9;
  const isChanging = total === 6 || total === 9;

  return {
    position: linePosition,
    value: total,
    type: isYang ? 'yang' : 'yin',
    changing: isChanging,
    name: getYaoName(linePosition, isYang),
  };
}
