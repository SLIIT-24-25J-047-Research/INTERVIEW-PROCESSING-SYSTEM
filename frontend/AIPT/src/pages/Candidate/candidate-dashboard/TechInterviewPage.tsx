
import Sidebar from "../../../components/Candidate/CandidateSidebar";
import Header from "../../../components/Candidate/CandidateHeader";


import React from 'react';
import { Trophy, Flag, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInterviewStore } from '../../../components/store/InterviewStore';
import { Timer } from '../../../components/Candidate/Timer';
import { CodeEditor } from '../../../components/Candidate/tech-interview/CodeEditor';
import { Question } from '../../../components/types';
import { DragDropQuestion } from '../../../components/Candidate/tech-interview/DragDropQuestion';
import { FillBlanksQuestion } from '../../../components/Candidate/tech-interview/FillBlanksQuestion';
import { MultipleChoiceQuestion } from '../../../components/Candidate/tech-interview/MultipleChoiceQuestion';

const mockQuestions: Question[] = [
    {
      id: 1,
      type: 'code',
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers in the array that add up to target. You may assume that each input would have exactly one solution.',
      timeLimit: 900, // 15 minutes
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


const Techexam: React.FC = () => {
    const { currentQuestionIndex, setCurrentQuestion } = useInterviewStore();
    const currentQuestion = mockQuestions[currentQuestionIndex];
  
    const handleTimeUp = () => {
      console.log('Time is up!');
    };
  
    const renderQuestion = (question: Question) => {
      switch (question.type) {
        case 'code':
          return (
            <CodeEditor
              language={question.content.language}
              code={question.content.initialCode}
              onChange={(value) => console.log(value)}
            />
          );
        case 'fillBlanks':
          return (
            <FillBlanksQuestion
              text={question.content.text}
              blanks={question.content.blanks}
              onChange={(answers) => console.log(answers)}
            />
          );
        case 'dragDrop':
          return (
            <DragDropQuestion
              items={question.content.items}
              onChange={(order) => console.log(order)}
            />
          );
        case 'multipleChoice':
          return (
            <MultipleChoiceQuestion
              options={question.content.options}
              onChange={(answer) => console.log(answer)}
            />
          );
        default:
          return null;
      }
    };
  
    return (
        <div className="flex  bg-gray-50">
              <Sidebar />
        {/* Sidebar */}
 
  
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0">
            <Header title="Technical Assessment " />
            
            {/* Sub-header with timer and score */}
            <div className="bg-white shadow-sm mt-20">
              <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">Technical Interview</h1>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      <span className="font-semibold">Score: 0</span>
                    </div>
                    <Timer duration={currentQuestion.timeLimit} onTimeUp={handleTimeUp} />
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Main Content */}
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-12 gap-8">
                {/* Question navigation */}
                <div className="col-span-3">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Questions</h2>
                    <div className="space-y-3">
                      {mockQuestions.map((q, index) => (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuestion(index)}
                          className={`w-full text-left p-3 rounded-lg transition ${
                            currentQuestionIndex === index
                              ? 'bg-blue-50 text-blue-700'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>Question {index + 1}</span>
                            <div className="flex items-center space-x-2">
                              {q.difficulty === 'easy' && <Star className="w-4 h-4 text-green-500" />}
                              {q.difficulty === 'medium' && <Star className="w-4 h-4 text-yellow-500" />}
                              {q.difficulty === 'hard' && <Star className="w-4 h-4 text-red-500" />}
                              <Flag className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
  
                {/* Question content */}
                <div className="col-span-9">
                  <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-semibold">{currentQuestion.title}</h2>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Trophy className="w-4 h-4 mr-1" />
                              {currentQuestion.points} points
                            </span>
                            <span className="flex items-center">
                              <Trophy className="w-4 h-4 mr-1" />
                              {Math.floor(currentQuestion.timeLimit / 60)} minutes
                            </span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {currentQuestion.difficulty}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">{currentQuestion.description}</p>
                    </div>
                    <div className="p-6">
                      {renderQuestion(currentQuestion)}
                    </div>
                    <div className="p-6 border-t bg-gray-50 flex justify-between">
                      <button
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestionIndex - 1))}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        disabled={currentQuestionIndex === 0}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentQuestion(Math.min(mockQuestions.length - 1, currentQuestionIndex + 1))}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        disabled={currentQuestionIndex === mockQuestions.length - 1}
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default Techexam;