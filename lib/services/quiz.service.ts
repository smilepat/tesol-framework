import { QuizSettings, QuizItem, CsvRow, GeneratedQuiz } from '../types/quiz.types';

export class QuizService {
  /**
   * Generate quiz items from vocabulary data and settings
   * Currently uses mock generation - will be replaced with Gemini API
   */
  static async generateQuiz(words: CsvRow[], settings: QuizSettings): Promise<GeneratedQuiz> {
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Filter words by CEFR level if available
    let filteredWords = words;
    if (settings.cefrLevel) {
      const matching = words.filter(w => w.cefrLevel === settings.cefrLevel);
      if (matching.length > 0) filteredWords = matching;
    }

    // Shuffle and limit
    const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(settings.questionCount, shuffled.length));

    // Generate items based on question types
    const items: QuizItem[] = [];
    const types: ("multiple-choice" | "fill-in-blank" | "short-answer")[] = settings.questionTypes.length > 0
      ? settings.questionTypes
      : ["multiple-choice"];

    selected.forEach((word, index) => {
      const type = types[index % types.length];
      items.push(this.generateItem(word, type, index, shuffled));
    });

    return {
      id: 'quiz-' + Date.now(),
      settings,
      items,
      createdAt: new Date(),
    };
  }

  private static generateItem(
    word: CsvRow,
    type: "multiple-choice" | "fill-in-blank" | "short-answer",
    index: number,
    allWords: CsvRow[]
  ): QuizItem {
    const id = `q-${index + 1}`;

    switch (type) {
      case "multiple-choice":
        return this.generateMultipleChoice(id, word, allWords);
      case "fill-in-blank":
        return this.generateFillInBlank(id, word);
      case "short-answer":
        return this.generateShortAnswer(id, word);
      default:
        return this.generateMultipleChoice(id, word, allWords);
    }
  }

  private static generateMultipleChoice(id: string, word: CsvRow, allWords: CsvRow[]): QuizItem {
    // Create distractors from other words
    const otherWords = allWords.filter(w => w.word !== word.word);
    const shuffledOthers = otherWords.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [
      word.meaningKo || word.meaning,
      ...shuffledOthers.map(w => w.meaningKo || w.meaning),
    ].sort(() => Math.random() - 0.5);

    return {
      id,
      type: "multiple-choice",
      question: `"${word.word}"의 뜻으로 가장 적절한 것은?`,
      options,
      correctAnswer: word.meaningKo || word.meaning,
      explanation: `${word.word}: ${word.meaning}${word.example ? `\n예문: ${word.example}` : ''}`,
      word: word.word,
    };
  }

  private static generateFillInBlank(id: string, word: CsvRow): QuizItem {
    const sentence = word.example
      ? word.example.replace(new RegExp(word.word, 'gi'), '________')
      : `The ________ is important in this context.`;

    return {
      id,
      type: "fill-in-blank",
      question: `다음 빈칸에 들어갈 알맞은 단어를 쓰세요.\n\n${sentence}`,
      correctAnswer: word.word,
      explanation: `정답: ${word.word} (${word.meaningKo || word.meaning})${word.example ? `\n원문: ${word.example}` : ''}`,
      word: word.word,
    };
  }

  private static generateShortAnswer(id: string, word: CsvRow): QuizItem {
    return {
      id,
      type: "short-answer",
      question: `다음 뜻에 해당하는 영어 단어를 쓰세요.\n\n뜻: ${word.meaningKo || word.meaning}`,
      correctAnswer: word.word,
      explanation: `${word.word}: ${word.meaning}${word.example ? `\n예문: ${word.example}` : ''}`,
      word: word.word,
    };
  }
}
