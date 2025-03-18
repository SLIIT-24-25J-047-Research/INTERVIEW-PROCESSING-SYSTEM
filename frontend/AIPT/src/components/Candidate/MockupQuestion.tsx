import React, { useState, useEffect } from "react";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

const allQuestions: Question[] = [
  { id: 1, text: "What is React?", options: ["React is a JavaScript library for building user interfaces.", "React is a CSS framework.", "React is a programming language.", "React is a database."], correctAnswer: "React is a JavaScript library for building user interfaces." },
  { id: 2, text: "What are React components?", options: ["React components are reusable pieces of UI.", "React components are database schemas.", "React components are stylesheets.", "React components are browser APIs."], correctAnswer: "React components are reusable pieces of UI." },
  { id: 3, text: "What is JSX?", options: ["JSX is a syntax extension for JavaScript.", "JSX is a library.", "JSX is a backend framework.", "JSX is a CSS property."], correctAnswer: "JSX is a syntax extension for JavaScript." },
  { id: 4, text: "What are React hooks?", options: ["React hooks are functions that let you use state and lifecycle features in function components.", "React hooks are database queries.", "React hooks are styling methods.", "React hooks are JavaScript frameworks."], correctAnswer: "React hooks are functions that let you use state and lifecycle features in function components." },
  { id: 5, text: "Explain useState in React.", options: ["useState is a hook that lets you add state to function components.", "useState is a CSS property.", "useState is a JavaScript library."], correctAnswer: "useState is a hook that lets you add state to function components." },
  { id: 6, text: "Explain useEffect in React.", options: ["useEffect is a hook for performing side effects in function components.", "useEffect is a styling method."], correctAnswer: "useEffect is a hook for performing side effects in function components." },
  { id: 7, text: "What is React Router?", options: ["React Router is a library for managing navigation and routing in React applications.", "React Router is a backend framework."], correctAnswer: "React Router is a library for managing navigation and routing in React applications." },
  { id: 8, text: "What is Redux?", options: ["Redux is a state management library.", "Redux is a CSS framework."], correctAnswer: "Redux is a state management library." },
  { id: 9, text: "What is the Virtual DOM?", options: ["A lightweight copy of the real DOM.", "A type of JavaScript function."], correctAnswer: "A lightweight copy of the real DOM." },
  { id: 10, text: "What is the purpose of props?", options: ["To pass data between components.", "To store local state."], correctAnswer: "To pass data between components." },
  { id: 11, text: "What is Next.js?", options: ["A React framework for server-side rendering.", "A database system."], correctAnswer: "A React framework for server-side rendering." },
  { id: 12, text: "What is Tailwind CSS?", options: ["A utility-first CSS framework.", "A JavaScript library.", "A type of React hook."], correctAnswer: "A utility-first CSS framework." },
  { id: 13, text: "What is TypeScript?", options: ["A strongly typed superset of JavaScript.", "A frontend framework."], correctAnswer: "A strongly typed superset of JavaScript." },
  { id: 14, text: "What is API in React?", options: ["A set of functions for data fetching.", "A CSS property."], correctAnswer: "A set of functions for data fetching." },
  { id: 15, text: "What is Firebase?", options: ["A cloud-based backend solution.", "A frontend library."], correctAnswer: "A cloud-based backend solution." }
];

const MockupQuestion: React.FC<{ onEndTest: (score: number) => void }> = ({ onEndTest }) => {
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number>(0);
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);

  useEffect(() => {
    const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuizQuestions(shuffledQuestions);
  }, []);

  const handleOptionSelect = (questionId: number, option: string) => {
    setSelectedAnswers((prev) => {
      const updatedAnswers = { ...prev, [questionId]: option };
      return updatedAnswers;
    });
  };

  const handleNextQuestion = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestion.id];
    const correctAnswer = currentQuestion.correctAnswer;

    // If the answer is correct, add 1 to the score
    if (selectedAnswer === correctAnswer) {
      setScore((prevScore) => Math.min(prevScore + 1, quizQuestions.length)); // Ensure score is capped at total number of questions
    }

    setTimeout(() => {
      setIsButtonVisible(true);
    }, 30000); // 30 seconds for each question
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleFinishTest = () => {
    onEndTest(score);
  };

  return (
    <div className="mockup-container p-4 bg-gradient-to-r from-blue-300 to-blue-500 rounded-lg shadow-lg">
      {currentQuestionIndex < quizQuestions.length ? (
        <div className="question-box bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Question {currentQuestionIndex + 1}</h2>
          <p className="text-lg text-gray-700">{quizQuestions[currentQuestionIndex].text}</p>
          <div className="options mt-4">
            {quizQuestions[currentQuestionIndex].options.map((option, index) => (
              <div key={index} className="option mb-2">
                <label className="block text-gray-800">
                  <input
                    type="radio"
                    name={`question-${quizQuestions[currentQuestionIndex].id}`}
                    value={option}
                    checked={selectedAnswers[quizQuestions[currentQuestionIndex].id] === option}
                    onChange={() => handleOptionSelect(quizQuestions[currentQuestionIndex].id, option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
          <button onClick={handleNextQuestion} className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
            Next
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-green-500">Test Finished!</h2>
          <p className="text-xl mt-2">Your score: {score} / 10</p>
          {isButtonVisible && (
            <button onClick={handleFinishTest} className="mt-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
              End Test
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MockupQuestion;
