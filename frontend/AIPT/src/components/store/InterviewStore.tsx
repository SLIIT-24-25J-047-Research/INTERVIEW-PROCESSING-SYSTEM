import { create } from 'zustand';
import { Question } from '../types';

const mockQuestions: Question[] = [
  {
    id: 1,
    type: 'code',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers in the array that add up to target. You may assume that each input would have exactly one solution.',
    timeLimit: 10, // 1 minute
    points: 100,
    difficulty: 'medium',
    content: {
      initialCode: 'function twoSum(nums: number[], target: number): number[] {\n  // Your code here\n}',
      language: 'typescript',
      testCases: [
        { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
        { input: '[3,2,4], 6', expectedOutput: '[1,2]' }
      ]
    }
  },
  {
    id: 2,
    type: 'code',
    title: 'String Reversal',
    description: 'Write a function that reverses a string without using the built-in reverse() method.',
    timeLimit: 600, // 10 minutes
    points: 50,
    difficulty: 'easy',
    content: {
      initialCode: 'function reverseString(str: string): string {\n  // Your code here\n}',
      language: 'typescript',
      testCases: [
        { input: '"hello"', expectedOutput: '"olleh"' },
        { input: '"world"', expectedOutput: '"dlrow"' }
      ]
    }
  },
  {
    id: 3,
    type: 'fillBlanks',
    title: 'Complete the React Hook',
    description: 'Fill in the blanks to complete this custom React hook that manages a counter with increment and decrement functions.',
    timeLimit: 300, // 5 minutes
    points: 75,
    difficulty: 'medium',
    content: {
      text: `function useCounter(initialValue = 0) {
  const [___1___] = useState(initialValue);

  const increment = ___2___ => {
    setCount(prev => prev + 1);
  };

  const decrement = ___3___ => {
    setCount(prev => prev - 1);
  };

  return { count, ___4___, decrement };
}`,
      blanks: [
        { id: '1', answer: 'count, setCount' },
        { id: '2', answer: '() =>' },
        { id: '3', answer: '() =>' },
        { id: '4', answer: 'increment' }
      ]
    }
  },
  {
    id: 4,
    type: 'dragDrop',
    title: 'Order React Lifecycle Methods',
    description: 'Arrange these React class component lifecycle methods in the order they are called during component mounting.',
    timeLimit: 240, // 4 minutes
    points: 50,
    difficulty: 'medium',
    content: {
      items: [
        { id: '1', text: 'constructor()' },
        { id: '2', text: 'render()' },
        { id: '3', text: 'componentDidMount()' },
        { id: '4', text: 'getDerivedStateFromProps()' }
      ],
      correctOrder: ['1', '4', '2', '3']
    }
  },
  {
    id: 5,
    type: 'multipleChoice',
    title: 'React Virtual DOM',
    description: 'Which statement about React\'s Virtual DOM is correct?',
    timeLimit: 120, // 2 minutes
    points: 25,
    difficulty: 'easy',
    content: {
      options: [
        'Virtual DOM is a complete copy of the real DOM',
        'Virtual DOM is a lightweight JavaScript representation of the real DOM',
        'Virtual DOM directly manipulates the browser\'s DOM',
        'Virtual DOM is slower than directly manipulating the real DOM'
      ],
      correctAnswer: 1
    }
  },
  {
    id: 6,
    type: 'code',
    title: 'Binary Search',
    description: 'Implement a binary search function that returns the index of the target element in a sorted array. Return -1 if the target is not found.',
    timeLimit: 1200, // 20 minutes
    points: 150,
    difficulty: 'hard',
    content: {
      initialCode: 'function binarySearch(arr: number[], target: number): number {\n  // Your code here\n}',
      language: 'typescript',
      testCases: [
        { input: '[1,2,3,4,5], 3', expectedOutput: '2' },
        { input: '[1,3,5,7,9], 8', expectedOutput: '-1' }
      ]
    }
  }
];

interface InterviewState {
  currentQuestionIndex: number;
  questions: Question[];
  score: number;
  answers: Record<number, any>;
  lockedQuestions: Set<number>;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionId: number, answer: any) => void;
  updateScore: (points: number) => void;
  lockQuestion: (questionId: number) => void;
  isQuestionLocked: (questionId: number) => boolean;
  canNavigateToQuestion: (index: number) => boolean;
  getQuestions: () => Question[];
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  currentQuestionIndex: 0,
  questions: mockQuestions,
  score: 0,
  answers: {},
  lockedQuestions: new Set(),
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
      const currentQuestionId = state.questions[state.currentQuestionIndex].id;
      return state.lockedQuestions.has(currentQuestionId);
    }
    return false;
  },
  getQuestions: () => mockQuestions,
}));