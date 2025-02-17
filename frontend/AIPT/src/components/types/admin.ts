export interface Answer {
    _id: string;
    questionId: string;
    response: string | number | string[];
    timeTaken: number;
  }
  
  export interface SubmissionGroup {
    _id: string;
    answers: Array<{
      _id: string;
      interviewId: string;
      userId: string;
      answers: Answer[];
      submittedAt: string;
      __v: number;
    }>;
  }
  
  export interface Question {
    _id: string;
    type: string;
    title: string;
    description: string;
    timeLimit: number;
    points: number;
    difficulty: string;
    content: {
      initialCode?: string;
      language?: string;
      testCases: { input: string; output: string; expectedOutput: string }[];
      blanks: string[];
      items: { [key: string]: string | number | boolean }[];
      correctOrder: string[];
      options: string[];
      correctAnswer: number;
    };
  }