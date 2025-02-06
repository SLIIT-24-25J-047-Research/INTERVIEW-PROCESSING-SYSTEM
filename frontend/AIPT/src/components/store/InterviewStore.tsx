import { create } from 'zustand';
import { Question } from '../types';

interface InterviewState {
  currentQuestionIndex: number;
  questions: Question[];
  score: number;
  timeRemaining: number | null;
  answers: Record<number, any>;
  lockedQuestions: Set<number>;
  isSubmitted: boolean;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionId: number, answer: any) => void;
  updateScore: (points: number) => void;
  updateTimeRemaining: (time: number) => void;
  lockQuestion: (questionId: number) => void;
  isQuestionLocked: (questionId: number) => boolean;
  submitInterview: () => void;
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  currentQuestionIndex: 0,
  questions: [],
  score: 0,
  timeRemaining: null,
  answers: {},
  lockedQuestions: new Set(),
  isSubmitted: false,
  setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),
  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
  updateScore: (points) =>
    set((state) => ({ score: state.score + points })),
  updateTimeRemaining: (time) => set({ timeRemaining: time }),
  lockQuestion: (questionId) => 
    set((state) => ({
      lockedQuestions: new Set([...state.lockedQuestions, questionId])
    })),
  isQuestionLocked: (questionId) => 
    get().lockedQuestions.has(questionId),
  submitInterview: () => set({ isSubmitted: true }),
}));