import { create } from 'zustand';
import { Question } from '../types';

interface InterviewState {
  currentQuestionIndex: number;
  questions: Question[];
  score: number;
  timeRemaining: number | null;
  answers: Record<number, any>;
  questionStartTimes: Record<number, number>;
  lockedQuestions: Set<number>;
  isSubmitted: boolean;
  interviewId: string | null;
  userId: string | null;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionId: number, answer: any) => void;
  updateScore: (points: number) => void;
  updateTimeRemaining: (time: number) => void;
  lockQuestion: (questionId: number) => void;
  isQuestionLocked: (questionId: number) => boolean;
  startQuestion: (questionId: number) => void;
  setInterviewData: (interviewId: string, userId: string) => void;
  submitInterview: () => Promise<void>;
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  currentQuestionIndex: 0,
  questions: [],
  score: 0,
  timeRemaining: null,
  answers: {},
  questionStartTimes: {},
  lockedQuestions: new Set(),
  isSubmitted: false,
  interviewId: null,
  userId: null,
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
  startQuestion: (questionId) =>
    set((state) => ({
      questionStartTimes: {
        ...state.questionStartTimes,
        [questionId]: Date.now()
      }
    })),
  setInterviewData: (interviewId, userId) =>
    set({ interviewId, userId }),
  submitInterview: async () => {
    const state = get();
    const { answers, questionStartTimes, interviewId, userId } = state;

    if (!interviewId || !userId) {
      throw new Error('Interview or user ID not set');
    }

    const formattedAnswers = Object.entries(answers).map(([questionId, response]) => {
      const startTime = questionStartTimes[Number(questionId)] || 0;
      const timeTaken = Math.floor((Date.now() - startTime) / 1000); // Convert to seconds

      return {
        questionId,
        type: state.questions.find(q => q.id === Number(questionId))?.type || 'unknown',
        response,
        timeTaken
      };
    });

    try {
      const response = await fetch('http://localhost:5000/api/techAnswers/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId,
          userId,
          answers: formattedAnswers
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit interview');
      }

      set({ isSubmitted: true });
    } catch (error) {
      console.error('Error submitting interview:', error);
      throw error;
    }
  },
}));