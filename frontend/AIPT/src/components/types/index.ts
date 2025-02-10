export type QuestionType = 'code' | 'fillBlanks' | 'dragDrop' | 'multipleChoice';
export type Difficulty = 'easy' | 'medium' | 'hard';

interface TestCase {
  input: string;
  expectedOutput: string;
  _id: string;
}

interface DragDropItem {
  id: string;
  text: string;
  _id: string;
}
interface QuestionContent {
  text?: string;
  initialCode?: string;
  language?: string;
  testCases: TestCase[];
  blanks: Array<{
    id: string;
    answer: string;
  }>;
  items: DragDropItem[];
  correctOrder: string[];
  options: string[];
}

export interface Question {
  _id: string;
  type: QuestionType;
  title: string;
  description: string;
  timeLimit: number;
  points: number;
  difficulty: Difficulty;
  content: QuestionContent;
}