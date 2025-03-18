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


interface Answer {
  questionId: string;
  type: string;
  response: string | number | boolean | string[] | number[] | boolean[] ;
  timeTaken: number;
}

interface InterviewContext {
  interviewId: string;
  testLink: string;
  duration: number;
  userId: string;
  jobId: string;
}


interface InterviewState {
  currentQuestionIndex: number;
  questions: Question[];
  score: number;
  answers: Record<string, Answer>;
  lockedQuestions: Set<string>;
  isLoading: boolean;
  error: string | null;
  timerState: TimerState;
  examStarted: boolean;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionId: string, type: string, response: string | number | boolean | string[] | number[] | boolean[]) => void;
  updateScore: (points: number) => void;
  lockQuestion: (questionId: string, timeTaken: number) => void;
  isQuestionLocked: (questionId: string) => boolean;
  canNavigateToQuestion: (index: number) => boolean;
  fetchQuestions: () => Promise<void>;
  updateTimer: (questionId: string, timeLeft: number) => void;
  getTimeLeft: (questionId: string, initialTime: number) => number;
  startExam: () => void;
  isExamStarted: () => boolean;
  isSubmitting: boolean;
  hasSubmitted: boolean;
  submitAllAnswers: () => Promise<void>;
  submitCodeForComplexityAnalysis: (questionId: string, code: string, language: string) => Promise<void>;
  submittedCodeQuestions: Set<string>;
  isSubmittingExam: boolean;
  sendWebcamSnapshot: (questionId: string, imageData: string) => Promise<void>;
  interviewContext: InterviewContext | null;
  setInterviewContext: (context: InterviewContext) => void;
  
}

const loadTimerState = (): TimerState => {
  const saved = localStorage.getItem('examTimerState');
  return saved ? JSON.parse(saved) : {};
};

const loadLockedQuestions = (): Set<string> => {
  const saved = localStorage.getItem('lockedQuestions');
  return saved ? new Set(JSON.parse(saved)) : new Set();
};

const loadAnswers = (): Record<string, Answer> => {
  const saved = localStorage.getItem('examAnswers');
  return saved ? JSON.parse(saved) : {};
};

const loadSubmittedCodeQuestions = (): Set<string> => {
  const saved = localStorage.getItem('submittedCodeQuestions');
  return saved ? new Set(JSON.parse(saved)) : new Set();
};

