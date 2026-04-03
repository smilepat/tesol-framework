export interface VocabWord {
  id?: string; // Firestore document ID
  word: string;
  meaning: string;
  meaningKo: string;
  example: string;
  cefrLevel: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  domain: string;
  sheetId?: string; // Track source Google Sheet ID
  syncedAt?: Date; // When this word was synced from Sheets
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SheetRow {
  [key: string]: string;
}

export interface VocabularyFilters {
  cefrLevel?: string;
  domain?: string;
  word?: string; // Search by word
}

export interface VocabularyStats {
  totalWords: number;
  byCEFR: Record<string, number>;
  byDomain: Record<string, number>;
}
