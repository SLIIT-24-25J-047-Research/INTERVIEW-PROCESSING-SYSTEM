import { create } from 'zustand';
import { Question } from '../types';

interface InterviewState {
  currentQuestionIndex: number;
  questions: Question[];
  score: number;
  timeRemaining: number;
  answers: Record<number, any>;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionId: number, answer: any) => void;
  updateScore: (points: number) => void;
  updateTimeRemaining: (value: number | ((prev: number) => number)) => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  currentQuestionIndex: 0,
  questions: [],
  score: 0,
  timeRemaining: 0,
  answers: {},
  setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),
  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
  updateScore: (points) =>
    set((state) => ({ score: state.score + points })),
  updateTimeRemaining: (time) =>
    set((state) => ({
      timeRemaining: typeof time === 'function' ? time(state.timeRemaining) : time,
    })),
}));