export const useInterviewStore = create<InterviewState>((set, get) => ({
  currentQuestionIndex: 0,
  questions: [],
  score: 0,
  answers: loadAnswers(),
  lockedQuestions: loadLockedQuestions(),
  isLoading: false,
  error: null,
  timerState: loadTimerState(),
  examStarted: localStorage.getItem('examStarted') === 'true',
  isSubmitting: false,
  hasSubmitted: localStorage.getItem('hasSubmitted') === 'true',
  submittedCodeQuestions: loadSubmittedCodeQuestions(),
  isSubmittingExam: false,
  interviewContext: null,

  setInterviewContext: (context) => set({ interviewContext: context }),
  setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),
  
  setAnswer: (questionId, type, response) => {
    set((state) => {
      const newAnswers = {
        ...state.answers,
        [questionId]: {
          ...state.answers[questionId],
          questionId,
          type,
          response,
          timeTaken: state.answers[questionId]?.timeTaken || 0, 
        },
      };
      localStorage.setItem('examAnswers', JSON.stringify(newAnswers));
      return { answers: newAnswers };
    });
  },
  
  updateScore: (points) =>
    set((state) => ({ score: state.score + points })),
  
  lockQuestion: (questionId, timeTaken) => {
    set((state) => {
      const newLockedQuestions = new Set([...state.lockedQuestions, questionId]);
      localStorage.setItem('lockedQuestions', JSON.stringify([...newLockedQuestions]));
  
      const existingAnswer = state.answers[questionId] || {};
      const newAnswers: Record<string, Answer> = {
        ...state.answers,
        [questionId]: {
          ...existingAnswer, 
          questionId,
          timeTaken,
          type: existingAnswer.type || '', 
          response: existingAnswer.response ?? '', 
        },
      };
      localStorage.setItem('examAnswers', JSON.stringify(newAnswers));
  
      return { 
        lockedQuestions: newLockedQuestions,
        answers: newAnswers
      };
    });

    // Only submit code for complexity analysis if:
    // 1. This is a code question
    // 2. It hasn't been submitted before
    // 3. We're not in the middle of submitting the entire exam
    const state = get();
    const answer = state.answers[questionId];
    const question = state.questions.find(q => q._id === questionId);

    if (
      !state.isSubmittingExam && 
      question && 
      question.type === 'code' && 
      typeof answer?.response === 'string' && 
      !state.submittedCodeQuestions.has(questionId)
    ) {
      // We make this call AFTER updating the state to ensure consistency
      get().submitCodeForComplexityAnalysis(
        questionId, 
        answer.response, 
        question.content.language || 'javascript'
      );
    }
  },
  
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

  submitCodeForComplexityAnalysis: async (questionId, code, language) => {
    try {
 
      const state = get();
      if (get().submittedCodeQuestions.has(questionId)) {
        console.log(`Skipping complexity analysis for Question ${questionId} - already submitted`);
        return;
      }
      
      console.log(`Submitting code for complexity analysis: Question ${questionId}`);
  
      set(state => {
        const newSubmittedCodeQuestions = new Set([...state.submittedCodeQuestions, questionId]);
        localStorage.setItem('submittedCodeQuestions', JSON.stringify([...newSubmittedCodeQuestions]));
        return { submittedCodeQuestions: newSubmittedCodeQuestions };
      });
      
      const response = await fetch('http://localhost:5000/api/CodeSubmissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          code,
          language,
          userId: state.interviewContext?.userId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit code for complexity analysis');
      }
      
      const result = await response.json();
      console.log('Complexity analysis result:', result);
      
    } catch (error) {
      console.error('Error submitting code for complexity analysis:', error);
      // We don't want to interrupt the user experience if this fails
    }
  },

  submitAllAnswers: async () => {
    const state = get();
    if (state.isSubmitting || state.hasSubmitted) {
      console.log('Submission already in progress or completed');
      return;
    }

    // Set both flags to prevent duplicate submissions
    set({ isSubmitting: true, isSubmittingExam: true });

    try {
      const answersArray = Object.values(state.answers).map(answer => ({
        questionId: answer.questionId,
        type: answer.type,
        response: answer.response,
        timeTaken: answer.timeTaken,
      }));
    
      // First, submit any pending code questions for complexity analysis
      // but only if they haven't been submitted yet
      const pendingCodeQuestions = state.questions.filter(q => 
        q.type === 'code' && 
        state.answers[q._id]?.response && 
        !state.submittedCodeQuestions.has(q._id)
      );
      
      // Process these one at a time to prevent race conditions
      for (const question of pendingCodeQuestions) {
        const answer = state.answers[question._id];
        if (typeof answer.response === 'string') {
          await get().submitCodeForComplexityAnalysis(
            question._id,
            answer.response,
            question.content.language || 'javascript'
          );
        }
      }
    
      console.log('Submitting answers:', {
        interviewId: state.interviewContext?.interviewId ?? '',
        userId: state.interviewContext?.userId,
        answers: answersArray,
      });
    
      const response = await fetch('http://localhost:5000/api/techAnswers/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId: state.interviewContext?.interviewId,
          userId: state.interviewContext?.userId,
          answers: answersArray,
        }),
      });
    
      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }
    
      const responseData = await response.json();
    
      // Clear all exam-related localStorage items
      localStorage.removeItem('examAnswers');
      localStorage.removeItem('examTimerState');
      localStorage.removeItem('lockedQuestions');
      localStorage.removeItem('examStarted');
      localStorage.removeItem('submittedCodeQuestions');

      set({ 
        hasSubmitted: true,
        isSubmitting: false,
        isSubmittingExam: false,
      });
    
      return responseData;
    } catch (error) {
      set({ isSubmitting: false, isSubmittingExam: false });
      console.error('Error submitting answers:', error);
      throw error;
    }
  },
  
  fetchQuestions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/techQuestions');
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      
      const questions: Question[] = await response.json();
      
      // Validate the response structure matches your Question type
      const validatedQuestions = questions.map(question => ({
        ...question,
        content: {
          ...question.content,
          testCases: question.content.testCases || [],
          blanks: question.content.blanks || [],
          items: question.content.items || [],
          correctOrder: question.content.correctOrder || [],
          options: question.content.options || [],
        }
      }));

      set({ questions: validatedQuestions, isLoading: false });
      
    } catch (error) {
      console.error('Error fetching questions:', error);
      set({ 
        questions: mockQuestions,
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },

  sendWebcamSnapshot: async (questionId: string, imageData: string) => {
    try {
      const byteCharacters = atob(imageData.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });
  
      const formData = new FormData();
      formData.append("file", blob, "snapshot.jpg");
  
      const state = get();
      if (state.interviewContext) {
        formData.append("questionID", questionId);
        formData.append("jobID", state.interviewContext.jobId);
        formData.append("interviewScheduleID", state.interviewContext.interviewId);
        formData.append("userID", state.interviewContext.userId);
      } else {
        throw new Error("Interview context is not available.");
      }
  
     
      const formDataObject: Record<string, string | Blob> = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });
  
      console.log("🚀 FormData JSON being sent:", JSON.stringify(formDataObject, null, 2));
  
      const response = await fetch("http://localhost:5000/api/stress/detect/", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`Failed to send webcam snapshot: ${errorResponse}`);
      }
  
      const result = await response.json();
      console.log("✅ Snapshot sent successfully:", result);
    } catch (error) {
      console.error("❌ Error sending webcam snapshot:", error);
    }
  },
  
}));