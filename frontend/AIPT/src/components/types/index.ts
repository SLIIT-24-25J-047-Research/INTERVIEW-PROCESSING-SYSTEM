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
  // For data visualization challenges
  dataset?: {
    data: string; // JSON string of the dataset
    expectedVisualization: string; // Description or configuration of expected visualization
  };
  // For object mechanics
  mechanics?: {
    worldConfig: string; // JSON string of world configuration
    expectedBehavior: string; // Description of expected behavior
  };
  // For logical puzzles
  puzzle?: {
    initialState: string; // JSON string of initial puzzle state
    goalState: string; // JSON string of goal state
    rules: string[]; // Array of rules or constraints
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