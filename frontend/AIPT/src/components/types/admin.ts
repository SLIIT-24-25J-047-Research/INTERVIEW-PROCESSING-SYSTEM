export interface TechnicalAnswer {
  _id: string;
  questionId: string;
  response: string | number | string[];
  timeTaken: number;
}

export interface NonTechnicalResponse {
  _id: string;
  questionId: {
    _id: string;
    text: string;
    skillGroupId: {
      _id: string;
      groupId: string;
    };
    answers: string[];
  };
  prediction: {
    confidence_level: number;
    confidence_score: number;
  };
  transcription: string;
  similarityScores: number[];
  isCorrect: boolean;
  createdAt: string;
}

export interface SkillGroup {
  _id: string;
  name: string;
  skills: string[];
  focus: string;
  groupId: string;
}

export interface TechnicalSubmission {
  _id: string;
  interviewId: string;
  userId: string;
  answers: TechnicalAnswer[];
  jobId: string;
  submittedAt: string;
  __v: number;
}

export interface NonTechnicalSubmission {
  _id: string;
  interviewId: string;
  userId: string;
  jobId: string;
  responses: NonTechnicalResponse[];
  createdAt: string;
  v: number;
}

export interface TechnicalSubmissionGroup {
  _id: string;
  answers: TechnicalSubmission[];
}

export interface NonTechnicalSubmissionGroup {
  responses: NonTechnicalSubmission[];
  interviewId: string | null;
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
    testCases: { input: string; expectedOutput: string }[];
    blanks: { [key: string]: string | number | boolean }[];
    items: { [key: string]: string | number | boolean }[];
    correctOrder: string[];
    correctAnswer?: number;
    mechanics?: {
      worldConfig: string;
      // Add any other properties that might be in mechanics
    };
    options: string[];
  };
}

export interface CombinedSubmission {
  userId: string;
  jobId: string;
  technical?: TechnicalSubmission;
  nonTechnical?: NonTechnicalSubmission;
}