import { JournalRecord } from '../types/divination';

const STORAGE_KEY = 'wenyishi_journal_records_v1';

export function getJournalRecords(): JournalRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load journal records from storage:', err);
    return [];
  }
}

export function saveJournalRecord(record: JournalRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const records = getJournalRecords();
    const existingIndex = records.findIndex((r) => r.id === record.id);
    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.unshift(record);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save journal record:', err);
  }
}

export function deleteJournalRecord(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const records = getJournalRecords().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to delete journal record:', err);
  }
}

export function clearAllJournalRecords(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear journal records:', err);
  }
}
