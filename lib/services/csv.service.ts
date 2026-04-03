import { CsvRow } from '../types/quiz.types';

export class CsvService {
  /**
   * Parse CSV text into rows
   */
  static parse(csvText: string): CsvRow[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV 파일에 데이터가 없습니다. 헤더와 최소 1행의 데이터가 필요합니다.');
    }

    const headers = this.parseLine(lines[0]).map(h => h.trim().toLowerCase());
    const requiredHeaders = ['word', 'meaning'];
    const missing = requiredHeaders.filter(h => !headers.includes(h));
    if (missing.length > 0) {
      throw new Error(`필수 컬럼이 없습니다: ${missing.join(', ')}`);
    }

    const rows: CsvRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = this.parseLine(line);
      const row: CsvRow = {
        word: '',
        meaning: '',
        meaningKo: '',
        example: '',
        cefrLevel: '',
        domain: '',
      };

      headers.forEach((header, index) => {
        if (index < values.length) {
          row[header] = values[index].trim();
        }
      });

      if (row.word) {
        rows.push(row);
      }
    }

    if (rows.length === 0) {
      throw new Error('유효한 데이터 행이 없습니다.');
    }

    return rows;
  }

  /**
   * Parse a single CSV line handling quoted fields
   */
  private static parseLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }

  /**
   * Read a File object as text
   */
  static async readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
      reader.readAsText(file);
    });
  }

  /**
   * Validate file type
   */
  static validateFile(file: File): void {
    if (!file.name.endsWith('.csv')) {
      throw new Error('CSV 파일만 업로드할 수 있습니다.');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('파일 크기는 5MB 이하여야 합니다.');
    }
  }

  /**
   * Get sample CSV data for demo
   */
  static getSampleData(): CsvRow[] {
    return [
      { word: "environment", meaning: "The surroundings or conditions in which a person lives", meaningKo: "환경", example: "We must protect the environment.", cefrLevel: "B1", domain: "academic" },
      { word: "significant", meaning: "Sufficiently great or important", meaningKo: "중요한", example: "There has been a significant increase.", cefrLevel: "B2", domain: "academic" },
      { word: "consequence", meaning: "A result or effect of an action", meaningKo: "결과", example: "Climate change has serious consequences.", cefrLevel: "B2", domain: "academic" },
      { word: "hypothesis", meaning: "A proposed explanation based on limited evidence", meaningKo: "가설", example: "The scientist tested her hypothesis.", cefrLevel: "C1", domain: "academic" },
      { word: "collaborate", meaning: "To work jointly on an activity", meaningKo: "협력하다", example: "Students collaborate on group projects.", cefrLevel: "B2", domain: "academic" },
      { word: "interpret", meaning: "To explain the meaning of something", meaningKo: "해석하다", example: "How do you interpret this data?", cefrLevel: "B2", domain: "academic" },
      { word: "perspective", meaning: "A particular way of regarding something", meaningKo: "관점", example: "Try to see it from my perspective.", cefrLevel: "B2", domain: "academic" },
      { word: "sustainable", meaning: "Able to be maintained at a certain level", meaningKo: "지속 가능한", example: "We need sustainable energy sources.", cefrLevel: "B2", domain: "academic" },
    ];
  }
}
