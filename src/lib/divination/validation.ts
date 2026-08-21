import { HEXAGRAMS, HEXAGRAM_MAP_BY_ID, HEXAGRAM_MAP_BY_TRIGRAMS } from '../../data/hexagrams';
import { TRIGRAMS, TRIGRAM_LIST } from '../../data/trigrams';
import { getHexagram, getChangedLines } from './hexagramResolver';
import { Line } from '../../types/divination';

/**
 * Perform database integrity validations on all 64 hexagrams & 8 trigrams
 */
export function validateHexagramDatabase(): boolean {
  let passed = true;

  // 1. Validate 8 Trigrams
  if (TRIGRAM_LIST.length !== 8) {
    console.error(`[Validation Error] Expected 8 trigrams, found ${TRIGRAM_LIST.length}`);
    passed = false;
  }

  const expectedTrigramIds = ['Qian', 'Kun', 'Zhen', 'Xun', 'Kan', 'Li', 'Gen', 'Dui'];
  for (const id of expectedTrigramIds) {
    if (!TRIGRAMS[id as keyof typeof TRIGRAMS]) {
      console.error(`[Validation Error] Missing trigram: ${id}`);
      passed = false;
    }
  }

  // 2. Validate 64 Hexagrams count
  if (HEXAGRAMS.length !== 64) {
    console.error(`[Validation Error] Expected 64 hexagrams, found ${HEXAGRAMS.length}`);
    passed = false;
  }

  // 3. Validate IDs 1..64 are unique and contiguous
  const idSet = new Set<number>();
  for (let i = 1; i <= 64; i++) {
    const hex = HEXAGRAM_MAP_BY_ID[i];
    if (!hex) {
      console.error(`[Validation Error] Missing Hexagram ID ${i}`);
      passed = false;
    } else {
      idSet.add(hex.id);
    }
  }

  // 4. Validate unique trigram pairs (8 * 8 = 64 unique combinations)
  const combinationKeys = Object.keys(HEXAGRAM_MAP_BY_TRIGRAMS);
  if (combinationKeys.length !== 64) {
    console.error(`[Validation Error] Expected 64 unique trigram pairings, found ${combinationKeys.length}`);
    passed = false;
  }

  // 5. Test specific landmark hexagrams
  try {
    // A: 乾为天 [1,1,1,1,1,1] => ID 1
    const qian = getHexagram([1, 1, 1, 1, 1, 1]);
    if (qian.id !== 1 || qian.chineseName !== '乾为天') {
      console.error(`[Validation Error] Qian [1,1,1,1,1,1] test failed: got ID ${qian.id} (${qian.chineseName})`);
      passed = false;
    }

    // B: 坤为地 [0,0,0,0,0,0] => ID 2
    const kun = getHexagram([0, 0, 0, 0, 0, 0]);
    if (kun.id !== 2 || kun.chineseName !== '坤为地') {
      console.error(`[Validation Error] Kun [0,0,0,0,0,0] test failed: got ID ${kun.id} (${kun.chineseName})`);
      passed = false;
    }

    // C: 水火既济 [1,0,1,0,1,0] (Lower Li [1,0,1], Upper Kan [0,1,0]) => ID 63
    const jiJi = getHexagram([1, 0, 1, 0, 1, 0]);
    if (jiJi.id !== 63 || jiJi.chineseName !== '水火既济') {
      console.error(`[Validation Error] JiJi [1,0,1,0,1,0] test failed: got ID ${jiJi.id} (${jiJi.chineseName})`);
      passed = false;
    }

    // D: 火水未济 [0,1,0,1,0,1] (Lower Kan [0,1,0], Upper Li [1,0,1]) => ID 64
    const weiJi = getHexagram([0, 1, 0, 1, 0, 1]);
    if (weiJi.id !== 64 || weiJi.chineseName !== '火水未济') {
      console.error(`[Validation Error] WeiJi [0,1,0,1,0,1] test failed: got ID ${weiJi.id} (${weiJi.chineseName})`);
      passed = false;
    }

    // E: Test Changing rules: 6 -> 1, 7 -> 1, 8 -> 0, 9 -> 0
    const sampleLines: Line[] = [
      { position: 1, value: 9, type: 'yang', changing: true, name: '初九' },
      { position: 2, value: 8, type: 'yin', changing: false, name: '六二' },
      { position: 3, value: 8, type: 'yin', changing: false, name: '六三' },
      { position: 4, value: 7, type: 'yang', changing: false, name: '九四' },
      { position: 5, value: 8, type: 'yin', changing: false, name: '六五' },
      { position: 6, value: 6, type: 'yin', changing: true, name: '上六' },
    ];
    const changed = getChangedLines(sampleLines);
    // Pos 1 (was 9 old yang) -> type 'yin' (0)
    // Pos 4 (was 7 young yang) -> type 'yang' (1)
    // Pos 6 (was 6 old yin) -> type 'yang' (1)
    if (changed[0].type !== 'yin' || changed[3].type !== 'yang' || changed[5].type !== 'yang') {
      console.error(`[Validation Error] Line change logic failed`);
      passed = false;
    }
  } catch (err) {
    console.error(`[Validation Error] Exception during hexagram lookup test:`, err);
    passed = false;
  }

  if (passed) {
    // Database validation succeeded quietly
  }
  return passed;
}
