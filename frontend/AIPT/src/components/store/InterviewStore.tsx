import { create } from 'zustand';
import { Question } from '../types';

interface InterviewState {
  currentQuestionIndex: number;
  questions: Question[];
  score: number;
  answers: Record<string, string | number | boolean>;
  lockedQuestions: Set<string>;
  isLoading: boolean;
  error: string | null;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionId: string, answer: string | number | boolean) => void;
  updateScore: (points: number) => void;
  lockQuestion: (questionId: string) => void;
  isQuestionLocked: (questionId: string) => boolean;
  canNavigateToQuestion: (index: number) => boolean;
  fetchQuestions: () => Promise<void>;
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  currentQuestionIndex: 0,
  questions: [],
  score: 0,
  answers: {},
  lockedQuestions: new Set(),
  isLoading: false,
  error: null,

  setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),
  
  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
  
  updateScore: (points) =>
    set((state) => ({ score: state.score + points })),
  
  lockQuestion: (questionId) => 
    set((state) => ({
      lockedQuestions: new Set([...state.lockedQuestions, questionId])
    })),
  
  isQuestionLocked: (questionId) => 
    get().lockedQuestions.has(questionId),
  
  canNavigateToQuestion: (index) => {
    const state = get();
    // Can always navigate to current or previous questions
    if (index <= state.currentQuestionIndex) return true;
    // Can only navigate to next question if current is locked
    if (index === state.currentQuestionIndex + 1) {
      const currentQuestionId = state.questions[state.currentQuestionIndex]._id;
      return state.lockedQuestions.has(currentQuestionId);
    }
    return false;
  },

  fetchQuestions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/techQuestions');
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const questions = await response.json();
      set({ questions, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },
}));