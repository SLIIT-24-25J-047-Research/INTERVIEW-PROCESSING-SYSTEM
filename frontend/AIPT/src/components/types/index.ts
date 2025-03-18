export type QuestionType = 'code' | 'fillBlanks' | 'dragDrop' | 'multipleChoice' | 'dataVisualization' | 'objectMechanic' | 'logicalPuzzle';
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
  correctAnswer?: number;

  dataset?: {
    data: string; 
    expectedVisualization: string; 
  };
  //  object mechanics
  mechanics?: {
    worldConfig: string;
    expectedBehavior: string; 
  };
  // For logical puzzles
  puzzle?: {
    initialState: string; 
    goalState: string; 
    rules: string[]; 
  };
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