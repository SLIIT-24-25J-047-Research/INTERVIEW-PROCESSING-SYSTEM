import { create } from 'zustand';
import { Question } from '../types';

// Mock questions for fallback
const mockQuestions: Question[] = [
  {
    _id: "mock_q1",
    type: "code",
    title: "Data is not fetched",
    description: "Thiss is dummy data. check the API to find whats the issue.",
    timeLimit: 60,
    points: 50,
    difficulty: "easy",
    content: {
      initialCode: "function reverseString(str) {\n  // Your code here\n}",
      language: "javascript",
      testCases: [
        {
          input: "['h','e','l','l','o']",
          expectedOutput: "['o','l','l','e','h']",
          _id: "mock_tc1"
        },
        {
          input: "['H','a','n','n','a','h']",
          expectedOutput: "['h','a','n','n','a','H']",
          _id: "mock_tc2"
        }
      ],
      blanks: [],
      items: [],
      correctOrder: [],
      options: []
    }
  },
  {
    _id: "mock_q2",
    type: "multipleChoice",
    title: "Data is not fetched",
    description: "Thiss is second dummy data. check the API to find whats the issue.",
    timeLimit: 120,
    points: 25,
    difficulty: "medium",
    content: {
      testCases: [],
      blanks: [],
      items: [],
      correctOrder: [],
      options: [
        "number",
        "string",
        "undefined",
        "object"
      ]
    }
  }
];

interface TimerState {
  [key: string]: {
    timeLeft: number;
    lastUpdated: number;
  };
}

interface InterviewState {
  currentQuestionIndex: number;
  questions: Question[];
  score: number;
  answers: Record<string, string | number | boolean>;
  lockedQuestions: Set<string>;
  isLoading: boolean;
  error: string | null;
  timerState: TimerState;
  examStarted: boolean;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionId: string, answer: string | number | boolean) => void;
  updateScore: (points: number) => void;
  lockQuestion: (questionId: string) => void;
  isQuestionLocked: (questionId: string) => boolean;
  canNavigateToQuestion: (index: number) => boolean;
  fetchQuestions: () => Promise<void>;
  updateTimer: (questionId: string, timeLeft: number) => void;
  getTimeLeft: (questionId: string, initialTime: number) => number;
  startExam: () => void;
  isExamStarted: () => boolean;
}

// Load timer state from localStorage
const loadTimerState = (): TimerState => {
  const saved = localStorage.getItem('examTimerState');
  return saved ? JSON.parse(saved) : {};
};

// Load locked questions from localStorage
const loadLockedQuestions = (): Set<string> => {
  const saved = localStorage.getItem('lockedQuestions');
  return saved ? new Set(JSON.parse(saved)) : new Set();
};

export const useInterviewStore = create<InterviewState>((set, get) => ({
  currentQuestionIndex: 0,
  questions: [],
  score: 0,
  answers: {},
  lockedQuestions: loadLockedQuestions(),
  isLoading: false,
  error: null,
  timerState: loadTimerState(),
  examStarted: localStorage.getItem('examStarted') === 'true',

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
    if (index <= state.currentQuestionIndex) return true;
    if (index === state.currentQuestionIndex + 1) {
      const currentQuestionId = state.questions[state.currentQuestionIndex]._id;
      return state.lockedQuestions.has(currentQuestionId);
    }
    return false;
  },

  updateTimer: (questionId: string, timeLeft: number) => {
    set((state) => {
      const newTimerState = {
        ...state.timerState,
        [questionId]: {
          timeLeft,
          lastUpdated: Date.now(),
        },
      };
      localStorage.setItem('examTimerState', JSON.stringify(newTimerState));
      return { timerState: newTimerState };
    });
  },

  getTimeLeft: (questionId: string, initialTime: number) => {
    const state = get().timerState[questionId];
    if (!state) return initialTime;
    
    const elapsed = (Date.now() - state.lastUpdated) / 1000;
    const timeLeft = Math.max(0, state.timeLeft - elapsed);
    
    return Math.round(timeLeft);
  },

  startExam: () => {
    localStorage.setItem('examStarted', 'true');
    set({ examStarted: true });
  },

  isExamStarted: () => get().examStarted,

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
      // Fall back to mock questions if fetch fails
      console.warn('Failed to fetch questions, using mock data instead:', error);
      set({ 
        questions: mockQuestions,
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },
}));