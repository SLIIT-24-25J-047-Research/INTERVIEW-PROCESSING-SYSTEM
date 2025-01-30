export type QuestionType = 'code' | 'fillBlanks' | 'dragDrop' | 'multipleChoice';

export interface Question {
  id: number;
  type: QuestionType;
  title: string;
  description: string;
  timeLimit: number; // in seconds
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  content: any;
}

export interface CodeQuestion extends Question {
  type: 'code';
  content: {
    initialCode: string;
    language: string;
    testCases: Array<{
      input: string;
      expectedOutput: string;
    }>;
  };
}

export interface FillBlanksQuestion extends Question {
  type: 'fillBlanks';
  content: {
    text: string;
    blanks: Array<{
      id: string;
      answer: string;
    }>;
  };
}

export interface DragDropQuestion extends Question {
  type: 'dragDrop';
  content: {
    items: Array<{
      id: string;
      text: string;
    }>;
    correctOrder: string[];
  };
}

export interface MultipleChoiceQuestion extends Question {
  type: 'multipleChoice';
  content: {
    options: string[];
    correctAnswer: number;
  };
}