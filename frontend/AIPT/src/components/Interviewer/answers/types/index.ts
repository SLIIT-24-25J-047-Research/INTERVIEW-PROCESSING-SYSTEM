export interface Question {
  _id: {
    $oid: string;
  };
  score?: number;
  maxScore?: number;
}

export interface NonTechnicalResponse {
  questionId: {
    $oid: string;
  };
  prediction: string;
  transcription: string | null;
  similarityScores: any | null;
  isCorrect: boolean | null;
  marks: number;
  _id: {
    $oid: string;
  };
}

export interface NonTechnicalResult {
  _id: {
    $oid: string;
  };
  interviewId: {
    $oid: string;
  };
  jobId: {
    $oid: string;
  };
  userId: string;
  responses: NonTechnicalResponse[];
  createdAt: {
    $date: string;
  };
  __v: number;
  sttresslevel?: string;
}

export interface TechnicalScore {
  questionId: {
    $oid: string;
  };
  score: number;
  maxScore: number;
  _id: {
    $oid: string;
  };
}

export interface TechnicalResult {
  _id: {
    $oid: string;
  };
  interviewScheduleId: {
    $oid: string;
  };
  jobId: {
    $oid: string;
  };
  userId: {
    $oid: string;
  };
  scores: TechnicalScore[];
  totalScore: number;
  maxPossibleScore: number;
  sttresslevel?: string;
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
  __v: number;
}

export interface Candidate {
  userId: string;
  technicalResult?: TechnicalResult;
  nonTechnicalResult?: NonTechnicalResult;
  overallScore?: number;
  confidenceLevel?: string;
  stressLevel?: string;
}

export interface Job {
  jobId: string;
  candidates: Candidate[];
}

export type RankingCriteria = 'score' | 'stress' | 'confidence';